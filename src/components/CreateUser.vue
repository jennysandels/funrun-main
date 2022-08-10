<template>
<v-container>
  <v-row>
    <v-col cols="5">
      <v-card
        title="Join the Campaign!"
        subtitle='the campaign description needs to go here!'>
        <v-img src="../assets/funrunpic.png"></v-img>
      </v-card>
    </v-col>
    <v-col cols="7">
      <v-container>
          <Form @submit="handleRegister" :validation-schema="schema">
            <div v-if="!successful">
              <div class="form-group">
                <label for="first_name">First Name</label>
                <Field name="first_name" type="text" class="form-control" />
                <ErrorMessage name="first_name" class="error-feedback" />
              </div>
              <div class="form-group">
                <label for="last_name">Last Name</label>
                <Field name="last_name" type="text" class="form-control" />
                <ErrorMessage name="last_name" class="error-feedback" />
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <Field name="email" type="email" class="form-control" />
                <ErrorMessage name="email" class="error-feedback" />
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <Field name="password" type="password" class="form-control" />
                <ErrorMessage name="password" class="error-feedback" />
              </div>
              <div>
                <div class="terms">
                  <v-card
                      class="overflow-y-auto"
                      max-height="200">
                    <v-card-title>Terms and Conditions</v-card-title>
                    <v-card-text>
                      {{ terms }}
                    </v-card-text>
                  </v-card>
                  <v-checkbox
                      v-model="checkbox"
                      label="I agree to the terms and conditions"></v-checkbox>
                </div>
              </div>
              <div class="form-group">
                <button class="btn btn-primary btn-block" :disabled="!checkbox">
                  Sign Up
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
export default {
  name: "Register",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      first_name: yup
          .string()
          .required("First Name is required!"),
      last_name: yup
          .string()
          .required("Last Name is required!"),
      email: yup
          .string()
          .required("Email is required!")
          .email("Email is invalid!")
          .max(50, "Must be maximum 50 characters!"),
      password: yup
          .string()
          .required("Password is required!")
          .min(6, "Must be at least 6 characters!")
          .max(40, "Must be maximum 40 characters!"),
    });
    return {
      successful: false,
      checkbox: false,
      loading: false,
      message: "",
      schema,
      terms: "1. Introduction.\n" +
          "These Website Standard Terms And Conditions (these “Terms” or these “Website Standard Terms And Conditions”) contained herein on this webpage, shall govern your use of this website, including all pages within this website (collectively referred to herein below as this “Website”). These Terms apply in full force and effect to your use of this Website and by using this Website, you expressly accept all terms and conditions contained herein in full. You must not use this Website, if you have any objection to any of these Website Standard Terms And Conditions.\n" +
          "\n" +
          "This Website is not for use by any minors (defined as those who are not at least 18 years of age), and you must not use this Website if you a minor.\n" +
          "\n" +
          "2. Intellectual Property Rights.\n" +
          "Other than content you own, which you may have opted to include on this Website, under these Terms, FunRunWeb and/or its licensors own all rights to the intellectual property and material contained in this Website, and all such rights are reserved.\n" +
          "\n" +
          "You are granted a limited license only, subject to the restrictions provided in these Terms, for purposes of viewing the material contained on this Website.\n" +
          "3. Restrictions.\n" +
          "You are expressly and emphatically restricted from all of the following:\n" +
          "\n" +
          "publishing any Website material in any media;\n" +
          "selling, sublicensing and/or otherwise commercializing any Website material;\n" +
          "publicly performing and/or showing any Website material;\n" +
          "using this Website in any way that is, or may be, damaging to this Website;\n" +
          "using this Website in any way that impacts user access to this Website;\n" +
          "using this Website contrary to applicable laws and regulations, or in a way that causes, or may cause, harm to the Website, or to any person or business entity;\n" +
          "engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website, or while using this Website;\n" +
          "using this Website to engage in any advertising or marketing;\n" +
          "Certain areas of this Website are restricted from access by you and FunRunWeb may further restrict access by you to any areas of this Website, at any time, in its sole and absolute discretion. Any user ID and password you may have for this Website are confidential and you must maintain confidentiality of such information.\n" +
          "\n" +
          "4. Your Content.\n" +
          "In these Website Standard Terms And Conditions, “Your Content” shall mean any audio, video, text, images or other material you choose to display on this Website. With respect to Your Content, by displaying it, you grant FunRunWeb a non-exclusive, worldwide, irrevocable, royalty-free, sublicensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media. Your Content must be your own and must not be infringing on any third party’s rights. FunRunWeb reserves the right to remove any of Your Content from this Website at any time, and for any reason, without notice.\n" +
          "5. No warranties.\n" +
          "This Website is provided “as is,” with all faults, and FunRunWeb makes no express or implied representations or warranties, of any kind related to this Website or the materials contained on this Website. Additionally, nothing contained on this Website shall be construed as providing consult or advice to you.\n" +
          "6. Limitation of liability.\n" +
          "In no event shall FunRunWeb, nor any of its officers, directors and employees, be liable to you for anything arising out of or in any way connected with your use of this Website, whether such liability is under contract, tort or otherwise, and FunRunWeb, including its officers, directors and employees shall not be liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.\n" +
          "7. Indemnification.\n" +
          "You hereby indemnify to the fullest extent FunRunWeb from and against any and all liabilities, costs, demands, causes of action, damages and expenses (including reasonable attorney’s fees) arising out of or in any way related to your breach of any of the provisions of these Terms.\n" +
          "8. Severability.\n" +
          "If any provision of these Terms is found to be unenforceable or invalid under any applicable law, such unenforceability or invalidity shall not render these Terms unenforceable or invalid as a whole, and such provisions shall be deleted without affecting the remaining provisions herein.\n" +
          "9. Variation of Terms.\n" +
          "FunRunWeb is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review such Terms on a regular basis to ensure you understand all terms and conditions governing use of this Website.\n" +
          "10. Assignment.\n" +
          "FunRunWeb shall be permitted to assign, transfer, and subcontract its rights and/or obligations under these Terms without any notification or consent required. However, .you shall not be permitted to assign, transfer, or subcontract any of your rights and/or obligations under these Terms.\n" +
          "\n" +
          "11. Entire Agreement.\n" +
          "These Terms, including any legal notices and disclaimers contained on this Website, constitute the entire agreement between FunRunWeb and you in relation to your use of this Website, and supersede all prior agreements and understandings with respect to the same.\n" +
          "\n" +
          "12. Governing Law & Jurisdiction.\n" +
          "These Terms will be governed by and construed in accordance with the laws of the State of Virginia, and you submit to the non-exclusive jurisdiction of the state and federal courts located in Virginia for the resolution of any disputes."
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
  },
  methods: {
    handleRegister(user) {
      this.message = "";
      this.successful = false;
      this.loading = true;
      this.$store.dispatch("auth/register", user).then(
          (data) => {
            this.message = data.message;
            this.successful = true;
            this.loading = false;
              this.$router.push("/");
          },
          (error) => {
            this.message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            this.successful = false;
            this.loading = false;
          }
      );
    },
  },
};
</script>
<style scoped>

</style>