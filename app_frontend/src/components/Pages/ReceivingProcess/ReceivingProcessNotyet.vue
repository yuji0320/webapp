<template>
  <v-container fluid grid-list-lg>
    <app-card-table
      :headers="headers"
      :items="receivingProcesses.results"
    >

      <!-- ヘッダー部分スロット -->
      <span slot="card-header-title"> Over date list</span>

      <!-- 戻るボタン -->
      <span slot="card-header-buck-button">
        <v-btn @click="backToMenu" >
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
      </span>

      <!-- カード上部検索機能コンポーネント -->
      <div slot="search-bar">
        <app-search-bar
          :length="receivingProcesses.pages"
          :count="receivingProcesses.count"
          :orderBy="orderBy"
          :incremental="incremental"
          :params="params"
          @search-list="getList"
        ></app-search-bar>
      </div>

    </app-card-table>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Over date list",
  name: "ReceivedProcessNotyet",
  data() {
    return {
      orderBy: "order__desired_delivery_date",
      // テーブルヘッダー
      headers: [
        { text: "No", value: "orderData" , nest: "number" },
        { text: "MFG No", value: "orderData" , nest: "mfgNo" },
        { text: "Part Name", value: "orderData" , nest: "name" },
        { text: "Supplier", value: "orderData" , nest: "supplierData", nestNest: "abbr" },
        { text: "Amount", value: "orderData" , nest: "amount", class: "text-xs-right" },
        { text: "Unit price", value: "orderData" , nest: "displayPrice", class: "text-xs-right" },
        { text: "Desired Delivery Date", value: "orderData" , nest: "desiredDeliveryDate", class: "text-xs-center" },
        // { text: "Ordered date", value: "orderData" , nest: "orderedDate" },
      ],
      // テーブル検索用データ
      incremental: {
        // 検索カラムリスト
        tableSelectItems: [
          { label: "Order Number", value: "order__number" },
        ],
        // 検索数値の初期値および返り値
        tableSelectValue: "order__number",
        tableSearch: ""
      }      
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("receivingProcessAPI", ["receivingProcesses"]),  
    // 今日の日付をISO形式で取得
    todayISO() {
      // 日付取得
      let dt = new Date();
      let year = dt.getFullYear();
      //1月が0、12月が11。そのため+1をする。
      let month = dt.getMonth()+1;
      let date = dt.getDate();
      let today = year + "-" + month + "-" + date;
      return today;
    },
    params() {
      return {
        order_company: this.loginUserData.companyId,
        is_received: false,
        desired_delivery_date_before: this.todayISO,
        order_by: this.orderBy,
      }
    }
  },
  methods: {
    ...mapActions("receivingProcessAPI", ["getReceivingProcesses"]),
    backToMenu() {
      this.$router.push({ name: "ReceivingProcessMenu" });
    },
    // リスト検索
    async getList(data) {
      this.$store.commit("systemConfig/setLoading", true);
      let list = await this.getReceivingProcesses(data);
      this.$store.commit("systemConfig/setLoading", false);
    },    
  },
  created() {
    // this.getReceivingProcesses({params: this.params});
    // console.log(this.params);
  }

}
</script>

<style>

</style>
