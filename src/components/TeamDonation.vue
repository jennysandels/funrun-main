<template>
<v-container>
  <v-row>
    <v-col cols="8">
      <v-card class="form">
        <v-card-title>Make a donation to {{ this.title }}</v-card-title>
        <v-card-subtitle>for the {{ this.campaign_name }}</v-card-subtitle>
        <v-container>
          <v-text-field
              label="Donation Amount"
              placeholder="10.00"
              prefix="$"
              :v-model="donation.amount"
          ></v-text-field>
          <v-text-field
              label="Team"
              :value="this.title"
          ></v-text-field>
          <p>
            <strong>Donor Information</strong>
          </p>
          <v-text-field
              label="First Name"
              :v-model="donation.first_name"
              :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
              label="Last Name"
              :v-model="donation.last_name"
              :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
              :v-model="donation.email"
              :rules="[rules.required, rules.email]"
              label="E-mail"
          ></v-text-field>
          <v-textarea
              :v-model="donation.message"
              label="Include a message with your donation"
          ></v-textarea>
          <div id="card-container"></div>
          <button type="button" ref="cardButton">
            Make Donation
          </button>
        </v-container>
        <div ref="paymentStatusContainer"></div>
      </v-card>
    </v-col>
    <v-col cols="4">
      <v-card>
        <v-img :src="`http://localhost:8080/api/teams/image/` + this.team_id"></v-img>
      </v-card>
    </v-col>
  </v-row>
</v-container>
</template>


<script>
import TeamDataService from "@/services/TeamDataService";
import DonationDataService from "@/services/DonationDataService";
import CampaignDataService from "@/services/CampaignDataService";
const { json, send } = require('micro');
const retry = require('async-retry');
// square provides the API client and error types
const { ApiError } = require('../plugins/square');
const { nanoid } = require('nanoid');

export default {
  name: "TeamDonation",
  mounted() {
    let squareScript = document.createElement('script');
    squareScript.setAttribute('src', 'https://sandbox.web.squarecdn.com/v1/square.js');
    document.head.appendChild(squareScript);
  },
  data() {
    return {
      donation: {
        amount: 10.00
      },
      team: this.getTeam(),
      title: "Not yet set!",
      team_id: 0,
      goal: 0,
      total: 0,
      campaign_id: 0,
      campaign_name: "Not yet set",
      campaign: null,
      rules: {
        required: value => !!value || 'Required.',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
      },
      errors: [],
      card: null,
      appId: 'sandbox-sq0idb-KG8rn1niVaCqF_E0O8gKqg',
      locationId: 'LCR64W6EC3HBB',
      payments: null,
    }
  },
  created() {
    window.addEventListener('load', () => {
      this.initializeCard();
    });
  },
  methods: {
    async initializeCard() {
      if (!window.Square) {
        throw new Error('Square.js failed to load properly');
      }

      const payments = window.Square.payments(this.appId, this.locationId);

      let card = await payments.card();
      await card.attach('#card-container');

      var self = this;
      this.$refs.cardButton.addEventListener("click", async function () {
        const tokenResult = await card.tokenize()
        self.make_payment(tokenResult)
      })
    },
    getTeam() {
      TeamDataService.get(this.$route.params.team_id)
          .then(response => {
            console.log(response);
            this.team = response.data;
            this.title = this.team.name;
            this.team_id = this.team.team_id;
            this.goal = this.team.team_goal;
            this.total = this.getTeamTotal();
            this.campaign_id = this.team.campaign_id;
            this.campaign_name = this.getCampaign(this.campaign_id);
          })
          .catch(e => {
            console.log(e);
          });
    },
    async make_payment(tokenResult) {
      if ((tokenResult.status == "OK") && (tokenResult.token.length)) {
        // disable the submit button as we await tokenization and make a
        // payment request.
        const paymentResults = this.createPayment(tokenResult);
        this.displayPaymentResults('SUCCESS');

        console.debug('Payment Success', paymentResults);
      } else {
        //cardButton.disabled = false;
        this.displayPaymentResults('FAILURE');
        console.error(tokenResult.message);
      }

    },
    getTeamTotal() {
      DonationDataService.getTotalByTeam(this.team_id)
          .then(response => {
            console.log(response);
            this.total = response.data[0].total;
            return response.data[0].total;
          })
          .catch(e => {
            console.log(e);
          });
    },
    getCampaign(id) {
      CampaignDataService.get(id)
          .then(response => {
            console.log(response);
            this.campaign_name = response.data.campaign_name;
            return response.data.campaign_name;
          })
          .catch(e => {
            console.log(e);
          });
    },
    async createPayment(token) {
      const locationId = this.locationId;
      const body = JSON.stringify({
        locationId,
        sourceId: token,
      });

      const payload = await json(body);
      console.debug(JSON.stringify(payload));
      // We validate the payload for specific fields. You may disable this feature
      // if you would prefer to handle payload validation on your own.
//      if (!validatePaymentPayload(payload)) {
//        throw createError(400, 'Bad Request');
//      }
      let res = null;
      await retry(async (bail, attempt) => {
        try {
          console.debug('Creating payment', { attempt });

          const idempotencyKey = payload.idempotencyKey || nanoid();
          const payment = {
            idempotencyKey,
            locationId: payload.locationId,
            sourceId: payload.sourceId,
            // While it's tempting to pass this data from the client
            // Doing so allows bad actor to modify these values
            // Instead, leverage Orders to create an order on the server
            // and pass the Order ID to createPayment rather than raw amounts
            // See Orders documentation: https://developer.squareup.com/docs/orders-api/what-it-does
            amountMoney: {
              // the expected amount is in cents, meaning this is $1.00.
              amount: '100',
              // If you are a non-US account, you must change the currency to match the country in which
              // you are accepting the payment.
              currency: 'USD',
            },
          };

          if (payload.customerId) {
            payment.customerId = payload.customerId;
          }

          // VerificationDetails is part of Secure Card Authentication.
          // This part of the payload is highly recommended (and required for some countries)
          // for 'unauthenticated' payment methods like Cards.
          if (payload.verificationToken) {
            payment.verificationToken = payload.verificationToken;
          }

          const { result, statusCode } = await window.Square.paymentsApi.createPayment(
              payment
          );

          console.info('Payment succeeded!', { result, statusCode });

          send(res, statusCode, {
            success: true,
            payment: {
              id: result.payment.id,
              status: result.payment.status,
              receiptUrl: result.payment.receiptUrl,
              orderId: result.payment.orderId,
            },
          });
        } catch (ex) {
          if (ex instanceof ApiError) {
            // likely an error in the request. don't retry
            console.error(ex.errors);
            bail(ex);
          } else {
            // IDEA: send to error reporting service
            console.error(`Error creating payment on attempt ${attempt}: ${ex}`);
            throw ex; // to attempt retry
          }
        }
      });


      if (res.ok) {
          return res.json();
        }
        const errorBody = res.text();
        throw new Error(errorBody);
    },
    tokenize() {
      const tokenResult = this.card.tokenize();
      if (tokenResult.status === 'OK') {
        return tokenResult.token;
      } else {
        let errorMessage = `Tokenization failed-status: ${tokenResult.status}`;
        if (tokenResult.errors) {
          errorMessage += ` and errors: ${JSON.stringify(
              tokenResult.errors
          )}`;
        }
        throw new Error(errorMessage);
      }
    },
    displayPaymentResults(status) {
      const statusContainer = this.$refs.paymentStatusContainer;
      if (status === 'SUCCESS') {
        statusContainer.classList.remove('is-failure');
        statusContainer.classList.add('is-success');
      } else {
        statusContainer.classList.remove('is-success');
        statusContainer.classList.add('is-failure');
      }

      statusContainer.style.visibility = 'visible';
    }
  }
}
</script>

<style scoped>

</style>