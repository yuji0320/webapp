<template>
  <v-container 
    fluid
    grid-list-lg
  >
    <app-excel-upload
      :headers="headers"
      @back-to-list="backToList"
      @fix-json="fixJson"
      @submit-data="submitData"
    >
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>people</v-icon></span>
      <span slot="card-header-title">Staff Master Excel Upload</span>
    
      <span slot="card-body">
        <!-- {{ userPartners }} -->
      </span>

    </app-excel-upload>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Staff Master Upload",
  name: "StaffUpload",
  data() {
    return {
      headers: [
        { text: "Staff No", value: "staffNumber" },
        { text: "Full Name", value: "fullName" },
        { text: "Ruby", value: "ruby"},
        { text: "email", value: "email" },
        { text: "Date Birth", value: "dateBirth" },
        { text: "Date Joined", value: "dateJoined"},
        { text: "Date Left", value: "dateLeft" },
        { text: "Action", value: "action" }
      ],      
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemConfig", ["excelJson"]),
    params() {
      return {
        company: this.loginUserData.companyId
      };
    }
  },  
  methods: {
    ...mapActions("systemConfig", ["setExcelJson", "showSnackbar"]),
    ...mapActions("systemUserApi", ["postStaff"]),
    backToList() {
      this.$router.push({ name: "Staff" });
    },
    fixJson(val) {
      // console.log(val);

      for(let i = 0; i < val.length; i++) {
        // オブジェクトのエラーコードを初期値とともに設定
        val[i].err = true;

        // ユーザー情報をレコードに挿入
        val[i].company = this.loginUserData.companyId;
        val[i].createdBy = this.loginUserData.id;
        val[i].modifiedBy = this.loginUserData.id;
      }
      // データをVuexに格納
      this.setExcelJson(val);
    },
    // データ登録処理
    async submitData(val) {
      // console.log(val);
      let res = {};
      res = await this.postStaff(val);
      if (res.data) {
        // 成功時
        this.showSnackbar(res.snack);
      } else {
        // 失敗時
        this.showSnackbar(res.snack);
        console.log(res.error);
      }
    }
  },
  mounted() {
    this.setExcelJson([]);
  }

}
</script>

<style>

</style>
