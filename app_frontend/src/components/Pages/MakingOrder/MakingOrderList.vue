<template>
  <v-container fluid grid-list-lg>
    <!-- 確認ダイアログ -->
    <app-confirm ref="confirm"></app-confirm>

    <app-card>
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>send</v-icon></span>
      <span slot="card-header-title">Order {{ switchParams.title }}</span>

      <!-- 戻るボタン -->
      <span slot="card-header-buck-button">
        <v-btn @click="backToMenu" >
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>

        <!-- 一括編集ボタン -->
        <v-btn 
          @click="multiUpdate" 
          outline 
          color="primary"
        >
          Multi Update
        </v-btn>

        <!-- 一括削除ボタン -->
        <v-btn 
          @click="multiDelete" 
          outline 
          color="error"
        >
          Multi Delete
        </v-btn>

      </span>

      <span slot="card-content">
        <!-- テーブル表示 -->
        <app-data-table
          :headers="switchParams.headers"
          :items="makingOrders.results"
          :checkbox="true"
          @edit-item="editMakingOrder"
          @double-clicked="editMakingOrder"
          @delete-item="deleteMakingOrderData"
          ref="data_table"
        >
        </app-data-table>
      </span>

      <!-- カード上部検索機能コンポーネント -->
      <div slot="search-bar">
        <v-layout row wrap>
          <app-search-bar
            :length="makingOrders.pages"
            :count="makingOrders.count"
            :orderBy="orderBy"
            :incremental="incremental"
            :params="switchParams.params"
            @search-list="getList"
          ></app-search-bar>
        </v-layout>
      </div>

      <!-- ダイアログ関係スロット -->
      <span slot="card-dialog">
        <!-- 発注ファイルダイアログ -->
        <app-order-dialog @response-function="responseFunction" :showAdd="!hasMFGNo" ref="order_dialog">
          <span d-inline-flex slot="edit-bom">
            <v-btn color="primary" dark @click="editBillOfMaterial" v-if="hasMFGNo">Edit Bill of Material</v-btn>
          </span>
        </app-order-dialog>
        <!-- 部品表ダイアログ -->
        <app-bom-dialog @response-function="responseFunction" ref="bom_dialog" :hideButtons="true"></app-bom-dialog>
      </span>
      
    </app-card>

    <multi-update @response-function="responseFunction" ref="multi_update"></multi-update>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import MakingOrderMultiUpdate from "./MakingOrderMultiUpdate.vue"
import MakingOrderMultiDeleteMixin from "./MakingOrderMultiDeleteMixin.js"

export default {
  title: "Making Order",
  name: "MakingOrder",
  mixins: [MakingOrderMultiDeleteMixin],
  components: {
    "multi-update": MakingOrderMultiUpdate,
  },
  data() {
    return {
      orderBy: "-created_at",
      // テーブルヘッダーデータ
      defaultHeadersTop: [
        { text: "", value: "checkbox" },
        { text: "No", value: "number" },
        { text: "Part Name", value: "name" }
      ],
      defaultHeadersEnd: [
        { text: "Supplier", value: "supplierData" , nest: "abbr"},
        { text: "Amount", value: "amount", class: "text-xs-right" },
        { text: "Unit Price", value: "displayPrice", class: "text-xs-right" },
        { text: "Delivery", value: "desiredDeliveryDate" },
        { text: "Action", value: "action", class: "text-xs-center" }
      ],
      // 市販部品テーブルヘッダー
      commercialHeaders: [
        { text: "Manufacturer", value: "manufacturerData" , nest: "abbr"},
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
    ...mapState("jobOrderAPI", ["jobOrder"]),
    ...mapState("billOfMaterialAPI", ["billOfMaterial"]),
    ...mapState("makingOrderAPI", [ "jobOrderID", "isProcessed", "makingOrders", "makingOrder"]),
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
    ...mapActions("billOfMaterialAPI", ["setBillOfMaterial"]),
    ...mapActions("makingOrderAPI", ["getMakingOrders", "setMakingOrder", "setMakingOrders", "postMakingOrder", "deleteMakingOrder", "setTableSelected"]),
    // 一括編集機能
    multiUpdate() {
      this.setTableSelected(this.$refs.data_table.selected);
      this.$refs.multi_update.openDialog();
    },
    async getList(data) {
      this.$store.commit("systemConfig/setLoading", true);
      await this.getMakingOrders(data);
      this.$store.commit("systemConfig/setLoading", false);
    },
    // 発注ファイル編集
    editMakingOrder: function (val) {
      this.setMakingOrder(val);
      this.$refs.order_dialog.editMakingOrder();
    },
    editBillOfMaterial() {
      this.setBillOfMaterial(this.makingOrder.billOfMaterial);
      this.$refs.bom_dialog.editBillOfMaterial();
    },
    // 処理結果統合フォーム
    responseFunction(val) {
      // リストをリロード
      this.getList({ params: this.switchParams.params });
      // Snackbar表示
      this.showSnackbar(val.snack);
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
      } else {
        // Noの場合はスナックバーにキャンセルの旨を表示
        res.snack = { snack: "Delete is cancelled" };
      }
      // リストをリロード
      this.getMakingOrders({ params: this.switchParams.params });
      // Snackbar表示
      this.showSnackbar(res.snack.snack, res.snack.color);
    },
    // メニューに戻る
    backToMenu() {
      this.$router.push({ name: "MakingOrderMenu" });
    },
  },
  created() {
    this.setMakingOrders({});
    if(this.jobOrderID) {
      this.getJobOrder(this.jobOrderID);
      this.setTableSelected([]);
    }
  }
}
</script>

<style>

</style>
