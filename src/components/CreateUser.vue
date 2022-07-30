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
              <div class="form-group">
                <VCheckbox name="termsofservice" class="form-control">Click to Accept our Terms of Service</VCheckbox>
              </div>
              <div class="form-group">
                <button class="btn btn-primary btn-block" :disabled="loading">
                  <span
                      v-show="loading"
                      class="spinner-border spinner-border-sm"
                  ></span>
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
      loading: false,
      message: "",
      schema,
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