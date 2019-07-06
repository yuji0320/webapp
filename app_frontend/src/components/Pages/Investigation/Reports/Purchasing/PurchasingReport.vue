<template>
  <v-container fluid grid-list-lg>

    <!-- 読み込み中ダイアログコンポーネント -->
    <app-loading-dialog></app-loading-dialog>

    <app-card>
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-title">Purchasing Report</span>

      <!-- 戻るボタン -->
      <span slot="card-header-buck-button">
        <v-btn @click="backToMenu" >
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
      </span>

    </app-card>
  </v-container>  
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Purchasing Report",
  name: "PurchasingReport",
  data() {
    return {}
  },
  computed: {
    
  },
  methods: {

    // 取引先別集計
    async searchByCustomer() {
      // this.orderBy = "customer__name";
      // this.summaryBy = "customer";
      let res = await this.getObjects();
    },
    // 月別集計
    async searchByMonth() {
      // this.orderBy = "-completion_date";
      // this.summaryBy = "month";
      let res = await this.getObjects();
    },
    // 集計データ取得
    async getObjects() {
      // 検索パラメーター
      let params = {
        company: this.loginUserData.companyId,
        // bill_date_after: this.date_from,
        // bill_date_before: this.date_to,
        order_by: this.orderBy,
        page_size: "max"
      }
      this.$store.commit("systemConfig/setLoading", true);
      // let res = await this.getJobOrders({params: params});
      this.$store.commit("systemConfig/setLoading", false);
      return res;
    },
    // 印刷
    print() {
      console.log("print");
      // let headerText = "Sales Summary by Period : " + this.date_from + " to " + this.date_to;
      // 子コンポーネントの印刷関数を呼び出し
      // this.printPDF(this.createPdfData(headerText));
      // console.log(this.createPdfData());
    },
    backToMenu() {
      this.$router.push({ name: "ReportsMenu" });
    }
  },
  created () {
    this.$store.commit("systemConfig/setLoading", false);
  }
}
</script>

<style>

</style>
