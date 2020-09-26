<template>
  <v-container fluid grid-list-lg>
    <!-- 読み込み中ダイアログコンポーネント -->
    <app-loading-dialog></app-loading-dialog>

    <app-card noSearchBar="true">
      <span slot="card-header-icon"><v-icon large left>send</v-icon></span>
      <span slot="card-header-title">Order</span>

      <span slot="card-content">
        <v-container fluid grid-list-lg>
          <v-row>
            <!-- 工事番号あり発注ファイル -->
            <v-col cols="12" xl="6">
              <app-card>
                <span slot="card-header-title">Make Order with MFG No</span>

                <!-- 工事番号選択 -->
                <span slot="search-bar">
                  <app-incremental-model-search
                    label="Job Order"
                    orderBy="-mfg_no"
                    v-model="mfgNo"
                    searchType="jobOrder"
                    errorMessages=""
                    @clear-item="clearJobOrderID"
                  ></app-incremental-model-search>
                </span>

                <span slot="card-content">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-btn 
                        large 
                        block 
                        outlined
                        color="primary"
                        :disabled = "mfgNo === ''"
                        @click="createOrder(true)"
                      >
                        Create order File (Processed)
                      </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-btn 
                        large 
                        block 
                        outlined
                        color="primary"
                        :disabled = "mfgNo === ''"
                        @click="createOrder(false)"
                      >
                        Create order File (Other)
                      </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-btn 
                        large 
                        block 
                        color="primary"
                        :disabled = "mfgNo === ''"
                        @click="selectParts(true)"
                      >
                        Edit order File (Processed)
                      </v-btn>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-btn 
                        large 
                        block 
                        color="primary"
                        :disabled = "mfgNo === ''"
                        @click="selectParts(false)"
                      >
                        Edit order File (Other)
                      </v-btn>
                    </v-col>
                  </v-row>
                </span>
              </app-card>
            </v-col>

            <!-- 工事番号なし発注ファイル -->
            <v-col cols="12" xl="6">
              <app-card noSearchBar="true">
                <span slot="card-header-title">Make Order without MFG No</span>
                <span slot="card-content">
                  <v-row row>
                    <v-col cols="12" sm="6">
                      <v-btn large block color="primary" @click="withoutMfgNo">
                        create or edit Order file
                      </v-btn>
                    </v-col>
                  </v-row>
                </span>
              </app-card>
            </v-col>

            <!-- 部品表印刷 -->
            <v-col cols="12" xl="6">
              <app-card>
                <span slot="card-header-title">Print Order</span>           
                <span slot="search-bar">
                  <v-row>
                    <v-col cols="12">
                      <app-incremental-model-search
                        label="Job Order"
                        orderBy="mfg_no"
                        v-model="mfgNoPrint"
                        searchType="jobOrder"
                        errorMessages=""
                        @clear-item="clearJobOrderIDPrint"
                      ></app-incremental-model-search>
                    </v-col>
                    <v-col cols="12">
                      <!-- 仕入先選択 -->
                      <app-incremental-model-search
                        label="Supplier"
                        orderBy="name"
                        v-model="supplier"
                        searchType="partner"
                        filter="supplier"
                        ref="supplier"
                        :errorMessages="supplier.err"
                      ></app-incremental-model-search>
                    </v-col>
                  </v-row>
                </span>
                <span slot="card-content">
                  <v-row>
                    <!-- 発注書印刷 -->
                    <v-col cols="12" sm="6">
                      <v-btn 
                        large 
                        block 
                        color="success"
                        :disabled = "supplier === '' "
                        @click="printOrder"
                      >
                        <v-icon>print</v-icon>
                        Print Purchase Order
                      </v-btn>
                    </v-col>

                    <!-- 発注書再印刷 -->
                    <v-col cols="12" sm="6">
                      <v-btn 
                        large 
                        block 
                        color="success"
                        :disabled = "supplier === '' "
                        @click="reprintOrder"
                      >
                        <v-icon>print</v-icon>
                        Rerint Purchase Order
                      </v-btn>
                    </v-col>

                    <v-col cols="12"></v-col>
                  </v-row>
                </span>
              </app-card>
            </v-col>

            <!-- 発注確認 -->
            <v-col cols="12" xl="6">
              <app-card noSearchBar="true">
                <span slot="card-header-title">Check Order</span>           
                <span slot="card-content">
                  <v-row>
                    <!-- 未発注リスト -->
                    <v-col cols="12" sm="6">
                      <v-btn 
                        large 
                        block 
                        color="warning"
                        @click="notYet"
                      >
                        Not orderd list
                      </v-btn>
                    </v-col>
                  </v-row>
                </span>
              </app-card>
            </v-col>
          </v-row>
        </v-container>
      </span>
    </app-card>
  </v-container>  
</template>

<script>
import { mapState, mapActions } from "vuex";
import MakingOrderCreateMixin from "./MakingOrderCreateMixin.js"

export default {
  title: "Making Order Menu",
  name: "MakingOrderMenu",
  mixins: [MakingOrderCreateMixin],
  data() {
    return {
      mfgNo: "",
      mfgNoPrint: "",
      supplier: "",
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("billOfMaterialAPI", ["billOfMaterials", "billOfMaterial"]),
    ...mapState("makingOrderAPI", ["jobOrderID", "isProcessed", "supplierID", "reprint", "makingOrders"]),    
  },
  methods: {
    ...mapActions("systemConfig", ["showSnackbar"]),
    ...mapActions("billOfMaterialAPI", ["getBillOfMaterials", "setBillOfMaterial"]),
    ...mapActions("makingOrderAPI", ["setJobOrderID", "setIsProcessed", "setSupplierID", "setReprint", "getMakingOrders", "postMakingOrder"]),
    async createOrder(val) {
      await this.setJobOrderID(this.mfgNo);
      await this.setIsProcessed(val);
      this.createOrderFile();

    },
    selectParts(val) {
      this.setJobOrderID(this.mfgNo);
      this.setIsProcessed(val);
      this.$router.push({ name: "MakingOrderList" });
    },
    withoutMfgNo() {
      this.setJobOrderID("");
      this.setIsProcessed(false);
      this.$router.push({ name: "MakingOrderList" });
    },
    clearJobOrderID() {
      this.mfgNo = "";
      this.setJobOrderID("");
      this.setIsProcessed(false);
    },
    clearJobOrderIDPrint() {
      this.mfgNoPrint = "";
      this.setJobOrderID("");
      this.setIsProcessed(false);
    },
    printOrder() {
      this.setJobOrderID(this.mfgNoPrint);
      this.setReprint(false);
      this.setSupplierID(this.supplier);
      this.$router.push({ name: "MakingOrderPrint" });
    },
    reprintOrder() {
      this.setJobOrderID(this.mfgNoPrint);
      this.setReprint(true);
      this.setSupplierID(this.supplier);
      this.$router.push({ name: "MakingOrderPrint" });
    },
    notYet() {
      this.setJobOrderID(this.mfgNo);
      this.$router.push({ name: "MakingOrderNotyet" });
    }
  },
  created() {
    this.mfgNo = this.jobOrderID;
    this.mfgNoPrint = this.jobOrderID;
    this.supplier = this.supplierID;
  }
}
</script>

<style>

</style>
