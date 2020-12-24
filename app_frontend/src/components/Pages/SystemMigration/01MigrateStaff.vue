<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <!-- 従業員マスタ登録 -->
      <v-flex xs12>
        <app-excel-upload
          :headers="headers"
          @fix-json="fixJson"
          @submit-all="submitAllData"
          submitAll="true"
          hideBackButton="true"
        >
          <!-- ヘッダー部分スロット -->
          <span slot="card-header-icon"><v-icon>list</v-icon></span>
          <span slot="card-header-title">従業員マスタインポート : </span>
        </app-excel-upload>

        <!-- エクセル出力 -->
        <app-excel-download
          :fileName="fileName"
          :hideButton="true"
          class="ml-2"
          ref="export"
        ></app-excel-download>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "01MigrateStaff",
  name: "MigrateStaff",
  data() {
    return {
      headers: [
        { text: "Number", value: "staffNumber", class: "text-right", money: true },
        { text: "Full Name", value: "fullName" },
        { text: "Mobile", value: "mobile" },
        { text: "email", value: "email" },
        { text: "address", value: "address" },
        { text: "dateBirth", value: "dateBirth" },
        { text: "dateJoined", value: "dateJoined" },
        { text: "dateLeft", value: "dateLeft" },
      ],
      fileName: "result 01 MigrateStaff"
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemConfig", ["excelJson"]),
    ...mapState("systemUserApi", ["userStaffs"]),
  },
  methods: {
    ...mapActions("systemConfig", ["setExcelJson", "showSnackbar"]),
    ...mapActions("systemUserApi", ["postStaff"]),
    async fixJson(val) {
      // console.log(this.loginUserData.companyId);
      // 読み取ったJSONの整形
      let jsonData = val.map((staff, index) => {
        return {
          "key": index,
          "company": this.loginUserData.companyId,
          "createdBy": this.loginUserData.id,
          "modifiedBy": this.loginUserData.id,
          "staffNumber": staff.staffid,
          "fullName": staff.staffname,
          "ruby": staff.staffname,
          "mobile": staff.cellnumber,
          "email": staff.email,
          "address": staff.address,
          "dateBirth": this.changeISODate(staff.date_of_birth),
          "dateJoined": this.changeISODate(staff.date_of_joining),
          "dateLeft": this.changeISODate(staff.date_of_leaving),
          "err": false,
          "updated": false,
        }
      });
      // データをVuexに格納
      this.setExcelJson(jsonData);
    },
    // データ全件登録処理
    async submitAllData() {
      this.$store.commit("systemConfig/setLoading", true);
      let res = {};
      // 登録処理
      res = await this.postStaff(this.excelJson);
      // 成功か失敗に応じて処理を変更
      if (res.data) {
        // 成功した場合
        for(let i=0,success; success = this.excelJson[i]; i++){
          success.updated = true;
        }
        // 返り値をエクセルで出力
        this.$refs.export.onExport(res.data);
      } else {
        // 失敗した場合
        for(let i=0,errorData; errorData = this.excelJson[i]; i++){
          if(Object.keys(res.error.data[i]).length !== 0) {
            // エラーのフラグを立てる
            errorData.err = true;
            // エラーテキストの挿入
            errorData.errorText = JSON.stringify(res.error.data[i]);
          }
        }
        // エクセルで出力
        this.$refs.export.onExport(this.excelJson);
      }
    }
  },
  mounted() {
    this.setExcelJson([]);
  }
}
</script>