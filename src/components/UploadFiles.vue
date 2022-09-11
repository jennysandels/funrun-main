<template>
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
</template>
<script>
import UploadService from "../services/UploadFilesService";
import { ref } from 'vue'
export default {
  name: "upload-files",
  data() {
    return {
      selectedFile: undefined,
      progress: 0,
      message: "",
      fileInfos: []
    };
  },
  mounted() {
    UploadService.getFiles().then(response => {
      this.fileInfos = response.data;
    });
  },
  setup () {
    return {
      currentFile: ref(undefined),
    };
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
          })
          .catch(() => {
            this.progress = 0;
            this.message = "Could not upload the file!";
            this.currentFile = undefined;
          });
    }
  }
};
</script>