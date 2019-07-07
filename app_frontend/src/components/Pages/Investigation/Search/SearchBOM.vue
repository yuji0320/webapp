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
      <div slot="search-bar">
        <v-layout row wrap>
          <app-search-bar
            :length="billOfMaterials.pages"
            :count="billOfMaterials.count"
            :orderBy="orderBy"
            :incremental="incremental"
            :params="params"
            @search-list="getList"
          ></app-search-bar>
        </v-layout>
      </div>

      <div slot="card-title-text">
        <p>* Green is already printed.</p>
      </div>

      <span slot="card-content">
        <!-- テーブル表示 -->
        <app-data-table
          :headers="switchParams.headers"
          :items="billOfMaterials.results"
          :checkbox="true"
          :editDisabled="true"
          :viewIcon="true"
          @view-item="viewBillOfMaterial"
          @double-clicked="viewBillOfMaterial"
          ref="data_table"
        >
        </app-data-table>
      </span>

      <!-- ダイアログ関係スロット -->
      <span slot="card-dialog">
        <!-- 部品表登録編集ダイアログコンポーネント -->
        <app-bom-dialog ref="bom_dialog" :hideButtons="true" :editDisable="true"></app-bom-dialog>
      </span>

    </app-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  title: "Search BOM",
  name: "SearchBillOfMaterial",
  data () {
    return {
      orderBy: "-created_at",
      // テーブルヘッダーデータ
      defaultHeadersTop: [
        { text: "Part Name", value: "name" }
      ],
      defaultHeadersEnd: [
        { text: "Amount", value: "amount", class: "text-xs-right" },
        { text: "Unit Price", value: "displayPrice", class: "text-xs-right" },
        { text: "Delivery", value: "desiredDeliveryDate" },
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
    ...mapState("billOfMaterialAPI", ["jobOrderID", "isProcessed", "billOfMaterials", "billOfMaterial"]),
    params() {
      return {
        company: this.loginUserData["companyId"],
        job_order: this.jobOrderID,
        type__is_processed_parts: this.isProcessed,
        order_by: this.orderBy
      }
    },
    switchParams() {
      let title = "Search Bill of Material" + " : " + this.jobOrder.mfgNo + " - " + this.jobOrder.name;
      let headers = [];
      if (this.isProcessed) {
        title += "(Processed Parts)";
        headers = this.defaultHeadersTop.concat(this.processedHeaders, this.defaultHeadersEnd);
      } else {
        title += "(Other)";
        headers = this.defaultHeadersTop.concat(this.commercialHeaders, this.defaultHeadersEnd);
      }
      return {
        title: title,
        headers: headers
      }
    }
  },
  methods: {
    ...mapActions("jobOrderAPI", ["getJobOrder"]),
    ...mapActions("billOfMaterialAPI", ["getBillOfMaterials", "setBillOfMaterial","setBillOfMaterials",]),
    async getList(data) {
      this.$store.commit("systemConfig/setLoading", true);
      let list = await this.getBillOfMaterials(data);
      this.$store.commit("systemConfig/setLoading", false);
    },
    // 編集データ設定
    viewBillOfMaterial(val) {
      this.setBillOfMaterial(val);
      this.$refs.bom_dialog.editBillOfMaterial();
    },
    // メニューに戻る
    backToMenu() {
      this.$router.push({ name: "SearchMenu" });
    }
  },
  created () {
    this.setBillOfMaterials({});
    // this.getList({params: this.params})
    this.getJobOrder(this.jobOrderID);
  }
}
</script>

<style>

</style>
