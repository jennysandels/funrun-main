<template>
  <v-main>
    <v-container fluid>
      <v-row dense>
        <v-col cols="8">
          <v-card>
            <v-img src="../assets/funrunpic.png"></v-img>
          </v-card>
        </v-col>
        <v-col>
          <ProgressPanel/>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="8">
          <v-card
              :title="`Learn more about ` + this.campaign_name"
              :text="this.description"
          ></v-card>
        </v-col>
        <v-col>
          <v-card
              :title="`Awards and Prizes`"
          >
            <v-list
                :items=this.prizes
            ></v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid>
      <v-toolbar color="orange-darken-4">
        <v-toolbar-title>Teams</v-toolbar-title>
        <v-spacer></v-spacer>
        <router-link to="/createTeam" v-slot="{createTeam}">
          <v-btn @click="createTeam" @keypress.enter="createTeam">Create your team!</v-btn>
        </router-link>
      </v-toolbar>
      <v-row dense>
        <v-container v-model=this.teams>
          <template v-for="team in teams" :key="team.name">
            <v-col cols="3">
              <TeamPanel :team="team"></TeamPanel>
            </v-col>
          </template>
        </v-container>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import TeamPanel from "@/components/TeamPanel";
import ProgressPanel from "@/components/ProgressPanel";
import CampaignDataService from "@/services/CampaignDataService";
import PrizesDataService from "@/services/PrizesDataService";
import TeamsDataService from "@/services/TeamDataService";
import DonationDataService from "@/services/DonationDataService";

export default {
  name: "MainPage",

  components: {
    TeamPanel,
    ProgressPanel
  },
  data()
  {
    return {
      campaign: this.getCampaign(2), // TODO: use config to set campaign id
      campaign_name: "Not yet set",
      description: "Not yet set",
      prizes: this.getPrizes(),
      teams: this.getTeams()
    }
  },
  methods: {
    getCampaign(id) {
      CampaignDataService.get(id)
          .then(response => {
            console.log(response);
            this.campaign = response.data;
            this.campaign_name = this.campaign.campaign_name;
            this.description = this.campaign.description;
          })
          .catch(e => {
            console.log(e);
          });
    },
    getPrizes() {
      // TODO: use config to get campaign id
      PrizesDataService.getByCampaignId(2)
          .then(response => {
            console.log(response);
            this.prizes = [];
            for (let i = 0; i < response.data.length; i++) {
              this.prizes[i] = {"title": response.data[i].prize_name, "value": response.data[i].prize_id};
            }
          })
          .catch(e => {
            console.log(e);
          });
    },
    getTeams() {
      // TODO: use config to get campaign id
      TeamsDataService.getByCampaignId(2)
          .then(response => {
            console.log(response);
            this.teams = [];
            for (let i = 0; i < response.data.length; i++) {
              var team = response.data[i];
              team.total = this.getTeamTotal(team.team_id);
              this.teams[i] = team;
            }
          })
          .catch(e => {
            console.log(e);
          });
    },
    getTeamTotal(team_id) {
      DonationDataService.getTotalByTeam(team_id)
          .then(response => {
            console.log(response);
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