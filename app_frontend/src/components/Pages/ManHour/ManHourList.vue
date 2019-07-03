<template>
  <v-container fluid grid-list-lg>
    <!-- 確認ダイアログ -->
    <app-confirm ref="confirm"></app-confirm>

    <app-card>
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>access_time</v-icon></span>
      <span slot="card-header-title">{{ switchParams.title }}</span>

      <!-- 戻るボタン -->
      <span slot="card-header-buck-button">
        <v-btn @click="backToMenu" >
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
      </span>

      <!-- カード上部検索機能コンポーネント -->
      <span slot="search-bar">
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
      </span>

      <span slot="card-content">
        <!-- テーブル表示 -->
        <app-data-table
          :headers="headers"
          :items="manHours.results"
          @edit-item="editManHour"
          @double-clicked="editManHour"
          @delete-item="deleteManHourData"
        >
        </app-data-table>
      </span>
      <!-- ダイアログ拡張スロット -->
      <span slot="card-dialog">
        <app-man-hour-dialog @response-function="responseFunction" ref="man_hour_dialog"></app-man-hour-dialog>
      </span>
    </app-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Man Hour List",
  name: "ManHourList",
  data() {
    return {
      orderBy: "-date",
      // テーブルヘッダーデータ
      headers: [
        { text: "Staff Name", value: "staffData", nest:"fullName" },
        { text: "MFG No", value: "mfgNo" },
        { text: "Product Name", value:"productName" },
        { text: "Job type", value: "typeData", nest:"incrementalField" },
        { text: "Hours", value: "workHour", class: "text-xs-right" },
        { text: "Date", value: "date" },
        { text: "Action", value: "action", class: "text-xs-center" }
      ],
      // テーブル検索用データ
      incremental: {
        // 検索カラムリスト
        tableSelectItems: [
          { label: "Staff Name", value: "name" },
          { label: "MFG No", value: "mfg_no" },
          { label: "Date", value: "date_icontains" },
        ],
        // 検索数値の初期値および返り値
        tableSelectValue: "name",
        tableSearch: ""
      }
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["jobTypes"]),
    ...mapState("manHourAPI", ["isAdmin", "manHour", "manHours"]),
    // ページごとの設定
    switchParams: function () {
      let title = "Add or Edit Man Hour ";
      let params = {};
      if(this.isAdmin) {
        title += "(Admin)";
        params = {
          order_by: this.orderBy
        };
      } else {
        title += "(Personal)";
        params = {
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
  },
  created () {
    this.setManHours({});
    this.getJobTypes();
  }
}
</script>

<style>

</style>
