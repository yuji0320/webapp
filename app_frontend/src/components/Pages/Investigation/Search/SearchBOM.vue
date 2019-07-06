<template>
  <v-container fluid grid-list-lg>
    <app-card noSeachBar="true">
      <span slot="card-header-icon"><v-icon>search</v-icon></span>
      <span slot="card-header-title">Search Bill of Material</span>





    </app-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  title: "Search BOM",
  name: "SearchBillOfMaterial",
  data () {
    return {
      
    }
  },
  computed: {
    
  },
  methods: {
    
  },
  created () {
    
  }
}
</script>

<style>

</style>
