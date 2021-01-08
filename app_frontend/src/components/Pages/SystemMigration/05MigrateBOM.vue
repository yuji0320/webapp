<template>
  <span>
    <!-- 読み込み中ダイアログコンポーネント -->
    <app-loading-dialog></app-loading-dialog>

    <!-- 取引先マスタ登録 -->
    <app-excel-upload
      :headers="headers"
      @fix-json="fixJson"
      @submit-all="submitAllData"
      submitAll="true"
      :itemPerPageManual="100"
      hideBackButton="true"
    >
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>list</v-icon></span>
      <span slot="card-header-title">部品表インポート : </span>
    </app-excel-upload>

    <!-- エクセル出力 -->
    <app-excel-download
      :fileName="fileName"
      :hideButton="true"
      class="ml-2"
      ref="export"
    ></app-excel-download>

    <!-- {{ jobOrders.results[0] }} -->
  </span>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "05MigrateBOM",
  name: "MigrateBOM",
  data() {
    return {
      headers: [
        { text: "Key", value: "key"},
        { text: "jobOrder", value: "jobOrder"},
        { text: "type", value: "type"},
        { text: "Name", value: "name" },
        { text: "manufacturer", value: "manufacturer" },
        { text: "standard", value: "standard" },
        { text: "unitNumber", value: "unitNumber" },
        { text: "drawingNumber", value: "drawingNumber" },
        { text: "material", value: "material" },
        { text: "surfaceTreatment", value: "surfaceTreatment" },
        { text: "amount", value: "amount" },
        { text: "stockAppropriation", value: "stockAppropriation" },
        { text: "unit", value: "unit" },
        { text: "currency", value: "currency" },
        { text: "rate", value: "rate" },
        { text: "unitPrice", value: "unitPrice" },
        { text: "desiredDeliveryDate", value: "desiredDeliveryDate" },
        { text: "failure", value: "failure" },
        { text: "isCustomerSupplied", value: "isCustomerSupplied" },
        { text: "notes", value: "notes" },
        { text: "isPrinted", value: "isPrinted" },
      ],
      fileName: "result 05 MigrateBOM"
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemConfig", ["excelJson"]),
    ...mapState("systemUserApi", ["userPartners"]),
    ...mapState("systemMasterApi", ["unitTypes", "expenseCategories", "expenseCategory", "currencies"]),
    ...mapState("jobOrderAPI", ["jobOrders"]),
    ...mapState("billOfMaterialAPI", [
      "responseError",
      "jobOrderID", 
      "partsType", 
      "billOfMaterials",
      "billOfMaterial"
    ]),
    params() {
      return {
        company: this.loginUserData.companyId,
        order_by: "-partner_number"
      };
    }
  },
  methods: {
    ...mapActions("systemConfig", ["setExcelJson", "showSnackbar"]),
    ...mapActions("systemMasterApi", ["getUnitTypes", "getExpenseCategories", "getCurrencies"]),
    ...mapActions("systemUserApi", ["getPartners"]),
    ...mapActions("jobOrderAPI", ["getJobOrders"]),
    ...mapActions("billOfMaterialAPI", ["postBillOfMaterial"]),
    async fixJson(val) {
      let partnerList = this.userPartners.results;
      let jobOrderList = this.jobOrders.results;
      // データの整形
      let jsonData = val.map((bom, index) => {
        let returnData = {
          "key": index,
          "company": this.loginUserData.companyId,
          "createdBy": this.loginUserData.id,
          "modifiedBy": this.loginUserData.id,
          "name": bom.part_name,
          "material": bom.material,
          "partnerNumber": bom.clientid,
          "surface_treatment": bom.surface_treatment,
          "unit_number": bom.unit_number,
          "amount": bom.amount,
          "stockAppropriation": bom.apply_amount,
          "note": bom.bom_id,
          "unit": this.unitTypes.results[0].id// 個数単位
          // 希望納期
          // "isbom": true
        }
        // 作業指図書
        if(bom.wis_code) {
          returnData.jobOrder = jobOrderList.filter(item => item.mfgNo == bom.wis_code)[0];
          if (returnData.jobOrder){
            returnData.jobOrder = returnData.jobOrder.id;
          } else {
            returnData.jobOrder = "No jobOrder";
          }
        }
        // 部品分類


        // メーカー *取引先マスタから挿入
        if(bom.maker_code) {
          returnData.manufacturer = partnerList.filter(item => item.note == bom.maker_code)[0].id
        }
        // 型式 *加工部品の場合は図面番号に入力
        // 単価
        // 通貨
        // レート *USDの場合は換算
        // 印刷フラグ
        // 仕損品

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
      res = await this.postBillOfMaterial(this.excelJson);

      this.$store.commit("systemConfig/setLoading", false);
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
    this.$store.commit("systemConfig/setLoading", false);
    this.setExcelJson([]);
    this.getUnitTypes({params: {number: 0}});
    this.getJobOrders({params: {company: this.loginUserData.companyId, page_size: 1000}});
    this.getPartners({params: {company: this.loginUserData.companyId, page_size: 1000, is_manufacturer: true}});
    // this.getPartners({params: this.params})
  }
}
</script>