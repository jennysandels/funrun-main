<template>
  <v-app>
    <v-main>
        <v-card class="mx-auto" color="grey-lighten-3">
            <v-app-bar>
              <template v-slot:image>
                <v-img src="./assets/abstract-yellow-comic-zoom.webp"
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
                    <v-app-bar-nav-icon to="/" icon="mdi-home" v-bind="props"></v-app-bar-nav-icon>
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
            <v-container dark>
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
import EventBus from "./common/EventBus";

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
  mounted() {
    EventBus.on("logout", () => {
      this.logOut();
    });
  },
  beforeUnmount() {
    EventBus.remove("logout");
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
<style>
  /* Global styles */
.btn {
  padding: 0.8rem 1rem 0.7rem;
  border: 0.2rem solid #4d4d4d;
  cursor: pointer;
  text-transform: capitalize;
}
.btn__danger {
  color: #fff;
  background-color: #ca3c3c;
  border-color: #bd2130;
}
.btn__filter {
  border-color: lightgrey;
}
.btn__danger:focus {
  outline-color: #c82333;
}
.btn__primary {
  color: #fff;
  background-color: #000;
}
.btn-group {
  display: flex;
  justify-content: space-between;
}
.btn-group > * {
  flex: 1 1 auto;
}
.btn-group > * + * {
  margin-left: 0.8rem;
}
.label-wrapper {
  margin: 0;
  flex: 0 0 100%;
  text-align: center;
}
[class*="__lg"] {
  display: inline-block;
  width: 100%;
  font-size: 1.9rem;
}
[class*="__lg"]:not(:last-child) {
  margin-bottom: 1rem;
}
@media screen and (min-width: 620px) {
  [class*="__lg"] {
    font-size: 2.4rem;
  }
}
.visually-hidden {
  position: absolute;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px 1px 1px 1px);
  clip: rect(1px, 1px, 1px, 1px);
  clip-path: rect(1px, 1px, 1px, 1px);
  white-space: nowrap;
}
[class*="stack"] > * {
  margin-top: 0;
  margin-bottom: 0;
}
.stack-small > * + * {
  margin-top: 1.25rem;
}
.stack-large > * + * {
  margin-top: 2.5rem;
}
@media screen and (min-width: 550px) {
  .stack-small > * + * {
    margin-top: 1.4rem;
  }
  .stack-large > * + * {
    margin-top: 2.8rem;
  }
}
/* End global styles */
</style>
