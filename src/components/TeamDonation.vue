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
          <v-btn id="card-button">Donate!</v-btn>
        </v-container>
        <div id="payment-status-container"></div>
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

export default {
  name: "TeamDonation",
  mounted() {
    let squareScript = document.createElement('script')
    squareScript.setAttribute('src', 'https://sandbox.web.squarecdn.com/v1/square.js')
    document.head.appendChild(squareScript)
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

    }
  },
  created() {
    const appId = 'sandbox-sq0idb-KG8rn1niVaCqF_E0O8gKqg';
    const locationId = 'LCR64W6EC3HBB';

    window.addEventListener('load', () => {
      if (!window.Square) {
        throw new Error('Square.js failed to load properly');
      }

      const payments = window.Square.payments(appId, locationId);
      let card;
      try {
        card = initializeCard(payments);
      } catch (e) {
        console.error('Initializing Card failed', e);
        return;
      }

      // Checkpoint 2.
      async function handlePaymentMethodSubmission(event, paymentMethod) {
        event.preventDefault();

        try {
          // disable the submit button as we await tokenization and make a
          // payment request.
          cardButton.disabled = true;
          const token = await tokenize(paymentMethod);
          const paymentResults = await createPayment(token);
          displayPaymentResults('SUCCESS');

          console.debug('Payment Success', paymentResults);
        } catch (e) {
          cardButton.disabled = false;
          displayPaymentResults('FAILURE');
          console.error(e.message);
        }
      }

      const cardButton = document.getElementById(
          'card-button'
      );
      cardButton.addEventListener('click', async function (event) {
        await handlePaymentMethodSubmission(event, card);
      });

      async function initializeCard(payments) {
        const card = await payments.card();
        await card.attach('#card-container');
        return card;
      }

      // Call this function to send a payment token, buyer name, and other details
      // to the project server code so that a payment can be created with
      // Payments API
      async function createPayment(token) {
        const body = JSON.stringify({
          locationId,
          sourceId: token,
        });
        const paymentResponse = await fetch('/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        });
        if (paymentResponse.ok) {
          return paymentResponse.json();
        }
        const errorBody = await paymentResponse.text();
        throw new Error(errorBody);
      }

      // This function tokenizes a payment method.
      // The ‘error’ thrown from this async function denotes a failed tokenization,
      // which is due to buyer error (such as an expired card). It is up to the
      // developer to handle the error and provide the buyer the chance to fix
      // their mistakes.
      async function tokenize(paymentMethod) {
        const tokenResult = await paymentMethod.tokenize();
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
      }

      // Helper method for displaying the Payment Status on the screen.
      // status is either SUCCESS or FAILURE;
      function displayPaymentResults(status) {
        const statusContainer = document.getElementById(
            'payment-status-container'
        );
        if (status === 'SUCCESS') {
          statusContainer.classList.remove('is-failure');
          statusContainer.classList.add('is-success');
        } else {
          statusContainer.classList.remove('is-success');
          statusContainer.classList.add('is-failure');
        }

        statusContainer.style.visibility = 'visible';
      }
    })
  },
  methods: {
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
  }
}
</script>

<style scoped>

</style>