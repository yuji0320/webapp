<template>
  <v-container 
    fluid
    grid-list-lg
  >
    <!-- 確認ダイアログ -->
    <app-confirm ref="confirm"></app-confirm>

    <!-- カード形式リストコンポーネント -->
    <app-card-table
      :headers="headers"
      :items="jobOrders.results"
      @edit-item="editJobOrder"
      @delete-item="deleteJobOrder"
    >
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>work</v-icon></span>
      <span slot="card-header-title">Job Order</span>

      <!-- カード上部検索機能コンポーネント -->
      <div slot="search-bar">
        <app-search-bar
          :length="jobOrders.pages"
          :count="jobOrders.count"
          :orderBy="orderBy"
          :incremental="incremental"
          @search-list="getJobOrders"
        ></app-search-bar>
      </div>

    </app-card-table>

  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Job Order",
  name: "JobOrder",
  data() {
    return {
      orderBy: "-created_at",
      headers: [
        { text: "MFG No.", value: "mfgNo" },
        { text: "Product name", value: "name" },
        { text: "Order Date", value: "orderDate" },
        { text: "Delivery Date", value: "deliveryDate" },
        { text: "Order price", value: "defaultCurrencyOrderAmount", align: "text-xs-right" },
        { text: "Action", value: "action" }
      ],
      incremental: {
        // 検索カラムリスト
        tableSelectItems: [
          { text: "MFG No", value: "mfgNo" },
          { text: "Product Name", value: "name" }
        ],
        // 検索数値の初期値および返り値
        tableSelectValue: "name",
        tableSearch: ""
      },
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("jobOrderAPI", ["jobOrders", "responseError"]),
    params() {
      return {
        company: this.loginUserData.companyId,
        order_by: this.orderBy
      };
    }
  },
  methods: {
    ...mapActions("systemConfig", ["showSnackbar"]),
    ...mapActions("jobOrderAPI", [
      "getJobOrders"
    ]),
    editJobOrder(val){},
    deleteJobOrder(val){}
  },
  created() {
    // ページ作成時にgetでデータを取得
    this.getJobOrders({
      params: this.params
    });
  }
}
</script>