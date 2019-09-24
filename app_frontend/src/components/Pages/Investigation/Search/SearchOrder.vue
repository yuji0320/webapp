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

      <div slot="card-title-text">
        <p>* Green is already Ordered.</p>
      </div>

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

      <span slot="card-content">
        <!-- テーブル表示 -->
        <app-data-table
          :headers="switchParams.headers"
          :items="makingOrders.results"
          :checkbox="true"
          :editDisabled="true"
          :viewIcon="true"
          @view-item="viewMakingOrder"
          @double-clicked="viewMakingOrder"
          ref="data_table"
        >
        </app-data-table>
      </span>

      <!-- ダイアログ関係スロット -->
      <span slot="card-dialog">
        <!-- 発注ファイルダイアログ -->
        <app-order-dialog :showAdd="false" ref="order_dialog" :editDisable="true">
          <span d-inline-flex slot="edit-bom">
            <v-btn color="primary" dark @click="viewBillOfMaterial" v-if="hasMFGNo">View Bill of Material</v-btn>
          </span>
        </app-order-dialog>
        <!-- 部品表ダイアログ -->
        <app-bom-dialog ref="bom_dialog" :hideButtons="true" :editDisable="true"></app-bom-dialog>
      </span>

    </app-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  title: "Search Order",
  name: "SearchOrder",
  data () {
    return {
      orderBy: 'is_printed,supplier__name,manufacturer__name,standard,drawing_number',
      // テーブルヘッダーデータ
      defaultHeadersTop: [
        { text: "Part Name", value: "name" }
      ],
      defaultHeadersEnd: [
        { text: "Supplier", value: "supplierData" , nest: "abbr"},
        { text: "Amount", value: "amount", class: "text-xs-right" },
        { text: "Unit Price", value: "displayPrice", class: "text-xs-right" },
        { text: "Delivery", value: "desiredDeliveryDate" },
        { text: "Ordered Date", value: "orderedDate" },
        { text: "Action", value: "action", class: "text-xs-center" }
      ],
      // 市販部品テーブルヘッダー
      commercialHeaders: [
        { text: "Manufacturer", value: "manufacturerData" , nest: "abbr"},
        { text: "Standard/Form", value: "standard" },
        { text: "Unit number", value: "unit_number" }
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
      let title = "Search Order";
      let headers = this.defaultHeadersTop.concat(this.commercialHeaders, this.defaultHeadersEnd);
      // 工事番号有無の確認
      if (this.hasMFGNo) {
        // 線品情報の追加
        title += " : " + this.jobOrder.mfgNo + " - " + this.jobOrder.name;
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
        title += " without MFG No";
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
    ...mapActions("jobOrderAPI", ["getJobOrder"]),
    ...mapActions("billOfMaterialAPI", ["setBillOfMaterial"]),
    ...mapActions("makingOrderAPI", ["getMakingOrders", "setMakingOrder", "setMakingOrders"]),
    async getList(data) {
      this.$store.commit("systemConfig/setLoading", true);
      await this.getMakingOrders(data);
      this.$store.commit("systemConfig/setLoading", false);
    },
    // 発注ファイル編集
    viewMakingOrder: function (val) {
      this.setMakingOrder(val);
      this.$refs.order_dialog.editMakingOrder();
    },
    viewBillOfMaterial() {
      this.setBillOfMaterial(this.makingOrder.billOfMaterial);
      this.$refs.bom_dialog.editBillOfMaterial();
    },
    // メニューに戻る
    backToMenu() {
      this.$router.push({ name: "SearchMenu" });
    }
  },
  created () {
    this.setMakingOrders({});
    if(this.jobOrderID) {
      this.getJobOrder(this.jobOrderID);
    } 
  }
}
</script>

<style>

</style>
