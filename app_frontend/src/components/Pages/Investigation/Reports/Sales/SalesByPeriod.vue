<template>
  <v-container fluid grid-list-lg>

    <!-- 読み込み中ダイアログコンポーネント -->
    <app-loading-dialog></app-loading-dialog>

    <app-card>
            <!-- ヘッダー部分スロット -->
      <span slot="card-header-title">Sales by Period</span>

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
          :disabled = "summaryBy === ''"
        ><v-icon>print</v-icon> Print</v-btn>
      </span>

      <span slot="search-bar">
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

export default {
  title: "Sales by Period",
  name: "SalesByPeriod",
  data() {
    return {
      date_from: "",
      date_to: "",
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
        for(let i=0,d;d=this.jobOrders.results[i];i++){
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
    },
    // PDF用ヘッダー
    headerList() {
      return function (val) {
        let headerArray = [];
        for(let key in val){
          let headerCol = {
            "text": val[key].text,
            "alignment": "center"
          }
          headerArray.push(headerCol);
        }
        return headerArray;
      }
    },
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
        page_size: max
      }
      this.$store.commit("systemConfig/setLoading", true);
      let res = await this.getJobOrders({params: params});
      this.$store.commit("systemConfig/setLoading", false);
      return res;
    },
    // 印刷用データ作成
    createPdfData() {
      // PDFヘッダー
      let headerText = "Sales Summary by Period : " + this.date_from + " to " + this.date_to;
      // テーブル用リストの宣言
      let tablebody = [];
      // ヘッダー作成
      let tableHeader = this.headerList(this.headers);
      let tableWidths = [40, 200, 70, 70, 50, 90]
      tablebody.push(tableHeader);
      // テーブル内容作成
      for(var s=0,summary;summary=this.summaryList[s];s++){
        // 作業指図書データの展開
        for(var d=0,data;data=summary.dataList[d];d++){
          // 行オブジェクトの定義
          let dataRow = [];
          // テーブルヘッダーを展開
          for(var h=0,head;head=this.headers[h];h++){
            // dataからヘッダーに該当するものを抜き出す
            let col = data[head.value];
            // データがネストしている場合はネスと先データを表示
            if(head.nest) {
              if(col) { col = col[head.nest];}
            }
            // 金額に通貨記号を付与
            if(head.value == "defaultCurrencyOrderAmount") {
              col = this.loginUserData.defaultCurrencyDisplay + " " + col 
            }
            // データが右寄せ(数値)の場合は右寄せ処理
            if(head.class=="text-xs-right") {
              col = {"text": col, alignment: "right"}
            }
            // データが未定義の場合はblankを入力
            if(!col) { col = ""; }
            dataRow.push(col);
          }
          // テーブルデータに行を追加
          tablebody.push(dataRow);
        }
        // 集計単位ごとの小計を表示
        let subTotalText = summary.value + "   Total : ";
        let subTotal = this.loginUserData.defaultCurrencyDisplay + " " + summary.subTotal.toString().replace(/(\d)(?=(\d{3})+($|\.\d+))/g , '$1,');
        let subtotalRow = [
          { colSpan: 5, text:subTotalText, alignment:"right", bold:true },'','','','',
          { text: subTotal , alignment:"right", bold:true }
        ]
        tablebody.push(subtotalRow);
      }
      // 合計表示
      let total = this.loginUserData.defaultCurrencyDisplay + " " + this.totalPrice.toString().replace(/(\d)(?=(\d{3})+($|\.\d+))/g , '$1,');
      let totalRow = [
        { colSpan: 5, text:"Grand Total : ", alignment:"right", bold:true },'','','','',
        { text: total , alignment:"right", bold:true }
      ]
      tablebody.push(totalRow);
      // テーブル定義
      let tableData = {
        table: {
          headerRows: 1,
          widths: tableWidths,
          body: tablebody
        }
      }
      // 出力データ整形
      let pdfData = {
        "headerText": headerText,
        "content": tableData
      }
      return pdfData;
    },
    // 印刷
    print() {
      // 子コンポーネントの印刷関数を呼び出し
      this.printPDF(this.createPdfData());
      // console.log(this.createPdfData());
    },
    backToMenu() {
      this.$router.push({ name: "ReportsMenu" });
    },
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
