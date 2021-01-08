<template>
  <v-app class="">
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import moment from "moment";

export default {
  name: "App",
  data() {
    return {
      test: "test"
    };
  },
  filters: {
    printDate(val) {
      return moment(val)
        .locale("ja")
        .format("YYYY年MM月DD日(ddd) HH時mm分ss秒");
    }
  }
};
</script>

<style>
@media print {
  .no_print {
    display: none;
  }
}

.centered-input input {
  text-align: center;
}

.right-input input {
  text-align: right;
}
</style>
