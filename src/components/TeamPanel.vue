<template>
<v-container>
  <v-card :title="team.name" :to="`/team/` + team.team_id">
    <v-img :src="team.team_img"></v-img>
    <v-text-field variant="solo" :value="team.total" readonly center></v-text-field>
  </v-card>
</v-container>
</template>

<script>
import DonationDataService from "@/services/DonationDataService";

export default {
  name: "TeamPanel",

  data() {
    return {
      team_total: "$0 raised!",
    }
  },

  props: ['team'],
  methods: {
    getTeamTotal(team_id) {
      DonationDataService.getTotalByTeam(team_id)
          .then(response => {
            console.log(response);
            if (response.data[0].total) {
              this.team_total = "$" + response.data[0].total + " raised!";
              return "$" + response.data[0].total + " raised!";
            }
            this.team_total = "$0 raised!";
            return "$0 raised!";
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