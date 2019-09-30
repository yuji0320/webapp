<template>
  <v-container fluid grid-list-lg>
    <app-card>
      <span slot="card-header-icon"><v-icon>search</v-icon></span>
      <span slot="card-header-title">{{ switchParams.title }}</span>

      <!-- 戻るボタン -->
      <span slot="card-header-buck-button">
        <v-btn @click="backToMenu">
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
      </span>

      <!-- カード上部検索機能コンポーネント -->
      <span slot="search-bar">
        <v-layout row wrap>
          <app-search-bar
            :length="receivingProcesses.pages"
            :count="receivingProcesses.count"
            :orderBy="orderBy"
            :incremental="incremental"
            :params="switchParams.params"
            @search-list="getList"
          ></app-search-bar>
        </v-layout>
      </span>

      <span slot="card-title-text">
        <h2 class="font-weight-light">{{ userPartner.name }}</h2>
      </span>

      <span slot="card-content">
        <!-- テーブル表示 -->
        <app-data-table
          :headers="headers"
          :items="receivingProcesses.results"
          :completeColumn="completeColumn"
          :editDisabled="true"
          :viewIcon="true"
          @view-item="viewReceivingProcess"
          @double-clicked="viewReceivingProcess"
        >
        </app-data-table>
      </span>
    </app-card>

    <app-received-dialog ref="receive_dialog" :editDisable="true">
      <span slot="edit-order" d-inline-flex>
        <v-btn color="primary" dark @click="viewMakingOrder">View Order</v-btn>
        <v-btn color="primary" dark @click="viewBillOfMaterial" v-if="hasMFGNo">View BOM</v-btn>
      </span>
    </app-received-dialog>

    <!-- 発注ファイル -->
    <app-order-dialog ref="order_dialog" :editDisable="true"></app-order-dialog>
    <!-- 部品票ダイアログ -->
    <app-bom-dialog ref="bom_dialog" :editDisable="true" :hideButtons="true"></app-bom-dialog>

  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Receiving Process Menu",
  name: "ReceivingProcessMenu",
  data () {
    return {
      // データ関係
      orderBy: 'suspense_received_date,order__supplier__name,order__manufacturer__name,order__standard,order__drawing_number',
      // テーブルヘッダーデータ
      headers: [
        { text: "No", value: "orderData", nest:"number" },
        { text: "Part Name", value: "orderData", nest:"name" },
        { text: "Standard / Drawing No", value:"orderData", nest:"partsDetail" },
        { text: "Delivery", value: "orderData", nest:"desiredDeliveryDate" },
        { text: "Received", value: "receivedDate" },
        { text: "Order Amount", value: "orderData", nest: "amount", class: "text-xs-right" },
        { text: "Received Amount", value: "amount", class: "text-xs-right" },
        { text: "Order UP", value: "orderData", nest: "unitPrice", class: "text-xs-right" },
        { text: "Received UP", value: "unitPrice", class: "text-xs-right" },
        { text: "Action", value: "action", class: "text-xs-center" }
      ],
      //  仕入完了時色変更
      completeColumn: "isReceived",
      // テーブル検索用データ
      incremental: {
        // 検索カラムリスト
        tableSelectItems: [
          { label: "Part Name", value: "name" }
        ],
        // 検索数値の初期値および返り値
        tableSelectValue: "name",
        tableSearch: ""
      }
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemUserApi", ["userPartner", "userCompany"]),
    ...mapState("jobOrderAPI", ["jobOrder"]),
    ...mapState("billOfMaterialAPI", ["billOfMaterial"]),
    ...mapState("makingOrderAPI", ["makingOrders"]),
    ...mapState("receivingProcessAPI", ["jobOrderID", "supplierID", "orderNumber", "receivingProcesses", "receivingProcess"]),
    hasMFGNo() {
      return !!this.jobOrderID;
    },
    hasOrderNumber() {
      return !!this.orderNumber;
    },
    // ページごとの設定
    switchParams: function () {
      let title = "Edit Receiving File ";
      if (this.hasOrderNumber) {
        // 工事番号なしの場合
        title += " - Order Number " + this.orderNumber;
        return {
          params: {
            company: this.loginUserData["companyId"],
            order__number: this.orderNumber,
            order_by: this.orderBy,
          },
          title: title
        }
      } else {
        if (this.hasMFGNo) {
          title += " : " + this.jobOrder.mfgNo + " - " + this.jobOrder.name;
          return {
            params: {
              company: this.loginUserData["companyId"],
              order__bill_of_material__job_order: this.jobOrderID,
              order__supplier: this.supplierID,
              order_by: this.orderBy,
            },
            title: title
          }
        } else {
          // 工事番号なしの場合
          title += " without MFG No";
          return {
            params: {
              company: this.loginUserData["companyId"],
              no_bom: true,
              order__supplier: this.supplierID,
              order_by: this.orderBy,
            },
            title: title
          }
        }
      }
    }
  },
  methods: {
    ...mapActions("systemConfig", ["showSnackbar"]),
    ...mapActions("systemUserApi", ["getPartner", "getCompany"]),
    ...mapActions("jobOrderAPI", ["getJobOrder"]),
    ...mapActions("billOfMaterialAPI", ["setBillOfMaterial"]),
    ...mapActions("makingOrderAPI", ["setMakingOrder"]),
    ...mapActions("receivingProcessAPI", ["getReceivingProcesses", "setReceivingProcessesList", "setReceivingProcess"]),
    async getList(data) {
      this.$store.commit("systemConfig/setLoading", true);
      await this.getReceivingProcesses(data);
      this.$store.commit("systemConfig/setLoading", false);
    },
    // 仕入れファイル閲覧
    viewReceivingProcess(val) {
      this.setReceivingProcess(val);
      this.$refs["receive_dialog"].editReceivingProcess();
    },
    // 発注ファイル閲覧
    viewMakingOrder() {
      this.setMakingOrder(this.receivingProcess.orderData);
      this.$refs["order_dialog"].editMakingOrder();
    },
    // 部品表ファイル閲覧
    viewBillOfMaterial() {
      this.setBillOfMaterial(this.receivingProcess.orderData.billOfMaterial);
      this.$refs["bom_dialog"].editBillOfMaterial();
    },
    backToMenu() {
      this.$router.push({ name: "SearchMenu" });
    },
    // データの読み込み
    loadData() {
      this.setReceivingProcessesList({});
      if (this.supplierID) {
          this.getPartner(this.supplierID);
      }
      if (this.hasMFGNo) {
        this.getJobOrder(this.jobOrderID);
      }
      this.getList({params: this.switchParams.params});
      console.log(this.switchParams.params);
    }
  },
  created() {
    // もし工事番号等がクリアの場合はメニューにリダイレクトする
    if(!this.supplierID && !this.orderNumber) {
        this.$router.push({ name: "ReceivingProcessMenu" });
    } else {
        this.setReceivingProcessesList({});
        this.loadData();
    }
  }
}
</script>

<style>

</style>
