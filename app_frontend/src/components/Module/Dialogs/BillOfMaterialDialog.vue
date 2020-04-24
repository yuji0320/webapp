<template>
  <app-dialog
    :formName="'billOfMaterialForm'"
    :hideButtons="hideButtons"
    parentTitle="Bill of Material"
    @clear-form="clearBillOfMaterial"
    @submit-form="submitBillOfMaterial"
    @set-default="setDefault"
    ref="dialog"
    :editDisable="editDisable"
  >
    <!-- フォーム内容 -->
    <span slot="dialog-contents">
      <v-row no-gutters>
        <!-- エラー表示 -->
        <v-col cols="12">
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
        </v-col>
        <!-- 部品表フォーム -->
        <v-col cols="12">
          <v-text-field 
            label="Part Name*"
            v-model="billOfMaterial.name"
            :error-messages="responseError.name"
            :disabled="editDisable"
          ></v-text-field>
        </v-col>

        <!-- <template v-if="this.expenseCategory.isProcessedParts"> -->
        <!-- 図面番号 -->
        <v-col cols="12" v-show="isProcessedParts">
          <v-text-field 
            label="Drawing Number"
            v-model="billOfMaterial.drawingNumber"
            :error-messages="responseError.drawingNumber"
            :disabled="editDisable"
          ></v-text-field>
        </v-col>
        <!-- 材質 -->
        <v-col cols="12" md="6" v-show="isProcessedParts" class="pr-2">
          <v-text-field 
            label="Material"
            v-model="billOfMaterial.material"
            :error-messages="responseError.material"
            :disabled="editDisable"
          ></v-text-field>
        </v-col>
        <!-- 表面処理 -->
        <v-col cols="12" md="6" v-show="isProcessedParts">
          <v-text-field 
            label="Surface treatment"
            v-model="billOfMaterial.surfaceTreatment"
            :error-messages="responseError.surfaceTreatment"
            :disabled="editDisable"
          ></v-text-field>
        </v-col>
        <!-- </template> -->

        <!-- <template v-else> -->
          <!-- メーカー選択 -->
          <v-col cols="12" v-show="!isProcessedParts">
            <app-incremental-model-search
              label="Manufacturer"
              orderBy="name"
              v-model="billOfMaterial.manufacturer"
              searchType="partner"
              filter="manufacturer"
              :errorMessages="responseError.manufacturer"
              ref="manufacturer"
              :disabled="editDisable"
            ></app-incremental-model-search>
          </v-col>
          <!-- 規格・寸法 -->
          <v-col cols="12" md="6" v-show="!isProcessedParts" class="pr-2">
            <v-text-field 
              label="Standard/Form"
              v-model="billOfMaterial.standard"
              :error-messages="responseError.standard"
              :disabled="editDisable"
            ></v-text-field>
          </v-col>
          <!-- ユニット番号 -->
          <v-col cols="12" md="6" v-show="!isProcessedParts">
            <v-text-field 
              label="Unit Number"
              v-model="billOfMaterial.unitNumber"
              :error-messages="responseError.unitNumber"
              :disabled="editDisable"
            ></v-text-field>
          </v-col>
        <!-- </template> -->

        <!-- 個数 -->
        <v-col cols="12" md="4">
          <v-text-field 
            label="Amount"
            v-model="billOfMaterial.amount"
            class="right-input"
            :error-messages="responseError.amount"
            :disabled="editDisable"
          ></v-text-field>
        </v-col>
        <!-- 単位選択 -->
        <v-col cols="12" md="8">
          <app-incremental-model-search
            label="Unit Type"
            orderBy="number"
            v-model="billOfMaterial.unit"
            searchType="unitType"
            :errorMessages="responseError.unit"
            ref="unitType"
            :disabled="editDisable"
          ></app-incremental-model-search>
        </v-col>
        <!-- 在庫充当個数 -->
        <v-col cols="12" md="4">
          <v-text-field 
            label="Stock Appropriation"
            v-model="billOfMaterial.stockAppropriation"
            class="right-input"
            :error-messages="responseError.stockAppropriation"
            :disabled="editDisable"
          ></v-text-field>
        </v-col> 
        <v-col cols="12" md="8">
        </v-col> 
        <!-- 金額 -->
        <v-col cols="12" md="4">
          <v-text-field 
            label="Unit Price"
            v-model="billOfMaterial.unitPrice"
            :error-messages="responseError.unitPrice"
            class="right-input"
            :disabled="editDisable"
          ></v-text-field >
        </v-col>
        <!-- 通貨 -->
        <v-col cols="12" md="8">
          <app-incremental-model-search
          label="Currency"
          orderBy="id"
          v-model="billOfMaterial.currency"
          searchType="currency"
          :errorMessages="responseError.currency"
          ref="currency"
          :disabled="editDisable"
          ></app-incremental-model-search>
        </v-col>
        <!-- レート -->
        <v-col cols="12" md="4">
          <v-text-field 
            label="Rate"
            v-model="billOfMaterial.rate"
            :error-messages="responseError.rate"
            :suffix="loginUserData.defaultCurrencyCode"
            hint="1 Order currency = "
            :persistent-hint="true"
            class="right-input mr-2"
            :disabled="editDisable"
          ></v-text-field >
        </v-col>
        <!-- 希望納期 -->
        <v-col cols="12" md="4">
          <app-input-date 
            label="Desired Delivery Date"
            v-model="billOfMaterial.desiredDeliveryDate"
            :errorMessages="responseError.desiredDeliveryDate"
            :disabled="editDisable"
          ></app-input-date >
        </v-col>       
        <!-- 支給品Boolern -->
        <v-col cols="12" md="8">
          <v-checkbox
            label="is Customer Supplied"
            v-model="billOfMaterial.isCustomerSupplied"
            :errorMessages="responseError.isCustomerSupplied"
            :disabled="editDisable"
          ></v-checkbox>
        </v-col>
        <!-- 仕損費種別 -->
        <v-col cols="12" md="8">
          <app-incremental-model-search
            label="Failure"
            orderBy="category_number"
            v-model="billOfMaterial.failure"
            searchType="failure"
            :errorMessages="responseError.failure"
            ref="failure"
            :disabled="editDisable"
          ></app-incremental-model-search>
        </v-col>
        <!-- メモ -->
        <v-col cols="12">
          <v-textarea
            label="Notes"
            v-model="billOfMaterial.notes"
            :error-messages="responseError.notes"
            :disabled="editDisable"
          ></v-textarea>
        </v-col>

        <!-- 部品種別選択 -->
        <v-col cols="12">
          <app-incremental-model-search
            label="Parts Type"
            orderBy="category_number"
            v-model="billOfMaterial.type"
            searchType="expenseCategory"
            :errorMessages="responseError.type"
            ref="type"
            :disabled="editDisable"
            hideClear="true"
          ></app-incremental-model-search>
        </v-col>

      </v-row>
    </span>
  </app-dialog>

</template>

<script>
import { mapState, mapActions } from "vuex";
import Dialog from '@/components/Module/Dialogs/Dialog.vue';

export default {
  props: {
    hideButtons: { required: false },
    editDisable: { required: false },
  },
  components: {
    "app-dialog": Dialog,
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
    },
    // 加工部品かどうか
    isProcessedParts() {
      if(this.billOfMaterial.isProcessed) {
        return true;
      } else {
        return false
      }
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
      // console.log(val);
      // メーカーデータをセット
      if(!this.isProcessedParts) {
        this.$refs.manufacturer.setData(val.manufacturer);
      }
      // 単位データセット
      this.$refs.unitType.setData(val.unit);
      // 通貨データセット
      this.$refs.currency.setData(val.currency);
      // 仕損費データセット
      this.$refs.failure.setData(val.failure);
      this.$refs.type.setData(val.type);
    },
    // デフォルト値設定
    setDefault() {
      this.setIncremental(this.defaultBillOfMaterial);
      this.setBillOfMaterial(this.defaultBillOfMaterial);
    },
    // 編集データ設定
    openDialogBOM() {
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
      // 希望納期がゼロの場合はnullを挿入
      if(this.billOfMaterial.desiredDeliveryDate === "") {
        this.billOfMaterial.desiredDeliveryDate = null
      }
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
  },
  mounted() {
    this.$refs.manufacturer.clearItem();
    // console.log("mounted BOM Dialog");
  }
}
</script>

<style>

</style>
