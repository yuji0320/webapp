<template>
  <v-container fluid grid-list-lg>
    <!-- 確認ダイアログ -->
    <app-confirm ref="confirm"></app-confirm>

    <app-card-table
      :headers="headers"
      :items="manHours.results"
      :viewIcon="false"
      @edit-item="editManHour"
      @double-clicked="editManHour"
      @delete-item="deleteManHourData"
      ref="card_table"
    >
      <!-- ヘッダー部分スロット -->
      <!-- <span slot="card-header-icon"><v-icon>access_time</v-icon></span>
      <span slot="card-header-title">{{ switchParams.title }}</span> -->

      <!-- 戻るボタン -->
      <span slot="card-header-button">
        <v-btn @click="backToMenu" >
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
        <app-man-hour-dialog @response-function="responseFunction" ref="man_hour_dialog"></app-man-hour-dialog>
      </span>

      <!-- カード上部検索機能コンポーネント -->
      <div slot="search-bar">

        <app-search-toolbar
          :length="manHours.pages"
          :count="manHours.count"
          :orderBy="orderBy"
          :params="switchParams.params"
          :refineParams="refineParams"
          @search-list="getList"
          @clear-params="clearParams"
          :refineDetail="false"
        >
          <span slot="search-data-content">
            <v-row no-gutters> 
              <!-- 従業員検索 -->
              <v-col cols="12" sm="6" md="4" lg="3">
                <app-incremental-model-search
                label="Staff"
                orderBy="full_name"
                v-model="refineParams.staff"
                searchType="staff"
                :errorMessages="responseError.staff"
                ref="staff"
                ></app-incremental-model-search>
              </v-col>
              <!-- 工事番号検索 -->
              <v-col cols="12" sm="6" md="4" lg="3">
                <app-incremental-model-search
                label="Job Order"
                orderBy="name"
                v-model="refineParams.job_order"
                searchType="jobOrder"
                :errorMessages="responseError.job_order"
                ref="jobOrder"
                ></app-incremental-model-search>
              </v-col>
              <!-- 作業種別検索 -->
              <v-col cols="12" sm="6" md="4" lg="3">
                <app-incremental-model-search
                label="Job Type"
                orderBy="number"
                v-model="refineParams.type"
                searchType="jobType"
                :errorMessages="responseError.type"
                ref="jobType"
                ></app-incremental-model-search>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12" sm="6" md="4" lg="3">
                <app-input-date label="Date from" v-model="refineParams.work_date_range_after" appendOuterIcon="〜"></app-input-date>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3">
                <app-input-date label="Date to" v-model="refineParams.work_date_range_before"></app-input-date>
              </v-col>
            </v-row>
          </span>
        </app-search-toolbar>
      </div>

      <!-- カード上部検索機能コンポーネント -->
      <!-- <span slot="search-bar">
        <v-layout row wrap>
          <app-search-bar
            :length="manHours.pages"
            :count="manHours.count"
            :orderBy="orderBy"
            :incremental="incremental"
            :params="switchParams.params"
            @search-list="getList"
          ></app-search-bar>
        </v-layout>
      </span> -->

    </app-card-table>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import CardTable from '@/components/Module/Cards/CardTable.vue';
import SearchToolbar from "@/components/Module/Search/SearchToolbar.vue";
import ManHourDialog from '@/components/Module/Dialogs/ManHourDialog.vue';

export default {
  title: "Man Hour List",
  name: "ManHourList",
  components: {
    "app-card-table": CardTable,
    "app-search-toolbar": SearchToolbar,
    "app-man-hour-dialog": ManHourDialog
  },
  data() {
    return {
      orderBy: "-date",
      // テーブルヘッダーデータ
      headers: [
        { text: "Staff Name", value: "staffName" },
        { text: "MFG No", value: "mfgNo" },
        { text: "Product Name", value:"productName" },
        { text: "Job type", value: "jobType"},
        { text: "Hours", value: "workHour", align: "right" },
        { text: "Date", value: "date" },
        { text: "Action", value: "action", align: "center" }
      ],
      // テーブル検索用データ
      refineParams: {}
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["jobTypes"]),
    ...mapState("manHourAPI", ["responseError", "isAdmin", "manHour", "manHours"]),
    // ページごとの設定
    switchParams: function () {
      let title = "Add or Edit Man Hour ";
      let params = {};
      if(this.isAdmin) {
        title += "(Admin)";
        params = {
          staff__company: this.loginUserData.staffId,
          order_by: this.orderBy
        };
      } else {
        title += "(Personal)";
        params = {
          staff__company: this.loginUserData.staffId,
          staff: this.loginUserData.staffId,
          order_by: this.orderBy
        };
      }
      return {
        title: title,
        params: params
      }
    }
  }, 
  methods: {
    ...mapActions("systemConfig", ["showSnackbar"]),
    ...mapActions("systemMasterApi", ["getJobTypes"]),
    ...mapActions("manHourAPI", ["getManHours", "setManHour", "deleteManHour", "setManHours"]),
    async getList(data) {
      this.$store.commit("systemConfig/setLoading", true);
      let res = await this.getManHours(data);
      this.$store.commit("systemConfig/setLoading", false);
    },
    editManHour(val) {
      this.setManHour(val);
      this.$refs["man_hour_dialog"].editManHour();
    },
    // 処理結果統合フォーム
    responseFunction(val) {
      // リストをリロード
      this.getList({ params: this.switchParams.params });
      // Snackbar表示
      this.showSnackbar(val.snack);
    },
    async deleteManHourData(val) {
      let res = {};
      // 削除確認
      if (
        await this.$refs.confirm.open(
          "Delete",
          "Are you sure delete this data?",
          { color: "red" }
        )
      ) {
        // Yesの場合は削除処理
        res = await this.deleteManHour(val);
      } else {
        // Noの場合はスナックバーにキャンセルの旨を表示
        res.snack = { snack: "Delete is cancelled" };
      }
      console.log(res);
      this.responseFunction(res);
    },
    backToMenu() {
      this.$router.push({ name: "ManHourMenu" });
    },
    clearParams() {
      this.refineParams = {};
      this.$refs.staff.clearItem();
      this.$refs.jobOrder.clearItem();

    }
  },
  created () {
    this.setManHours({});
    this.getJobTypes({params:{order_by:"number"}});
    this.getList({params: this.switchParams.params});
  }
}
</script>

<style>

</style>
