<template>
<v-container>
  <v-card :title="team.name" :to="`/team/` + team.team_id"
  :subtitle="getTeamTotal(team.team_id)">
    <v-img :src="`http://localhost:8080/api/teams/image/` + team.team_id"></v-img>
    <v-text-field variant="solo" :value="`$` + this.team_total + ` raised!`" readonly center></v-text-field>
  </v-card>
</v-container>
</template>

<script>
import DonationDataService from "@/services/DonationDataService";

export default {
  name: "TeamPanel",

  data() {
    return {
      team_total: 0,
    }
  },
  props: ['team'],
  methods: {
    getTeamTotal(team_id) {
      DonationDataService.getTotalByTeam(team_id)
          .then(response => {
            console.log(response);
            this.team_total = response.data[0].total;
            return response.data[0].total;
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