<template>
  <div>
    <!-- <v-card>
      <v-card-text>
        <v-btn
          block
          color="primary"
          dark
          @click="showSnackbar('test')"
        >
          Show Snackbar
        </v-btn>
      </v-card-text>
    </v-card> -->
    <v-snackbar
      :top=true
      :value="snackbar.snackbarStatus"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.snack }}
      <v-btn
        dark
        flat
        @click="snackbar.snackbarStatus = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "snackbar",
  data() {
    return {
      color: "success"
    };
  },
  computed: {
    ...mapState("systemConfig", ["snackbar"])
  }
};
</script>
