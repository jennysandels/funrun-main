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
                <label for="team_name">Team Name</label>
                <Field name="team_name" type="text" v-model="team_name" class="form-control" />
                <ErrorMessage name="team_name" class="error-feedback" />
              </div>
              <div class="form-group">
                <label for="profile_image">Profile Image</label>
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
                <label for="action">Call For Action</label>
                <VTextarea v-model="action" name="action" class="form-control" />
                <ErrorMessage name="action" class="error-feedback" />
              </div>
              <div class="form-group">
                <label for="goal">Campaign Goal</label>
                <v-text-field name="team_goal" type="number" v-model="goal" class="form-control" prefix="$" />
                <ErrorMessage name="goal" class="error-feedback" />
              </div>
              <v-card>
                <v-card-title>Children</v-card-title>
                <v-btn @click="addChild">New Child</v-btn>
                <ChildEntry v-for="(child, index) in children"
                         :itemdata="students"
                         v-on:remove="removeChild(index)"
                          :key="child.student_id"
                          student_prop.sync="child">
                </ChildEntry>
              </v-card>
              <div class="form-group">
                <button class="btn btn-primary btn-block" @click="createTeam">
                  Create Team
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
      goal: 500,
      team_name: '',
      team_img: "../assets/funrunpic.png",
      action: '',
      children: [{teacher_id: null, student_id: null}],
      students: [],
      selectedFile: undefined,
      currentFile: undefined,
      progress: 0,
      message: ""
    }
  },
  methods: {
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
    createTeam() {
      const team = {
        name: this.team_name,
        user_id: this.$store.state.auth.user.id,
        campaign_id: this.campaign_id,
        team_img: this.team_img,
        description: this.action,
        team_goal: this.goal
      }
      TeamDataService.create(team)
      .then(response => {
          const team_id = response.data.team_id;
          console.log(response.data);
          this.submitted = true;
          for (let i = 0; i < this.students.length; i++) {
            StudentDataService.update(this.students.student_id, {team_id: team_id})
          }
          const teamPage = "/team/" + team_id;
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