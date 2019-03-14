<template>
  <v-container 
    fluid
    grid-list-lg
  >
    <!-- 確認ダイアログ -->
    <app-confirm ref="confirm"></app-confirm>

    <!-- カード形式リストコンポーネント -->
    <app-card-table
      :headers="headerData"
      :items="billOfMaterials.results"
      :viewIcon="false"
      @edit-item="editBillOfMaterial"
      @delete-item="deleteBillOfMaterialData"
    >
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>list</v-icon></span>
      <span slot="card-header-title">Bill of material : "{{ jobOrder.name }}"  {{ expenseCategory.categoryName }} </span>

      <!-- カード上部検索機能コンポーネント -->
      <div slot="search-bar">
        <v-layout row wrap>
          <app-search-bar
            :length="billOfMaterials.pages"
            :count="billOfMaterials.count"
            :orderBy="orderBy"
            :incremental="incremental"
            :params="params"
            @search-list="getBillOfMaterials"
          ></app-search-bar>
        </v-layout>
      </div>
    </app-card-table>
    {{ headerData }}
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Bill of Material List",
  name: "BillOfMaterialList",
  data() {
    return {
      orderBy: "-created_at",
      defaultHeaders: [
        { text: "Part Name", value: "name" },
        { text: "Qty", value: "quantity", class: "text-xs-right" },
        { text: "Unit Price", value: "defaultCurrencyPrice", class: "text-xs-right" },
        { text: "Action", value: "action", class: "text-xs-center" }
      ],
      commercialHeaders: [
        { text: "Manufacturer", value: "manufacturer" },
      ],
      processedHeaders: [
        { text: "Drawing Number", value: "drawingNumber" },
      ],
      incremental: {
        // 検索カラムリスト
        tableSelectItems: [
          { label: "Part Name", value: "name" }
        ],
        // 検索数値の初期値および返り値
        tableSelectValue: "name",
        tableSearch: ""
      }
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["expenseCategories", "expenseCategory"]),
    ...mapState("billOfMaterialAPI", ["jobOrderID", "partsType", "billOfMaterials"]),
    ...mapState("jobOrderAPI", ["jobOrder"]),
    params() {
      return {
        company: this.loginUserData.companyId,
        job_order: this.jobOrderID,
        type: this.partsType
      };
    },
    headerData() {
      let header = this.defaultHeaders;
      // if(this.expenseCategory.isProcess) {
      //   test
      // } else {
      //   header.splice(2, 0, this.commercialHeaders);
      // }
      return header;
    }
  },
  methods: {
    ...mapActions("systemMasterApi", ["getExpenseCategories", "getExpenseCategory"]),
    ...mapActions("billOfMaterialAPI", ["setJobOrderID", "setPartsType", "getBillOfMaterials"]),
    ...mapActions("jobOrderAPI", ["getJobOrder"]),
    editBillOfMaterial() {},
    deleteBillOfMaterialData() {}
  },
  created() {
    this.getExpenseCategory(this.partsType);
    this.getJobOrder(this.jobOrderID);
    // this.getBillOfMaterials({params: this.params});
  }

}
</script>

