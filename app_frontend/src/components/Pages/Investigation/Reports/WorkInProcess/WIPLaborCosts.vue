<template>
  <v-container fluid grid-list-lg>

    <!-- 読み込み中ダイアログコンポーネント -->
    <app-loading-dialog></app-loading-dialog>

    <app-card>
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-title">Work In Process (Labor Costs)</span>

      <!-- 戻るボタン -->
      <span slot="card-header-button">
        <v-btn @click="backToMenu" >
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
        <!-- 印刷ボタン -->
        <v-btn 
          @click="print" 
          color="primary"
          class="ms-2" 
          :disabled="dataList.length === 0"
        ><v-icon>print</v-icon> Print</v-btn>
      </span>

      <!-- 検索バー -->
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
              class="ms-2" 
              @click="search"
              :disabled = "date === '' "
            >Search</v-btn>
          </v-flex>
        </v-layout>
      </span>

      <span slot="card-content">
        <h2 class="text-right">Grand Total : {{ loginUserData.defaultCurrencyDisplay }} {{ grandTotal | moneyDelemiter }}</h2>
        <v-data-table
          :headers="tableHeaders"
          :items="dataList"
          hide-default-footer
          disable-sort
          class="elevation-1 mb-4"
          :items-per-page="dataList.length"
          dense
        >
        </v-data-table>
      </span>


    </app-card>

  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import WIPLaborCostsPrint from "./WIPLaborCostsPrint.js"

export default {
  title: "WIP Labor Costs",
  name: "WIPLaborCosts",
  mixins: [WIPLaborCostsPrint],
  data () {
    return {
      date: "",
      defaultHeaders: [
        { text: "MFG No", value: "mfgNo" },
        { text: "Product Name", value: "name" },
        { text: "Delivery Date", value: "deliveryDate", class: "text-xs-center" },
        { text: "Sale price", value: "defaultCurrencyOrderAmount", class: "text-xs-right", align:"right"},
      ],
      totalHours: {text: "Total(h)", value: "totalHours", class: "text-xs-right", align:"right"},
      totalCosts: {text: "Total(Cost)", value: "totalCosts", class: "text-xs-right", align:"right"},
      dataList: [],
      grandTotal: 0
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["jobTypes"]),    
    ...mapState("jobOrderAPI", ["jobOrders"]),
    ...mapState("manHourAPI", ["manHours", "manHour"]),
    ...mapState("systemUserApi", ["userCompany"]),
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
      headerList.push(this.totalHours);
      headerList.push(this.totalCosts);
      let results = this.defaultHeaders.concat(headerList);
      return results
    }
  },
  methods: {
    ...mapActions("systemMasterApi", ["getJobTypes"]),
    ...mapActions("jobOrderAPI", ["getJobOrders", "clearJobOrders"]),
    ...mapActions("manHourAPI", ["getManHours", "setManHours"]),
    ...mapActions("systemUserApi", ["getCompany"]),
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
      let company = await this.getCompany({ detail: this.loginUserData["companyId"] });
      let res = await this.getJobOrders({params: this.params});
      let dataList = res.results;
      for(let i=0, JobOrder; JobOrder=dataList[i]; i++) {
        // 工数データ取得
        JobOrder.totalArray = await this.getReceivedList(JobOrder.id);
        JobOrder.totalHours = JobOrder.totalArray.totalHours;
        JobOrder.totalCosts = this.moneyComma(parseFloat(JobOrder.totalArray.totalCosts.replace(/,/g, "")).toFixed(2));
      }
      // 総合計の計算
      let grandTotalArray = {};
      grandTotalArray.totalHours = this.moneyComma(dataList.reduce((p, x) => p + parseFloat(x.totalArray.totalHours.replace(/,/g, "")), 0).toFixed(2));
      grandTotalArray.totalCosts = this.moneyComma(dataList.reduce((p, x) => p + parseFloat(x.totalArray.totalCosts.replace(/,/g, "")), 0).toFixed(2));

      let defaultCurrencyOrderAmount = this.moneyComma(dataList.reduce((p, x) => p + parseFloat(x.defaultCurrencyOrderAmount.replace(/,/g, "")), 0).toFixed(2));
      this.grandTotal = grandTotalArray.totalCosts;
      let totalData = {
        name:"Total",
        totalArray:grandTotalArray,
        defaultCurrencyOrderAmount: defaultCurrencyOrderAmount,
        totalHours: grandTotalArray.totalHours,
        totalCosts: grandTotalArray.totalCosts
      }
      dataList.push(totalData);
      return dataList;
    },
    // 仕入データ取得
    async getReceivedList(val) {
      // 工事番号を受け取って仕入データを検索
      let params = {
        company: this.loginUserData["companyId"],
        date_before: this.date,
        job_order: val,
        page_size: 100000
      }
      let res = await this.getManHours({params: params});
      let receivedList = res.results;
      // 合計作業時間
      let totalHours = receivedList.reduce((p, x) => p + parseFloat(x.workHour), 0).toFixed(2);
      // 合計金額
      let totalCosts = this.moneyComma(totalHours * this.userCompany.timeCharge);
      // 出力値の生成
      let totalArray = {
        totalHours: totalHours,
        totalCosts: totalCosts
      };
      return totalArray
    },
    // 印刷関数
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
    // 読み込みの初期化
    this.$store.commit("systemConfig/setLoading", false);
    // 本日日付のインプット
    this.date = this.todayISO;
  }
}
</script>