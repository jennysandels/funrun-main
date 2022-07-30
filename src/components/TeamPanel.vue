<template>
<v-container>
  <v-card :title="team.name"
          :subtitle="team.total">
    <v-img :src="`http://localhost:8080/api/teams/image/` + team.team_id"></v-img>
  </v-card>
</v-container>
</template>

<script>
export default {
  name: "TeamPanel",

  data() {
    return {
    }
  },
  props: ['team'],
  methods: {
  }
}
</script>

<style scoped>

</style>