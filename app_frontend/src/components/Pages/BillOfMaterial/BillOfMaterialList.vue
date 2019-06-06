<template>
  <v-container 
    fluid
    grid-list-lg
  >
    <!-- 確認ダイアログ -->
    <app-confirm ref="confirm"></app-confirm>

    <!-- カード形式リストコンポーネント -->
    <app-card-table
      :headers="headerData"
      :items="billOfMaterials.results"
      :viewIcon="false"
      @edit-item="editBillOfMaterial"
      @delete-item="deleteBillOfMaterialData"
    >
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>list</v-icon></span>
      <span slot="card-header-title">BOM - {{ expenseCategory.categoryName }} : "{{ jobOrder.mfgNo }} - {{ jobOrder.name }}" </span>

      <!-- 戻るボタン -->
      <span slot="card-header-buck-button">
        <v-btn @click="backToMenu" >
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
      </span>

      <!-- ダイアログ関係スロット -->
      <span slot="card-dialog">

        <app-bom-dialog
          :expenseCategory="expenseCategory"
        >

        </app-bom-dialog>
        
      </span>

      <span slot="card-header-button">
        <!-- エクセルアップロード -->
        <v-btn
          fab
          small
          @click="upload"
        >
          <v-icon>cloud_upload</v-icon>
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
    </app-card-table>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Bill of Material List",
  name: "BillOfMaterialList",
  data() {
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
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["unitTypes", "expenseCategories", "expenseCategory"]),
    ...mapState("jobOrderAPI", ["jobOrder"]),
    ...mapState("billOfMaterialAPI", [
      "responseError",
      "jobOrderID", 
      "partsType", 
      "billOfMaterials",
      "billOfMaterial"
    ]),
    params() {
      return {
        company: this.loginUserData.companyId,
        job_order: this.jobOrderID,
        type: this.partsType,
        order_by: this.orderBy
      };
    },
    headerData() {
      // 部品種別ごとにテーブル表示項目を変更
      let header = [];
      if(this.expenseCategory.isProcessedParts) {
        header = this.defaultHeadersTop.concat(this.processedHeaders, this.defaultHeadersEnd);
      } else {
        header = this.defaultHeadersTop.concat(this.commercialHeaders, this.defaultHeadersEnd);
      }
      return header;
    },
    // 部品表デフォルト値
    defaultBillOfMaterial() {
      // 単位デフォルト値取得
      let unitType = this.unitTypes.results[0].id;
      // デフォルト配列作成
      let array = {
        company: this.loginUserData.companyId,
        jobOrder: this.jobOrderID,
        type: this.partsType,
        amount: "1.00",
        unit: unitType,
        currency: this.loginUserData.defaultCurrencyId,
        rate: 1,
        stockAppropriation: "0.00",
        createdBy: this.loginUserData.id
      }
      return array;
    }
  },
  methods: {
    ...mapActions("systemConfig", ["showSnackbar"]),
    ...mapActions("systemMasterApi", ["getUnitTypes", "getExpenseCategories", "getExpenseCategory"]),
    ...mapActions("jobOrderAPI", ["getJobOrder"]),
    ...mapActions("billOfMaterialAPI", [
      "setJobOrderID", 
      "setPartsType", 
      "getBillOfMaterials",
      "setBillOfMaterial",
      "clearBillOfMaterialError",
      "setBillOfMaterials",
      "postBillOfMaterial",
      "putBillOfMaterial",
      "deleteBillOfMaterial"
    ]),
    async getList(data) {
      this.$store.commit("systemConfig/setLoading", true);
      let list = await this.getBillOfMaterials(data);
      this.$store.commit("systemConfig/setLoading", false);
    },
    // 頭出しフォームに対するデータ反映
    setIncremental(val) {
      // メーカーデータをセット
      if(!this.expenseCategory.isProcessedParts) {
        this.$refs.manufacturer.setData(val.manufacturer);
      }
      // 単位データセット
      this.$refs.unitType.setData(val.unit);
      // 通貨データセット
      this.$refs.currency.setData(val.currency);
      // 仕損費データセット
      this.$refs.failure.setData(val.failure);
    },
    // デフォルト値設定
    setDefault() {
      // console.log(this.defaultBillOfMaterial);
      this.setIncremental(this.defaultBillOfMaterial);
      this.setBillOfMaterial(this.defaultBillOfMaterial);
    },
    // 編集データ設定
    editBillOfMaterial(val) {
      this.setIncremental(val);
      this.setBillOfMaterial(val);
      this.$refs.dialog.editForm();
    },
    // フォームおよび子コンポーネントのデータクリア
    clearBillOfMaterial() {
      // エラーをクリア
      this.clearBillOfMaterialError();
      // データをクリア
      this.setBillOfMaterial({});
      // メーカーデータを削除
      if(!this.expenseCategory.isProcessedParts) {
        this.$refs.manufacturer.clearItem();
      }
      // 単位データクリア
      this.$refs.unitType.clearItem();
      // 通貨データクリア
      this.$refs.currency.clearItem();
      // 仕損費データクリア
      this.$refs.failure.clearItem();
    },
    // 処理結果統合フォーム
    responseFunction(val) {
      // リストをリロード
      this.getBillOfMaterials({ params: this.params });
      // Snackbar表示
      this.showSnackbar(val.snack);
    },
    // 部品表フォーム送信
    async submitBillOfMaterial() {
      let res = {};
      this.billOfMaterial.modifiedBy = this.loginUserData.id;
      // コンポーネントの編集ステータスに応じて新規と更新を切り替える
      if (this.$refs.dialog.editedIndex == -1) {
        // 新規追加時の処理
        // console.log("post");
        res = await this.postBillOfMaterial(this.billOfMaterial);
      } else {
        // 更新時
        // console.log("put");
        res = await this.putBillOfMaterial(this.billOfMaterial);
      }
      if (res.data) {
        // 更新成功時はモーダルを閉じる
        if (this.$refs.dialog.editedIndex == -1) {
          this.setDefault();
        } else {
          this.$refs.dialog.closeDialog();
        }
        this.responseFunction(res);
      } else {
        // 失敗時
        console.log("Failed");
        console.log(res);
      }
    },
    // 部品表削除
    async deleteBillOfMaterialData(val) {
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
        res = await this.deleteBillOfMaterial(val);
      } else {
        // Noの場合はスナックバーにキャンセルの旨を表示
        res.snack = { snack: "Delete is cancelled" };
      }
      this.responseFunction(res);
    },
    // エクセルアップロード
    upload() {
      this.$router.push({ name: "BillOfMaterialUpload" });
    },
    // メニューに戻る
    backToMenu() {
      this.$router.push({ name: "BillOfMaterialMenu" });
    },
  },
  created() {
    // もし工事番号等がクリアの場合はメニューにリダイレクトする
    if(!this.partsType || !this.jobOrderID) {
      this.$router.push({ name: "BillOfMaterialMenu" });
    } else {
      this.setBillOfMaterials("");
      this.getExpenseCategory(this.partsType);
      this.getJobOrder(this.jobOrderID);
      // console.log(this.jobOrderID);
    }
  },
  mounted() {}
}
</script>

