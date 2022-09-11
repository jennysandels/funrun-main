<template>
  <v-container>
    <v-row>
      <v-col cols="10">
        <h1>{{ this.teacher_name }}'s Class</h1>
      </v-col>
      <v-col cols="2">
        <v-btn color="orange-darken-3" :to="`/donation/classroom=` + this.teacher_id">Donate Now!</v-btn>
      </v-col>
    </v-row>
  </v-container>
  <v-row>
    <v-col cols="6">
  <v-container>
    <v-table>
      <thead>
      <tr>
        <th class="text-left">
          Classroom Info
        </th>
        <th></th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td><b>Grade</b></td>
        <td>{{ this.grade_name }}</td>
      </tr>
      <tr>
        <td><b>Name</b></td>
        <td>{{this.teacher_name}}'s Class</td>
      </tr>
      <tr>
        <td><b>Amount</b></td>
        <td>{{format(this.teacher_total)}}</td>
      </tr>
      <tr>
        <td><b>Rank</b></td>
        <td>{{ this.rank }}</td>
      </tr>
      </tbody>
    </v-table>
  </v-container>
    </v-col>
    <v-col cols="6">
      <v-container>
        <v-table>
          <thead>
          <tr>
            <th class="text-left">
              Classroom Awards
            </th>
            <th></th>
            <th></th>
          </tr>
          <tr>
            <th class="text-left">
              Award
            </th>
            <th class="text-left">
              Amount Required
            </th>
            <th class="text-left">
              Achieved
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="prize in this.prizes"
              :key="prize.prize_name"
          >
            <td>{{ prize.prize_name }}</td>
            <td>{{ format(prize.donation_amount) }}</td>
            <td>
              <v-icon class="mr-3" color="green">{{ prize.icon }}</v-icon>
            </td>
          </tr>
          </tbody>
        </v-table>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
import TeacherDataService from "@/services/TeacherDataService";
import GradeDataService from "@/services/GradeDataService";
import PrizesDataService from "@/services/PrizesDataService";

export default {
  name: "ClassPage",

  data() {
    return {
      teacher: this.getTeacher(),
      teacher_name: '',
      teacher_id: 0,
      grade: '',
      grade_name: '',
      rank: 0,
      teacher_total: 0,
      prizes: this.getClassPrizes(),
      formatter: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

        // These options are needed to round to whole numbers if that's what you want.
        minimumFractionDigits: 2, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        maximumFractionDigits: 2, // (causes 2500.99 to be printed as $2,501)
      })
    }
  },
  methods: {
    getTeacher() {
      TeacherDataService.get(this.$route.params.id)
        .then(teacher => {
            this.teacher = teacher.data[0];
            this.teacher_id = teacher.data[0].teacher_id;
            this.teacher_name = teacher.data[0].name;
            this.teacher_total = teacher.data[0].total;
            this.grade = this.getGradeInfo();
            this.rank = this.getRank();
            return teacher.data[0];
        });
    },
    getGradeInfo() {
      if (this.teacher) {
        GradeDataService.get(this.teacher.grade_id)
            .then(grade => {
              this.grade = grade.data;
              this.grade_name = grade.data.grade_name;
              return grade.data;
            });
      }
    },
    getRank() {
      TeacherDataService.getByCampaignId(2)
        .then(teachers => {
          // returns an ordered list of teachers
          var rank = 0;
          if (this.teacher.teacher_id) {
            for (let i = 0; i < teachers.data.length; i++) {
              if (teachers.data[i].teacher_id === this.teacher.teacher_id) {
                rank = i + 1;
                break;
              }
            }
          }
          this.rank = rank;
          return rank;
        });
    },
    getClassPrizes() {
      PrizesDataService.getClassPrizes(2)
        .then(prizes => {
          var updated_prizes = [];
          for (let i = 0; i < prizes.data.length; i++) {
            var updated_prize = prizes.data[i];
            if (this.getAchieved(updated_prize.donation_amount)) {
              updated_prize.icon = 'mdi-check-bold';
            } else {
              updated_prize.icon = 'mdi-emoty';
            }
            updated_prizes[i] = updated_prize;
          }
          this.prizes = updated_prizes;
          return updated_prizes;
        })
    },
    getAchieved(amount_required) {
      return this.teacher_total >= amount_required;
    },
    format(number) {
      return this.formatter.format(number);
    },
    getColor(amount) {
      if (amount) {
        return "red";
      }
    }
  }
}
</script>

<style scoped>

</style>