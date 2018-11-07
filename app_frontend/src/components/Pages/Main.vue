<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column>

        <h1>Main menu</h1>

        <!-- メインメニュー -->
        <div>
          <v-card>
            <v-container
              fluid
              grid-list-lg
              v-for="menu in menus"
              :key="menu.title"
            >
              <v-layout row wrap>
                <v-flex xs12>
                  <h2>{{ menu.title }}</h2>
                </v-flex>
                <v-flex 
                  v-for="subMenu in menu.subMenus"
                  :key="subMenu.title"
                  xs4
                >
                  <v-card color="blue-grey darken-2" class="white--text">
                    <v-card-title primary-title>
                      <div class="headline">{{ subMenu.title }}</div>
                      <!-- <div>Listen to your favorite artists and albums whenever and wherever, online and offline.</div> -->
                    </v-card-title>
                    <v-card-actions>
                      <!-- <v-btn flat dark>Listen now</v-btn> -->
                    </v-card-actions>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </div>

      </v-layout>
    </v-slide-y-transition>
  </v-container>
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
    ...mapActions("systemMasterApi", ["getCountries"]),
    ajax: function() {
      this.getCountries();
      // console.log(this.countries);
    }
  },
  mounted() {
    // console.log(this.menus + "main");
  }
};
</script>
