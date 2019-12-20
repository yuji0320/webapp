<template>
  <v-container fluid grid-list-lg>

    <!-- 読み込み中ダイアログコンポーネント -->
    <app-loading-dialog></app-loading-dialog>

    <app-card>
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-title">{{ switchParams.title }}</span>

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
          :disabled = "true"
        ><v-icon>print</v-icon> Print</v-btn>
      </span>

      <!-- 検索バー -->
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
              @click="sortByJobOrder"
              :disabled = "date_from === '' || date_to === '' "
            >Search(Sort by Job Order)</v-btn>
            <!-- 年月別集計 -->
            <v-btn 
              color="primary" 
              class="mb-2" 
              @click="sortBySupplier"
              :disabled = "date_from === '' || date_to === '' "
            >Search(Sort by Supplier)</v-btn>
          </v-flex>
        </v-layout>
      </span>

      <!-- データ表示 -->
      <span slot="card-content">
        <template v-if="receivingProcesses.results">
          <!-- 仕入総合計の表示 -->
          <h2 class="text-xs-right">Grand Total : {{ loginUserData.defaultCurrencyDisplay }} {{ totalPrice | moneyDelemiter }}</h2>
          <!-- 詳細表示の場合 -->
          <template v-if="isDetail">
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
                  <!-- 小計 -->
                  <span slot="data-table-footer">
                    <strong>Sub Total : {{ loginUserData.defaultCurrencyDisplay }} {{ list.subTotal | moneyDelemiter }}</strong>
                  </span>
                </app-data-table>
            </div>
            <h2 class="text-xs-right">Grand Total : {{ loginUserData.defaultCurrencyDisplay }} {{ totalPrice | moneyDelemiter }}</h2>
          </template>
          <!-- 集計のみ表示の場合 -->
          <template v-else>
            <v-layout row wrap justify-center>
              <!-- 表示サイズの調整 -->
              <v-flex xs12 lg6>
                <!-- テーブル表示 -->
                <app-data-table
                  :headers="headersSummary"
                  :items="summaryList"
                  :footer="true"
                >
                  <!-- 仕入総合計の表示 -->
                  <span slot="data-table-footer">
                    <strong>Grand Total : {{ loginUserData.defaultCurrencyDisplay }} {{ totalPrice | moneyDelemiter }}</strong>
                  </span>
                </app-data-table>     
              </v-flex>
            </v-layout>
          </template>
        </template>
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
    return {
      // date_from: "2019-10-01",
      // date_to: "2019-10-31",
      date_from: "",
      date_to: "",
      orderBy: 'order__supplier__name,order__manufacturer__name,order__standard,order__drawing_number,order__name',
      summaryBy: "",
      headersMfgNo: [
        { text: "MFG No", value: "orderData", nest:"mfgNo" },
      ],
      headersSupplier: [
        { text: "Supplier", value: "orderData", nest:"supplierData", nestNest:"abbr" },
      ],
      headersDetail: [
        { text: "Name", value: "orderData", nest:"name" },
        { text: "mfr.", value: "orderData", nest:"manufacturerData", nestNest:"abbr" },
        { text: "Detail", value: "orderData", nest:"billOfMaterial", nestNest:"partsDetail" },
        { text: "Date", value: "receivedDate", class: "text-xs-center" },
        { text: "Qty", value: "amount", class: "text-xs-right" },
        { text: "Price", value: "orderData", nest:"displayPrice", class: "text-xs-right" },
        { text: "Total($)", value: "orderData", nest:"displayTotalDefaultCurrencyPrice", class: "text-xs-right"},
      ],
      headersSummary: [
        { text: "Detail", value: "value"},
        { text: "Total($)", value: "subTotal", class: "text-xs-right"},
      ]
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("jobOrderAPI", ["jobOrder"]),
    ...mapState("receivingProcessAPI", ["receivingProcesses", "receivingProcess","isDetail"]),
    // 合計か詳細かでステータスの変更
    switchParams() {
      let title = "Purchasing Report (Summary)";
      if(this.isDetail) {
        title = "Purchasing Report (Detail)";
      }
      return {
        title: title,
      }
    },
    // 詳細用テーブルヘッダー
    headers() {
      let headers = [];
      if(this.summaryBy=="jobOrder") {
        headers = this.headersSupplier.concat(this.headersDetail);
      } else {
        headers = this.headersMfgNo.concat(this.headersDetail);
      }
      return headers
    },
    // 合計金額計算
    totalPrice() {
      let total = 0;
      if(this.receivingProcesses.results) {
        for(var i=0,d;d=this.receivingProcesses.results[i];i++){
          let price = parseFloat(d.orderData.totalDefaultCurrencyPrice);
          total += price;
        }
        total = Math.round( total * 100) / 100;
      }
      return total;
    },
    // 集計方法の選択
    summaryList() {
      let list = [];
      if(this.summaryBy=="jobOrder") {
        return this.jobOrderList();
      } else {
        return this.supplierList();
      }
    }
  },
  methods: {
    ...mapActions("jobOrderAPI", ["getJobOrder"]),
    ...mapActions("receivingProcessAPI", ["getReceivingProcesses", "setReceivingProcessesList", "setIsDetail"]),
    // 取引先別集計
    async sortByJobOrder() {
      this.summaryBy = "jobOrder";
      this.orderBy = 'order__manufacturer__name,order__standard,order__drawing_number,order__name,order__supplier__name';
      let res = await this.getObjects();
    },
    // 月別集計
    async sortBySupplier() {
      this.summaryBy = "supplier";
      this.orderBy = 'order__manufacturer__name,order__standard,order__drawing_number,order__name,order__bill_of_material__job_order';
      let res = await this.getObjects();
    },
    // 集計データ取得
    async getObjects() {
      // 検索パラメーター
      let params = {
        company: this.loginUserData.companyId,
        received_date_after: this.date_from,
        received_date_before: this.date_to,
        order_by: this.orderBy,
        page_size: 100000
      }
      this.$store.commit("systemConfig/setLoading", true);
      let res = await this.getReceivingProcesses({params: params});
      this.$store.commit("systemConfig/setLoading", false);
      return res;
    },
    // 工事番号別集計
    jobOrderList() {
      let jobOrderList = [];
      // リストの作成
      if(this.receivingProcesses.results) {
        // 仕入ファイルから工事番号情報の抜き出し
        for(var i=0,d;d=this.receivingProcesses.results[i];i++){
          let array = {
            key: d.orderData.jobOrder,
            value: d.orderData.mfgNo,
          }
          jobOrderList.push(array);
        }
        // 重複削除
        jobOrderList = jobOrderList.filter(function(v1,i1,a1){ 
          return (a1.findIndex(function(v2){ 
            return (v1.key===v2.key) 
          }) === i1);
        });
        // 工事番号別集計
        for(var i=0,d;d=jobOrderList[i];i++){
          let list = this.receivingProcesses.results.filter(x => x.orderData.jobOrder === d.key);
          let total = list.reduce((p, x) => p + parseFloat(x.orderData.totalDefaultCurrencyPrice), 0)
          d.subTotal = (Math.round( total * 100) / 100).toFixed(2);
          d.dataList = list;
        }
        // 名前順ソート
        jobOrderList.sort(function(a,b){
            if(a.value<b.value) return 1;
            if(a.value > b.value) return -1;
            return 0;
        });
      }
      return jobOrderList
    },
    // 仕入先別集計
    supplierList() {
      let supplierList = [];
      // リストの作成
      if(this.receivingProcesses.results) {
        // 仕入ファイルから仕入先情報の抜き出し
        for(var i=0,d;d=this.receivingProcesses.results[i];i++){
          let array = {
            key: d.orderData.supplierData.id,
            value: d.orderData.supplierData.name,
          }
          supplierList.push(array);
        }
        // 重複削除
        supplierList = supplierList.filter(function(v1,i1,a1){ 
          return (a1.findIndex(function(v2){ 
            return (v1.key===v2.key) 
          }) === i1);
        });
        // 取引先別集計
        for(var i=0,d;d=supplierList[i];i++){
          let list = this.receivingProcesses.results.filter(x => x.orderData.supplier === d.key);
          let total = list.reduce((p, x) => p + parseFloat(x.orderData.totalDefaultCurrencyPrice), 0)
          d.subTotal = (Math.round( total * 100) / 100).toFixed(2);
          d.dataList = list;
        }
        // 名前順ソート
        supplierList.sort(function(a,b){
            if(a.value<b.value) return -1;
            if(a.value > b.value) return 1;
            return 0;
        });
      }
      return supplierList
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
    this.setReceivingProcessesList({});
  }
}
</script>

<style>

</style>
