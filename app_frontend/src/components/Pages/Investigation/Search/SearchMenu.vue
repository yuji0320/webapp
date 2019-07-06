<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12 md6>
        <app-card noSeachBar="true">
          <span slot="card-header-icon"><v-icon>search</v-icon></span>
          <span slot="card-header-title">Bill of Material</span>
          <span slot="card-content">
            <v-layout row>
              <v-flex xs12 sm6>
                <v-btn large block outline @click="searchBOM">
                  Processing Parts
                </v-btn>
              </v-flex>
              <v-flex xs12 sm6>
                <v-btn large block outline @click="searchBOM">
                  Other Parts
                </v-btn>
              </v-flex>
            </v-layout>
          </span>
        </app-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Search",
  name: "Search",
  data () {
    return {
      
    }
  },
  computed: {
    
  },
  methods: {
    searchBOM() {
      this.$router.push({ name: "SearchBOM" });
    }
  },
  created () {
    
  }
}
</script>

<style>

</style>
