<template>
  <app-dialog
    :formName="'makingOrderForm'"
    :hideButtons="!showAdd"
    parentTitle="Order"
    dialogWidth="600px"
    @submit-form="submitMakingOrder"
    @clear-form="clearMakingOrder"
    @set-default="setDefault"
    ref="dialog"
    :editDisable="editDisable"
  >
    <!-- フォーム内容 -->
    <span slot="dialog-contents">
      <!-- 確認ダイアログ -->
      <app-confirm ref="confirm"></app-confirm>

      <v-layout wrap>
        <!-- 発注ファイルフォーム -->

        <!-- エラー表示 -->
        <v-flex xs12>
          <v-alert 
            value="true"
            type="error"
            v-if="responseError.nonFieldErrors"
          >
            <li
              v-for="(error, index) in responseError.nonFieldErrors"
              :key="index"
            >
              {{ error }}
            </li>
          </v-alert>
        </v-flex>

        <!-- 発注番号 -->
        <v-flex xs2 md2>
          <v-text-field 
            label="No"
            class="right-input"
            disabled
            v-model="makingOrder.number"
          ></v-text-field>
        </v-flex>
        <!-- 部品名 -->
        <v-flex xs2 md10>
          <v-text-field 
            label="Part Name*"
            v-model="makingOrder.name"
            :error-messages="responseError.name"
            :disabled="editDisable"
          ></v-text-field>
        </v-flex>

        <!-- 加工部品の場合 -->
        <!-- 図面番号 -->
        <v-flex xs12 v-show="isProcessedParts">
          <v-text-field 
            label="Drawing Number"
            v-model="makingOrder.drawingNumber"
            :error-messages="responseError.drawingNumber"
            :disabled="editDisable"
          ></v-text-field>
        </v-flex>
        <!-- 材質 -->
        <v-flex xs12 md6 v-show="isProcessedParts">
          <v-text-field 
            label="Material"
            v-model="makingOrder.material"
            :error-messages="responseError.material"
            :disabled="editDisable"
          ></v-text-field>
        </v-flex>
        <!-- 表面処理 -->
        <v-flex xs12 md6 v-show="isProcessedParts">
          <v-text-field 
            label="Surface treatment"
            v-model="makingOrder.surfaceTreatment"
            :error-messages="responseError.surfaceTreatment"
            :disabled="editDisable"
          ></v-text-field>
        </v-flex>

        <!-- 加工部品以外の場合 -->
        <!-- メーカー選択 -->
        <v-flex xs12 v-show="!isProcessedParts">
          <app-incremental-model-search
            label="Manufacturer"
            orderBy="name"
            v-model="makingOrder.manufacturer"
            searchType="partner"
            filter="manufacturer"
            :errorMessages="responseError.manufacturer"
            ref="manufacturer"
            :disabled="editDisable"
          ></app-incremental-model-search>
        </v-flex>
        <!-- 規格・寸法 -->
        <v-flex xs12 md6 v-show="!isProcessedParts">
          <v-text-field 
            label="Standard/Form"
            v-model="makingOrder.standard"
            :error-messages="responseError.standard"
            :disabled="editDisable"
          ></v-text-field>
        </v-flex>
        <!-- ユニット番号 -->
        <v-flex xs12 md6 v-show="!isProcessedParts">
          <v-text-field 
            label="Unit Number"
            v-model="makingOrder.unitNumber"
            :error-messages="responseError.unitNumber"
            :disabled="editDisable"
          ></v-text-field>
        </v-flex>

        <!-- 個数 -->
        <v-flex xs12 md4>
          <v-text-field 
            label="Amount"
            v-model="makingOrder.amount"
            class="right-input"
            :error-messages="responseError.amount"
            :disabled="editDisable"
          ></v-text-field>
        </v-flex>
        <!-- 単位選択 -->
        <v-flex xs12 md8>
          <app-incremental-model-search
            label="Unit Type"
            orderBy="number"
            v-model="makingOrder.unit"
            searchType="unitType"
            :errorMessages="responseError.unit"
            ref="unitType"
            :disabled="editDisable"
          ></app-incremental-model-search>
        </v-flex>
        <!-- 金額 -->
        <v-flex xs4>
          <v-text-field 
            label="Unit Price"
            v-model="makingOrder.unitPrice"
            :error-messages="responseError.unitPrice"
            class="right-input"
            @blur="checkPrice"
            :disabled="editDisable"
          ></v-text-field >
        </v-flex>
        <!-- 通貨 -->
        <v-flex xs12 md8>
          <app-incremental-model-search
          label="Currency"
          orderBy="id"
          v-model="makingOrder.currency"
          searchType="currency"
          :errorMessages="responseError.currency"
          ref="currency"
          :disabled="editDisable"
          ></app-incremental-model-search>
        </v-flex>
        <!-- レート -->
        <v-flex xs12 md4>
          <v-text-field 
            label="Rate"
            v-model="makingOrder.rate"
            :error-messages="responseError.rate"
            :suffix="loginUserData.defaultCurrencyCode"
            hint="1 Order currency = "
            :persistent-hint="true"
            class="right-input"
            :disabled="editDisable"
          ></v-text-field >
        </v-flex>
        <!-- 仕入先選択 -->
        <v-flex xs12 md8>
          <app-incremental-model-search
            label="Supplier"
            orderBy="name"
            v-model="makingOrder.supplier"
            searchType="partner"
            filter="supplier"
            :errorMessages="responseError.supplier"
            ref="supplier"
            :disabled="editDisable"
          ></app-incremental-model-search>
        </v-flex>
        <!-- 希望納期 -->
        <v-flex xs12 md4>
          <app-input-date 
            label="Desired Delivery Date"
            v-model="makingOrder.desiredDeliveryDate"
            :errorMessages="responseError.desiredDeliveryDate"
            :disabled="editDisable"
          ></app-input-date>
        </v-flex>       
      </v-layout>
    </span>

    <!-- 拡張ボタンスロット -->
    <span slot="expand-button">
        <slot name="edit-bom"></slot>
    </span>

  </app-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  props: {
    showAdd: { required: false },
    editDisable: { required: false },
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["unitTypes", "expenseCategories", "expenseCategory"]),
    ...mapState("billOfMaterialAPI", ["billOfMaterial"]),
    ...mapState("makingOrderAPI", ["responseError", "jobOrderID", "partsType", "makingOrders", "makingOrder"]),
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
    },
    // 加工部品かどうか
    isProcessedParts() {
      if(this.makingOrder.isProcessed) {
        return true;
      } else {
        return false
      }
    }
  },
  methods: {
    ...mapActions("systemConfig", ["showSnackbar"]),
    ...mapActions("billOfMaterialAPI", ["setBillOfMaterial", "putBillOfMaterial"]),
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
      if(this.makingOrder.billOfMaterial) {
        this.makingOrder.billOfMaterialId = this.makingOrder.billOfMaterial.id;
      } else {
        this.makingOrder.billOfMaterialId = null;
        if (this.$refs.dialog.editedIndex == -1) {
          this.makingOrder.number = null;
        }
      }
      // コンポーネントの編集ステータスに応じて新規と更新を切り替える
      if (this.$refs.dialog.editedIndex == -1) {
        // 新規追加時の処理
        this.makingOrder.createdBy = this.loginUserData.id;
        res = await this.postMakingOrder(this.makingOrder);
      } else {
        // 更新時
        res = await this.putMakingOrder(this.makingOrder);
      }
      
      if (res.data) {
        // 更新成功時はモーダルを閉じる
        if (this.$refs.dialog.editedIndex == -1) {
          this.setDefault();
        } else {
          this.$refs.dialog.closeDialog();
        }
        // 登録完了後、親コンポーネントで連携関数を実施する
        this.$emit("response-function", res);
      } else {
        // 失敗時
        console.log("Failed");
        console.log(res);
      }
    },
    // 発注ファイルと部品表の金額差チェック
    async checkPrice() {
      let res = {};
      if(this.makingOrder.billOfMaterial) {
        let order = this.makingOrder.unitPrice;
        let bom = this.makingOrder.billOfMaterial.unitPrice;
        if(order!=bom) {
          // 発注ファイルと部品表で単価が違う場合
          // アラート文
          let alertText = ("Order's unit price is '" + order.replace(/(\d)(?=(\d{3})+($|\.\d+))/g , '$1,') + 
                          "'\nBOM's unit price is   '" + bom.replace(/(\d)(?=(\d{3})+($|\.\d+))/g , '$1,') + "'" + 
                          "\nAre you sure change Bill ob material's unit price?")
          if (
            await this.$refs.confirm.open(
              "Unit Price is different!",
              alertText,
              { color: "blue" }
            )
          ) {
            // Yesの場合は上書き処理
            this.setBillOfMaterial(this.makingOrder.billOfMaterial);
            this.billOfMaterial.unitPrice = order;
            this.billOfMaterial.modifiedBy = this.loginUserData.id;
            this.makingOrder.billOfMaterial = this.billOfMaterial;
            res = await this.putBillOfMaterial(this.billOfMaterial);
          } else {
            // Noの場合はスナックバーにキャンセルの旨を表示
            res.snack = { snack: "Bill of Material's price is not changed." };
            this.showSnackbar(res.snack);
          }
        } else {
          // 単価が同じ場合は処理しない
        }
      }
    }
  }
}
</script>

<style>

</style>
