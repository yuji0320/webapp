<template>
  <v-card 
    class="d-block pa-2" 
    color="grey lighten-2"
    flat
  >
    <!-- KSIシステム移行画面 -->
    <!-- <v-card class="d-block pa-2 ma-2" >
      <v-card-title primary-title>
        <v-btn :to="{ name: 'SystemMigrationMenu' }">KSIシステム移行画面</v-btn>
      </v-card-title>
    </v-card> -->

    <v-card
      class="d-block pa-2 ma-2" 
      v-for="menu in menus"
      :key="menu.title"
    >
      <v-card-title class="headline">{{ menu.title }}</v-card-title>
      <v-row dense class="pa-4">
        <v-col 
          v-for="subMenu in menu.subMenus"
          :key="subMenu.title"
          cols="12" sm="3"
        >
          <v-card 
            color="blue-grey darken-2" 
            class="white--text"
          >
            <v-card-title primary-title>
              <div class="headline">{{ subMenu.title }}</div>
            </v-card-title>
            <v-card-actions primary>
              <v-btn :to="subMenu.url">Go!</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-card>
</template>

<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Main menu",
  name: "Main",
  data() {
    return {};
  },
  computed: {
    ...mapState("systemConfig", ["menus"]),
    ...mapState("systemMasterApi", ["countries"])
  },
  methods: {
    ...mapActions("systemMasterApi", ["getCountries"])
    // ajax: function() {
    //   this.getCountries();
    //   // console.log(this.countries);
    // }
  },
  mounted() {
    // console.log(this.menus + "main");
    // this.ajax();
  }
};
</script>
