<template>
  <v-container fluid grid-list-lg>
    <app-card>
      <span slot="card-header-icon"><v-icon large left>list</v-icon></span>
      <span slot="card-header-title">Bill of Material</span>

      <!-- 工事番号選択 -->
      <span slot="search-bar">
        <app-incremental-model-search
          label="Job Order"
          orderBy="mfg_no"
          v-model="mfgNo"
          searchType="jobOrder"
          errorMessages=""
          @clear-item="clearJobOrderID"
        ></app-incremental-model-search>
      </span>

      <span slot="card-content">
        <v-row>
          <v-col 
            v-for="expense in expenseCategories.results"
            :key="expense.id"
            cols="12" md="6"
          >
            <v-btn 
              large 
              block 
              color="primary"
              :disabled = "mfgNo === ''"
              @click="selectParts(expense.id)"
            >
              Add or Edit "{{ expense.categoryName }}"
            </v-btn>
          </v-col>

          <v-col cols="12"></v-col>

          <!-- 部品表印刷 -->
          <v-col cols="12" md="6">
            <v-btn 
              large 
              block 
              color="success"
              :disabled = "mfgNo === ''"
              @click="printBillOfMaterials"
            >
              <v-icon class="mr-2">print</v-icon>
              Print Bill of Material
            </v-btn>
          </v-col>

          <!-- 部品表際印刷 -->
          <v-col xs6>
            <v-btn 
              large 
              block 
              color="success"
              :disabled = "mfgNo === ''"
              @click="reprintBillOfMaterials"
            >
              <v-icon class="mr-2">print</v-icon>
              Rerint Bill of Material (ALL)
            </v-btn>
          </v-col>
        </v-row>
      </span>
    </app-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Bill of Material Menu",
  name: "BillOfMaterialMenu",
  data() {
    return {
      mfgNo: "",
      orderBy: "category_number"
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["expenseCategories"]),
    ...mapState("billOfMaterialAPI", ["jobOrderID", "partsType", "reprint"]),
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
    ...mapActions("billOfMaterialAPI", ["setJobOrderID", "setPartsType", "setReprint"]),
    selectParts(val) {
      this.setJobOrderID(this.mfgNo);
      this.setPartsType(val);
      this.$router.push({ name: "BillOfMaterialList" });
    },
    clearJobOrderID() {
      this.mfgNo = "";
      this.setJobOrderID("");
      this.setPartsType("");
    },
    printBillOfMaterials() {
      this.setJobOrderID(this.mfgNo);
      this.setReprint(false);
      // console.log(this.reprint);
      this.$router.push({ name: "BillOfMaterialPrint" });
    },
    reprintBillOfMaterials() {
      this.setJobOrderID(this.mfgNo);
      this.setReprint(true);
      this.$router.push({ name: "BillOfMaterialPrint" });
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
