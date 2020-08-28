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
      :selectAll="true"
    >
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>move_to_inbox</v-icon></span>
      <span slot="card-header-title">Suspense Receive {{ switchParams.title }}</span>

      <!-- 戻るボタン -->
      <span slot="card-header-button">
        <v-btn @click="backToMenu" >
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>

        <!-- 一括編集ボタン -->
        <v-btn 
          @click="multiUpdate" 
          outlined 
          color="primary"
          class="ml-2"
        >
          Multi Update
        </v-btn>       
      </span>

      <!-- カード上部検索機能コンポーネント -->
      <span slot="search-bar">
        <!-- <v-layout row wrap>
          <app-search-bar
            :length="receivingProcesses.pages"
            :count="receivingProcesses.count"
            :orderBy="orderBy"
            :incremental="incremental"
            :params="switchParams.params"
            @search-list="getList"
          ></app-search-bar>
        </v-layout> -->
      </span>
    </app-card-table>


    <app-received-dialog @response-function="responseFunction" ref="receive_dialog">
      <span slot="edit-order" d-inline-flex>
        <v-btn color="primary" dark @click="editMakingOrder">Edit Order File</v-btn>
        <v-btn color="primary" dark @click="editBillOfMaterial" v-if="hasMFGNo" class="ml-2">Edit Order File</v-btn>
      </span>
    </app-received-dialog>

    <!-- 発注ファイル -->
    <app-order-dialog @response-function="responseFunction" ref="order_dialog" :hideButtons="true"></app-order-dialog>
    <!-- 部品票ダイアログ -->
    <app-bom-dialog @response-function="responseFunction" ref="bom_dialog" :hideButtons="true"></app-bom-dialog>

    <!-- <multi-update @response-function="responseFunction" ref="multi_update"></multi-update> -->
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import CardTable from '@/components/Module/Cards/CardTable.vue';
import SearchToolbar from "@/components/Module/Search/SearchToolbar.vue";
import ReceivingProcessDialog from '@/components/Module/Dialogs/ReceivingProcessDialog.vue';
import MakingOrderDialog from '@/components/Module/Dialogs/MakingOrderDialog.vue';
import BillOfMaterialDialog from '@/components/Module/Dialogs/BillOfMaterialDialog.vue';
import ReceivingProcessMultiUpdate from "./ReceivingProcessMultiUpdate.vue"

export default {
  title: "Suspense Receive",
  name: "ReceivingProcessSuspense",
  components: {
    "app-card-table": CardTable,
    "app-search-toolbar": SearchToolbar,
    "app-received-dialog": ReceivingProcessDialog,
    "app-order-dialog": MakingOrderDialog,
    "app-bom-dialog": BillOfMaterialDialog,
    "multi-update": ReceivingProcessMultiUpdate
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
        { text: "Suspense Received", value: "suspenseReceivedDate" },
        { text: "Order Amount", value: "orderAmount", align: "right" },
        { text: "Received Amount", value: "amount", align: "right" },
        { text: "Action", value: "action", class: "text-xs-center" }
      ],
      //  仮仕入完了時色変更
      completeColumn: "suspenseReceivedDate",
      // テーブル検索用データ
      refineParams:{}
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("jobOrderAPI", ["jobOrder"]),
    ...mapState("systemUserApi", ["userPartner", "userCompany"]),
    ...mapState("receivingProcessAPI", [ "responseError", "jobOrderID", "supplierID", "orderNumber", "receivingProcesses", "receivingProcess", "tableSelected"]),
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
            is_received: false,
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
              is_received: false,
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
              is_received: false,
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
    ...mapActions("jobOrderAPI", ["getJobOrder"]),
    ...mapActions("systemUserApi", ["getPartner", "getCompany"]),
    ...mapActions("billOfMaterialAPI", ["setBillOfMaterial"]),
    ...mapActions("makingOrderAPI", ["setMakingOrder", "putMakingOrder"]),
    ...mapActions("receivingProcessAPI", ["getReceivingProcesses", "setReceivingProcessesList", "setReceivingProcess", "deleteReceivingProcess", "setTableSelected"]),
    // 一括編集機能
    multiUpdate() {
      this.setTableSelected(this.$refs.card_table.selected);
      // console.log(test);
      this.$refs.multi_update.openDialog();
    },
    async getList(data) {
      this.$store.commit("systemConfig/setLoading", true);
      await this.getReceivingProcesses(data);
      this.$store.commit("systemConfig/setLoading", false);
    },
    // 仕入れファイル編集
    editReceivingProcess(val) {
      this.setReceivingProcess(val);
      this.$refs.receive_dialog.openDialogReceive();
    },
    // 発注ファイル編集
    editMakingOrder() {
      // this.setMakingOrder(this.receivingProcess.orderData);
      // this.$refs["order_dialog"].editMakingOrder();
      console.log("edit order");
    },
    // 部品表ファイル編集
    editBillOfMaterial() {
      // this.setBillOfMaterial(this.receivingProcess.orderData.billOfMaterial);
      // this.$refs["bom_dialog"].editBillOfMaterial();
      console.log("edit bom");
    },
    // 仕入ファイル削除
    async deleteReceivingProcessData(val) {
      console.log("dalete : ", val);
      // let res = {};
      // // 削除確認
      // if (
      //   await this.$refs.confirm.open(
      //     "Delete",
      //     "Are you sure delete this data?",
      //     { color: "red" }
      //   )
      // ) {
      //   // Yesの場合は削除処理
      //   // 発注ファイルのフラグ修正
      //   val.orderData.isPrinted = false;
      //   if(val.orderData.billOfMaterial) {
      //     console.log(val.orderData.billOfMaterial);
      //     val.orderData.billOfMaterialId = val.orderData.billOfMaterial.id;
      //   } else {
      //     val.orderData.billOfMaterialId = null;
      //   }
      //   await this.putMakingOrder(val.orderData);
      //   // 仕入ファイルの削除
      //   res = await this.deleteReceivingProcess(val);
      // } else {
      //   // Noの場合はスナックバーにキャンセルの旨を表示
      //   res.snack = { snack: "Delete is cancelled" };
      // }
      // this.responseFunction(res);
    },
    // 処理結果統合フォーム
    responseFunction(val) {
      // リストをリロード
      this.getList({ params: this.switchParams.params });
      // Snackbar表示
      this.showSnackbar(val.snack);
      this.$refs.card_table.selected = [];
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

<style>

</style>
