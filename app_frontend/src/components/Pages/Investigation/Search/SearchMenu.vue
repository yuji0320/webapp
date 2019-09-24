<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <!-- 部品表検索 -->
      <v-flex xs12 md6>
        <app-card noSearchBar="true">
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
        <app-card noSearchBar="true">
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
        <app-card noSearchBar="true">
          <span slot="card-header-icon"><v-icon>search</v-icon></span>
          <span slot="card-header-title">Search Received</span>
          <span slot="card-content">
            <v-layout row wrap>
              <!-- 検索フォーム -->
              <v-flex xs12>
                <app-incremental-model-search
                        label="Job Order"
                        orderBy="-mfg_no"
                        v-model="mfgNoReceived"
                        searchType="jobOrder"
                        errorMessages=""
                        @clear-item="clearJobOrderIDReceived"
                ></app-incremental-model-search>
              </v-flex>
              <v-flex xs12>
                <app-incremental-model-search
                        label="Supplier"
                        orderBy="name"
                        v-model="supplierReceived"
                        searchType="partner"
                        filter="supplier"
                        ref="supplier"
                        @clear-item="clearSupplierIDReceived"
                ></app-incremental-model-search>
              </v-flex>
              <!--発注番号検索-->
              <v-flex xs12>
                <v-layout>
                  <v-flex>
                    <v-text-field label="Order Number" v-model="numberReceived"></v-text-field>
                  </v-flex>
                  <v-flex class="pt-3">
                    <v-btn @click="clearOrderNumberReceived">Clear</v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>

              <v-flex xs12 sm6>
                <v-btn large block outline @click="searchReceived" :disabled = "supplierReceived === '' && numberReceived === ''">
                  Search Received
                </v-btn>
              </v-flex>


            </v-layout>
          </span>
        </app-card>
      </v-flex>

      <v-flex xs12 md6>
        <app-card noSearchBar="true">
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
      mfgNoReceived: "",
      supplierReceived: "",
      numberReceived: ""
    }
  },
  computed: {
    ...mapState("billOfMaterialAPI", { jobOrderIDBOM: "jobOrderID"}),
    ...mapState("makingOrderAPI", { jobOrderIDOrder: "jobOrderID", isProcessedOrder: "isProcessed", supplierIDOrder: "supplierID"}),
    ...mapState("receivingProcessAPI", { jobOrderIDReceived: "jobOrderID", orderNumberReceived: "orderNumber", supplierIDReceived: "supplierID"}),
  },
  methods: {
    ...mapActions("billOfMaterialAPI", 
      { setJobOrderIDBOM:"setJobOrderID", setIsProcessedBOM: "setIsProcessed"}
    ),
    ...mapActions("makingOrderAPI", 
      { setJobOrderIDOrder:"setJobOrderID", setIsProcessedOrder: "setIsProcessed", setSupplierIDOrder: "setSupplierID"}
    ),
    ...mapActions("receivingProcessAPI", 
      { setJobOrderIDReceived:"setJobOrderID", setOrderNumberReceived: "setOrderNumber", setSupplierIDReceived: "setSupplierID"}
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
    clearJobOrderIDReceived() {},
    clearSupplierIDReceived() {},
    clearOrderNumberReceived() {
      this.numberReceived = "";
    },
    searchReceived() {
      this.setJobOrderIDReceived(this.mfgNoReceived);
      this.setOrderNumberReceived(this.numberReceived);
      this.setSupplierIDReceived(this.supplierReceived);
      // console.log(this.mfgNoReceived);
      // console.log(this.numberReceived);
      // console.log(this.supplierReceived);
      this.$router.push({ name: "SearchReceived" });
    },
    searchCost() {
      this.$router.push({ name: "SearchCost" });
    }
  },
  created () {
    this.mfgNoBOM = this.jobOrderIDBOM;
    this.mfgNoOrder = this.jobOrderIDOrder;
    this.mfgNoReceived = this.jobOrderIDReceived;
    this.numberReceived = this.orderNumberReceived;
    this.supplierReceived = this.supplierIDReceived;
  }
}
</script>

<style>

</style>
