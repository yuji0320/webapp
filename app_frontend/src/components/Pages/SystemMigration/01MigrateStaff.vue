<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <!-- 従業員マスタ登録 -->
      <v-flex xs12>

          <app-excel-upload
            :headers="headers"
            @fix-json="fixJson"
            @submit-data="submitData"
            @submit-all="submitAllData"
            submitAll="true"
            hideBackButton="true"
          >
            <!-- ヘッダー部分スロット -->
            <span slot="card-header-icon"><v-icon>list</v-icon></span>
            <span slot="card-header-title">従業員マスタインポート : </span>

          </app-excel-upload>

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
        // { text: "Action", value: "action", class: "text-center" }
      ],
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemConfig", ["excelJson"]),
  },
  methods: {
    ...mapActions("systemConfig", ["setExcelJson", "showSnackbar"]),
    async fixJson(val) {
      // console.log(this.loginUserData.companyId);
      // 読み取ったJSONの整形
      for(let i = 0; i < val.length; i++) {
        // オブジェクトの配列番号をkeyとして設定
        val[i].key = i;

        // オブジェクトのエラーコードを初期値とともに設定
        val[i].err = false;

        // アップロードステータスを設定
        val[i].updated = false;

        // ユーザー情報をレコードに挿入
        val[i].company = this.loginUserData.companyId;
        val[i].createdBy = this.loginUserData.id;
        val[i].modifiedBy = this.loginUserData.id;

        // 取得情報を登録用情報に変換
        // 社員番号
        val[i].staffNumber = val[i].staffid;
        // 名前
        val[i].fullName = val[i].staffname;
        // 振り仮名 *便宜上フルネームを代入する
        val[i].ruby = val[i].staffname;
        // 携帯番号
        val[i].mobile = val[i].cellnumber;
        // メールアドレス *そのままでOK
        // 住所 *そのままでOK
        // 誕生日
        val[i].dateBirth = this.changeISODate(val[i].date_of_birth);        
        // 入社日
        val[i].dateJoined = this.changeISODate(val[i].date_of_joining);        
        // 退職日
        val[i].dateLeft = this.changeISODate(val[i].date_of_leaving);
      }
      // console.log(val);
      // データをVuexに格納
      this.setExcelJson(val);
    },
    // データ単体登録処理
    async submitData(val) {
      console.log("single-submit", val);
    },
    // データ全権登録処理
    async submitAllData() {
      console.log("submit-all", this.excelJson);
    }
  },
  mounted() {
    this.setExcelJson([]);
  }
}
</script>