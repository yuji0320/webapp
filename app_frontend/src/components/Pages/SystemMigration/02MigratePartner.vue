<template>
  <span>
    <!-- 取引先マスタ登録 -->
    <app-excel-upload
      :headers="headers"
      @fix-json="fixJson"
      @submit-all="submitAllData"
      submitAll="true"
      hideBackButton="true"
    >
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>list</v-icon></span>
      <span slot="card-header-title">取引先マスタインポート : </span>
    </app-excel-upload>

    <!-- エクセル出力 -->
    <app-excel-download
      :fileName="fileName"
      :hideButton="true"
      class="ml-2"
      ref="export"
    ></app-excel-download>
  </span>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "02MigratePartner",
  name: "MigratePartner",
  data() {
    return {
      headers: [
        { text: "Key", value: "key"},
        { text: "Number", value: "partnerNumber"},
        { text: "Name", value: "name" },
        { text: "Abbr", value: "abbr" },
        { text: "Phone", value: "phone" },
        { text: "fax", value: "fax" },
        { text: "address", value: "address" },
        { text: "note", value: "note" },
        { text: "isCustomer", value: "isCustomer" },
        { text: "isDeliveryDestination", value: "isDeliveryDestination" },
        { text: "isSupplier", value: "isSupplier" },
        { text: "isManufacturer", value: "isManufacturer" },
      ],
      fileName: "result 02 MigratePartner"
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemConfig", ["excelJson"]),
    ...mapState("systemUserApi", ["userPartners"]),
  },
  methods: {
    ...mapActions("systemConfig", ["setExcelJson", "showSnackbar"]),
    ...mapActions("systemUserApi", ["postPartner"]),
    async fixJson(val) {
      let jsonData = val.map((client, index) => {
        let returnData = {
          "key": index,
          "company": this.loginUserData.companyId,
          "createdBy": this.loginUserData.id,
          "modifiedBy": this.loginUserData.id,
          "partnerNumber": client.clientid,
          "name": client.clientname,
          "abbr": client.clientname,
          "address": client.clientaddress,
          "Phone": client.clientphone,
          "fax": client.clientfax,
          "note": client.clientnote,
        }
        // 取引先種別情報
        switch(client.clientcode) {
          case 1:
            returnData.isCustomer = true;
            break;
          case 2:
            returnData.isSupplier = true;
            break;
          case 3:
            returnData.isDeliveryDestination = true;
            break;          
        }
        // 取引先種別の登録
        return returnData
      });
      // データをVuexに格納
      this.setExcelJson(jsonData);
    },
    // データ全件登録処理
    async submitAllData() {
      this.$store.commit("systemConfig/setLoading", true);
      let res = {};
      // 登録処理
      res = await this.postPartner(this.excelJson);
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
    },
  },
  mounted() {
    this.setExcelJson([]);
  }
}
</script>