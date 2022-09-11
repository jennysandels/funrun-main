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
      <v-toolbar color="orange">
        <v-toolbar-title>Teams</v-toolbar-title>
          <v-btn to="/createTeam">Create your team!</v-btn>
      </v-toolbar>
      <v-container v-model=this.teams>
        <v-row>
            <v-col v-for="team in teams" :key="team.name" cols="3">
                <v-container>
                  <v-card :title="team.name" :to="`/team/` + team.team_id" :subtitle="getTotalRaised(team.total)">
                    <v-img :src="team.team_img"></v-img>
                  </v-card>
                </v-container>
            </v-col>
        </v-row>
      </v-container>
    </v-container>
    <v-container fluid>
      <v-toolbar color="orange">
        <v-toolbar-title>Classrooms</v-toolbar-title>
      </v-toolbar>
      <v-container v-model=this.teachers>
        <v-row>
          <v-col v-for="teacher in teachers" :key="teacher.name" cols="3">
            <v-container>
              <v-card :title="teacher.name" :to="`/teacher/` + teacher.teacher_id" :subtitle="getTotalRaised(teacher.total)">
              </v-card>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
      <v-container fluid>
        <v-toolbar color="orange">
          <v-toolbar-title>Students</v-toolbar-title>
        </v-toolbar>
        <v-container v-model=this.students>
          <v-row>
            <v-col v-for="student in students" :key="student.student_id" cols="3">
              <v-container>
                <v-card :title="student.name" :to="`/student/` + student.student_id" :subtitle="getTotalRaised(student.total)">
                </v-card>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
    </v-container>
  </v-main>
</template>

<script>
import ProgressPanel from "@/components/ProgressPanel";
import CampaignDataService from "@/services/CampaignDataService";
import PrizesDataService from "@/services/PrizesDataService";
import TeamsDataService from "@/services/TeamDataService";
import TeacherDataService from "@/services/TeacherDataService";
import StudentDataService from "@/services/StudentDataService";

export default {
  name: "MainPage",

  components: {
    ProgressPanel
  },
  data()
  {
    return {
      campaign: this.getCampaign(2), // TODO: use config to set campaign id
      campaign_name: "Not yet set",
      description: "Not yet set",
      prizes: this.getPrizes(),
      teams: this.getTeams(),
      teachers: this.getTeachers(),
      students: this.getStudents()
    }
  },
  methods: {
    getTotalRaised(total) {
      if (total) {
        return "$" + total + " raised"
      }
      return "$0 raised";
    },
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
    async getTeams() {
      // TODO: use config to get campaign id
      TeamsDataService.getByCampaignId(2)
          .then(async response => {
            console.log(response);
            this.teams = response.data;
            return response.data;
          })
          .catch(e => {
            console.log(e);
          });
    },
    async getTeachers() {
      // TODO: use config to get campaign id
      TeacherDataService.getByCampaignId(2)
        .then(async response => {
          console.log(response);
          this.teachers = response.data;
          return response.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    async getStudents() {
      // TODO: use config to get campaign id
      StudentDataService.getByCampaign(2)
        .then(async response => {
          console.log(response);
          this.students = response.data;
          return response.data
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