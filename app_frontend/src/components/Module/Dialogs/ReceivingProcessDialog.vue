<template>
  <app-dialog
    :formName="'receivingProcessForm'"
    :hideButtons="true"
    parentTitle="Received"
    dialogWidth="600px"
    @submit-form="submitReceivingProcess"
    ref="dialog"
    :editDisable="editDisable"
    eager
  >
    <!-- フォーム内容 -->
    <span slot="dialog-contents">
      <!-- 確認ダイアログ -->
      <app-confirm ref="confirm"></app-confirm>

      <v-row>
        <!-- エラー表示 -->
        <v-col cols="12">
          <v-alert 
            value="true"
            type="error"
            v-if="responseError['nonFieldErrors']"
          >
            <li
              v-for="(error, index) in responseError['nonFieldErrors']"
              :key="index"
            >
              {{ error }}
            </li>
          </v-alert>
        </v-col>
        <!-- 工事番号 -->
        <v-col cols="12" xs="2" md="2">
          <v-text-field 
            label="MFG No"
            class="right-input"
            disabled
            v-model="mfgNo"
          ></v-text-field>
        </v-col>
        <!-- 発注番号 -->
        <v-col cols="12" xs="2" md="2">
          <v-text-field 
            label="Order No"
            class="right-input"
            disabled
            v-model="number"
          ></v-text-field>
        </v-col>
        <!-- 部品名 -->
        <v-col cols="12" md="8">
          <v-text-field 
            label="Part Name"
            disabled
            v-model="partName"
          ></v-text-field>
        </v-col>
        <!-- 仕入先 -->
        <v-col cols="12" md="4">
          <v-text-field 
            label="Supplier"
            disabled
            v-model="supplier"
          ></v-text-field>
        </v-col>
        <!-- 部品詳細 -->
        <v-col cols="12" md="8">
          <v-text-field 
            label="Standard / Drawing No"
            disabled
            v-model="receivingProcess.partDetail"
          ></v-text-field>
        </v-col>
        <!-- 個数 -->
        <v-col cols="12" md="4">
          <v-text-field 
            label="Amount"
            v-model="receivingProcess.amount"
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
            v-model="receivingProcess.unit"
            searchType="unitType"
            :errorMessages="responseError.unit"
            ref="unitType"
            :disabled="editDisable"
          ></app-incremental-model-search>
        </v-col>
        <!-- 金額 -->
        <v-col cols="12" xs="4">
          <v-text-field 
            label="Unit Price"
            v-model="receivingProcess.unitPrice"
            :error-messages="responseError.unitPrice"
            class="right-input"
            @blur="checkPrice"
            :disabled="editDisable"
          ></v-text-field >
        </v-col>
        <!-- 通貨 -->
        <v-col cols="12" md="8">
          <app-incremental-model-search
            label="Currency"
            orderBy="id"
            v-model="receivingProcess.currency"
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
            v-model="receivingProcess.rate"
            :error-messages="responseError.rate"
            :suffix="loginUserData['defaultCurrencyCode']"
            hint="1 Order currency = "
            :persistent-hint="true"
            class="right-input"
            :disabled="editDisable"
          ></v-text-field >
        </v-col>
        <!-- 希望納期 -->
        <v-col cols="12" md="6">
          <app-input-date 
            label="Suspense Received Date"
            v-model="receivingProcess['suspenseReceivedDate']"
            :errorMessages="responseError['suspenseReceivedDate']"
            :disabled="editDisable"
          ></app-input-date>
        </v-col>
        <!-- 仕入日 -->
        <v-col cols="12" md="6">
          <app-input-date 
            label="Received Date"
            v-model="receivingProcess['receivedDate']"
            :errorMessages="responseError['receivedDate']"
            :disabled="editDisable"
          ></app-input-date>
        </v-col>   
      </v-row>
    </span>

    <!-- 拡張ボタンスロット -->
    <span slot="expand-button">
        <slot name="edit-order"></slot>
    </span>
  </app-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Dialog from '@/components/Module/Dialogs/Dialog.vue';

export default {
  data() {
    return {
      mfgNo: "",
      number: "",
      supplier: "",
      partName: ""
    }
  },
  components: {
    "app-dialog": Dialog,
  },
  props: {
    editDisable: { required: false },
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("billOfMaterialAPI", ["billOfMaterial"]),
    ...mapState("makingOrderAPI", ["makingOrder"]),
    ...mapState("receivingProcessAPI", ["responseError", "receivingProcess"]),
    partsDetail() {
      if(this.receivingProcess.orderData){
        return this.receivingProcess.orderData.partsDetail;
      } else {
        return "";
      }
    }
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
      // console.log(val);
      this.mfgNo = val.mfgNo;
      this.number = val.orderNumber;
      this.supplier = val.supplierAbbr;
      this.partName = val.partName;
    },
    // 発注ファイル編集
    openDialogReceive() {
      this.clearReceivingProcessError();
      this.setIncremental(this.receivingProcess);
      this.setData(this.receivingProcess);
      this.$refs.dialog.editForm();
      // console.log(this.receivingProcess);
    },
    async submitReceivingProcess() {
      let res = {};
      this.receivingProcess.modifiedBy = this.loginUserData.id;
      this.receivingProcess.order = this.receivingProcess.order;
      // 日付がブランクの場合nullをセットおする
      if(this.receivingProcess.suspenseReceivedDate==="") {
        this.receivingProcess.suspenseReceivedDate = null
      }
      if(this.receivingProcess.receivedDate==="") {
        this.receivingProcess.receivedDate = null
      }

      // 金額一致確認
      let check = await this.checkPrice();
      // console.log(check);

      if(check) {
        // console.log("OK");
        // 発注金額と仕入金額が一致しているor空白の場合は更新処理
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

      } else {
          // Noの場合はスナックバーにキャンセルの旨を表示
          res.snack = { snack: "Update is Failed" };
          this.showSnackbar(res.snack);
      }
    },
    // 仕入ファイルと発注の金額差チェック
    async checkPrice() {
      let res = {};
      let received = parseFloat(this.receivingProcess.unitPrice);
      let order = this.receivingProcess.orderPrice;
      // 値が0の場合はnullを代入
      if(received===0) {
        this.receivingProcess.unitPrice = null;
      }
      if(received!==order && received) {
        // 発注ファイルと部品表で単価が違う場合        
        // アラート文
        let alertText = ("'\Receiving's unit price is '" + parseFloat(received).toFixed(2).toString().replace(/(\d)(?=(\d{3})+($|\.\d+))/g , '$1,') +
                "'\nOrder's unit price is '" + order.toFixed(2).toString().replace(/(\d)(?=(\d{3})+($|\.\d+))/g , '$1,') + "'" +
                "\nYou have to edit Order data first");
        if (
          await this.$refs.confirm.open(
            "Unit Price is different!",
            alertText,
            { color: "blue" }
          )
        ) {
          // 同意した場合はnullを代入
          this.receivingProcess.unitPrice = null;
          return false;
        } else {
          // Noの場合はスナックバーにキャンセルの旨を表示
          res.snack = { snack: "Price is not changed." };
          this.showSnackbar(res.snack);
          return false;
        }
      } else {
        // 単価が同じ場合は処理しない
        return true;
      }
    }
  }
}
</script>

<style>

</style>
