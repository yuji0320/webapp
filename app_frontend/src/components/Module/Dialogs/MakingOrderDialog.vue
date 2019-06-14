<template>
  
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["unitTypes", "expenseCategories", "expenseCategory"]),
    ...mapState("jobOrderAPI", ["jobOrder"]),
    ...mapState("makingOrderAPI", [
      "responseError", "jobOrderID", "partsType", "makingOrders", "makingOrder"
    ]),
    // 発注ファイルデフォルト値
    defaultMakingOrder() {
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
        createdBy: this.loginUserData.id
      }
      return array;
    }
  },
  methods: {
    ...mapActions("systemConfig", ["showSnackbar"]),
    ...mapActions("systemMasterApi", ["getUnitTypes", "getExpenseCategories", "getExpenseCategory"]),
    // ...mapActions("jobOrderAPI", ["getJobOrder"]),
    // ...mapActions("billOfMaterialAPI", ["getBillOfMaterials", "setBillOfMaterials", "setBillOfMaterial", "putBillOfMaterial"]),
    ...mapActions("makingOrderAPI", [
      "setJobOrderID", "setPartsType", "getMakingOrders", "setMakingOrder" ,"clearMakingOrderError", "setMakingOrders",
      "postMakingOrder", "putMakingOrder", "deleteMakingOrder"
    ]),
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
      // 仕入先データセット
      this.$refs.supplier.setData(val.supplier);
    },
    // デフォルト値設定
    setDefault() {
      this.setIncremental(this.defaultMakingOrder);
      this.setMakingOrder(this.defaultMakingOrder);
    },
    // 発注ファイル編集
    editMakingOrder() {
      this.setIncremental(this.makingOrder);
      this.$refs.dialog.editForm();
    },
    // フォームおよび子コンポーネントのデータクリア
    clearMakingOrder() {
      // エラーをクリア
      this.clearMakingOrderError();
      // データをクリア
      this.setMakingOrder({});
      // メーカーデータを削除
      if(!this.expenseCategory.isProcessedParts) {
        this.$refs.manufacturer.clearItem();
      }
      // 単位データクリア
      this.$refs.unitType.clearItem();
      // 通貨データクリア
      this.$refs.currency.clearItem();
      // 仕損費データクリア
      this.$refs.supplier.clearItem();
    },
    // 発注ファイル編集データ送信
    async submitMakingOrder() {
      let res = {};
      this.makingOrder.modifiedBy = this.loginUserData.id;
      this.makingOrder.billOfMaterialId = this.makingOrder.billOfMaterial.id;
      // console.log(this.makingOrder);
      res = await this.putMakingOrder(this.makingOrder);
      // console.log(res);
      if (res.data) {
        // 更新成功時はモーダルを閉じる
        this.$refs.dialog.closeDialog();
        // 登録完了後、親コンポーネントで連携関数を実施する
        this.$emit("response-function", res);
      } else {
        // 失敗時
        console.log("Failed");
        console.log(res);
      }
      // console.log("submit!");
    },
  }
}
</script>

<style>

</style>
