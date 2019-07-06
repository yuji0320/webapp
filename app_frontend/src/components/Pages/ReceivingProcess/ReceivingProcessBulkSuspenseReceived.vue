<template>
  <v-container>

    <!-- 読み込み中ダイアログコンポーネント -->
    <app-loading-dialog></app-loading-dialog>

    <!-- 仕入済、仮仕入未処理の部品の一括更新 -->
    <v-btn
      @click="update"
    >
      Bulk Suspense Received
    </v-btn>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {}
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("receivingProcessAPI", ["receivingProcesses"]),
    params() {
      return {
        company: this.loginUserData["companyId"],
        is_received: true,
        is_suspense_received:true,
        page_size: "max"
      }      
    },
    paramsSuspense() {
      return {
        company: this.loginUserData["companyId"],
        is_suspense_received: false,
        page_size: "max"
      }      
    }
  },
  methods: {
    ...mapActions("systemConfig", ["showSnackbar"]),
    ...mapActions("receivingProcessAPI", ["getReceivingProcesses", "putReceivingProcess"]),
    async update() {
      // ロード開始
      this.$store.commit("systemConfig/setLoading", true);

      await this.getReceivingProcesses({params: this.params});
      console.log(this.receivingProcesses);

      // レスポンス用変数の定義
      let res = {};
      for(let i=0,receive; receive = this.receivingProcesses.results[i]; i++){
        // 更新者データの反映
        receive.modifiedBy = this.loginUserData.id;
        receive.suspenseReceivedDate = receive.receivedDate;
        res = await this.putReceivingProcess(receive);
      }

      // 成功時のスナックバー定義
      res.snack = {
        color: "success",
        snack: "Update is success!"
      };

      this.showSnackbar(res.snack);

      await this.getReceivingProcesses({params: this.paramsSuspense});
      console.log(this.receivingProcesses);

      // ロード終了
      this.$store.commit("systemConfig/setLoading", false);
    },
    async checkSuspense() {
      await this.getReceivingProcesses({params: this.paramsSuspense});
      console.log(this.receivingProcesses);
    }
  },
  created () {
    this.$store.commit("systemConfig/setLoading", false);
    this.getReceivingProcesses({params: this.params});
  }
}
</script>

<style>

</style>
