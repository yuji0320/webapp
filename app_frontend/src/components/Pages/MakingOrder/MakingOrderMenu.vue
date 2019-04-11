<template>
  <v-container 
    fluid
    grid-list-lg
  >
    <v-card>
      <v-toolbar card>
        <v-icon>send</v-icon>
        <v-toolbar-title class="font-weight-light">
          Making Order
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

          <v-flex xs12></v-flex>

          <!-- 部品表印刷 -->
          <v-flex xs6>
            <v-btn 
              large 
              block 
              round
              color="success"
              :disabled = "mfgNo === ''"
              @click="printOrder"
            >
              <v-icon>print</v-icon>
              Print Purchase Order
            </v-btn>
          </v-flex>

          <!-- 部品表際印刷 -->
          <v-flex xs6>
            <v-btn 
              large 
              block 
              round
              color="success"
              :disabled = "mfgNo === ''"
              @click="reprintOrder"
            >
              <v-icon>print</v-icon>
              Rerint Purchase Order
            </v-btn>
          </v-flex>


        </v-layout>
      </v-card-text>

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
      orderBy: "category_number"
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["expenseCategories"]),
    ...mapState("makingOrderAPI", ["jobOrderID", "partsType", "reprint"]),    
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
    ...mapActions("makingOrderAPI", ["setJobOrderID", "setPartsType", "setReprint"]),
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
      // console.log(this.reprint);
      this.$router.push({ name: "MakingOrderPrint" });
    },
    reprintOrder() {
      this.setJobOrderID(this.mfgNo);
      this.setReprint(true);
      this.$router.push({ name: "MakingOrderPrint" });
    }
  },
  created() {
    this.getExpenseCategories({params: this.params});
    this.mfgNo = this.jobOrderID;
    // console.log(process.env);
  }
}
</script>

<style>

</style>
