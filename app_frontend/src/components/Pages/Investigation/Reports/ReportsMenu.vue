<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12 md6>
        <app-card noSeachBar="true">
          <span slot="card-header-icon"><v-icon>poll</v-icon></span>
          <span slot="card-header-title">Sales Reports</span>

          <span slot="card-content">
            <v-layout row>
              <v-flex sm6 xs12>
                <v-btn large block outline :to="{ name: 'SalesByPeriod' }">
                  Sales by period
                </v-btn>
              </v-flex>
              <v-flex sm6 xs12>
                <v-btn large block outline :to="{ name: 'OpenPO' }">
                  Open PO
                </v-btn>
              </v-flex>
            </v-layout>
          </span>
        </app-card>
      </v-flex>

      <v-flex xs12 md6>
        <app-card noSeachBar="true">
          <span slot="card-header-icon"><v-icon>poll</v-icon></span>
          <span slot="card-header-title">Purchasing Reports</span>

          <span slot="card-content">
            <v-layout row>
              <v-flex sm6 xs12>
                <v-btn large block outline @click="purchasing" disabled>
                  Purchasing Summary
                </v-btn>
              </v-flex>
              <v-flex sm6 xs12>
                <v-btn large block outline @click="purchasing" disabled>
                  Purchasing Detail
                </v-btn>
              </v-flex>
            </v-layout>
          </span>
        </app-card>
      </v-flex>

      <v-flex xs12 md6>
        <app-card noSeachBar="true">
          <span slot="card-header-icon"><v-icon>poll</v-icon></span>
          <span slot="card-header-title">Costing Reports</span>

          <span slot="card-content">
            <v-layout row>
              <v-flex sm6 xs12>
                <v-btn large block outline @click="manHourTotal(false)">
                  Monthly Total Reports
                </v-btn>
              </v-flex>
              <v-flex sm6 xs12>
                <v-btn large block outline @click="manHourTotal(true)">
                  Annual Reports for Costing
                </v-btn>
              </v-flex>
            </v-layout>
          </span>
        </app-card>
      </v-flex>

      <v-flex xs12 md6>
        <app-card noSeachBar="true">
          <span slot="card-header-icon"><v-icon>poll</v-icon></span>
          <span slot="card-header-title">Man Hour Reports</span>

          <span slot="card-content">
            <v-layout row>
              <v-flex sm6 xs12>
                <v-btn large block outline @click="wipMaterial()">
                  Work-in-process(Material costs)
                </v-btn>
              </v-flex>
              <v-flex sm6 xs12>
                <v-btn large block outline disabled>
                  Work-in-process(Labor costs)
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
  title: "Reports",
  name: "Reports",
  data() {
    return {};
  },
  computed: {
    ...mapState("manHourAPI", ["isAnnual"]),
  },
  methods: {
    ...mapActions("manHourAPI", ["setIsAnnual"]),
    test() {
      console.log("test");
    },
    purchasing() {
      this.$router.push({ name: "PurchasingReport" });
    },
    manHourTotal(val) {
      this.setIsAnnual(val);
      this.$router.push({ name: "ManHourTotal" });
    },
    wipMaterial() {
      this.$router.push({ name: "WIPMaterialCosts" });      
    }
  }
}
</script>

<style>

</style>
