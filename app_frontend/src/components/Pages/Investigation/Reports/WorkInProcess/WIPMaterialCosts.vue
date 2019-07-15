<template>
  <v-container fluid grid-list-lg>

    <!-- 読み込み中ダイアログコンポーネント -->
    <app-loading-dialog></app-loading-dialog>

    <app-card>
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-title">Work In Process (Material Costs)</span>

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
          :disabled="dataList.length === 0"
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
        <h2 class="text-xs-right">Grand Total : {{ loginUserData.defaultCurrencyDisplay }} {{ grandTotal | moneyDelemiter }}</h2>
        <app-data-table
          :headers="tableHeaders"
          :items="dataList"
          :footer="true"
        >
        </app-data-table>
      </span>
    </app-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import WIPMaterialPrint from "./WIPMaterialPrint.js"

export default {
  title: "WIP Material Costs",
  name: "WIPMaterialCosts",
  mixins: [WIPMaterialPrint],
  data () {
    return {
      date: "2019-03-31",
      defaultHeaders: [
        { text: "MFG No", value: "mfgNo" },
        { text: "Product Name", value: "name" },
        { text: "Delivery Date", value: "deliveryDate" },
        { text: "Sale price", value: "defaultCurrencyOrderAmount", class: "text-xs-right"},
      ],
      totalCol: {text: "Total", value: "totalArray", nest: "total", class: "text-xs-right"},
      dataList: [],
      grandTotal: 0
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["expenseCategories"]),
    ...mapState("jobOrderAPI", ["jobOrders"]),
    ...mapState("receivingProcessAPI", ["receivingProcesses", "receivingProcess"]),
    params() {
      return {
        company: this.loginUserData.companyId,
        search_open_po: this.date,
        delivery_date_isnull: false,
        order_date_isnull:false,
        // order_date_before: this.date,
        order_by: "delivery_date",
        page_size: 100000
      }
    },
    // テーブルヘッダー作成
    tableHeaders() {
      let headerList = [];
      // headerList.concat();
      if(this.expenseCategories.results) {
        let list = this.expenseCategories.results;
        for (let i=0,expense; expense=list[i]; i++) {
          let col = {
            text: expense.categoryName,
            value: "totalArray",
            nest: expense.id,
            class: "text-xs-right"
          };
          headerList.push(col);
        }
      }
      headerList.push(this.totalCol);
      let results = this.defaultHeaders.concat(headerList);
      return results
    }
  },
  methods: {
    ...mapActions("systemMasterApi", ["getExpenseCategories"]),
    ...mapActions("jobOrderAPI", ["getJobOrders", "clearJobOrders"]),
    ...mapActions("receivingProcessAPI", ["getReceivingProcesses", "setReceivingProcessesList"]),
    moneyComma(value) {
      return value.toString().replace(/(\d)(?=(\d{3})+($|\.\d+))/g, '$1,');
    },
    async search() {
      this.$store.commit("systemConfig/setLoading", true);
      this.dataList = await this.getJobOrderList();
      this.$store.commit("systemConfig/setLoading", false);
    },
    // 作業指図書情報取得
    async getJobOrderList() {
      let res = await this.getJobOrders({params: this.params});
      let dataList = res.results;
      for(let i=0, JobOrder; JobOrder=dataList[i]; i++) {
        // 仕入データ取得
        JobOrder.totalArray = await this.getReceivedList(JobOrder.id);
      }
      // 総合計の計算
      let grandTotalArray = {};
      grandTotalArray.total = this.moneyComma(dataList.reduce((p, x) => p + parseFloat(x.totalArray.total.replace(/,/g, "")), 0).toFixed(2));
      for(let c=0,category; category=this.expenseCategories.results[c]; c++) {
        grandTotalArray[category.id] = this.moneyComma(dataList.reduce((p, x) => p + parseFloat(x.totalArray[category.id].replace(/,/g, "")), 0).toFixed(2));
      }
      let defaultCurrencyOrderAmount = this.moneyComma(dataList.reduce((p, x) => p + parseFloat(x.defaultCurrencyOrderAmount.replace(/,/g, "")), 0).toFixed(2));
      this.grandTotal = grandTotalArray.total;
      let totalData = {
        name:"Total",
        totalArray:grandTotalArray,
        defaultCurrencyOrderAmount: defaultCurrencyOrderAmount
      }
      dataList.push(totalData);
      return dataList;
    },
    // 仕入データ取得
    async getReceivedList(val) {
      // 工事番号を受け取って仕入データを検索
      let params = {
        company: this.loginUserData["companyId"],
        received_date_before: this.date,
        order__bill_of_material__job_order: val,
        page_size: 100000
      }
      let res = await this.getReceivingProcesses({params: params});
      let receivedList = res.results;
      // 集計用変数の定義
      let totalArray = {};
      let totalPlice = 0;
      // 部品種別ごとに集計
      for(let c=0,category; category=this.expenseCategories.results[c]; c++) {
        // カテゴリごとの合計計算
        let categoryList = receivedList.filter(x => x.orderData.billOfMaterial.type === category.id);
        let total = categoryList.reduce((p, x) => p + parseFloat(x.orderData.totalDefaultCurrencyPrice), 0);
        // 工事番号ごとの集計
        totalPlice += total
        totalArray[category.id] = this.moneyComma(total.toFixed(2));
      }
      totalArray.total = this.moneyComma(totalPlice.toFixed(2));
      return totalArray
    },
    print() {
      // let res = this.createPdfData();
      // console.log(res);
      this.printPDF(this.createPdfData());
    },
    backToMenu() {
      this.$router.push({ name: "ReportsMenu" });
    }
  },
  created () {
    // 計算対象カテゴリー取得
    this.getExpenseCategories({params: {is_calculate:true, order_by:"category_number"}});
    // // 集計データリセット
    this.clearJobOrders();
    // 読み込みの初期化
    this.$store.commit("systemConfig/setLoading", false);
    // 本日日付のインプット
    this.date = this.todayISO;
  }
}
</script>

<style>

</style>
