<template>
  <app-dialog
    :formName="'makingOrderForm'"
    :hideButtons="true"
    dialogTitle="Multi Update"
    dialogWidth="600px"
    @submit-form="multiUpdate"
    ref="dialog"
  >
    <span slot="dialog-contents">
      <v-layout wrap>
        <!-- 仕入先選択 -->
        <v-flex xs1>
          <v-checkbox v-model="supplierIsAble"></v-checkbox>
        </v-flex>
        <v-flex xs11>
          <app-incremental-model-search
            label="Supplier"
            orderBy="name"
            v-model="supplier"
            searchType="partner"
            filter="supplier"
            ref="supplier"
            :disabled="!supplierIsAble"
          ></app-incremental-model-search>
        </v-flex>
        <!-- 希望納期 -->
        <v-flex xs1>
          <v-checkbox v-model="dateIsAble"></v-checkbox>
        </v-flex>
        <v-flex xs12 md4>
          <app-input-date 
            label="Desired Delivery Date"
            v-model="date"
            :disabled="!dateIsAble"
          ></app-input-date>
        </v-flex>   
      </v-layout>
    </span>
  </app-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      supplier: "",
      supplierIsAble: true,
      date: "",
      dateIsAble: true
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("makingOrderAPI", ["makingOrder", "tableSelected"]),
    // 一つ以上選択されている場合のみTrueを返す
    selectedDataExists() {
      if(this.tableSelected.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    ...mapActions("systemConfig", ["showSnackbar"]),
    ...mapActions("makingOrderAPI", ["putMakingOrder"]),
    // ダイアログオープン
    openDialog() {
      // ダイアログを開いた際にデータをリセット
      this.date = "";
      this.supplier = "";
      this.$refs.supplier.clearItem();
      this.supplierIsAble = true;
      this.dateIsAble = true;
      // ダイアログオープン
      this.$refs.dialog.editForm();
    },
    // アップデート処理
    async multiUpdate() {
      // データが選択済みかどうかで処理を分岐
      if(this.selectedDataExists) {
        if(!this.supplierIsAble && !this.dateIsAble) {
          // 編集項目が両方ともfalseの場合アラートを出す
          this.showSnackbar({color:"red", snack:"Input data is disabled."});
        } else {
          // 編集項目がどちらか一方選択済みの場合
          // レスポンス用変数の定義
          let res = {};
          // 日付が空白の場合はnullを設定
          if(!this.date) { this.date = null; }
          // 選択済みデータを個別処理
          for(var o=0,order;order=this.tableSelected[o];o++){
            // 講師尿データの反映
            order.modifiedBy = this.loginUserData.id;
            // BOMのIDを渡す
            if(order.billOfMaterial) {
              // bomありの場合
              order.billOfMaterialId = order.billOfMaterial.id;
            } else {
              // 交番なし発注の場合
              order.billOfMaterialId = null;
            }
            // 仕入先入力フォームがableの場合
            if(this.supplierIsAble) {
              order.supplier = this.supplier;
            }
            // 日付入力フォームがableの場合
            if(this.dateIsAble) {
              order.desiredDeliveryDate = this.date;
            }
            // データのアップロード
            res = await this.putMakingOrder(order);
            // console.log(res);
          }
          // 成功時のスナックバー定義
          res.snack = {
            color: "success",
            snack: "Update is success!"
          }
          // 処理統合関数の呼び出し
          this.$emit("response-function", res);       
          // ダイアログを閉じる
          this.$refs.dialog.closeDialog(); 
        }
      } else {
        // データを選択していない場合はアラートを出し、ダイアログを閉じる
        this.showSnackbar({color:"red", snack:"No data selected."});
        this.$refs.dialog.closeDialog();
      }
    }
  }
}
</script>

<style>

</style>
