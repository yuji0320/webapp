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
      :completeColumn="completeColumn"
      :viewIcon="true"
      @view-item="viewJobOrder"
      @edit-item="editJobOrder"
      @delete-item="deleteJobOrder"
    >
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>work</v-icon></span>
      <span slot="card-header-title">Job Order</span>
      <!-- 新規作成ボタン -->
      <span slot="card-header-button">
        <v-btn
         color="primary"
         class="mb-2"
         dark
         @click="createJobOrder()"
        >New Item</v-btn>
      </span>

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
        { text: "Customer", value: "customerData", nest: "abbr" },
        {
          text: "Delivery destination",
          value: "deliveryDestinationData",
          nest: "abbr"
        },
        { text: "Order Date", value: "orderDate" },
        { text: "Delivery Date", value: "deliveryDate" },
        { text: "Completion Date", value: "completionDate" },
        {
          text: "Order price",
          value: "defaultCurrencyOrderAmount",
          class: "text-xs-right"
        },
        { text: "Action", value: "action" }
      ],
      // 工事完了時色変更
      completeColumn: "completionDate",
      incremental: {
        // 検索カラムリスト
        tableSelectItems: [
          { label: "MFG No", value: "mfg_no" },
          { label: "Product Name", value: "name" }
        ],
        // 検索数値の初期値および返り値
        tableSelectValue: "name",
        tableSearch: ""
      }
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("jobOrderAPI", [
      "responseError",
      "jobOrderStatus",
      "jobOrders",
      "jobOrder"
    ]),
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
      "createNew",
      "isEdit",
      "setMfgNo",
      "getJobOrders",
      "setJobOrder"
    ]),
    createJobOrder() {
      // console.log("create new");
      this.setJobOrder({});
      this.createNew();
      this.$router.push({ name: "JobOrderCreate" });
    },
    viewJobOrder(val) {
      this.setMfgNo(val.id);
      this.setJobOrder(val);
      // console.log(val.id);
      this.$router.push({ name: "JobOrderDetail" });
    },
    editJobOrder(val) {
      // console.log("edit "+val.name);
      this.setMfgNo(val.id);
      this.setJobOrder(val);
      this.isEdit();
      this.$router.push({ name: "JobOrderEdit" });
    },
    deleteJobOrder(val) {
      console.log(val);
    }
  },
  created() {
    // ページ作成時に基準通貨の通貨コードをテーブルヘッダーに反映
    this.headers[7].text =
      "Order price" + " (" + this.loginUserData.defaultCurrencyCode + ")";
  }
};
</script>
