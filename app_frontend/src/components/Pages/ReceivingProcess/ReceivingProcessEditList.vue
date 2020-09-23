<template>
  <v-container fluid grid-list-lg>
    <!-- 確認ダイアログ -->
    <app-confirm ref="confirm"></app-confirm>

    <!-- カードコンポーネント -->
    <app-card-table
      :headers="headers"
      :items="receivingProcesses.results"
      :completeColumn="completeColumn"
      @edit-item="editReceivingProcess"
      @double-click="editReceivingProcess"
      @delete-item="deleteReceivingProcessData"
      completeDisabled=true
      ref="card_table"
    >
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>move_to_inbox</v-icon></span>
      <span slot="card-header-title">Edit Receiving File {{ switchParams.title }}</span>

      <!-- 戻るボタン -->
      <span slot="card-header-button">
        <v-btn @click="backToMenu" >
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
      </span>

      <!-- カード上部検索機能コンポーネント -->
      <span slot="search-bar">
        <v-card-text>
          <p>Supply from : {{ userPartner.name }}</p>
        </v-card-text>

        <!-- 検索コンポーネント -->
        <app-search-toolbar
          :length="receivingProcesses.pages"
          :count="receivingProcesses.count"
          :orderBy="orderBy"
          :params="switchParams.params"
          :refineParams="refineParams"
          @search-list="getList"
          @clear-params="clearParams"
          :refineDetail="false"
        >
          <span slot="search-data-content">
            <v-row no-gutters> 
              <!-- 部品名検索 -->
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-text-field 
                  label="Parts Name"
                  v-model="refineParams.name"
                  clearable
                  class="ps-2"
                ></v-text-field>
              </v-col>
              <!-- 部品情報検索 -->
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-text-field 
                  label="Standard / Drawing No"
                  v-model="refineParams.parts_data"
                  clearable
                  class="ps-2"
                ></v-text-field>
              </v-col>
            </v-row>
          </span>
        </app-search-toolbar>
      </span>
    </app-card-table>

    <!-- 仕入ファイル編集ダイアログ -->
    <app-received-dialog @response-function="responseFunction" ref="receiveDialog">
      <span slot="edit-order" d-inline-flex>
        <v-btn color="primary" dark @click="editMakingOrder">Edit Order File</v-btn>
      </span>
    </app-received-dialog>

    <!-- 発注ファイル -->
    <app-order-dialog @response-function="responseFunction" ref="orderDialog">
      <span d-inline-flex slot="edit-bom">
        <v-btn color="primary" dark @click="editBillOfMaterial" v-if="hasMFGNo">Edit Bill of Material</v-btn>
      </span>
    </app-order-dialog>
    <!-- 部品票ダイアログ -->
    <app-bom-dialog @response-function="responseFunction" ref="bomDialog" :hideButtons="true"></app-bom-dialog>

  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import CardTable from '@/components/Module/Cards/CardTable.vue';
import SearchToolbar from "@/components/Module/Search/SearchToolbar.vue";
import ReceivingProcessDialog from '@/components/Module/Dialogs/ReceivingProcessDialog.vue';
import MakingOrderDialog from '@/components/Module/Dialogs/MakingOrderDialog.vue';
import BillOfMaterialDialog from '@/components/Module/Dialogs/BillOfMaterialDialog.vue';

export default {
  title: "Edit Receiving File",
  name: "ReceivingProcessList",
  components: {
    "app-card-table": CardTable,
    "app-search-toolbar": SearchToolbar,
    "app-received-dialog": ReceivingProcessDialog,
    "app-order-dialog": MakingOrderDialog,
    "app-bom-dialog": BillOfMaterialDialog,
  },
  data() {
    return {
      // データ関係
      orderBy: 'suspense_received_date,order__supplier__name,order__manufacturer__name,order__standard,order__drawing_number',
      // テーブルヘッダーデータ
      headers: [
        { text: "No", value: "orderNumber"},
        { text: "Part Name", value: "partName" },
        { text: "Standard / Drawing No", value:"partDetail"},
        { text: "Delivery", value: "desiredDeliveryDate"},
        { text: "Received", value: "receivedDate" },
        { text: "Order Amount", value: "orderAmount", align: "right" },
        { text: "Received Amount", value: "amount", align: "right" },
        { text: "Order UP", value: "orderPriceDisplay", align: "right" },
        { text: "Received UP", value: "unitPrice", align: "right" },
        { text: "Action", value: "action", align: "center" }
      ],
      //  仕入完了時色変更
      completeColumn: "isReceived",
      // テーブル検索用データ
      refineParams:{}
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["unitTypes", "expenseCategories", "expenseCategory"]),
    ...mapState("systemUserApi", ["userPartner", "userCompany"]),
    ...mapState("jobOrderAPI", ["jobOrder"]),
    ...mapState("billOfMaterialAPI", ["billOfMaterials", "billOfMaterial"]),
    ...mapState("makingOrderAPI", ["makingOrders", "makingOrder"]),
    ...mapState("receivingProcessAPI", [
      "responseError", "jobOrderID", "supplierID", "orderNumber", "receivingProcesses", "receivingProcess"
    ]),
    hasMFGNo() {
      return !!this.jobOrderID;
    },
    hasOrderNumber() {
      return !!this.orderNumber;
    },
    // ページごとの設定
    switchParams: function () {
      let title = "";
      if (this.hasOrderNumber) {
        // 工事番号なしの場合
        title = " - Order Number " + this.orderNumber;
        return {
          params: {
            company: this.loginUserData["companyId"],
            order__number: this.orderNumber,
            is_received: true,
            order_by: this.orderBy,
          },
          title: title
        }
      } else {
        if (this.hasMFGNo) {
          title = " : " + this.jobOrder.mfgNo + " - " + this.jobOrder.name;
          return {
            params: {
              company: this.loginUserData["companyId"],
              order__bill_of_material__job_order: this.jobOrderID,
              is_received: true,
              order__supplier: this.supplierID,
              order_by: this.orderBy,
            },
            title: title
          }
        } else {
          // 工事番号なしの場合
          title = " without MFG No";
          return {
            params: {
              company: this.loginUserData["companyId"],
              is_received: true,
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
    ...mapActions("systemMasterApi", ["getUnitTypes", "getExpenseCategories", "getExpenseCategory"]),
    ...mapActions("jobOrderAPI", ["getJobOrder"]),
    ...mapActions("systemUserApi", ["getPartner", "getCompany"]),
    ...mapActions("billOfMaterialAPI", ["setBillOfMaterial", "putBillOfMaterial", "getBillOfMaterial"]),
    ...mapActions("makingOrderAPI", ["setMakingOrder", "postMakingOrder", "putMakingOrder", "getMakingOrder"]),
    ...mapActions("receivingProcessAPI", ["getReceivingProcesses", "setReceivingProcessesList", "setReceivingProcess", "deleteReceivingProcess"]),
    async getList(data) {
      this.$store.commit("systemConfig/setLoading", true);
      await this.getReceivingProcesses(data);
      this.$store.commit("systemConfig/setLoading", false);
    },
    // 検索フォーム初期化
    clearParams() {
      this.refineParams = {};
    },
    // 仕入れファイル編集
    editReceivingProcess(val) {
      this.setReceivingProcess(val);
      this.$refs.receiveDialog.openDialogReceive();
    },
    // 発注ファイル編集
    async editMakingOrder() {
      let res = await this.getMakingOrder(this.receivingProcess.order);
      this.setMakingOrder(res);
      this.$refs.orderDialog.openDialogMO();
    },
    // 部品表ファイル編集
    async editBillOfMaterial() {
      let res = await this.getBillOfMaterial(this.makingOrder.billOfMaterial);
      this.setBillOfMaterial(res);
      this.$refs.bomDialog.openDialogBOM();
    },
    // 処理結果統合フォーム
    responseFunction(val) {
      // リストをリロード
      this.getList({ params: this.switchParams.params });
      // Snackbar表示
      this.showSnackbar(val.snack);
    },
    // 発注ファイル削除
    async deleteReceivingProcessData(val) {
      // console.log("dalete : ", val);
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
        // 発注ファイルのフラグ修正
        let orderData = await this.getMakingOrder(val.order);
        orderData.isPrinted = false;
        await this.putMakingOrder(orderData);
        // 仕入ファイルの削除
        res = await this.deleteReceivingProcess(val);
      } else {
        // Noの場合はスナックバーにキャンセルの旨を表示
        res.snack = { snack: "Delete is cancelled" };
      }
      this.responseFunction(res);
    },
    backToMenu() {
      this.$router.push({ name: "ReceivingProcessMenu" });
    },
    // データの読み込み
    loadData() {
      this.setReceivingProcessesList({});
      if (this.supplierID) {
          this.getPartner(this.supplierID);
      }
      this.getExpenseCategories({params: {"order_by": "category_number"}});
      if (this.hasMFGNo) {
        this.getJobOrder(this.jobOrderID);
      }
      this.getList({params: this.switchParams.params});
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

