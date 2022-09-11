<template>
<v-container>
  <v-card>
    <v-card-title>{{ this.title }}</v-card-title>
    <v-row>
      <v-col cols="7">
        <v-img :src="this.team_img"></v-img>
      </v-col>
      <v-col cols="5">
        <v-card>
          <v-card-title>${{ this.total }} of ${{ this.goal }} goal </v-card-title>
          <v-container>
            <v-progress-linear
                :model-value=this.getProgressValue()
                height="30"
                striped
                color="orange"
            >
              <template v-slot:default="{ value }">
                <strong>{{ Math.ceil(value) }}% complete</strong>
              </template>
            </v-progress-linear>
          </v-container>
          <v-card-text>Raised by {{ this.count }} donors!</v-card-text>
          <v-container>
            <v-btn color="orange-darken-3" :to="`/donation/team=` + this.team_id">Donate Now!</v-btn>
          </v-container>
          <v-container>
            <v-text-field readonly>Created by {{ this.first_name }}  {{ this.last_name }}</v-text-field>
            <v-btn v-if="this.showEdit" color="orange-darken-3" :to="`/editteam/` + this.team_id">Edit Team</v-btn>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-card-subtitle>{{ this.team_description }}</v-card-subtitle>
    <v-container v-model=this.donations>
      <v-row>
          <v-col v-for="donation in donations" :key="donation.id">
            <v-card>
              <v-card-title>${{ donation.amount }} on {{ this.formatDate(donation.timestamp) }}</v-card-title>
              <v-card-text>{{ donation.message }} from {{ donation.who }}</v-card-text>
            </v-card>
          </v-col>
      </v-row>
    </v-container>
  </v-card>
</v-container>
</template>

<script>
import dayjs from 'dayjs';
import TeamDataService from "@/services/TeamDataService";
import DonationDataService from "@/services/DonationDataService";
import UserDataService from "@/services/UserDataService";

export default {
  name: "TeamPage",
  data() {
    return {
      team: this.getTeam(),
      title: "Not yet set!",
      team_id: 0,
      total: 0,
      goal: 0,
      count: 0,
      team_description: "",
      donations: [],
      user_id: 0,
      user: this.getOwner(),
      first_name: "",
      last_name: "",
      team_img: "",
      showEdit: false
    }
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
            this.team_img = this.team.team_img;
            this.team_description = this.team.description;
            this.user_id = this.team.user_id;
            this.user = this.getOwner(this.user_id);
            this.total = this.getTeamTotal();
            this.count = this.getDonationCount();
            this.donations = this.getDonations();
            this.showEdit = (this.team.user_id === this.$store.state.auth.user.id);
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
    getProgressValue() {
      return (this.total / this.goal) * 100;
    },
    getDonationCount() {
      DonationDataService.getCountByTeam(this.team_id)
          .then(response => {
            console.log(response);
            this.count = response.data[0].count;
            return response.data[0].count;
          })
          .catch(e => {
            console.log(e);
          });
    },
    getDonations() {
      DonationDataService.getByTeam(this.team_id)
          .then(response => {
            console.log(response);
            this.donations = response.data;
            return response.data;
          })
          .catch(e => {
            console.log(e);
          })
    },
    formatDate(dateString) {
      const date = dayjs(dateString);
      // Then specify how you want your dates to be formatted
      return date.format('MM/DD');
    },
    getOwner(user_id) {
      UserDataService.get(user_id)
          .then(response => {
            console.log(response);
            this.user = response.data;
            this.first_name = this.user.first_name;
            this.last_name = this.user.last_name;
            return response.data;
          })
          .catch(e => {
            console.log(e);
          })
    }
  }
}
</script>

<style scoped>

</style>