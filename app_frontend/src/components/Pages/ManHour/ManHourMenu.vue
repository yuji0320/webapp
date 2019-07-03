<template>
  <v-container fluid grid-list-lg>
    <app-card>
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>access_time</v-icon></span>
      <span slot="card-header-title">Man Hour</span>

      <span slot="card-title-text">
        <p>*Please select and Add or Edit ManHour File</p>
      </span>

      <span slot="card-content">
        <v-layout row wrap>
          <v-flex xs12 sm6>
            <v-btn 
              large 
              block 
              round
              color="primary"
              @click="manHour(false)"
            >
              Add or Edit Man Hour (Personal)
            </v-btn>
          </v-flex>
          <v-flex xs12 sm6>
            <v-btn 
              large 
              block 
              round
              color="primary"
              @click="manHour(true)"
            >
              Add or Edit Man Hour (Admin)
            </v-btn>
          </v-flex>
        </v-layout>
      </span>


    </app-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "ManHourMenu",
  name: "ManHourMenu",
  data() {
    return {}
  },
  computed: {
    ...mapState("manHourAPI", ["isAdmin"]),

  },
  methods: {
    ...mapActions("manHourAPI", ["setIsAdmin"]),
    manHour(isAdmin) {
      this.setIsAdmin(isAdmin);
      this.$router.push({ name: "ManHourList" });
    }
  }
}
</script>

<style>

</style>
