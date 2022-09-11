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
        <Form @submit="handleLogin" :validation-schema="schema">
        <div class="form-group">
          <label for="email">Email</label>
          <Field name="email" type="text" class="form-control" />
          <ErrorMessage name="email" class="error-feedback" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <Field name="password" type="password" class="form-control" />
          <ErrorMessage name="password" class="error-feedback" />
        </div>
        <button class="btn btn-primary btn-block" :disabled="loading">
          <span
              v-show="loading"
              class="spinner-border spinner-border-sm"
          ></span>
          <span>Login</span>
        </button>
          <p class="forgot-password text-right">
            <router-link to="forgot">Forgot password?</router-link>
          </p>

        <div class="form-group">
          <div v-if="message" class="alert alert-danger" role="alert">
            {{ message }}
          </div>
        </div>
      </Form>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import {SECRET} from "../config/development";
import jwt from 'jwt-simple';
export default {
  name: "Login",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      email: yup.string().required("Email is required!"),
      password: yup.string().required("Password is required!"),
    });
    return {
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
  created() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
  },
  methods: {
    handleLogin(user) {
      this.loading = true;
      const encoded_password = jwt.encode(user.password, SECRET);
      const encoded_user = {
        email: user.email,
        password: encoded_password
      };
      this.$store.dispatch("auth/login", encoded_user).then(
          () => {
            this.$router.push(this.$route.query.redirect || '/');
          },
          (error) => {
            this.loading = false;
            this.message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
          }
      );
    },
  },
};
</script>


<style scoped>

</style>