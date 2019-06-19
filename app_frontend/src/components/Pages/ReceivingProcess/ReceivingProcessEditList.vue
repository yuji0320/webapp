<template>
  <v-container fluid grid-list-lg>
    <!-- 確認ダイアログ -->
    <app-confirm ref="confirm"></app-confirm>

    <!-- カードコンポーネント -->
    <app-card>
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>move_to_inbox</v-icon></span>
      <span slot="card-header-title">Edit Receiving File "{{ jobOrder.mfgNo }} - {{ jobOrder.name }}"</span>

      <!-- 戻るボタン -->
      <span slot="card-header-buck-button">
        <v-btn @click="backToMenu" >
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
            :params="params"
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
          @edit-item="editReceivingProcess"
          @double-clicked="editReceivingProcess"
        >
        </app-data-table>
      </span>
    </app-card>

    <app-received-dialog @response-function="responseFunction" ref="receive_dialog">
      <span slot="edit-order" d-inline-flex>
        <v-btn color="primary" dark @click="editMakingorder">Edit Order File</v-btn>
        <v-btn color="primary" dark @click="editBillOfMaterial">Edit Order File</v-btn>
      </span>
    </app-received-dialog>

    <!-- 発注ファイル -->
    <app-order-dialog @response-function="responseFunction" ref="order_dialog"></app-order-dialog>
    <!-- 部品票ダイアログ -->
    <app-bom-dialog @response-function="responseFunction" ref="bom_dialog" :hideButtons="true"></app-bom-dialog>

  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Edit Receiving File",
  name: "ReceivingProcessList",
  data() {
    return {
      // データ関係
      orderBy: "-order__desired_delivery_date",
      // テーブルヘッダーデータ
      headers: [
        { text: "No", value: "orderData", nest:"number" },
        { text: "Part Name", value: "orderData", nest:"name" },
        { text: "Standard / Dwaring No", value:"partsDetail" },
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
          { label: "Order Number", value: "order__number" },
          { label: "Part Name", value: "name" }
        ],
        // 検索数値の初期値および返り値
        tableSelectValue: "order__number",
        tableSearch: ""
      }
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["unitTypes", "expenseCategories", "expenseCategory"]),
    ...mapState("systemUserApi", ["userPartner", "userCompany"]),
    ...mapState("jobOrderAPI", ["jobOrder"]),
    ...mapState("billOfMaterialAPI", ["billOfMaterials", "billOfMaterial"]),
    ...mapState("makingOrderAPI", ["makingOrders"]),
    ...mapState("receivingProcessAPI", [
      "responseError", "jobOrderID", "supplierID", "receivingProcesses", "receivingProcess"
    ]),
    params() {
      return {
        company: this.loginUserData.companyId,
        order__bill_of_material__job_order: this.jobOrderID,
        order__supplier: this.supplierID,
        order_by: this.orderBy,
        is_received: true
      };
    },
  },
  methods: {
    ...mapActions("systemConfig", ["showSnackbar"]),
    ...mapActions("systemMasterApi", ["getUnitTypes", "getExpenseCategories", "getExpenseCategory"]),
    ...mapActions("jobOrderAPI", ["getJobOrder"]),
    ...mapActions("systemUserApi", ["getPartner", "getCompany"]),
    ...mapActions("billOfMaterialAPI", ["setBillOfMaterial", "putBillOfMaterial"]),
    ...mapActions("makingOrderAPI", ["setMakingOrder", "postMakingOrder", "putMakingOrder"]),
    ...mapActions("receivingProcessAPI", ["getReceivingProcesses", "setReceivingProcessesList", "setReceivingProcess", "deleteReceivingProcess"]),
    async getList(data) {
      this.$store.commit("systemConfig/setLoading", true);
      let list = await this.getReceivingProcesses(data);
      this.$store.commit("systemConfig/setLoading", false);
    },
    // 仕入れファイル編集
    editReceivingProcess(val) {
      this.setReceivingProcess(val);
      this.$refs.receive_dialog.editReceivingProcess();
    },
    // 発注ファイル編集
    editMakingorder() {
      this.setMakingOrder(this.receivingProcess.orderData);
      this.$refs.order_dialog.editMakingOrder();
    },
    // 部品表ファイル編集
    editBillOfMaterial() {
      this.setBillOfMaterial(this.receivingProcess.orderData.billOfMaterial);
      this.$refs.bom_dialog.editBillOfMaterial();
    },
    // 処理結果統合フォーム
    responseFunction(val) {
      // リストをリロード
      this.getList({ params: this.params });
      // Snackbar表示
      this.showSnackbar(val.snack);
    },
    backToMenu() {
      this.$router.push({ name: "ReceivingProcessMenu" });
    },
    // データの読み込み
    loadData() {
      this.setReceivingProcessesList({})
      this.getPartner(this.supplierID);
      this.getExpenseCategories({params: {"order_by": "category_number"}});
      this.getJobOrder(this.jobOrderID);
      this.getList({params: this.params});
    },
    // 発注ファイル削除
    async deleteReceivingProcessData(val) {
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
        res = await this.deleteReceivingProcess(val);
      } else {
        // Noの場合はスナックバーにキャンセルの旨を表示
        res.snack = { snack: "Delete is cancelled" };
      }
      responseFunction(res);
    }
  },
  created() {
    // もし工事番号等がクリアの場合はメニューにリダイレクトする
    if(!this.supplierID || !this.jobOrderID) {
      this.$router.push({ name: "ReceivingProcessMenu" });
    } else {
      this.loadData();
    }
  }
}
</script>

<style>

</style>
