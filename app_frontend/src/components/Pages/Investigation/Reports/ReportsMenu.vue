<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <app-card noSeachBar="true">
          <span slot="card-header-icon"><v-icon>poll</v-icon></span>
          <span slot="card-header-title">Sales Reports</span>

          <span slot="card-content">
            <v-layout row>
              <v-flex sm6 xs12>
                <v-btn large block outline color="primary" :to="{ name: 'SalesByPeriod' }">
                  Sales by period
                </v-btn>
              </v-flex>
              <v-flex sm6 xs12>
                <v-btn large block outline color="primary" @click="test" disabled>
                  Open PO
                </v-btn>
              </v-flex>
            </v-layout>
          </span>
        </app-card>
      </v-flex>

      <v-flex xs12>
        <app-card noSeachBar="true">
          <span slot="card-header-icon"><v-icon>poll</v-icon></span>
          <span slot="card-header-title">Purchasing Reports</span>

          <span slot="card-content">
            <v-layout row>
              <v-flex sm6 xs12>
                <v-btn large block outline color="primary" @click="test" disabled>
                  Purchase by Supplier Summary
                </v-btn>
              </v-flex>
              <v-flex sm6 xs12>
                <v-btn large block outline color="primary" @click="test" disabled>
                  Purchase by Supplier Detail
                </v-btn>
              </v-flex>
              <v-flex sm6 xs12>
                <v-btn large block outline color="primary" @click="test" disabled>
                  Purchase by Products Summary
                </v-btn>
              </v-flex>
              <v-flex sm6 xs12>
                <v-btn large block outline color="primary" @click="test" disabled>
                  Purchase by Products Detail
                </v-btn>
              </v-flex>
            </v-layout>
          </span>
        </app-card>
      </v-flex>

      <v-flex xs12>
        <app-card noSeachBar="true">
          <span slot="card-header-icon"><v-icon>poll</v-icon></span>
          <span slot="card-header-title">Man Hour Reports</span>

          <span slot="card-content">
            <v-layout row>
              <v-flex sm6 xs12>
                <v-btn large block outline color="primary" @click="manHourTotal(false)">
                  Monthly Total Reports
                </v-btn>
              </v-flex>
              <v-flex sm6 xs12>
                <v-btn large block outline color="primary" @click="manHourTotal(true)">
                  Annual Total Reports for Costing
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
    manHourTotal(val) {
      this.setIsAnnual(val);
      this.$router.push({ name: "ManHourTotal" });
    }
  }
}
</script>

<style>

</style>
