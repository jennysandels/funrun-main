<template>
  <v-container>
    <v-col cols="12">
      <v-row>
        <v-select
            :items="classrooms"
            label="Classroom"
            v-model="teacher_id"
            @update:modelValue="this.getStudents"
        ></v-select>
        <v-select :items="students" label="Student Name" v-model="student_id"></v-select>
        <v-btn icon="mdi-delete" @click="deleteChild"></v-btn>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import TeacherDataService from "@/services/TeacherDataService";
import GradeDataService from "@/services/GradeDataService";
import StudentDataService from "@/services/StudentDataService";
export default {
  name: "ChildEntry",
  mounted() {
    this.classrooms = this.getClassrooms();
    this.students = this.getAllStudents();
  },
  props: ['teacher_id_prop','student_id_prop'],
  data() {
    return {
      classrooms: [],
      students: [],
      teacher_id: this.teacher_id_prop,
      grade_id: null,
      student_id: this.student_id_prop
    }
  },
  methods: {
    getClassrooms: function () {
      TeacherDataService.getByCampaignId(2)
          .then(data => {
              this.classrooms = [];
              for (let i = 0; i < data.data.length; i++) {
                let classroom = data.data[i];
                classroom.value = data.data[i].teacher_id;
                GradeDataService.get(classroom.grade_id)
                    .then(grade => {
                      classroom.title = grade.data.grade_name + " - " + data.data[i].name;
                      this.classrooms[i] = classroom;
                    });
              }
          })
    },
    getAllStudents: function () {
      StudentDataService.getAll().then(data => {
        this.students = [];
        for (let i = 0; i < data.data.length; i++) {
          let student = data.data[i];
          student.title = data.data[i].first_name + " " + data.data[i].last_name;
          student.value = data.data[i].student_id;
          this.students[i] = student;
        }
      })
    },
    getStudents: function() {
        TeacherDataService.get(this.teacher_id).then(data => {
          const teacher = data.data;
          this.grade_id = teacher.grade_id;
          StudentDataService.getStudentsByGrade(this.grade_id).then(data => {
            this.students = [];
            for (let i = 0; i < data.data.length; i++) {
              let student = data.data[i];
              student.title = data.data[i].first_name + " " + data.data[i].last_name;
              student.value = data.data[i].student_id;
              this.students[i] = student;
            }
          });
        });
    },
    deleteChild: function() {
      this.$emit('remove');
    }
  }
}
</script>

<style scoped>

</style>