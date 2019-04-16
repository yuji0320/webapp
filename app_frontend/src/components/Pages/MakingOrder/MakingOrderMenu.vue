<template>
  <v-container 
    fluid
    grid-list-lg
  >
    <v-card>
      <v-toolbar card>
        <v-icon>send</v-icon>
        <v-toolbar-title class="font-weight-light">
          Order
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
      
      <v-container
        fluid
        grid-list-lg
      >
        <v-layout row wrap>
          <v-flex xs12>
            <v-card>
              <v-toolbar card>
                <v-toolbar-title class="font-weight-light">
                  Make Order
                </v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-layout row>
                  <v-flex 
                    v-for="expense in expenseCategories.results"
                    :key="expense.id"
                    xs6
                  >
                    <v-btn 
                      large 
                      block 
                      round
                      color="primary"
                      :disabled = "mfgNo === ''"
                      @click="selectParts(expense.id)"
                    >
                      Add or Edit "{{ expense.categoryName }}"
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-text>

            </v-card>
          </v-flex>


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
                  <v-flex xs6>
                    <v-btn 
                      large 
                      block 
                      round
                      color="success"
                      :disabled = "mfgNo === '' || supplier === '' "
                      @click="printOrder"
                    >
                      <v-icon>print</v-icon>
                      Print Purchase Order
                    </v-btn>
                  </v-flex>

                  <!-- 発注書再印刷 -->
                  <v-flex xs6>
                    <v-btn 
                      large 
                      block 
                      round
                      color="success"
                      :disabled = "mfgNo === '' || supplier === '' "
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
                  <v-flex xs6>
                    <v-btn 
                      large 
                      block 
                      round
                      color="warning"
                      :disabled = "mfgNo === ''"
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

export default {
  title: "Making Order Menu",
  name: "MakingOrderMenu",
  data() {
    return {
      mfgNo: "",
      supplier: "",
      orderBy: "category_number"
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["expenseCategories"]),
    ...mapState("makingOrderAPI", ["jobOrderID", "partsType", "supplierID", "reprint"]),    
    params() {
      return {
        company: this.loginUserData.companyId,
        order_by: this.orderBy,
        is_active: true
      };
    }
  },
  methods: {
    ...mapActions("systemMasterApi", ["getExpenseCategories"]),
    ...mapActions("makingOrderAPI", ["setJobOrderID", "setPartsType", "setSupplierID", "setReprint"]),
    selectParts(val) {
      this.setJobOrderID(this.mfgNo);
      this.setPartsType(val);
      this.$router.push({ name: "MakingOrderList" });
    },
    clearJobOrderID() {
      this.mfgNo = "";
      this.setJobOrderID("");
      this.setPartsType("");
    },
    printOrder() {
      this.setJobOrderID(this.mfgNo);
      this.setReprint(false);
      this.setSupplierID(this.supplier);
      // console.log(this.reprint);
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
    this.getExpenseCategories({params: this.params});
    this.mfgNo = this.jobOrderID;
    this.supplier = this.supplierID;
    // console.log(process.env);
  }
}
</script>

<style>

</style>
