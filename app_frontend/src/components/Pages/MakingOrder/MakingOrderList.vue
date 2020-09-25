<template>
  <v-container fluid grid-list-lg>
    <!-- 確認ダイアログ -->
    <app-confirm ref="confirm"></app-confirm>

    <app-card-table
      :headers="switchParams.headers"
      :items="makingOrders.results"
      :viewIcon="false"
      @edit-item="editMakingOrder"
      @double-click="editMakingOrder"
      @delete-item="deleteMakingOrderData"
      ref="card_table"
    >
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>send</v-icon></span>
      <span slot="card-header-title">Order {{ switchParams.title }}</span>

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

        <!-- 一括削除ボタン -->
        <v-btn 
          @click="multiDelete" 
          outlined 
          color="error"
          class="ml-2"
        >
          Multi Delete
        </v-btn>
      </span>


      <!-- カード上部検索機能コンポーネント -->
      <div slot="search-bar">
        <app-search-toolbar
          :length="makingOrders.pages"
          :count="makingOrders.count"
          :orderBy="orderBy"
          :params="switchParams.params"
          :refineParams="refineParams"
          @search-list="getList"
          @clear-params="clearParams"
          :refineDetail="false"
        >
          <span slot="search-data-content">
            <v-row no-gutters> 
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-text-field 
                  label="Parts Name"
                  v-model="refineParams.name"
                  clearable
                  class="ps-2"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3" v-show="!isProcessed">
                <app-incremental-model-search
                label="Manufacturaer"
                orderBy="name"
                v-model="refineParams.manufacturer"
                searchType="partner"
                filter="manufacturer"
                :errorMessages="responseError.manufacturer"
                ref="manufacturer"
                ></app-incremental-model-search>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3" v-show="!isProcessed">
                <v-text-field 
                  label="Standard/Form"
                  v-model="refineParams.standard"
                  clearable
                  class="ps-2"
                ></v-text-field>
              </v-col>
              <!-- 加工部品の場合 -->
              <v-col cols="12" sm="6" md="4" lg="3" v-show="isProcessed">
                <v-text-field 
                  label="Drawing Number"
                  v-model="refineParams.drawing_number"
                  clearable
                  class="ps-2"
                ></v-text-field>
              </v-col>
              <!-- 仕入れ先 -->
              <v-col cols="12" sm="6" md="4" lg="3">
                <app-incremental-model-search
                label="Supplier"
                orderBy="name"
                v-model="refineParams.supplier"
                searchType="partner"
                filter="supplier"
                :errorMessages="responseError.supplier"
                ref="supplier"
                ></app-incremental-model-search>
              </v-col>

            </v-row>
          </span>
        </app-search-toolbar>
      </div>

      <!-- ダイアログ関係スロット -->
      <span slot="card-dialog">
        <!-- 発注ファイルダイアログ -->
        <app-order-dialog @response-function="responseFunction" :showAdd="!hasMFGNo" ref="orderDialog">
          <span d-inline-flex slot="edit-bom">
            <v-btn color="primary" dark @click="editBillOfMaterial" v-if="hasMFGNo">Edit Bill of Material</v-btn>
          </span>
        </app-order-dialog>
        <!-- 部品表ダイアログ -->
        <app-bom-dialog @response-function="responseFunction" ref="bomDialog" :hideButtons="true"></app-bom-dialog>
      </span>
      
    </app-card-table>

    <multi-update @response-function="responseFunction" ref="multi_update"></multi-update>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import CardTable from '@/components/Module/Cards/CardTable.vue';
import SearchToolbar from "@/components/Module/Search/SearchToolbar.vue";
import MakingOrderMultiDeleteMixin from "./MakingOrderMultiDeleteMixin.js"
import MakingOrderDialog from '@/components/Module/Dialogs/MakingOrderDialog.vue';
import BillOfMaterialDialog from '@/components/Module/Dialogs/BillOfMaterialDialog.vue';
import MakingOrderMultiUpdate from "./MakingOrderMultiUpdate.vue";

export default {
  title: "Making Order",
  name: "MakingOrder",
  mixins: [MakingOrderMultiDeleteMixin],
  components: {
    "app-card-table": CardTable,
    "app-search-toolbar": SearchToolbar,
    "app-order-dialog": MakingOrderDialog,
    "app-bom-dialog": BillOfMaterialDialog,
    "multi-update": MakingOrderMultiUpdate,
  },
  data() {
    return {
      orderBy: 'is_printed,supplier__name,manufacturer__name,standard,drawing_number',
      // テーブルヘッダーデータ
      defaultHeadersTop: [
        { text: "", value: "checkbox" },
        { text: "No", value: "number" },
        { text: "Part Name", value: "name" }
      ],
      defaultHeadersEnd: [
        { text: "Supplier", value: "supplierAbbr" , nest: "abbr"},
        { text: "Amount", value: "amount", class: "text-right" },
        { text: "Unit Price", value: "displayPrice", class: "text-right" },
        { text: "Delivery", value: "desiredDeliveryDate" },
        { text: "Action", value: "action", class: "text-center" }
      ],
      // 市販部品テーブルヘッダー
      commercialHeaders: [
        { text: "Manufacturer", value: "manufacturerAbbr"},
        { text: "Standard/Form", value: "standard" },
        { text: "Unit number", value: "unitNumber" }
      ],
      // 加工部品テーブルヘッダー
      processedHeaders: [
        { text: "Drawing Number", value: "drawingNumber" },
        { text: "Surface treatment", value: "surfaceTreatment" },
        { text: "Material", value: "material" }
      ],
      // テーブル検索用データ
      refineParams:{}
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("jobOrderAPI", ["jobOrder"]),
    ...mapState("billOfMaterialAPI", ["billOfMaterial"]),
    ...mapState("makingOrderAPI", [ "responseError", "jobOrderID", "isProcessed", "makingOrders", "makingOrder"]),
    hasMFGNo() {
      return !!this.jobOrderID;
    },
    // ページごとの設定
    switchParams: function () {
      let title = "";
      let headers = this.defaultHeadersTop.concat(this.commercialHeaders, this.defaultHeadersEnd);
      // 工事番号有無の確認
      if (this.hasMFGNo) {
        // 線品情報の追加
        title = " : " + this.jobOrder.mfgNo + " - " + this.jobOrder.name;
        // 加工部品かどうか
        if (this.isProcessed) {
          title += " (Processed Parts)";
          headers = this.defaultHeadersTop.concat(this.processedHeaders, this.defaultHeadersEnd);
        } else {
          title += " (Other)"
        }
        return {
          params: {
            company: this.loginUserData["companyId"],
            bill_of_material__job_order: this.jobOrderID,
            bill_of_material__type__is_processed_parts: this.isProcessed,
            order_by: this.orderBy,
          },
          title: title,
          headers: headers
        }
      } else {
        // 工事番号なしの場合
        title = " without MFG No";
        return {
          params: {
            company: this.loginUserData["companyId"],
            no_bom: true,
            order_by: this.orderBy,
          },
          title: title,
          headers: headers
        }
      }
    }
  },
  methods: {
    ...mapActions("systemConfig", ["showSnackbar"]),
    ...mapActions("jobOrderAPI", ["getJobOrder"]),
    ...mapActions("billOfMaterialAPI", ["setBillOfMaterial", "getBillOfMaterial"]),
    ...mapActions("makingOrderAPI", ["getMakingOrders", "setMakingOrder", "setMakingOrders", "postMakingOrder", "deleteMakingOrder", "setTableSelected"]),
    // 一括編集機能
    multiUpdate() {
      this.setTableSelected(this.$refs.card_table.selected);
      this.$refs.multi_update.openDialog();
    },
    async getList(data) {
      this.$store.commit("systemConfig/setLoading", true);
      await this.getMakingOrders(data);
      this.$store.commit("systemConfig/setLoading", false);
    },
    // 絞り込み検索のクリア
    clearParams() {
      this.refineParams = {};
      this.$refs.manufacturer.clearItem();
      this.$refs.supplier.clearItem();
    },
    // 発注ファイル編集
    editMakingOrder: function (val) {
      this.setMakingOrder(val);
      this.$refs.orderDialog.openDialogMO();
    },
    async editBillOfMaterial() {
      let res = await this.getBillOfMaterial(this.makingOrder.billOfMaterial);
      this.setBillOfMaterial(res);
      // console.log(res);
      this.$refs.bomDialog.openDialogBOM();
    },
    // 処理結果統合フォーム
    responseFunction(val) {
      // リストをリロード
      this.getList({ params: this.switchParams.params });
      // Snackbar表示
      this.showSnackbar(val.snack);
      // console.log(val.snack);
    },
    // 発注ファイル削除
    async deleteMakingOrderData(val) {
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
        res = await this.deleteMakingOrder(val);
        console.log(res.snack);
      } else {
        // Noの場合はスナックバーにキャンセルの旨を表示
        res.snack = { snack: "Delete is cancelled" };
      }
      this.responseFunction(res);
    },
    // メニューに戻る
    backToMenu() {
      this.$router.push({ name: "MakingOrderMenu" });
    },
  },
  created() {
    this.$store.commit("systemConfig/setLoading", false);
    this.setMakingOrders({});
    if(this.jobOrderID) {
      this.getJobOrder(this.jobOrderID);
      this.setTableSelected([]);
    }
    this.getList({params: this.switchParams.params});
  }
}
</script>

<style>

</style>
