<template>
  <div class="pa-2">
    <!-- 確認ダイアログ -->
    <app-confirm ref="confirm"></app-confirm>

    <app-card-table
      :headers="headers"
      :items="jobOrders.results"
      :completeColumn="completeColumn"
      :viewIcon="true"
      @view-item="viewJobOrder"
      @edit-item="editJobOrder"
      @delete-item="deleteJobOrderData"
      @double-click="viewJobOrder"
    >
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon large left>work</v-icon></span>
      <span slot="card-header-title">Job Order</span>
      <span slot="card-header-button">
        <v-layout row wrap>
          <v-btn
            color="primary"
            class="ma-2"
            dark
            @click="createJobOrder()"
          >New Item</v-btn>
        </v-layout>
      </span>

      <!-- カード上部検索機能コンポーネント -->
      <div slot="search-bar">
        <app-search-toolbar
          :length="jobOrders.pages"
          :count="jobOrders.count"
          :orderBy="orderBy"
          :params="params"
          :refineParams="refineParams"
          @search-list="getList"
          @clear-params="clearParams"
          :refineDetail="false"
        >
          <!-- 絞り込み検索 -->
          <!-- <span slot="search-data-header-close">
            Header close text
          </span> -->
          <!-- <span slot="search-data-header-open">
            Header open text
          </span> -->
          <!-- 絞り込み内容 -->
          <span slot="search-data-content">
            <v-row no-gutters> 
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-text-field 
                  label="Manfacturing Number"
                  v-model="refineParams.mfg_no"
                  clearable
                  class="ps-2"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3">
                <app-incremental-model-search
                label="Customer"
                orderBy="name"
                v-model="refineParams.customer"
                searchType="partner"
                filter="customer"
                :errorMessages="responseError.customer"
                ref="customer"
                ></app-incremental-model-search>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3">
                <app-incremental-model-search
                label="Delivery Destination"
                orderBy="name"
                v-model="refineParams.delivery_destination"
                searchType="partner"
                filter="delivery"
                :errorMessages="responseError.delivery_destination"
                ref="delivery"
                ></app-incremental-model-search>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-text-field 
                  label="Product Name"
                  v-model="refineParams.name"
                  clearable
                  class="ps-2"
                ></v-text-field>
              </v-col>
            </v-row>
          </span>
          <!-- 詳細検索フォーム -->
          <!-- <span slot="search-data-content-sub">
            <v-row no-gutters> 

            </v-row>
          </span> -->
        </app-search-toolbar>
      </div>

    </app-card-table>

  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import JobOrderBulkBillDate from "./JobOrderBulkBillDate.vue"
import CardTable from '@/components/Module/Cards/CardTable.vue';
import SearchToolbar from "@/components/Module/Search/SearchToolbar.vue";

export default {
  title: "Job Order",
  name: "JobOrder",
  components: {
    "bulk-bill-date": JobOrderBulkBillDate,
    "app-card-table": CardTable,
    "app-search-toolbar": SearchToolbar
  },
  data() {
    return {
      orderBy: "-mfg_no",
      headers: [
        { text: "MFG No.", value: "mfgNo"},
        { text: "Product name", value: "name"},
        { text: "Customer", value: "customerAbbr"},
        { text: "Delivery", value: "deliveryDestinationAbbr"},
        { text: "Order Date", value: "orderDate"},
        { text: "Delivery Date", value: "deliveryDate"},
        { text: "Completion Date", value: "completionDate"},
        { text: "Order price", value: "defaultCurrencyOrderAmount", class:"text-right"},
        { text: "Action", value: "action"}
      ],
      // 工事完了時色変更
      completeColumn: "completionDate",
      refineParams: {}
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
      await this.getJobOrders(data);
      this.$store.commit("systemConfig/setLoading", false);
      // console.log(data);
    },
    clearParams() {
      this.refineParams = {};
      this.$refs.customer.clearItem();
      this.$refs.delivery.clearItem();
      // console.log(this.refineParams);
    },
    createJobOrder() {
      this.setJobOrder({});
      this.createNew();
      this.$router.push({ name: "JobOrderCreate" });
    },
    viewJobOrder(val) {
      // console.log(val);
      this.setMfgNo(val.id);
      this.setJobOrder(val);
      this.$router.push({ name: "JobOrderDetail" });
    },
    editJobOrder(val) {
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
    // console.log(this.jobOrders);
    this.getList({params: this.params});
    this.$store.commit("systemConfig/setLoading", false);
    // ページ作成時に基準通貨の通貨コードをテーブルヘッダーに反映
    this.headers[7].text = "Order price" + " (" + this.loginUserData["defaultCurrencyCode"] + ")";
  }
};
</script>
