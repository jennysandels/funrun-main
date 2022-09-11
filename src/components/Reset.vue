<template>
  <form @submit.prevent="handleSubmit">
    <h3>Reset Password</h3>
    <div class="form-group">
      <label>Password</label>
      <input type="password" class="form-control" v-model="password" placeholder="Password"/>
    </div>
    <div class="form-group">
      <label>Password Confirm</label>
      <input type="password" class="form-control" v-model="passwordConfirm" placeholder="Password Confirm"/>
    </div>
    <button class="btn btn-primary btn-block">Submit</button>
  </form>
</template>

<script>
import http from '../http-common'
import jwt from "jwt-simple";
import {SECRET} from "@/config/development";
export default {
  name: "Reset",
  data() {
    return {
      password: '',
      passwordConfirm: ''
    }
  },
  methods: {
    async handleSubmit() {
      const encoded_password = jwt.encode(this.password, SECRET);
      const response = await http.post('auth/reset', {
        password: encoded_password,
        token: this.$route.params.token
      });
      console.log(response);
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>

</style>