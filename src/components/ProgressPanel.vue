<template>
  <v-card :title=this.getTitle()
          :subtitle=this.getText()>
    <v-container>
      <v-progress-linear
          :model-value=this.getProgressValue()
          height="30"
          striped
          color="deep-orange"
      >
        <template v-slot:default="{ value }">
          <strong>{{ Math.ceil(value) }}%</strong>
        </template>
      </v-progress-linear>
    </v-container>
    <v-container>
    <div>
      <p align="center" class="font-weight-black">{{ this.getRemainingTime() }}</p>
    </div>
    </v-container>
  </v-card>
</template>

<script>
import CampaignDataService from "@/services/CampaignDataService";
import DonationDataService from "@/services/DonationDataService";

export default {
  name: "ProgressPanel",

  data() {
    return {
      campaign: this.getCampaign(2),
      campaign_name: null,
      campaign_goal: null,
      campaign_progress: this.getCampaignProgress(2),
      donation_count: this.getDonationCount(2)
    }
  },
  methods: {
    getCampaign(id) {
      CampaignDataService.get(id)
          .then(response => {
            console.log(response);
            this.campaign = response.data;
            this.campaign_name = this.campaign.campaign_name;
            this.campaign_goal = this.campaign.goal;
          })
          .catch(e => {
            console.log(e);
          });
    },
    getCampaignProgress(id) {
      DonationDataService.getTotalByCampaign(id)
        .then(response => {
          console.log(response);
          this.campaign_progress = response.data[0].total;
        })
        .catch(e => {
          console.log(e);
        });
    },
    getTitle() {
      return "$" + this.campaign_progress + " out of $" + this.campaign_goal;
    },
    getProgressValue() {
      return (this.campaign_progress / this.campaign_goal) * 100;
    },
    getText() {
      return "Raised by " + this.donation_count + " donors";
    },
    getRemainingTime() {
      if (this.campaign !== null && this.campaign != undefined) {
        var end_date = Date.parse(this.campaign.end_date);
        var differenceInMillis = end_date - Date.now();
        var differenceInDays = differenceInMillis / (1000 * 3600 * 24);
        return Math.round(differenceInDays) + " days remaining!";
      } else {
        return null;
      }
    },
    getDonationCount(id) {
      DonationDataService.getCountByCampaign(id)
          .then(response => {
            console.log(response);
            this.donation_count = response.data[0].count;
          })
          .catch(e => {
            console.log(e);
          });
    }
  }
}
</script>

<style scoped>

</style>