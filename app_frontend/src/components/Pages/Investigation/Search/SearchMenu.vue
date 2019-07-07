<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <!-- 部品表検索 -->
      <v-flex xs12 md6>
        <app-card noSeachBar="true">
          <span slot="card-header-icon"><v-icon>search</v-icon></span>
          <span slot="card-header-title">Search Bill of Material</span>
          <span slot="card-content">
            <v-layout row>
              <!-- 工事番号検索フォーム -->
              <v-flex xs12>
                <app-incremental-model-search
                  label="Job Order"
                  orderBy="mfg_no"
                  v-model="mfgNoBOM"
                  searchType="jobOrder"
                  errorMessages=""
                  @clear-item="clearJobOrderIDBOM"
                ></app-incremental-model-search>
              </v-flex>
              <!-- 移動ボタン -->
              <v-flex xs12 sm6>
                <v-btn large block outline @click="searchBOM(true)" :disabled="mfgNoBOM ===''">
                  Processing Parts
                </v-btn>
              </v-flex>
              <v-flex xs12 sm6>
                <v-btn large block outline @click="searchBOM(false)" :disabled="mfgNoBOM ===''">
                  Other Parts
                </v-btn>
              </v-flex>
            </v-layout>
          </span>
        </app-card>
      </v-flex>

      <!-- 発注ファイル検索 -->
      <v-flex xs12 md6>
        <app-card noSeachBar="true">
          <span slot="card-header-icon"><v-icon>search</v-icon></span>
          <span slot="card-header-title">Search Order</span>
          <span slot="card-content">
            <v-layout row>
              <v-flex xs12>
                <app-incremental-model-search
                  label="Job Order"
                  orderBy="mfg_no"
                  v-model="mfgNoOrder"
                  searchType="jobOrder"
                  errorMessages=""
                  @clear-item="clearJobOrderIDOrder"
                ></app-incremental-model-search>
              </v-flex>
              <!-- 移動ボタン -->
              <v-flex xs12 sm6>
                <v-btn large block outline @click="searchOrder(true)" :disabled="mfgNoOrder ===''">
                  Processing Parts
                </v-btn>
              </v-flex>
              <v-flex xs12 sm6>
                <v-btn large block outline @click="searchOrder(false)" :disabled="mfgNoOrder ===''">
                  Other Parts
                </v-btn>
              </v-flex>
              <v-flex xs12 sm6>
                <v-btn large block outline @click="searchOrderWithoutMFGNo">
                  Without MFG No
                </v-btn>
              </v-flex>
            </v-layout>
          </span>
        </app-card>
      </v-flex>

      <v-flex xs12 md6>
        <app-card noSeachBar="true">
          <span slot="card-header-icon"><v-icon>search</v-icon></span>
          <span slot="card-header-title">Search Received</span>
        </app-card>
      </v-flex>

      <v-flex xs12 md6>
        <app-card noSeachBar="true">
          <span slot="card-header-icon"><v-icon>search</v-icon></span>
          <span slot="card-header-title">Search Parts Cost</span>
          <span slot="card-content">
            <v-layout row>
              <v-flex xs12 sm6>
                <v-btn large block outline @click="searchCost">
                  Search Parts Cost
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
      mfgNoBOM: "",
      mfgNoOrder: "",
      // supplierOrder: "",
      // orderNumberOrder: "",
    }
  },
  computed: {
    ...mapState("billOfMaterialAPI", { jobOrderIDBOM: "jobOrderID"}),
    ...mapState("makingOrderAPI", { jobOrderIDOrder: "jobOrderID", isProcessedOrder: "isProcessed", supplierIDOrder: "supplierID"}),

  },
  methods: {
    ...mapActions("billOfMaterialAPI", 
      { setJobOrderIDBOM:"setJobOrderID", setIsProcessedBOM: "setIsProcessed"}
    ),
    ...mapActions("makingOrderAPI", 
      { setJobOrderIDOrder:"setJobOrderID", setIsProcessedOrder: "setIsProcessed", setSupplierIDOrder: "setSupplierID"}
    ),
    clearJobOrderIDBOM() {
      this.mfgNoBOM = "";
      this.setJobOrderIDBOM("");
    },
    searchBOM(isProcessed) {
      this.setJobOrderIDBOM(this.mfgNoBOM);
      this.setIsProcessedBOM(isProcessed);
      this.$router.push({ name: "SearchBOM" });
    },
    clearJobOrderIDOrder() {
      this.mfgNoOrder = "";
      this.setJobOrderIDOrder("");     
    },
    searchOrder(isProcessed) {
      this.setJobOrderIDOrder(this.mfgNoOrder);
      this.setIsProcessedOrder(isProcessed);
      // console.log(this.isProcessedOrder);
      // // this.setSupplierIDOrder(this.supplierOrder);
      this.$router.push({ name: "SearchOrder" });
    },
    searchOrderWithoutMFGNo() {
      this.setJobOrderIDOrder("");
      this.$router.push({ name: "SearchOrder" });
    },
    searchCost() {
      this.$router.push({ name: "SearchCost" });
    }

  },
  created () {
    this.mfgNoBOM = this.jobOrderIDBOM;
    this.mfgNoOrder = this.jobOrderIDOrder;
  }
}
</script>

<style>

</style>
