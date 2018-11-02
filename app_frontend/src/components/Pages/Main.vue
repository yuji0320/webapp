<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column>

        <h1>Welcome!</h1>

        <button @click="ajax">getCountries</button>

        <!-- <button @click="tokentest">Test Token Auth</button> -->

        <div>
          <v-card>
            <v-container grid-list-lg>
              <v-layout row wrap>
                <v-flex xs4 v-for="data in countries.results" :key="data.id">
                  <v-card color="primary" class="white--text">
                    <v-card-title primary-title>
                      <div>{{ data.name }}</div>
                    </v-card-title>
                    <v-card-text>
                      <div>{{ data.createdAt|printDate }}</div>
                    </v-card-text>
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
  title: "Main",
  name: "Main",
  data() {
    return {};
  },
  computed: {
    ...mapState("systemMasterApi", ["countries"])
  },
  methods: {
    ...mapActions("systemMasterApi", ["getCountries"]),
    ajax: function() {
      this.getCountries();
      // console.log(this.countries);
    }
  },
  mounted() {}
};
</script>
