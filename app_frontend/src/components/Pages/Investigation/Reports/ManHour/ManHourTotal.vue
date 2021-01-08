<template>
  <v-container fluid grid-list-lg>

    <!-- 読み込み中ダイアログコンポーネント -->
    <app-loading-dialog></app-loading-dialog>
  
    <app-card>
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-title">{{ switchParams.title }}</span>

            <!-- 戻るボタン -->
      <span slot="card-header-button">
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
              class="ms-2" 
              @click="search"
              :disabled = "date_from === '' || date_to === '' "
            >Search</v-btn>
          </v-flex>
        </v-layout>
      </span>

      <span slot="card-content">
        <h2 class="text-right">Grand Total : {{ grandTotal }}h</h2>
        <!-- テーブル表示 -->
        <v-data-table
          :headers="tableHeader"
          :items="results"
          hide-default-footer
          disable-sort
          class="elevation-1 mb-4"
          :items-per-page="results.length"
          dense
        >
        </v-data-table>

        <!-- 注意書き -->
        <p>*
          <span
            v-for="(list, id) in jobTypes.results"
            :key="id"
          >
          {{ list.number }}:{{ list.abbr }} = {{ list.incrementalField }}, 
          </span>
        </p>
      </span>

    </app-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Man Hour Total",
  name: "ManHourTotal",
  data() {
    return {
      date_from: "",
      date_to: "",
      orderBy: "",
      summaryBy: "",
      results:[],
      grandTotal: 0
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["jobTypes"]),
    ...mapState("systemUserApi", ["userStaffs"]),
    ...mapState("manHourAPI", ["manHours", "isAnnual"]),
    switchParams() {
      let title = "Man Hour Monthly Total Reports";
      let paramsTypes = { order_by:"number" }
      if(this.isAnnual) {
        title = "Man Hour Annual Total Reports for Costing";
        paramsTypes = {
          is_calculate: true,
          order_by:"number"
        }
      }
      return {
        title: title,
        paramsTypes:paramsTypes
      }
    },
    paramsStaff() {
      return {
        company: this.loginUserData.companyId,
        is_login_user: true,
        date_left: this.date_from,
        order_by: "staff_number"
      }
    },
    paramsManHour() {
      return {
        company: this.loginUserData.companyId,
        work_date_range_after: this.date_from,
        work_date_range_before: this.date_to,
      }
    },
    // テーブルヘッダー
    tableHeader() {
      let jobTypes = this.jobTypes.results;
      let array = [
        { text: "Name", value: "fullName" }
      ]
      if(jobTypes) {
        // 作業種別ごとに配列を追加
        for (let i=0,h;h=jobTypes[i];i++) {
          let headerObjekt = {};
          headerObjekt.text = h.number + ":" + h.abbr;
          headerObjekt.value = h.id;
          headerObjekt.class = "text-xs-right";
          headerObjekt.align = "right";
          array.push(headerObjekt);
        }
        array.push({ text: "Total", value: "total", class: "text-xs-right", align:"right" });
      }
      return array
    }
  },
  methods: {
    ...mapActions("systemMasterApi", ["getJobTypes"]),
    ...mapActions("systemUserApi", ["getStaffs", "setStaffs"]),
    ...mapActions("manHourAPI", ["getManHours", "setManHours"]),
    async search() {
      this.$store.commit("systemConfig/setLoading", true);
      await this.getStaffs({params: this.paramsStaff})
      await this.getManHours({params: this.paramsManHour})
      // console.log(this.userStaffs.results);
      let list  = await this.createData();
      this.results = list.array;
      this.grandTotal = list.grandTotal;
      this.$store.commit("systemConfig/setLoading", false);
    },
    // データリスト作成
    async createData() {
      let staffList = this.userStaffs.results;
      let manHourList = this.manHours.results;
      let jobTypes = this.jobTypes.results;
      let array = [];
      let grandTotal = 0;
      if(staffList && manHourList && jobTypes) {
        for (let i=0,staff;staff=staffList[i];i++) {
          // 従業員ごとに工数を分類
          let list = manHourList.filter(x => x.staff === staff.id);
          // 作業種別ごとに集計
          let staffTotal = 0;
          for(let j=0, type; type=jobTypes[j]; j++) {
            // 作業種別で分類
            let typeList = list.filter(x => x.type === type.id);
            // 分類ごとの合計を算出
            let typeTotal = typeList.reduce((p, x) => p + Number(x.workHour), 0)
            staff[type["id"]] = typeTotal.toFixed(2);
            staffTotal += typeTotal;
          }
          // 従業員ごとの合計を計算
          staff.total = staffTotal.toFixed(2);
          array.push(staff);
          // 総計
          grandTotal += staffTotal;
        }
      }
      return {
        array: array,
        grandTotal: grandTotal
      }
    }
  },
  created () {
    // 読み込みの初期化
    this.$store.commit("systemConfig/setLoading", false);
    this.getJobTypes({params: this.switchParams.paramsTypes});
    this.setStaffs({});
    this.setManHours({});
  }
}
</script>

<style>

</style>
