<template>
  <v-container>
    <v-row>
      <v-col cols="5">
        <v-card
            title="Join the Campaign!"
            subtitle='the campaign description needs to go here!'>
          <v-img :src="this.team_img"></v-img>
        </v-card>
      </v-col>
      <v-col cols="7">
        <v-container>
          <Form @submit="handleRegister" :validation-schema="schema">
            <div v-if="!successful">
              <div class="form-group">
                <label>Team Name</label>
                <Field name="team_name" type="text" v-model="team_name" :value="this.team_name" class="form-control" />
                <ErrorMessage name="team_name" class="error-feedback" />
              </div>
              <div class="form-group">
                <label>Profile Image</label>
                <div>
                  <div v-if="currentFile" class="progress">
                    <div
                        class="progress-bar progress-bar-info progress-bar-striped"
                        role="progressbar"
                        :aria-valuenow="progress"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        :style="{ width: progress + '%' }"
                    >
                      {{ progress }}%
                    </div>
                  </div>
                  <label class="btn btn-default">
                    <input type="file" ref="file" accept="image/png, image/gif, image/jpeg" @change="selectFile" />
                  </label>
                  <button class="btn btn-success" @click="upload">
                    Upload
                  </button>
                  <div class="alert alert-light" role="alert">{{ message }}</div>
                </div>

              </div>
              <div class="form-group">
                <label>Call For Action</label>
                <VTextarea v-model="action" :value="this.action" name="action" class="form-control" />
                <ErrorMessage name="action" class="error-feedback" />
              </div>
              <div class="form-group">
                <label>Campaign Goal</label>
                <v-text-field name="team_goal" type="number" :value="this.goal" v-model="goal" class="form-control" prefix="$" />
                <ErrorMessage name="goal" class="error-feedback" />
              </div>
              <v-card>
                <v-card-title>Children</v-card-title>
                <v-btn @click="addChild">New Child</v-btn>
                <ChildEntry v-for="(child, index) in children"
                            :itemdata="students"
                            v-on:remove="removeChild(index)"
                            :key="child.student_id"
                            :student_id_prop="child.student_id"
                            :teacher_id_prop="child.teacher_id">
                </ChildEntry>
              </v-card>
              <div class="form-group">
                <button class="btn btn-primary btn-block" @click="updateTeam">
                  Update Team
                </button>
              </div>
            </div>
          </Form>
          <div
              v-if="message"
              class="alert"
              :class="successful ? 'alert-success' : 'alert-danger'"
          >
            {{ message }}
          </div>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import ChildEntry from "@/components/ChildEntry";
import TeamDataService from "@/services/TeamDataService";
import StudentDataService from "@/services/StudentDataService";
import UploadService from "@/services/UploadFilesService";

export default {
  name: "CreateTeam",
  components: {
    ChildEntry,
    Form,
    Field,
    ErrorMessage
  },
  props: ['campaign_id'],
  data() {
    const schema = yup.object().shape({
      team_name: yup
          .string()
          .required("Team Name is required!"),
      action: yup
          .string()
          .required("Action is required!"),
      goal: yup
          .string()
          .required("Goal is required!")
    });
    return {
      schema,
      team: this.getTeam(),
      team_id: 0,
      goal: 500,
      team_name: '',
      team_img: null,
      action: '',
      children: this.getStudentsForTeam(this.$route.params.team_id),
      students: [],
      selectedFile: undefined,
      currentFile: undefined,
      progress: 0,
      message: "",
    }
  },
  methods: {
    getTeam() {
      TeamDataService.get(this.$route.params.team_id)
          .then(response => {
            console.log(response);
            this.team = response.data;
            this.team_id = this.team.team_id;
            this.team_name = this.team.name;
            this.goal = this.team.team_goal;
            this.action = this.team.description;
            this.children = this.getStudentsForTeam(this.team.team_id);
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
    getStudentsForTeam(team_id) {
      StudentDataService.getStudentsByTeam(team_id)
        .then(response => {
          console.log(response);
          let children = [];
          for (let i = 0; i < response.data.length; i++) {
            children.push({teacher_id: response.data[i].teacher_id, student_id: response.data[i].student_id});
          }
          this.children = children;
          return children;
        })
    },
    selectFile() {
      this.selectedFile = this.$refs.file.files[0];
    },
    upload() {
      this.progress = 0;
      this.currentFile = this.selectedFile;
      UploadService.upload(this.currentFile, event => {
        this.progress = Math.round((100 * event.loaded) / event.total);
      })
          .then(response => {
            this.message = response.data.message;
            this.team_img = response.data.url;
          })
          .catch(() => {
            this.progress = 0;
            this.message = "Could not upload the file!";
            this.currentFile = undefined;
          });
    },
    addChild() {
      this.children.push({teacher_id: null, student_id: null});
    },
    removeChild(index) {
      this.children.splice(index, 1)
    },
    updateTeam() {
      const team = {
        name: this.team_name,
        user_id: this.$store.state.auth.user.id,
        team_img: this.team_img,
        description: this.action,
        team_goal: this.goal
      }
      TeamDataService.update(this.team_id, team)
          .then(response => {
            console.log(response.data);
            this.submitted = true;
            for (let i = 0; i < this.students.length; i++) {
              StudentDataService.update(this.students.student_id, {team_id: this.team_id})
            }
            const teamPage = "/team/" + this.team_id;
            this.$router.push(teamPage);
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