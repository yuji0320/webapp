<template>
  <span>
    <!-- 読み込み中ダイアログコンポーネント -->
    <app-loading-dialog></app-loading-dialog>

    <!-- 工事完了済み、売上未計上の部品の一括更新 -->
    <v-btn
      @click="update"
    >
      Bulk Bill Date
    </v-btn>
  </span>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {}
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("jobOrderAPI", ["jobOrders"]),
    params() {
      return {
        company: this.loginUserData["companyId"],
        uncompleted: false,
        unbilled: true,
      }
    },
    paramsUnbilled() {
      return {
        company: this.loginUserData["companyId"],
        unbilled: false,
      }
    }
  },
  methods: {
    ...mapActions("systemConfig", ["showSnackbar"]),
    ...mapActions("jobOrderAPI", ["getJobOrders", "putJobOrder"]),
    async update() {
      // ロード開始
      this.$store.commit("systemConfig/setLoading", true);

      await this.getJobOrders({params: this.params});
      console.log(this.jobOrders);

      // レスポンス用変数の定義
      let res = {};
      for(let i=0,jobOrder; jobOrder = this.jobOrders.results[i]; i++){
        // 更新者データの反映
        jobOrder.modifiedBy = this.loginUserData.id;
        jobOrder.billDate = jobOrder.completionDate;
        res = await this.putJobOrder(jobOrder);
      }

      // 成功時のスナックバー定義
      res.snack = {
        color: "success",
        snack: "Update is success!"
      };

      this.showSnackbar(res.snack);

      await this.getJobOrders({params: this.paramsUnbilled});
      console.log(this.jobOrders);
      // ロード終了
      this.$store.commit("systemConfig/setLoading", false);
    }
  },
  created () {
    this.$store.commit("systemConfig/setLoading", false);
  }
}
</script>

<style>

</style>
