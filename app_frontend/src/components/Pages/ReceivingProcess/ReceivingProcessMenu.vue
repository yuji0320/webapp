<template>
  <v-container fluid grid-list-lg>
    <v-card>
      <v-toolbar card>
        <v-icon>move_to_inbox</v-icon>
        <v-toolbar-title class="font-weight-light">
          Receive
        </v-toolbar-title>
      </v-toolbar>

      <!-- 工事番号、仕入先選択 -->
      <v-card-title>
        <v-layout row wrap>
          <v-flex xs12 sm6 md4>
            <app-incremental-model-search
              label="Job Order"
              orderBy="mfg_no"
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
        </v-layout>
      </v-card-title>

      <!-- 仕入れ処理 -->
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
                      :disabled = "mfgNo === '' || supplier === '' "
                      @click="receive"
                    >
                      Receiving Process
                    </v-btn>

                    <!-- <v-btn 
                      large 
                      block 
                      round
                      color="primary"
                      :disabled = "mfgNo === '' || supplier === '' "
                      @click="editReceivingFile"
                    >
                      Edit Receiving File
                    </v-btn> -->

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

      <!-- Cardフッター -->
      <v-footer card height="auto">
      </v-footer>
    </v-card>
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
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["expenseCategories"]),
    ...mapState("receivingProcessAPI", ["jobOrderID", "supplierID"]),    
  }, 
  methods: {
    ...mapActions("receivingProcessAPI", ["setJobOrderID", "setSupplierID", "setPartsType"]),
    clearJobOrderID() {
      this.mfgNo = "";
      this.setJobOrderID("");
    },
    clearSupplierID() {
      this.supplier = "";
      this.setSupplierID("");
    },    
    receive() {
      this.setJobOrderID(this.mfgNo);
      this.setSupplierID(this.supplier);
      
      this.$router.push({ name: "ReceivingProcessList" });
    },
    editReceivingFile() {
      this.setJobOrderID(this.mfgNo);
      this.setSupplierID(this.supplier);
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
  }
}
</script>

<style>

</style>
