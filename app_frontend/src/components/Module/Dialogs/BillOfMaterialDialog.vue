<template>
  <app-dialog
    :formName="'billOfMaterialForm'"
    :hideButtons="hideButtons"
    parentTitle="Bill of Material"
    @clear-form="clearBillOfMaterial"
    @submit-form="submitBillOfMaterial"
    @set-default="setDefault"
    ref="dialog"
  >
    <!-- フォーム内容 -->
    <span slot="dialog-contents">
      <v-layout wrap>
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
        <!-- 部品表フォーム -->
        <v-flex xs12>
          <v-text-field 
            label="Part Name*"
            v-model="billOfMaterial.name"
            :error-messages="responseError.name"
          ></v-text-field>
        </v-flex>

        <template v-if="this.expenseCategory.isProcessedParts">
          <!-- 図面番号 -->
          <v-flex xs12>
            <v-text-field 
              label="Drawing Number"
              v-model="billOfMaterial.drawingNumber"
              :error-messages="responseError.drawingNumber"
            ></v-text-field>
          </v-flex>
          <!-- 材質 -->
          <v-flex xs12 md6>
            <v-text-field 
              label="Material"
              v-model="billOfMaterial.material"
              :error-messages="responseError.material"
            ></v-text-field>
          </v-flex>
          <!-- 表面処理 -->
          <v-flex xs12 md6>
            <v-text-field 
              label="Surface treatment"
              v-model="billOfMaterial.surfaceTreatment"
              :error-messages="responseError.surfaceTreatment"
            ></v-text-field>
          </v-flex>
        </template>

        <template v-else>
          <!-- メーカー選択 -->
          <v-flex xs12>
            <app-incremental-model-search
              label="Manufacturer"
              orderBy="name"
              v-model="billOfMaterial.manufacturer"
              searchType="partner"
              filter="manufacturer"
              :errorMessages="responseError.manufacturer"
              ref="manufacturer"
            ></app-incremental-model-search>
          </v-flex>
          <!-- 規格・寸法 -->
          <v-flex xs12 md6>
            <v-text-field 
              label="Standard/Form"
              v-model="billOfMaterial.standard"
              :error-messages="responseError.standard"
            ></v-text-field>
          </v-flex>
          <!-- ユニット番号 -->
          <v-flex xs12 md6>
            <v-text-field 
              label="Unit Number"
              v-model="billOfMaterial.unitNumber"
              :error-messages="responseError.unitNumber"
            ></v-text-field>
          </v-flex>
        </template>

        <!-- 個数 -->
        <v-flex xs12 md4>
          <v-text-field 
            label="Amount"
            v-model="billOfMaterial.amount"
            class="right-input"
            :error-messages="responseError.amount"
          ></v-text-field>
        </v-flex>
        <!-- 単位選択 -->
        <v-flex xs12 md8>
          <app-incremental-model-search
            label="Unit Type"
            orderBy="number"
            v-model="billOfMaterial.unit"
            searchType="unitType"
            :errorMessages="responseError.unit"
            ref="unitType"
          ></app-incremental-model-search>
        </v-flex>
        <!-- 在庫充当個数 -->
        <v-flex xs12 md4>
          <v-text-field 
            label="Stock Appropriation"
            v-model="billOfMaterial.stockAppropriation"
            class="right-input"
            :error-messages="responseError.stockAppropriation"
          ></v-text-field>
        </v-flex> 
        <v-flex xs12 md8>
        </v-flex> 
        <!-- 金額 -->
        <v-flex xs4>
          <v-text-field 
            label="Unit Price"
            v-model="billOfMaterial.unitPrice"
            :error-messages="responseError.unitPrice"
            class="right-input"
          ></v-text-field >
        </v-flex>
        <!-- 通貨 -->
        <v-flex xs12 md8>
          <app-incremental-model-search
          label="Currency"
          orderBy="id"
          v-model="billOfMaterial.currency"
          searchType="currency"
          :errorMessages="responseError.currency"
          ref="currency"
          ></app-incremental-model-search>
        </v-flex>
        <!-- レート -->
        <v-flex xs12 md4>
          <v-text-field 
            label="Rate"
            v-model="billOfMaterial.rate"
            :error-messages="responseError.rate"
            :suffix="loginUserData.defaultCurrencyCode"
            hint="1 Order currency = "
            :persistent-hint="true"
            class="right-input"
          ></v-text-field >
        </v-flex>
        <!-- 希望納期 -->
        <v-flex xs12 md4>
          <app-input-date 
            label="Desired Delivery Date"
            v-model="billOfMaterial.desiredDeliveryDate"
            :errorMessages="responseError.desiredDeliveryDate"
          ></app-input-date >
        </v-flex>       
        <!-- 支給品Boolern -->
        <v-flex xs12 md6>
          <v-checkbox
            label="is Customer Supplied"
            v-model="billOfMaterial.isCustomerSupplied"
            :errorMessages="responseError.isCustomerSupplied"
          ></v-checkbox>
        </v-flex>
        <!-- 仕損費種別 -->
        <v-flex xs12 md8>
          <app-incremental-model-search
          label="Failure"
          orderBy="category_number"
          v-model="billOfMaterial.failure"
          searchType="failure"
          :errorMessages="responseError.failure"
          ref="failure"
          ></app-incremental-model-search>
        </v-flex>
      </v-layout>
    </span>
  </app-dialog>

</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  props: {
    hideButtons: { required: false }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["unitTypes", "expenseCategories", "expenseCategory"]),
    ...mapState("billOfMaterialAPI", ["responseError", "jobOrderID", "partsType","billOfMaterial"]),
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
    ...mapActions("systemConfig", ["showSnackbar", "moneySetting"]),
    ...mapActions("billOfMaterialAPI", [
      "setBillOfMaterial",
      "clearBillOfMaterialError",
      "postBillOfMaterial",
      "putBillOfMaterial"
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
      // 仕損費データセット
      this.$refs.failure.setData(val.failure);
    },
    // デフォルト値設定
    setDefault() {
      this.setIncremental(this.defaultBillOfMaterial);
      this.setBillOfMaterial(this.defaultBillOfMaterial);
    },
    // 編集データ設定
    editBillOfMaterial() {
      this.setIncremental(this.billOfMaterial);
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
    // 部品表フォーム送信
    async submitBillOfMaterial() {
      let res = {};
      this.billOfMaterial.modifiedBy = this.loginUserData.id;
      // コンポーネントの編集ステータスに応じて新規と更新を切り替える
      if (this.$refs.dialog.editedIndex == -1) {
        // 新規追加時の処理
        res = await this.postBillOfMaterial(this.billOfMaterial);
      } else {
        // 更新時
        res = await this.putBillOfMaterial(this.billOfMaterial);
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
    }
  }
}
</script>

<style>

</style>
