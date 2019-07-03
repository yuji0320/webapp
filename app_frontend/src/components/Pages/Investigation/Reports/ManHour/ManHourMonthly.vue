<template>
  <v-container fluid grid-list-lg>

    <!-- 読み込み中ダイアログコンポーネント -->
    <app-loading-dialog></app-loading-dialog>
  
    <app-card>
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-title">Man Hour Monthly Total Reports</span>

            <!-- 戻るボタン -->
      <span slot="card-header-buck-button">
        <v-btn :to="{ name: 'ReportsMenu' }" >
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

        {{ jobTypes.results }}
      </span>

    </app-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Man Hour Manthly",
  name: "ManHourMonthly",
  data() {
    return {
      date_from: "2019-01-01",
      date_to: "2019-12-31",
      orderBy: "",
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
      list:[]
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["jobTypes"]),
    ...mapState("manHourAPI", ["manHours"]),
    tableHeader() {
      let jobTypes = this.jobTypes.results;
      let array = [
        { text: "Name", value: "" }
      ]
      if(jobTypes) {
        for (let index = 0; index < jobTypes.length; index++) {
          const element = jobTypes[index];
          console.log(element);
        }
      }

    }
  },
  methods: {
    ...mapActions("systemMasterApi", ["getJobTypes"]),
    ...mapActions("manHourAPI", ["getManHours"]),
    search() {

    }
  },
  created () {
    // 集計データリセット
    // this.clearJobOrders();
    // 読み込みの初期化
    this.$store.commit("systemConfig/setLoading", false);
    this.getJobTypes();
  }
}
</script>

<style>

</style>
