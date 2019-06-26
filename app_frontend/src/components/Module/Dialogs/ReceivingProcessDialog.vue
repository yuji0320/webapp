<template>
  <app-dialog
    :formName="'receivingProcessForm'"
    :hideButtons="true"
    parentTitle="Received"
    dialogWidth="600px"
    @submit-form="submitReceivingProcess"
    ref="dialog"
  >
    <!-- フォーム内容 -->
    <span slot="dialog-contents">
      <!-- 確認ダイアログ -->
      <app-confirm ref="confirm"></app-confirm>

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
        <!-- 工事番号 -->
        <v-flex xs2 md2>
          <v-text-field 
            label="MFG No"
            class="right-input"
            disabled
            v-model="mfgNo"
          ></v-text-field>
        </v-flex>
        <!-- 発注番号 -->
        <v-flex xs2 md2>
          <v-text-field 
            label="Order No"
            class="right-input"
            disabled
            v-model="number"
          ></v-text-field>
        </v-flex>
        <!-- 部品名 -->
        <v-flex xs12 md8>
          <v-text-field 
            label="Part Name"
            disabled
            v-model="partName"
          ></v-text-field>
        </v-flex>
        <!-- 仕入先 -->
        <v-flex xs12 md4>
          <v-text-field 
            label="Supplier"
            disabled
            v-model="supplier"
          ></v-text-field>
        </v-flex>
        <!-- 部品詳細 -->
        <v-flex xs12 md8>
          <v-text-field 
            label="Standard / Dwaring No"
            disabled
            v-model="receivingProcess.partsDetail"
          ></v-text-field>
        </v-flex>
        <!-- 個数 -->
        <v-flex xs12 md4>
          <v-text-field 
            label="Amount"
            v-model="receivingProcess.amount"
            class="right-input"
            :error-messages="responseError.amount"
          ></v-text-field>
        </v-flex>
        <!-- 単位選択 -->
        <v-flex xs12 md8>
          <app-incremental-model-search
            label="Unit Type"
            orderBy="number"
            v-model="receivingProcess.unit"
            searchType="unitType"
            :errorMessages="responseError.unit"
            ref="unitType"
          ></app-incremental-model-search>
        </v-flex>
        <!-- 金額 -->
        <v-flex xs4>
          <v-text-field 
            label="Unit Price"
            v-model="receivingProcess.unitPrice"
            :error-messages="responseError.unitPrice"
            class="right-input"
            @blur="checkPrice"
          ></v-text-field >
        </v-flex>
        <!-- 通貨 -->
        <v-flex xs12 md8>
          <app-incremental-model-search
          label="Currency"
          orderBy="id"
          v-model="receivingProcess.currency"
          searchType="currency"
          :errorMessages="responseError.currency"
          ref="currency"
          ></app-incremental-model-search>
        </v-flex>
        <!-- レート -->
        <v-flex xs12 md4>
          <v-text-field 
            label="Rate"
            v-model="receivingProcess.rate"
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
            label="Received Date"
            v-model="receivingProcess.receivedDate"
            :errorMessages="responseError.receivedDate"
          ></app-input-date>
        </v-flex>   
      </v-layout>
    </span>

    <!-- 拡張ボタンスロット -->
    <span slot="expand-button">
        <slot name="edit-order"></slot>
    </span>
  </app-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      mfgNo: "",
      number: "",
      supplier: "",
      partName: ""
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("billOfMaterialAPI", ["billOfMaterial"]),
    ...mapState("makingOrderAPI", ["makingOrder"]),
    ...mapState("receivingProcessAPI", ["responseError", "receivingProcess"]),
  },
  methods: {
    ...mapActions("systemConfig", ["showSnackbar"]),
    ...mapActions("billOfMaterialAPI", ["setBillOfMaterial", "putBillOfMaterial"]),
    ...mapActions("makingOrderAPI", [ "setMakingOrder", "putMakingOrder" ]),
    ...mapActions("receivingProcessAPI", [ "putReceivingProcess", "setReceivingProcess", "clearReceivingProcessError"]),
    // 頭出しフォームに対するデータ反映
    setIncremental(val) {
      // 単位データセット
      this.$refs.unitType.setData(val.unit);
      // 通貨データセット
      this.$refs.currency.setData(val.currency);
    },
    setData(val) {
      this.mfgNo = val.orderData.mfgNo;
      this.number = val.orderData.number;
      this.supplier = val.orderData.supplierData.name;
      this.partName = val.orderData.name;
    },
    // 発注ファイル編集
    editReceivingProcess() {
      this.clearReceivingProcessError()
      this.setIncremental(this.receivingProcess);
      this.setData(this.receivingProcess);
      this.$refs.dialog.editForm();
    },
    async submitReceivingProcess() {
      let res = {};
      this.receivingProcess.modifiedBy = this.loginUserData.id;
      this.receivingProcess.order = this.receivingProcess.orderData.id;
      // console.log(this.receivingProcess);
      res = await this.putReceivingProcess(this.receivingProcess);
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
    },
    // 仕入ファイルと発注の金額差チェック
    async checkPrice() {
      let res = {};
      let received = this.receivingProcess.unitPrice
      let order = this.receivingProcess.orderData.unitPrice;
      let bom = this.receivingProcess.orderData.billOfMaterial.unitPrice;
      if(received!=order) {
        // 発注ファイルと部品表で単価が違う場合
        // アラート文
        let alertText = ("'\Receiving's unit price is '" + received.replace(/(\d)(?=(\d{3})+($|\.\d+))/g , '$1,') + 
                        "'\nOrder's unit price is '" + order.replace(/(\d)(?=(\d{3})+($|\.\d+))/g , '$1,') + 
                        "'\nBOM's unit price is   '" + bom.replace(/(\d)(?=(\d{3})+($|\.\d+))/g , '$1,') + "'" + 
                        "\nAre you sure change Order's unit price and Bill ob material's unit price?")
        if (
          await this.$refs.confirm.open(
            "Unit Price is different!",
            alertText,
            { color: "blue" }
          )
        ) {
          // Yesの場合は上書き処理
          // 部品表の編集
          this.setBillOfMaterial(this.receivingProcess.orderData.billOfMaterial);
          this.billOfMaterial.unitPrice = received;
          this.billOfMaterial.modifiedBy = this.loginUserData.id;
          res = await this.putBillOfMaterial(this.billOfMaterial);
          // 発注ファイルの上書き
          this.setMakingOrder(this.receivingProcess.orderData);
          this.makingOrder.unitPrice = received;
          this.makingOrder.modifiedBy = this.loginUserData.id;
          this.makingOrder.billOfMaterialId = this.receivingProcess.orderData.billOfMaterial.id;
          this.receivingProcess.orderData = this.makingOrder;
          res = await this.putMakingOrder(this.makingOrder);
          this.showSnackbar(res.snack);
        } else {
          // Noの場合はスナックバーにキャンセルの旨を表示
          res.snack = { snack: "Price is not changed." };
          this.showSnackbar(res.snack);
        }
      } else {
        // 単価が同じ場合は処理しない
      }
    }
  }
}
</script>

<style>

</style>
