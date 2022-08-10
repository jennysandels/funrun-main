<template>
  <v-app>
    <v-main>
        <v-card class="mx-auto" color="grey-lighten-3">
            <v-app-bar
                color="orange-darken-4"
            >
              <template v-slot:image>
                <v-img src="./assets/background.jpeg"
                ></v-img>
              </template>

              <template v-slot:prepend>
                <v-app-bar-nav-icon></v-app-bar-nav-icon>
              </template>

            <v-app-bar-title class="font-weight-bold">{{ this.campaign_name }}</v-app-bar-title>

              <v-spacer></v-spacer>
              <template v-slot:append>
                <v-tooltip bottom>
                  <template v-slot:activator="{ props }">
                    <v-app-bar-nav-icon to="/" class="nav-link" icon="mdi-home" v-bind="props"></v-app-bar-nav-icon>
                  </template>
                  <span>Home</span>
                </v-tooltip>
                <div v-if="!currentUser" class="navbar-nav ml-auto">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ props }">
                      <v-btn to="/createUser" v-bind="props">Sign Up</v-btn>
                    </template>
                    <span>Sign Up for an Account</span>
                  </v-tooltip>
                </div>
                <div v-if="!currentUser" class="navbar-nav ml-auto">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ props }">
                      <v-app-bar-nav-icon to="/login" icon="mdi-login" v-bind="props"></v-app-bar-nav-icon>
                    </template>
                    <span>Log In</span>
                  </v-tooltip>
                </div>
                <div v-if="currentUser" class="navbar-nav ml-auto">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ props }">
                      <v-app-bar-nav-icon to="/profile" icon="mdi-account" v-bind="props"></v-app-bar-nav-icon>
                    </template>
                    <span>Account Info</span>
                  </v-tooltip>
                </div>
                <div v-if="currentUser" class="navbar-nav ml-auto">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ props }">
                      <v-app-bar-nav-icon @click.prevent="logOut" icon="mdi-logout" v-bind="props"></v-app-bar-nav-icon>
                    </template>
                    <span>Log Out</span>
                  </v-tooltip>
                </div>
              </template>
            </v-app-bar>
            <v-container>
              <router-view />
            </v-container>
        </v-card>
    </v-main>
  </v-app>
</template>

<script>
import CampaignDataService from "@/services/CampaignDataService";
import PrizesDataService from "@/services/PrizesDataService";
import TeamsDataService from "@/services/TeamDataService";
import DonationDataService from "@/services/DonationDataService";

export default {
  name: 'App',

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
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
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
            this.teams[i] = response.data[i];
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
            return response.data;
          })
          .catch(e => {
            console.log(e);
          });
    },
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  }
}
</script>
