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
              v-model="amount"
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
              v-model="first_name"
              :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
              label="Last Name"
              v-model="last_name"
              :rules="[rules.required]"
          ></v-text-field>
          <v-text-field
              v-model="email"
              :rules="[rules.required, rules.email]"
              label="E-mail"
          ></v-text-field>
          <v-textarea
              v-model="message"
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
import PaymentDataService from "@/services/PaymentDataService";

export default {
  name: "TeamDonation",
  mounted() {
    let squareScript = document.createElement('script');
    squareScript.setAttribute('src', 'https://sandbox.web.squarecdn.com/v1/square.js');
    document.head.appendChild(squareScript);
  },
  data() {
    return {
      amount: 10.00,
      first_name: "",
      last_name: "",
      email: "",
      message: "",
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
    inputData($event) {
      // Value will update reactively
      $event.target.value;
    },
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
        //moving this to the api server
        //const paymentResults = this.createPayment(tokenResult.token);
        const payment = {
          campaign_id: this.campaign_id,
          location_id: this.locationId,
          team_id: this.team_id,
          source_id: tokenResult.token,
          amount: this.amount,
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email,
          message: this.message
        };
        console.info("Sending payment info", {payment});
        PaymentDataService.create(payment)
            .then(paymentResults => {
              this.displayPaymentResults('SUCCESS');
              console.debug('Payment Success', paymentResults);
            }).catch(e => {
          //cardButton.disabled = false;
          this.displayPaymentResults('FAILURE');
          console.error(e);
        });
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