<template>
  <v-container fluid grid-list-lg>
    <!-- 読み込み中ダイアログコンポーネント -->
    <app-loading-dialog></app-loading-dialog>

    <v-card>
      <v-toolbar card>
        <v-icon>send</v-icon>
        <v-toolbar-title class="font-weight-light">
          Order
        </v-toolbar-title>
      </v-toolbar>
      
      <v-container fluid grid-list-lg>
        <v-layout row wrap>
          <!-- 工事番号あり発注ファイル -->
          <v-flex xs12 lg6>
            <v-card>
              <v-toolbar card>
                <v-toolbar-title class="font-weight-light">
                  Make Order with MFG No
                </v-toolbar-title>
              </v-toolbar>

              <!-- 工事番号選択 -->
              <v-card-title>
                <app-incremental-model-search
                  label="Job Order"
                  orderBy="mfg_no"
                  v-model="mfgNo"
                  searchType="jobOrder"
                  errorMessages=""
                  @clear-item="clearJobOrderID"
                ></app-incremental-model-search>
              </v-card-title>

              <v-card-text>
                <v-layout row>
                  <v-flex xs12 sm6>
                    <v-btn 
                      large 
                      block 
                      round
                      outline
                      color="primary"
                      :disabled = "mfgNo === ''"
                      @click="createOrder(true)"
                    >
                      Create order File (Processed)
                    </v-btn>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-btn 
                      large 
                      block 
                      round
                      outline
                      color="primary"
                      :disabled = "mfgNo === ''"
                      @click="createOrder(false)"
                    >
                      Create order File (Other)
                    </v-btn>
                  </v-flex>



                  <v-flex xs12 sm6>
                    <v-btn 
                      large 
                      block 
                      round
                      color="primary"
                      :disabled = "mfgNo === ''"
                      @click="selectParts(true)"
                    >
                      Edit order File (Processed)
                    </v-btn>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-btn 
                      large 
                      block 
                      round
                      color="primary"
                      :disabled = "mfgNo === ''"
                      @click="selectParts(false)"
                    >
                      Edit order File (Other)
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>

          <!-- 工事番号なし発注ファイル -->
          <v-flex xs12 lg6>
            <v-card>
              <v-toolbar card>
                <v-toolbar-title class="font-weight-light">
                  Make Order without MFG No
                </v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-layout row>
                  <v-flex xs12 sm6>
                    <v-btn large block round color="primary" @click="withoutMfgNo">
                      create or edit Order file
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>

          <!-- 部品表印刷 -->
          <v-flex xs12 lg6>
            <v-card>
              <v-toolbar card>
                <v-toolbar-title class="font-weight-light">
                  Print Order
                </v-toolbar-title>
              </v-toolbar>            
              <v-card-text>
                <v-layout row>
                  <v-flex xs12>
                    <app-incremental-model-search
                      label="Job Order"
                      orderBy="mfg_no"
                      v-model="mfgNoPrint"
                      searchType="jobOrder"
                      errorMessages=""
                      @clear-item="clearJobOrderIDPrint"
                    ></app-incremental-model-search>

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
                  </v-flex>

                  <!-- 発注書印刷 -->
                  <v-flex xs12 sm6>
                    <v-btn 
                      large 
                      block 
                      round
                      color="success"
                      :disabled = "supplier === '' "
                      @click="printOrder"
                    >
                      <v-icon>print</v-icon>
                      Print Purchase Order
                    </v-btn>
                  </v-flex>

                  <!-- 発注書再印刷 -->
                  <v-flex xs12 sm6>
                    <v-btn 
                      large 
                      block 
                      round
                      color="success"
                      :disabled = "supplier === '' "
                      @click="reprintOrder"
                    >
                      <v-icon>print</v-icon>
                      Rerint Purchase Order
                    </v-btn>
                  </v-flex>

                  <v-flex xs12></v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>

          <!-- 発注確認 -->
          <v-flex xs12 lg6>
            <v-card>
              <v-toolbar card>
                <v-toolbar-title class="font-weight-light">
                  Check Order
                </v-toolbar-title>
              </v-toolbar>            
              <v-card-text>
                <v-layout>
                  <!-- 未発注リスト -->
                  <v-flex xs12 sm6>
                    <v-btn 
                      large 
                      block 
                      round
                      color="warning"
                      @click="notYet"
                    >
                      Not orderd list
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

      <!-- Cardフッター -->
      <v-footer 
        card
        height="auto"
      >
      </v-footer>
    </v-card>
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
      this.setJobOrderID(this.mfgNo);
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
