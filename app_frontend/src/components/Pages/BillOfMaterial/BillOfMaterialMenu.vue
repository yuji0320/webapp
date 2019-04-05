<template>
  <v-container 
    fluid
    grid-list-lg
  >
    <v-card>
      <v-toolbar card>
        <v-icon>list</v-icon>
        <v-toolbar-title class="font-weight-light">
          Bill of Material
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
              Add or Edit {{ expense.categoryName }}
            </v-btn>
          </v-flex>

          <!-- 部品表印刷 -->
          <v-flex xs6>
            <v-btn 
              large 
              block 
              round
              color="primary"
              :disabled = "mfgNo === ''"
              @click="printBillOfMaterials"
            >
              <v-icon>print</v-icon>
              Print Bill of Material
            </v-btn>
          </v-flex>

          <!-- 部品表際印刷 -->
          <v-flex xs6>
            <v-btn 
              large 
              block 
              round
              color="primary"
              :disabled = "mfgNo === ''"
              @click="reprintBillOfMaterials"
            >
              <v-icon>print</v-icon>
              Rerint Bill of Material (ALL)
            </v-btn>
          </v-flex>

        </v-layout>



        <!-- {{ expenseCategories }} -->
        <!-- {{ jobOrderID }},
        {{ partsType }} -->




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
