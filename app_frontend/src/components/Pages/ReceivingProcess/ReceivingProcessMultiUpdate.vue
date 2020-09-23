<template>
  <app-dialog
    :formName="'receivingProcessForm'"
    :hideButtons="true"
    dialogTitle="Multi Update"
    dialogWidth="600px"
    @submit-form="multiUpdate"
    ref="dialog"
  >
    <span slot="dialog-contents">

      <!-- 読み込み中ダイアログコンポーネント -->
      <app-loading-dialog></app-loading-dialog>

      <v-layout wrap>
        <!-- 仮仕入日 -->
        <v-flex xs12 md6>
          <app-input-date 
            label="Suspense Received Date"
            v-model="date"
          ></app-input-date>
        </v-flex>   
      </v-layout>
    </span>
  </app-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Dialog from '@/components/Module/Dialogs/Dialog.vue';

export default {
  data() {
    return {
      date: "",
      // dateIsAble: true
    };
  },
  components: {
    "app-dialog": Dialog,
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("receivingProcessAPI", ["receivingProcess", "tableSelected"]),
    // 一つ以上選択されている場合のみTrueを返す
    selectedDataExists() {
      return this.tableSelected.length > 0;
    }
  },
  methods: {
    ...mapActions("systemConfig", ["showSnackbar"]),
    ...mapActions("receivingProcessAPI", ["putReceivingProcess"]),
    // ダイアログオープン
    openDialog() {
      // ダイアログを開いた際にデータをリセット
      this.date = "";
      // ダイアログオープン
      this.$refs.dialog.editForm();
    },
    async multiUpdate() {
      // データが選択済みかどうかで処理を分岐
      if(this.selectedDataExists) {
        // ロード開始
        this.$store.commit("systemConfig/setLoading", true);
        // レスポンス用変数の定義
        let res = {};
        for(let i=0,receive; receive = this.tableSelected[i]; i++){
          // 更新者データの反映
          receive.modifiedBy = this.loginUserData.id;
          receive.suspenseReceivedDate = this.date;
          res = await this.putReceivingProcess(receive);
        }
        // 成功時のスナックバー定義
        res.snack = {
          color: "success",
          snack: "Update is success!"
        };
        // 処理統合関数の呼び出し
        this.$emit("response-function", res);
        // console.log(res);
        // ロード終了
        this.$store.commit("systemConfig/setLoading", false);
        // ダイアログを閉じる
        this.$refs.dialog.closeDialog();

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
