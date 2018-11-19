<template>
  <v-container 
      fluid
      grid-list-lg
    >
    <v-card>
      <v-toolbar card>
        <v-icon>people</v-icon>
        <v-toolbar-title class="font-weight-light">Staff Master</v-toolbar-title>
      </v-toolbar>

      {{ userStaffs }}

    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Staff master",
  name: "Staff",
  data() {
    return {};
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemUserApi", ["userStaffs"])
  },
  methods: {
    ...mapActions("systemUserApi", ["getStaffs"])
  },
  mounted() {
    this.getStaffs({ params: {company : this.loginUserData.companyId} });
  }
};
</script>
