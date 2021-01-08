<template>
  <app-dialog
    :formName="'inventoryMasterForm'"
    :hideButtons="hideButtons"
    parentTitle="Inventory Master"
    @clear-form="clearInventoryMaster"
    @submit-form="submitInventoryMaster"
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
        <!-- 在庫マスタフォーム -->

        <!-- 部品名 -->
        <v-col cols="12">
          <v-text-field 
            label="Part Name*"
            v-model="inventoryMaster.name"
            :error-messages="responseError.name"
            :disabled="editDisable"
          ></v-text-field>
        </v-col>
        <!-- メーカー選択 -->
        <v-col cols="12">
          <app-incremental-model-search
            label="Manufacturer"
            orderBy="name"
            v-model="inventoryMaster.manufacturer"
            searchType="partner"
            filter="manufacturer"
            :errorMessages="responseError.manufacturer"
            ref="manufacturer"
            :disabled="editDisable"
          ></app-incremental-model-search>
        </v-col>
        <!-- 規格・寸法 -->
        <v-col cols="12" md="6" class="pr-2">
          <v-text-field 
            label="Standard/Form"
            v-model="inventoryMaster.standard"
            :error-messages="responseError.standard"
            :disabled="editDisable"
          ></v-text-field>
        </v-col>
        <!-- 材質 -->
        <v-col cols="12" md="6" class="pr-2">
          <v-text-field 
            label="Material"
            v-model="inventoryMaster.material"
            :error-messages="responseError.material"
            :disabled="editDisable"
          ></v-text-field>
        </v-col>
        <!-- 単位選択 -->
        <v-col cols="12" md="8">
          <app-incremental-model-search
            label="Unit Type"
            orderBy="number"
            v-model="inventoryMaster.unit"
            searchType="unitType"
            :errorMessages="responseError.unit"
            ref="unitType"
            :disabled="editDisable"
          ></app-incremental-model-search>
        </v-col>
        <!-- メモ -->
        <v-col cols="12">
          <v-textarea
            label="Notes"
            v-model="inventoryMaster.notes"
            :error-messages="responseError.notes"
            :disabled="editDisable"
          ></v-textarea>
        </v-col>


      </v-row>
    </span>
  </app-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Dialog from '@/components/Module/Dialogs/Dialog.vue';

export default {
  name: "InventoryMasterDialog",
  props: {
    hideButtons: { required: false },
    editDisable: { required: false },
  },
  components: {
    "app-dialog": Dialog,
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["unitTypes"]),
    ...mapState("inventoryDataAPI", ["responseError","inventoryMaster"]),
    // 在庫部品デフォルト値
    defaultInventoryMaster() {
      // 単位デフォルト値取得
      let unitType = this.unitTypes.results[0].id;
      // デフォルト配列作成
      let array = {
        company: this.loginUserData.companyId,
        unit: unitType,
        createdBy: this.loginUserData.id
      }
      return array;
    }
  },
  methods: {
    ...mapActions("systemConfig", ["showSnackbar", "moneySetting"]),
    ...mapActions("inventoryDataAPI", [
      "setInventoryMaster",
      "clearInventoryMasterError",
      "postInventoryMaster",
      "putInventoryMaster"
    ]),
    // 頭出しフォームに対するデータ反映
    setIncremental(val) {
      // console.log(val);
      // メーカーデータをセット
      this.$refs.manufacturer.setData(val.manufacturer);
      // 単位データセット
      this.$refs.unitType.setData(val.unit);
    },
    // デフォルト値設定
    setDefault() {
      let defaultData = Object.assign({},this.defaultInventoryMaster);
      this.setIncremental(defaultData);
      this.setInventoryMaster(defaultData);
    },
    // 編集データ設定
    openDialogIM() {
      this.setIncremental(this.inventoryMaster);
      this.$refs.dialog.editForm();
    },
    // フォームおよび子コンポーネントのデータクリア
    clearInventoryMaster() {
      // エラーをクリア
      this.clearInventoryMasterError();
      // データをクリア
      this.setInventoryMaster({});
      // メーカーデータを削除
      this.$refs.manufacturer.clearItem();
    },
    // 在庫部品フォーム送信
    async submitInventoryMaster() {
      let res = {};
      this.inventoryMaster.modifiedBy = this.loginUserData.id;
      // コンポーネントの編集ステータスに応じて新規と更新を切り替える
      if (this.$refs.dialog.editedIndex == -1) {
        // 新規追加時の処理
        res = await this.postInventoryMaster(this.inventoryMaster);
      } else {
        // 更新時
        res = await this.putInventoryMaster(this.inventoryMaster);
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
    // console.log("mounted im Dialog");
  }
}
</script>
