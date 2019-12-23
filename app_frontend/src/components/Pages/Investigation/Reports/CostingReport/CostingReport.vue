<template>
  <v-container fluid grid-list-lg>
    <!-- 読み込み中ダイアログコンポーネント -->
    <app-loading-dialog></app-loading-dialog>

    <app-card>
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-title">Costing Report</span>

      <!-- 戻るボタン -->
      <span slot="card-header-buck-button">
        <v-btn @click="backToMenu" >
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
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
              @click="search"
              :disabled = "date_from === '' || date_to === '' "
            >Search</v-btn>
          </v-flex>
        </v-layout>
      </span>

      <span slot="card-content">
        <h2 class="text-xs-right">Grand Total : {{ loginUserData.defaultCurrencyDisplay }} {{ grandTotal | moneyDelemiter }}</h2>
        <app-data-table
          :headers="headers"
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

export default {
  title: "Costing Report",
  name: "CostingReport",
  data () {
    return {
      // date_from: "2019-04-01",
      // date_to: "2019-04-30",
      date_from: "",
      date_to: "",
      orderBy: "-completion_date",
      headers: [
        { text: "MFG No", value: "mfgNo" },
        { text: "Product Name", value: "name" },
        { text: "Completion Date", value: "completionDate", class: "text-xs-center" },
        { text: "Sale price", value: "defaultCurrencyOrderAmount", class: "text-xs-right"},
        {text: "Direct Cost", value: "directCost", nest: "total", class: "text-xs-right"},
        {text: "Labor Cost", value: "laborCost", nest: "totalCosts", class: "text-xs-right"},
        {text: "Total Cost", value: "totalCost", class: "text-xs-right"},
        {text: "Cost Rate", value: "costRate", class: "text-xs-right"},
      ],
      dataList: [],
      grandTotal: 0
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["jobTypes"]),    
    ...mapState("systemMasterApi", ["expenseCategories"]),
    ...mapState("jobOrderAPI", ["jobOrders"]),
    ...mapState("billOfMaterialAPI", ["billOfMaterials"]),
    ...mapState("manHourAPI", ["manHours"]),
    ...mapState("systemUserApi", ["userCompany"]),
    // 工事番号検索用パラメーター
    params() {
      return {
        company: this.loginUserData.companyId,
        delivery_date_isnull: false,
        order_date_isnull:false,
        bill_date_after: this.date_from,
        bill_date_before: this.date_to,
        order_by: this.orderBy,
        page_size: 100000
      }
    }
  },
  methods: {
    ...mapActions("systemMasterApi", ["getExpenseCategories"]),
    ...mapActions("systemMasterApi", ["getJobTypes"]),
    ...mapActions("jobOrderAPI", ["getJobOrders", "clearJobOrders"]),
    ...mapActions("billOfMaterialAPI", [ "getBillOfMaterials", "setBillOfMaterials"]),
    ...mapActions("manHourAPI", ["getManHours", "setManHours"]),
    ...mapActions("systemUserApi", ["getCompany"]),
    moneyComma(value) {
      return value.toString().replace(/(\d)(?=(\d{3})+($|\.\d+))/g, '$1,');
    },
    removeCamma(str) {
    return Number(str.replace(/,/g, ''));
    },
    async search() {
      this.$store.commit("systemConfig/setLoading", true);
      this.dataList = await this.getJobOrderList();
      this.$store.commit("systemConfig/setLoading", false);
    },
    // 工事番号毎集計
    async getJobOrderList() {
      let res = await this.getJobOrders({params: this.params});
      let dataList = res.results;

      // 合計値取得用変数
      let totalSales = 0;
      let totalDirectCost = 0;
      let totalLaborCost = 0;
      let totalCosts = 0;

      // 直接原価集計
      for(let i=0, JobOrder; JobOrder=dataList[i]; i++) {
        // 仕入データ集計
        JobOrder.directCost = await this.getBillOfMaterialList(JobOrder.id);
        // 工数データ取得
        JobOrder.laborCost = await this.getManHourList(JobOrder.id);
        // 集計
        JobOrder.totalCost = this.moneyComma((this.removeCamma(JobOrder.directCost.total) + this.removeCamma(JobOrder.laborCost.totalCosts)).toFixed(2));
        // 原価率の集計
        JobOrder.costRate = (this.removeCamma(JobOrder.totalCost) / this.removeCamma(JobOrder.defaultCurrencyOrderAmount) * 100).toFixed(2);
        // 合計の積算
        totalSales += this.removeCamma(JobOrder.defaultCurrencyOrderAmount);
        totalDirectCost += this.removeCamma(JobOrder.directCost.total);
        totalLaborCost += this.removeCamma(JobOrder.laborCost.totalCosts);
        totalCosts += this.removeCamma(JobOrder.totalCost);
      }
      // 合計データ整形
      let totalRow = {
        directCost: {},
        laborCost:{},
      };
      totalRow.defaultCurrencyOrderAmount = this.moneyComma(totalSales.toFixed(2));
      totalRow.directCost.total = this.moneyComma(totalDirectCost.toFixed(2));
      totalRow.laborCost.totalCosts = this.moneyComma(totalLaborCost.toFixed(2));
      totalRow.totalCost = this.moneyComma(totalCosts.toFixed(2));
      totalRow.costRate = (totalCosts / totalSales * 100).toFixed(2);
      // console.log(totalRow);
      dataList.push(totalRow);

      return dataList;
    },
    // 直接原価集計
    async getBillOfMaterialList(val) {
      // 工事番号を受け取って仕入データを検索
      let params = {
        company: this.loginUserData["companyId"],
        job_order: val,
        page_size: 100000
      }
      let res = await this.getBillOfMaterials({params: params});
      let bomList = res.results;
      // 集計用変数の定義
      let totalArray = {};
      let totalPlice = 0;
      // 部品種別ごとに集計
      for(let c=0,category; category=this.expenseCategories.results[c]; c++) {
        // カテゴリごとの合計計算
        let categoryList = bomList.filter(x => x.type === category.id);
        let total = categoryList.reduce((p, x) => p + parseFloat(x.totalDefaultCurrencyPrice), 0);
        // 工事番号ごとの集計
        totalPlice += total
        totalArray[category.id] = this.moneyComma(total.toFixed(2));
      }
      totalArray.total = this.moneyComma(totalPlice.toFixed(2));
      // 仕損費の集計
      let failureList = bomList.filter(x => x.failure !== null);
      totalArray.failure = this.moneyComma(failureList.reduce((p, x) => p + parseFloat(x.totalDefaultCurrencyPrice), 0).toFixed(2));
      // 返り値
      return totalArray
    },
    // 労務費集計
    async getManHourList(val) {
      // 工事番号を受け取って仕入データを検索
      let params = {
        company: this.loginUserData["companyId"],
        job_order: val,
        page_size: 100000
      }
      let res = await this.getManHours({params: params});
      let manHourList = res.results;
      let totalArray = {};
      // 合計作業時間
      let totalHours = 0;
      // 合計金額
      let totalCosts = 0;
      for(let c=0,type; type=this.jobTypes.results[c]; c++) {
        let typeList = manHourList.filter(x => x.type === type.id);
        let hours = typeList.reduce((p, x) => p + parseFloat(x.workHour), 0);
        totalHours += hours;
      }
      // 合計時間・金額の集計
      totalArray.totalHours = totalHours;
      totalArray.totalCosts = this.moneyComma((totalHours * this.userCompany.timeCharge).toFixed(2));
      // 仕損費の集計
      let failureList = manHourList.filter(x => x.failure !== null);
      totalArray.failure = this.moneyComma(failureList.reduce((p, x) => p + parseFloat(x.totalDefaultCurrencyPrice), 0).toFixed(2));
      // 返り値
      return totalArray
    },
    backToMenu() {
      this.$router.push({ name: "ReportsMenu" });
    }
  },
  created () {
    // 読み込みの初期化
    this.$store.commit("systemConfig/setLoading", false);
    // 計算対象カテゴリー取得
    this.getExpenseCategories({params: {is_calculate:true, order_by:"category_number"}});
    this.getJobTypes({params: {is_calculate:true, order_by:"number"}});
    this.getCompany({ detail: this.loginUserData["companyId"] });
  }
}
</script>