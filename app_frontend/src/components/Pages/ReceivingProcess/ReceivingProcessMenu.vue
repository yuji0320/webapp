<template>
  <v-container fluid grid-list-lg>
    <app-card>
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>move_to_inbox</v-icon></span>
      <span slot="card-header-title">Receive</span>

      <span slot="card-title-text">
        <!-- 工事番号、仕入先選択 -->
        <v-layout row wrap>
          <v-flex xs12 sm6 md4>
            <app-incremental-model-search
                    label="Job Order"
                    orderBy="-mfg_no"
                    v-model="mfgNo"
                    searchType="jobOrder"
                    errorMessages=""
                    @clear-item="clearJobOrderID"
            ></app-incremental-model-search>
          </v-flex>
          <v-flex xs12 sm6 md4>
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
          </v-flex>
          <!--発注番号検索-->
          <v-flex xs12 sm6 md4>
            <v-layout>
              <v-flex>
                <v-text-field label="Order Number" v-model="number"></v-text-field>
              </v-flex>
              <v-flex class="pt-3">
                <v-btn @click="clearOrderNumber">Clear</v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </span>

      <!-- 仕入れ処理 -->
      <span slot="card-content">
        <v-container fluid grid-list-lg>
          <v-layout row wrap>
            <v-flex xs12 md6>
              <v-card>
                <v-toolbar card>
                  <v-toolbar-title class="font-weight-light">
                    Receive
                  </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-layout row>
                    <v-flex xs12>
                      <v-btn
                        large
                        block
                        round
                        color="primary"
                        :disabled = "supplier === '' && number === ''"
                        @click="receive"
                      >
                        Receiving Process
                      </v-btn>

                      <v-btn
                        large
                        block
                        round
                        color="primary"
                        :disabled = "supplier === '' && number === ''"
                        @click="editReceivingFile"
                      >
                        Edit Receiving File
                      </v-btn>

                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>

            <!-- 未処理チェック -->
            <v-flex xs12 md6>
              <v-card>
                <v-toolbar card>
                  <v-toolbar-title class="font-weight-light">
                    Check Received
                  </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <v-layout>
                    <!-- 納期経過分リスト -->
                    <v-flex xs12>
                      <v-btn
                        large
                        block
                        round
                        color="warning"
                        @click="notYet"
                      >
                        Past due list
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </span>
    </app-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Receiving Process Menu",
  name: "ReceivingProcessMenu",
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
