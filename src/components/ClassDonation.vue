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
            <button type="button" ref="cardButton" class="btn btn__primary__lg">
              Make Donation
            </button>
          </v-container>
        </v-card>
      </v-col>
      <v-dialog
          v-model="dialog"
      >
        <v-card>
          <v-card-text>
            {{ this.donationStatus }}
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" block @click="dialog = false">Close Dialog</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>


<script>
import TeacherDataService from "@/services/TeacherDataService";
import CampaignDataService from "@/services/CampaignDataService";
import PaymentDataService from "@/services/PaymentDataService";

export default {
  name: "ClassDonation",
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
      teacher: this.getTeacher(),
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
      appId: 'sandbox-sq0idb-KG8rn1niVaCqF_E0O8gKqg',
      locationId: 'LCR64W6EC3HBB',
      donationStatus: "",
      dialog: false
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
    getTeacher() {
      TeacherDataService.get(this.$route.params.teacher_id)
          .then(response => {
            console.log(response);
            this.teacher = response.data[0];
            this.title = this.teacher.name + "'s Class";
            this.teacher_id = this.teacher.teacher_id;
            this.total = this.teacher.total;
            this.campaign_id = this.teacher.campaign_id;
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
          teacher_id: this.teacher_id,
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
      if (status === 'SUCCESS') {
        this.donationStatus = "Donation Successfully Received! Look for an email with a receipt. Thank you!"
        this.$router.push('../teacher/' + this.teacher_id);
      } else {
        this.donationStatus = "Donation was unsuccessful. Please try again or email support at jsandels@lrespto.org"
      }
    }
  }
}
</script>

<style scoped>

</style>