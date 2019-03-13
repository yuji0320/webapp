<template>
  <v-container 
    fluid
    grid-list-lg
  >
    <!-- 確認ダイアログ -->
    <app-confirm ref="confirm"></app-confirm>

    {{ expenseCategory }},
    {{ billOfMaterials }}

  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Bill of Material List",
  name: "BillOfMaterialList",
  data() {
    return {};
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemUserApi", ["expenseCategories", "expenseCategory"]),
    ...mapState("billOfMaterialAPI", ["jobOrderID", "partsType", "billOfMaterials"]),
    params() {
      return {
        company: this.loginUserData.companyId,
        type: this.partsType
      };
    }
  },
  methods: {
    ...mapActions("systemUserApi", ["getExpenseCategories", "getExpenseCategory"]),
    ...mapActions("billOfMaterialAPI", ["setJobOrderID", "setPartsType", "getBillOfMaterials"]),
  },
  created() {
    // this.getExpenseCategories({params: this.params});
    // console.log(process.env);
    this.getExpenseCategory(this.partsType);
    this.getBillOfMaterials({params: this.params});
  }

}
</script>

