<template>
  <v-container 
    fluid
    grid-list-lg
  >
    <v-layout row wrap>
      <v-flex tag="h1" class="headline">Dashbord</v-flex>
      <v-flex d-flex lg12 order-xs5>
        <v-layout column>
          <v-flex
            v-for="menu in menus"
            :key="menu.title"
          >
            <v-card fluid>
              <v-container 
                fluid
                grid-list-lg
              >
              <v-flex xs12>
                <h2>{{ menu.title }}</h2>
              </v-flex>
              <v-layout row wrap offset-xs1>
                <v-flex 
                  v-for="subMenu in menu.subMenus"
                  :key="subMenu.title"
                  xs3
                  d-flex
                >
                  <v-card color="blue-grey darken-2" class="white--text">
                    <v-card-title primary-title>
                      <div class="headline">{{ subMenu.title }}</div>
                      <!-- <div>Listen to your favorite artists and albums whenever and wherever, online and offline.</div> -->
                    </v-card-title>
                    <v-card-actions primary>
                      <v-btn flat dark :to="subMenu.url">Go!</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-flex>
              </v-layout> 
              </v-container>          
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
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
