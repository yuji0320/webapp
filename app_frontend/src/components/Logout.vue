<template>
  <router-view></router-view>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "logout",
  methods: {
    ...mapActions("auth", ["logout"])
  },
  mounted: function() {
    this.logout({ router: this.$router });
    localStorage.removeItem("vuex");
  }
};
</script>
