<template>
  <v-container fluid grid-list-lg>

    <!-- 読み込み中ダイアログコンポーネント -->
    <app-loading-dialog></app-loading-dialog>

    <v-card>
      <!-- Cardヘッダー -->
      <v-toolbar card>
        <v-toolbar-title class="font-weight-light">
          Sales by Period
        </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <!-- 検索フォーム -->
      <v-card-title>
        <v-layout row wrap>
          <!-- 検索開始日 -->
          <v-flex xs12 sm6 md3>
            <app-input-date label="Date from" v-model="date_from" appendOuterIcon="〜"></app-input-date>
          </v-flex>
          <!-- 検索終了日 -->
          <v-flex xs12 sm6 md3>
            <app-input-date label="Date to" v-model="date_to"></app-input-date>
          </v-flex>
          <!-- 検索ボタン -->
          <v-flex xs12 md6>
            <!-- 取引先別集計 -->
            <v-btn 
              color="primary" 
              class="mb-2" 
              @click="searchByCustomer"
              :disabled = "date_from === '' || date_to === '' "
            >Search(Sort by Customer)</v-btn>
            <!-- 年月別集計 -->
            <v-btn 
              color="primary" 
              class="mb-2" 
              @click="searchByMonth"
              :disabled = "date_from === '' || date_to === '' "
            >Search(Sort by Month)</v-btn>
          </v-flex>
        </v-layout>
      </v-card-title>

      <!-- 検索結果表示 -->
      <v-card-text>
        <template v-if="jobOrders.results">
          <h2 class="text-xs-right">Total : {{ loginUserData.defaultCurrencyDisplay }} {{ totalPrice | moneyDelemiter }}</h2>
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

            <br><br>
            
          </div>
        </template>

      </v-card-text>

      <!-- Cardフッター -->
      <v-footer 
        card
        height="auto"
      >
      </v-footer>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Sales by Period",
  name: "SalesByPeriod",
  data() {
    return {
      date_from: "2018-04-01",
      date_to: "2019-03-31",
      orderBy: "-completion_date",
      summaryBy: "",
      // テーブルヘッダーデータ
      headers: [
        { text: "MFG No", value: "mfgNo" },
        { text: "Product Name", value: "name" },
        { text: "Delivery", value: "deliveryDestinationData", nest: "abbr" },
        { text: "Customer", value: "customerData", nest: "abbr" },
        { text: "Completion Date", value: "completionDate" },
        { text: "Order price", value: "defaultCurrencyOrderAmount", class: "text-xs-right"}
      ],
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
          // console.log(total);
        }
        total = Math.round( total * 100) / 100;
      }
      return total;
    },
    // 取引先リスト
    customerList() {
      let customerList = [];
      // リストの作成
      if(this.jobOrders.results) {
        // 指図書データから取引先情報の抜き出し
        for(var i=0,d;d=this.jobOrders.results[i];i++){
          let array = {
            key: d.customerData.id,
            value: d.customerData.name,
          }
          customerList.push(array);
        }
        // 重複削除
        customerList = customerList.filter(function(v1,i1,a1){ 
          return (a1.findIndex(function(v2){ 
            return (v1.key===v2.key) 
          }) === i1);
        });
        // 取引先別集計
        for(var i=0,d;d=customerList[i];i++){
          let list = this.jobOrders.results.filter(x => x.customer === d.key);
          let total = list.reduce((p, x) => p + parseFloat(x.defaultCurrencyOrderAmount.replace(/,/g, "")), 0)
          d.subTotal = (Math.round( total * 100) / 100).toFixed(2);
          d.dataList = list;
        }
        // 名前順ソート
        customerList.sort(function(a,b){
            if(a.value<b.value) return -1;
            if(a.value > b.value) return 1;
            return 0;
        });
      }
      return customerList
    },
    // 範囲月リスト
    monthList(){
      let monthList = [];
      // リストの作成
      if(this.jobOrders.results) {
        // 指図書データから取引先情報の抜き出し
        for(var i=0,d;d=this.jobOrders.results[i];i++){
          let array = {
            key: d.completionDate.substr(0, 7),
            value: d.completionDate.substr(0, 7),
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
          let list = this.jobOrders.results.filter(x => x.completionDate.substr(0, 7) === d.key);
          let total = list.reduce((p, x) => p + parseFloat(x.defaultCurrencyOrderAmount.replace(/,/g, "")), 0)
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
    },
    summaryList() {
      if(this.summaryBy=="customer") {
        return this.customerList;
      } else {
        return this.monthList;
      }
    }
  },
  methods: {
    ...mapActions("jobOrderAPI", ["getJobOrders", "clearJobOrders"]),
    // 取引先別集計
    async searchByCustomer() {
      this.orderBy = "customer__name";
      this.summaryBy = "customer";
      let res = await this.getObjects();
    },
    // 月別集計
    async searchByMonth() {
      this.orderBy = "-completion_date";
      this.summaryBy = "month";
      let res = await this.getObjects();
    },
    // 集計データ取得
    async getObjects() {
      // 検索パラメーター
      let params = {
        company: this.loginUserData.companyId,
        completion_date_after: this.date_from,
        completion_date_before: this.date_to,
        order_by: this.orderBy,
        page_size: 1000
      }
      this.$store.commit("systemConfig/setLoading", true);
      let res = await this.getJobOrders({params: params});
      this.$store.commit("systemConfig/setLoading", false);
      return res;
    }
  },
  created () {
    // 集計データリセット
    this.clearJobOrders();
  }
}
</script>

<style>

</style>
