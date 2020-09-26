<template>
  <v-container fluid grid-list-lg>
    <app-card>
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon large left>move_to_inbox</v-icon></span>
      <span slot="card-header-title">Receive</span>

      <!-- 仕入済、仮仕入未処理の部品の一括更新 -->
      <!-- <span slot="card-header-button">
        <bulk-suspense></bulk-suspense>
      </span> -->

      <span slot="search-bar">
        <!-- 工事番号、仕入先選択 -->
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <app-incremental-model-search
                    label="Job Order"
                    orderBy="-mfg_no"
                    v-model="mfgNo"
                    searchType="jobOrder"
                    errorMessages=""
                    @clear-item="clearJobOrderID"
            ></app-incremental-model-search>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <app-incremental-model-search
                    label="Supplier"
                    orderBy="name"
                    v-model="supplier"
                    searchType="partner"
                    filter="supplier"
                    ref="supplier"
                    :errorMessages="supplier.err"
                    @clear-item="clearSupplierID"
            ></app-incremental-model-search>
          </v-col>
          <!--発注番号検索-->
          <v-col cols="12" sm="6" md="4">
            <v-text-field label="Order Number" placeholder="Order Number" v-model="number" clearable></v-text-field>
          </v-col>
        </v-row>
      </span>

      <!-- 仕入れ処理 -->
      <span slot="card-content">
        <v-container fluid grid-list-lg>
          <v-row row wrap>
            <v-col cols="12" md="6">
              <app-card noSearchBar="ture">
                <span slot="card-header-title">Receive</span>
                <span slot="card-content">
                  <v-row>
                    <v-col cols="12">
                      <v-btn
                        large
                        block
                        color="primary"
                        :disabled = "supplier === '' && number === ''"
                        @click="suspense"
                        class="mb-2"
                      >
                        Suspense Receive
                      </v-btn>
                      <v-btn
                        large
                        block
                        color="primary"
                        :disabled = "supplier === '' && number === ''"
                        @click="receive"
                        class="mb-2"
                      >
                        Receiving Process
                      </v-btn>

                      <v-btn
                        large
                        block
                        color="primary"
                        :disabled = "supplier === '' && number === ''"
                        @click="editReceivingFile"
                        class="mb-2"
                      >
                        Edit Receiving File
                      </v-btn>

                    </v-col>
                  </v-row>
                </span>
              </app-card>
            </v-col>

            <!-- 未処理チェック -->
            <v-col cols="12" md="6">
              <app-card noSearchBar="ture">
                <span slot="card-header-title">Check Received</span>
                <span slot="card-content">
                  <v-row>
                    <!-- 納期経過分リスト -->
                    <v-col cols="12">
                      <v-btn
                        large
                        block
                        color="warning"
                        @click="notYet"
                      >
                        Past due list
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
// import ReceivingProcessBulkSuspenseReceived from "./ReceivingProcessBulkSuspenseReceived.vue"

export default {
  title: "Receiving Process Menu",
  name: "ReceivingProcessMenu",
  // components: {
  //   "bulk-suspense": ReceivingProcessBulkSuspenseReceived
  // },
  data() {
    return {
      mfgNo: "",
      supplier: "",
      number: ""
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["expenseCategories"]),
    ...mapState("receivingProcessAPI", ["jobOrderID", "supplierID", "orderNumber"]),
  }, 
  methods: {
    ...mapActions("receivingProcessAPI", ["setJobOrderID", "setSupplierID", "setPartsType", "setOrderNumber"]),
    clearJobOrderID() {
      this.mfgNo = "";
      this.setJobOrderID("");
    },
    clearSupplierID() {
      this.supplier = "";
      this.setSupplierID("");
    },
    clearOrderNumber() {
        this.number = "";
        this.setOrderNumber("");
    },
    suspense() {
      this.setJobOrderID(this.mfgNo);
      this.setSupplierID(this.supplier);
      this.setOrderNumber(this.number);
      this.$router.push({ name: "ReceivingProcessSuspense" });
    },
    receive() {
      this.setJobOrderID(this.mfgNo);
      this.setSupplierID(this.supplier);
      this.setOrderNumber(this.number);
      this.$router.push({ name: "ReceivingProcessList" });
    },
    editReceivingFile() {
      this.setJobOrderID(this.mfgNo);
      this.setSupplierID(this.supplier);
      this.setOrderNumber(this.number);
      this.$router.push({ name: "ReceivingProcessEditList" });
    },
    // 納期経過分リスト
    notYet() {
      this.$router.push({ name: "ReceivingProcessNotyet" });
    },
  }, 
  created() {
    this.mfgNo = this.jobOrderID;
    this.supplier = this.supplierID;
    this.number = this.orderNumber;
  }
}
</script>

<style>

</style>
