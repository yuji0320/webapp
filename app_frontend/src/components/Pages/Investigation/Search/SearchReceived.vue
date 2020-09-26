<template>
  <v-container fluid grid-list-lg>
    <app-card-table
      :headers="headers"
      :items="receivingProcesses.results"
      :completeColumn="completeColumn"
      :editDisabled="true"
      :viewIcon="true"
      @double-click="viewReceivingProcess"
      ref="data_table"
    >
      <span slot="card-header-icon"><v-icon>search</v-icon></span>
      <span slot="card-header-title">{{ switchParams.title }}</span>
      <!-- 戻るボタン -->
      <span slot="card-header-button">
        <v-btn @click="backToMenu">
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
      </span>
      <div slot="search-bar">
        <v-card-text class="font-weight-light">* Green is already received.</v-card-text>
      </div>

      <!-- カード上部検索機能コンポーネント -->
      <span slot="search-bar">
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

    <app-received-dialog ref="receiveDialog" :editDisable="true">
      <span slot="edit-order" d-inline-flex>
        <v-btn color="primary" dark @click="viewMakingOrder">View Order</v-btn>
      </span>
    </app-received-dialog>

    <!-- 発注ファイル -->
    <app-order-dialog ref="orderDialog" :editDisable="true">
      <span d-inline-flex slot="edit-bom">
              <v-btn color="primary" dark @click="viewBillOfMaterial" v-if="hasMFGNo">View BOM</v-btn>
      </span>
    </app-order-dialog>
    <!-- 部品票ダイアログ -->
    <app-bom-dialog ref="bomDialog" :editDisable="true" :hideButtons="true"></app-bom-dialog>

  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import CardTable from '@/components/Module/Cards/CardTable.vue';
import SearchToolbar from "@/components/Module/Search/SearchToolbar.vue";
import BillOfMaterialDialog from '@/components/Module/Dialogs/BillOfMaterialDialog.vue';
import MakingOrderDialog from '@/components/Module/Dialogs/MakingOrderDialog.vue';
import ReceivingProcessDialog from '@/components/Module/Dialogs/ReceivingProcessDialog.vue';

export default {
  title: "Receiving Process Menu",
  name: "ReceivingProcessMenu",
  components: {
    "app-card-table": CardTable,
    "app-search-toolbar": SearchToolbar,
    "app-bom-dialog": BillOfMaterialDialog,
    "app-order-dialog": MakingOrderDialog,
    "app-received-dialog": ReceivingProcessDialog,
  },
  data () {
    return {
      // データ関係
      orderBy: 'suspense_received_date,is_received,order__supplier__name,order__manufacturer__name,order__standard,order__drawing_number',
      // テーブルヘッダーデータ
      headers: [
        { text: "No", value: "orderNumber" },
        { text: "Part Name", value: "partName" },
        { text: "Standard / Drawing No", value:"partDetail" },
        { text: "Supplier", value: "supplierAbbr"},
        { text: "Delivery", value: "desiredDeliveryDate" },
        { text: "Suspense", value: "suspenseReceivedDate" },
        { text: "Received", value: "receivedDate" },
        { text: "Order Amount", value: "orderAmount", align: "right" },
        { text: "Order UP", value: "orderPriceDisplay", align: "right" },
        { text: "Action", value: "action", align: "center" }
      ],
      //  仕入完了時色変更
      completeColumn: "suspenseReceivedDate",
      // テーブル検索用データ
      refineParams: {}
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemUserApi", ["userPartner", "userCompany"]),
    ...mapState("jobOrderAPI", ["jobOrder"]),
    ...mapState("billOfMaterialAPI", ["billOfMaterials", "billOfMaterial"]),
    ...mapState("makingOrderAPI", ["makingOrders", "makingOrder"]),
    ...mapState("receivingProcessAPI", ["responseError", "jobOrderID", "supplierID", "orderNumber", "receivingProcesses", "receivingProcess"]),
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
    ...mapActions("billOfMaterialAPI", ["setBillOfMaterial", "getBillOfMaterial"]),
    ...mapActions("makingOrderAPI", ["setMakingOrder", "getMakingOrder"]),
    ...mapActions("receivingProcessAPI", ["getReceivingProcesses", "setReceivingProcessesList", "setReceivingProcess"]),
    async getList(data) {
      this.$store.commit("systemConfig/setLoading", true);
      await this.getReceivingProcesses(data);
      this.$store.commit("systemConfig/setLoading", false);
    },
    // 検索フォーム初期化
    clearParams() {
      this.refineParams = {};
    },
    // 仕入れファイル閲覧
    viewReceivingProcess(val) {
      this.setReceivingProcess(val);
      this.$refs.receiveDialog.openDialogReceive();
    },
    // 発注ファイル閲覧
    async viewMakingOrder() {
      let res = await this.getMakingOrder(this.receivingProcess.order);
      this.setMakingOrder(res);
      this.$refs.orderDialog.openDialogMO();
    },
    // 部品表ファイル閲覧
    async viewBillOfMaterial() {
      let res = await this.getBillOfMaterial(this.makingOrder.billOfMaterial);
      this.setBillOfMaterial(res);
      this.$refs.bomDialog.openDialogBOM();
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
      // console.log(this.switchParams.params);
    }
  },
  created() {
    // もし工事番号等がクリアの場合はメニューにリダイレクトする
    if(!this.hasMFGNo && !this.orderNumber) {
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
