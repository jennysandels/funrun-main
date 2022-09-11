<template>
  <v-container>
    <v-row>
      <v-col cols="10">
        <h1>{{ this.student_name }}'s Donations</h1>
      </v-col>
      <v-col cols="2">
        <v-btn color="orange-darken-3" :to="`/donation/student=` + this.student_id">Donate Now!</v-btn>
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
          Student Info
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
        <td><b>Teacher Name</b></td>
        <td>{{this.teacher_name}}</td>
      </tr>
      <tr>
        <td><b>Student Name</b></td>
        <td>{{this.student_name}}</td>
      </tr>
      <tr>
        <td><b>Amount</b></td>
        <td>{{format(this.student_total)}}</td>
      </tr>
      <tr>
        <td><b>Rank</b></td>
        <td>{{ this.rank }}</td>
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
import StudentDataService from "@/services/StudentDataService";

export default {
  name: "StudentPage",

  data() {
    return {
      student: this.getStudent(),
      student_name: '',
      teacher_name: '',
      student_id: 0,
      grade: '',
      grade_name: '',
      rank: 0,
      student_total: 0,
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
    getStudent() {
      StudentDataService.get(this.$route.params.id)
        .then(student => {
            this.student = student.data[0];
            this.student_id = student.data[0].student_id;
            this.student_name = student.data[0].name;
            this.student_total = student.data[0].total;
            this.teacher_id = student.data[0].teacher_id;
            this.teacher = this.getTeacher(this.teacher_id);
            this.grade = this.getGradeInfo();
            this.rank = this.getRank();
            return student.data[0];
        });
    },
    getTeacher(id) {
      TeacherDataService.get(id)
        .then(teacher => {
          this.teacher = teacher.data[0];
          this.teacher_name = teacher.data[0].name;
          return teacher.data[0];
        })
    },
    getGradeInfo() {
      if (this.student) {
        GradeDataService.get(this.student.grade_id)
            .then(grade => {
              this.grade = grade.data;
              this.grade_name = grade.data.grade_name;
              return grade.data;
            });
      }
    },
    getRank() {
      StudentDataService.getByCampaign(2)
        .then(students => {
          // returns an ordered list of teachers
          var rank = 0;
          if (this.student.student_id) {
            for (let i = 0; i < students.data.length; i++) {
              if (students.data[i].student_id === this.student.student_id) {
                rank = i + 1;
                break;
              }
            }
          }
          this.rank = rank;
          return rank;
        });
    },

    format(number) {
      return this.formatter.format(number);
    },
  }
}
</script>

<style scoped>

</style>