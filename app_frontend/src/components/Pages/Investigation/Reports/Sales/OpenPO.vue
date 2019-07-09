<template>
  <v-container fluid grid-list-lg>

    <!-- 読み込み中ダイアログコンポーネント -->
    <app-loading-dialog></app-loading-dialog>

    <app-card>
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-title">Open PO</span>

      <!-- 戻るボタン -->
      <span slot="card-header-buck-button">
        <v-btn @click="backToMenu" >
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
      </span>

      <!-- 印刷ボタン -->
      <span slot="card-header-buck-button">
        <v-btn 
          @click="print" 
          color="primary"
          :disabled = "summaryList.length === 0"
        ><v-icon>print</v-icon> Print</v-btn>
      </span>

      <span slot="search-bar">
        <v-layout row wrap>
          <!-- 検索開始日 -->
          <v-flex xs12 sm6 md3>
            <app-input-date label="Date" v-model="date"></app-input-date>
          </v-flex>
          <!-- 検索ボタン -->
          <v-flex xs12 md6>
            <!-- 年月別集計 -->
            <v-btn 
              color="primary" 
              class="mb-2" 
              @click="search"
              :disabled = "date === '' "
            >Search</v-btn>
          </v-flex>
        </v-layout>
      </span>

      <span slot="card-content">
        <template v-if="jobOrders.results">
          <h2 class="text-xs-right">Grand Total : {{ loginUserData.defaultCurrencyDisplay }} {{ totalPrice | moneyDelemiter }}</h2>
          <div
            v-for="(list, id) in summaryList"
            :key="id"
          >
            <!-- 項目名 -->
            <h2 class="title font-weight-light">{{ list.value }}</h2>
            <!-- テーブル表示 -->
            <app-data-table
              :headers="headers"
              :items="list.dataList"
              :footer="true"
            >
              <span slot="data-table-footer">
                <strong>Sub Total : {{ loginUserData.defaultCurrencyDisplay }} {{ list.subTotal | moneyDelemiter }}</strong>
              </span>
            </app-data-table>
            <!-- レイアウト調整用改行タグ -->
            <br><br>
          </div>
          <h2 class="text-xs-right">Grand Total : {{ loginUserData.defaultCurrencyDisplay }} {{ totalPrice | moneyDelemiter }}</h2>
        </template>
      </span>

    </app-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import SalesReportCreatePDFMixin from "./SalesReportCreatePDFMixin.js"

export default {
  title: "Open PO",
  name: "OpenPO",
  mixins: [SalesReportCreatePDFMixin],
  data() {
    return {
      date: "2019-03-31",
      // テーブルヘッダーデータ
      headers: [
        { text: "MFG No", value: "mfgNo" },
        { text: "Product Name", value: "name" },
        { text: "Delivery", value: "deliveryDestinationData", nest: "abbr" },
        { text: "Customer", value: "customerData", nest: "abbr" },
        { text: "Delivery Date", value: "deliveryDate" },
        { text: "Order price", value: "defaultCurrencyOrderAmount", class: "text-xs-right"}
      ],
      orderBy: "delivery_date"
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("jobOrderAPI", ["jobOrders"]),
    // 合計金額計算
    totalPrice() {
      let total = 0;
      if(this.jobOrders.results) {
        for(var i=0,d;d=this.jobOrders.results[i];i++){
          let price = parseFloat(d.defaultCurrencyOrderAmount.replace(/,/g, ""));
          total += price;
        }
        total = Math.round( total * 100) / 100;
      }
      return total.toFixed(2);
    },
    // 月別リスト
    summaryList(){
      let monthList = [];
      // リストの作成
      if(this.jobOrders.results) {
        // 指図書データから取引先情報の抜き出し
        for(var i=0,d;d=this.jobOrders.results[i];i++){
          let array = {
            key: d.deliveryDate.substr(0, 7),
            value: d.deliveryDate.substr(0, 7),
          }
          monthList.push(array);
        }
        // 重複削除
        monthList = monthList.filter(function(v1,i1,a1){ 
          return (a1.findIndex(function(v2){ 
            return (v1.key===v2.key) 
          }) === i1);
        });
        // 年月別集計
        for(var i=0,d;d=monthList[i];i++){
          let list = this.jobOrders.results.filter(x => x.deliveryDate.substr(0, 7) === d.key);
          let total = list.reduce((p, x) => p + parseFloat(x.defaultCurrencyOrderAmount.replace(/,/g, "")), 0);
          d.subTotal = (Math.round( total * 100) / 100).toFixed(2);
          d.dataList = list;
        }
        // 年月順ソート
        monthList.sort(function(a,b){
            if(a.value<b.value) return -1;
            if(a.value > b.value) return 1;
            return 0;
        });
      }
      return monthList
    }
  },
  methods: {
    ...mapActions("jobOrderAPI", ["getJobOrders", "clearJobOrders"]),
    // 月別集計
    async search() {
      this.orderBy = "-completion_date";
      let res = await this.getObjects();
    },
    // 集計データ取得
    async getObjects() {
      // 検索パラメーター
      let params = {
        company: this.loginUserData.companyId,
        search_open_po: this.date,
        delivery_date_isnull: false,
        order_date_isnull:false,
        order_by: this.orderBy,
        page_size: "max"
      }
      this.$store.commit("systemConfig/setLoading", true);
      let res = await this.getJobOrders({params: params});
      this.$store.commit("systemConfig/setLoading", false);
      return res;
    },
    // 印刷
    print() {
      let headerText = "Open PO at " + this.date;
      // 子コンポーネントの印刷関数を呼び出し
      this.printPDF(this.createPdfData(headerText));
    },
    backToMenu() {
      this.$router.push({ name: "ReportsMenu" });
    }
  },
  created () {
    // 集計データリセット
    this.clearJobOrders();
    // 読み込みの初期化
    this.$store.commit("systemConfig/setLoading", false);
  }
}
</script>

<style>

</style>
