<template>
  <v-container fluid grid-list-lg>
    <app-card>
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-title">Not ordered list</span>
      <!-- 戻るボタン -->
      <span slot="card-header-buck-button">
        <v-btn @click="backToMenu"><v-icon>reply</v-icon>Back to Menu</v-btn>
      </span>

      <!-- 注意書き -->
      <span slot="card-title-text">*These parts are not ordered.</span>

      <!-- カード上部検索機能コンポーネント -->
      <span slot="search-bar">
        <v-layout row wrap>
          <app-search-bar
            :length="makingOrders.pages"
            :count="makingOrders.count"
            :orderBy="orderBy"
            :incremental="incremental"
            :params="params"
            @search-list="getList"
          ></app-search-bar>
        </v-layout>
      </span>

      <span slot="card-content">
        <!-- テーブル表示 -->
        <app-data-table
          :headers="headers"
          :items="makingOrders.results"
        >
        </app-data-table>
      </span>

    </app-card>

  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Not orderd",
  name: "MakingOrderNotyet",
  data() {
    return {
      orderBy: "-desired_delivery_date",
      // テーブルヘッダーデータ
      headers: [
        { text: "MFG No", value: "mfgNo" },
        { text: "Order No", value: "number" },
        { text: "Part Name", value: "name" },
        { text: "Standard / Dwaring No", value:"partsDetail" },
        { text: "Supplier", value: "supplierData", nest: "name" },
        { text: "Delivery", value: "desiredDeliveryDate" },
      ],
      // テーブル検索用データ
      incremental: {
        // 検索カラムリスト
        tableSelectItems: [
          { label: "Order Number", value: "number" },
          { label: "Part Name", value: "name" }
        ],
        // 検索数値の初期値および返り値
        tableSelectValue: "number",
        tableSearch: ""
      }
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["unitTypes", "expenseCategories", "expenseCategory"]),
    ...mapState("systemUserApi", ["userPartners"]),
    ...mapState("jobOrderAPI", ["jobOrder"]),
    ...mapState("makingOrderAPI", [ "jobOrderID", "partsType", "makingOrders"]),
    params() {
      return {
        company: this.loginUserData["companyId"],
        is_printed: false,
        order_by: this.orderBy,
      };
    },
  },
  methods: {
    ...mapActions("systemMasterApi", ["getUnitTypes", "getExpenseCategories", "getExpenseCategory"]),
    ...mapActions("jobOrderAPI", ["getJobOrder"]),
    ...mapActions("systemUserApi", ["getPartners"]),
    ...mapActions("makingOrderAPI", [ "setJobOrderID", "getMakingOrders", "setMakingOrders"]),
    async getList(data) {
      this.$store.commit("systemConfig/setLoading", true);
      await this.getMakingOrders(data);
      this.$store.commit("systemConfig/setLoading", false);
    },
    // メニューに戻る
    backToMenu() {
      this.$router.push({ name: "MakingOrderMenu" });
    },    
  },
  created() {
    this.setMakingOrders({});
    this.getExpenseCategories({params: {"order_by": "category_number"}});
    this.getJobOrder(this.jobOrderID);
    this.getMakingOrders({params: this.params});
  }

}
</script>

<style>

</style>
