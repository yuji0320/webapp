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
      <span slot="card-header-title">Partner Master Excel Upload</span>
    
      <span slot="card-body">
        <!-- {{ userPartners }} -->
      </span>

    </app-excel-upload>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Partner Master Upload",
  name: "PartnerUpload",
  data() {
    return {
      headers: [
        { text: "Partner No", value: "partnerNumber" },
        { text: "Partner Name", value: "name" },
        { text: "Abbrivation", value: "abbr"},
        { text: "Phone Number", value: "phoneNumber" },
        { text: "Fax Number", value: "faxNumber" },
        { text: "Postal code", value: "postalCode"},
        { text: "Address", value: "address" },
        { text: "isCustomer", value: "isCustomer" },
        { text: "isDeliveryDestination", value: "isDeliveryDestination" },
        { text: "isSupplier", value: "isSupplier" },
        { text: "isManufacturer", value: "isManufacturer" },
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
    ...mapActions("systemUserApi", ["postPartner"]),
    backToList() {
      this.$router.push({ name: "Partner" });
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
      res = await this.postPartner(val);
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
