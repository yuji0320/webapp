<template>
    <app-dialog
    :formName="'LocationMasterForm'"
    :hideButtons="hideButtons"
    parentTitle="Location Master"
    @clear-form="clearLocationMaster"
    @submit-form="submitLocationMaster"
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
        <!-- 保存場所マスタフォーム -->
        <!-- 保存場所番号 -->
        <v-col cols="12">
          <v-text-field 
            label="Location Number*"
            v-model="locationMaster.number"
            :error-messages="responseError.number"
            :disabled="editDisable"
          ></v-text-field>
        </v-col>
        <!-- 保存場所名称-->
        <v-col cols="12">
          <v-text-field 
            label="Location Name*"
            v-model="locationMaster.name"
            :error-messages="responseError.name"
            :disabled="editDisable"
          ></v-text-field>
        </v-col>
        <!-- メモ -->
        <v-col cols="12">
          <v-textarea
            label="Notes"
            v-model="locationMaster.notes"
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
  name: "LocationMasterDialog",
  props: {
    hideButtons: { required: false },
    editDisable: { required: false },
  },
  components: {
    "app-dialog": Dialog,
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("inventoryDataAPI", ["responseError","locationMaster"]),
    // 在庫部品デフォルト値
    defaultLocationMaster() {
      // デフォルト配列作成
      let array = {
        company: this.loginUserData.companyId,
        createdBy: this.loginUserData.id
      }
      return array;
    }
  },
  methods: {
    ...mapActions("systemConfig", ["showSnackbar", "moneySetting"]),
    ...mapActions("inventoryDataAPI", [
      "setLocationMaster",
      "clearInventoryMasterError",
      "postLocationMaster",
      "putLocationMaster"
    ]),
    // デフォルト値設定
    setDefault() {
      let defaultData = Object.assign({},this.defaultLocationMaster);
      console.log(defaultData);
      this.setLocationMaster(defaultData);
    },
    // 編集データ設定
    openDialogLM() {
      // this.setIncremental(this.locationMaster);
      this.$refs.dialog.editForm();
    },
    // フォームおよび子コンポーネントのデータクリア
    clearLocationMaster() {
      // エラーをクリア
      this.clearInventoryMasterError();
      // データをクリア
      this.setLocationMaster({});
    },
    // 在庫部品フォーム送信
    async submitLocationMaster() {
      let res = {};
      this.locationMaster.modifiedBy = this.loginUserData.id;
      // コンポーネントの編集ステータスに応じて新規と更新を切り替える
      if (this.$refs.dialog.editedIndex == -1) {
        // 新規追加時の処理
        res = await this.postLocationMaster(this.locationMaster);
      } else {
        // 更新時
        res = await this.putLocationMaster(this.locationMaster);
      }
      if (res.data) {
        // 更新成功時はモーダルを閉じる
        if (this.$refs.dialog.editedIndex == -1) {
          this.clearLocationMaster();
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
    // console.log("mounted lm Dialog");
  }
}
</script>