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
      @delete-item="deleteJobOrderData"
    >
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>work</v-icon></span>
      <span slot="card-header-title">Job Order</span>
      <!-- 新規作成ボタン -->
      <span slot="card-header-button">
        <v-layout row wrap>
          <v-btn
          color="primary"
          class="mb-2"
          dark
          @click="createJobOrder()"
          >New Item</v-btn>

          <!-- 工事完了済み、売上未計上の部品の一括更新 -->
          <!-- <span slot="card-header-button">
            <bulk-bill-date></bulk-bill-date>
          </span> -->

          <!-- エクセルアップロード -->
          <!-- <v-btn
            fab
            small
            @click="upload"
          >
            <v-icon>cloud_upload</v-icon>
          </v-btn> -->
        </v-layout>
      </span>

      <!-- カード上部検索機能コンポーネント -->
      <div slot="search-bar">
        <v-layout row wrap>
          <app-search-bar
            :length="jobOrders.pages"
            :count="jobOrders.count"
            :orderBy="orderBy"
            :incremental="incremental"
            :params="params"
            @search-list="getList"
          ></app-search-bar>

          <!-- excelダウンロード -->
          <!-- <app-excel-download
            fileName="job_order"
            v-model="jobOrders.results"
          ></app-excel-download> -->

        </v-layout>
      </div>

    </app-card-table>

  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import JobOrderBulkBillDate from "./JobOrderBulkBillDate.vue"

export default {
  title: "Job Order",
  name: "JobOrder",
  components: {
    "bulk-bill-date": JobOrderBulkBillDate
  },
  data() {
    return {
      orderBy: "-mfg_no",
      headers: [
        { text: "MFG No.", value: "mfgNo" },
        { text: "Product name", value: "name" },
        { text: "Customer", value: "customerData", nest: "abbr" },
        {
          text: "Delivery",
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
          { label: "Related Party MFG No", value: "related_party_mfg_no" },
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
        company: this.loginUserData["companyId"],
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
      "setJobOrder",
      "deleteJobOrder"
    ]),
    async getList(data) {
      this.$store.commit("systemConfig/setLoading", true);
      // console.log(this.$store.state.systemConfig.loading);
      await this.getJobOrders(data);
      this.$store.commit("systemConfig/setLoading", false);
      // console.log(this.$store.state.systemConfig.loading);
    },
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
    async deleteJobOrderData(val) {
      // console.log(val);
      let res = {};
      // 削除確認
      if (
        await this.$refs.confirm.open(
          "Delete",
          "Are you sure delete this data?",
          { color: "red" }
        )
      ) {
        // Yesの場合は削除処理
        res = await this.deleteJobOrder(val);
      } else {
        // Noの場合はスナックバーにキャンセルの旨を表示
        res.snack = { snack: "Delete is cancelled" };
      }
      this.getJobOrders({params: this.params});
      this.showSnackbar(res.snack);
    },
    upload() {
      this.$router.push({ name: "JobOrderUpload" });
    }
  },
  mounted() {
    // ページ作成時に基準通貨の通貨コードをテーブルヘッダーに反映
    this.headers[7].text =
      "Order price" + " (" + this.loginUserData["defaultCurrencyCode"] + ")";
  }
};
</script>
