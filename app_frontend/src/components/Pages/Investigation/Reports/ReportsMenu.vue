<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12 md6>
        <app-card noSearchBar="true">
          <span slot="card-header-icon"><v-icon>poll</v-icon></span>
          <span slot="card-header-title">Sales Reports</span>

          <span slot="card-content">
            <br>
            <v-layout row>
              <v-flex sm6 xs12>
                <v-btn large block outlined :to="{ name: 'SalesByPeriod' }">
                  Sales by period
                </v-btn>
              </v-flex>
              <v-flex sm6 xs12>
                <v-btn large block outlined :to="{ name: 'OpenPO' }">
                  Open PO
                </v-btn>
              </v-flex>
            </v-layout>
          </span>
        </app-card>
      </v-flex>

      <v-flex xs12 md6>
        <app-card noSearchBar="true">
          <span slot="card-header-icon"><v-icon>poll</v-icon></span>
          <span slot="card-header-title">Purchasing Reports</span>

          <span slot="card-content">
            <br>
            <v-layout row>
              <v-flex sm6 xs12>
                <v-btn large block outlined @click="purchasing(false)">
                  Purchasing Summary
                </v-btn>
              </v-flex>
              <v-flex sm6 xs12>
                <v-btn large block outlined @click="purchasing(true)">
                  Purchasing Detail
                </v-btn>
              </v-flex>
            </v-layout>
          </span>
        </app-card>
      </v-flex>

      <v-flex xs12 md6>
        <app-card noSearchBar="true">
          <span slot="card-header-icon"><v-icon>poll</v-icon></span>
          <span slot="card-header-title">Man Hour Reports</span>

          <span slot="card-content">
            <br>
            <v-layout row>
              <v-flex sm6 xs12>
                <v-btn large block outlined @click="manHourTotal(false)">
                  Monthly Total Reports
                </v-btn>
              </v-flex>
              <v-flex sm6 xs12>
                <v-btn large block outlined @click="manHourTotal(true)">
                  Annual Reports for Costing
                </v-btn>
              </v-flex>
            </v-layout>
          </span>
        </app-card>
      </v-flex>

      <!-- 仕掛集計 -->
      <v-flex xs12 md6>
        <app-card noSearchBar="true">
          <span slot="card-header-icon"><v-icon>poll</v-icon></span>
          <span slot="card-header-title">Work In Process</span>
          <span slot="card-content">
            <br>
            <v-layout row>
              <v-flex sm6 xs12>
                <v-btn large block outlined @click="wipMaterial()">
                  Work-in-process(Material costs)
                </v-btn>
              </v-flex>
              <v-flex sm6 xs12>
                <v-btn large block outlined @click="wipLabor()">
                  Work-in-process(Labor costs)
                </v-btn>
              </v-flex>
            </v-layout>
          </span>
        </app-card>
      </v-flex>


      <v-flex xs12 md6>
        <app-card noSearchBar="true">
          <span slot="card-header-icon"><v-icon>poll</v-icon></span>
          <span slot="card-header-title">Costing Report</span>
          <span slot="card-content">
            <br>
            <v-layout row>
              <v-flex sm6 xs12>
                <v-btn large block outlined @click="costingReport()">
                  Costing Report
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
    ...mapState("receivingProcessAPI", ["isDetail"]),
  },
  methods: {
    ...mapActions("manHourAPI", ["setIsAnnual"]),
    ...mapActions("receivingProcessAPI", ["setIsDetail"]),
    // 仕入集計
    purchasing(val) {
      this.setIsDetail(val);
      this.$router.push({ name: "PurchasingReport" });
    },
    // 工数集計
    manHourTotal(val) {
      this.setIsAnnual(val);
      this.$router.push({ name: "ManHourTotal" });
    },
    // 仕掛材料費
    wipMaterial() {
      this.$router.push({ name: "WIPMaterialCosts" });      
    },
    // 仕掛労務費
    wipLabor() {
      this.$router.push({ name: "WIPLaborCosts" });      
    },
    // 原価集計
    costingReport() {
      // console.log("test");
      this.$router.push({ name: "CostingReport" });      
    }
  }
}
</script>

<style>

</style>
