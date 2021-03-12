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

    <!-- {{ loginUserData.defaultCurrencyId }} -->
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
    ...mapState("systemMasterApi", ["unitTypes", "expenseCategories", "expenseCategory", "currencies", "failureCategories"]),
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
    ...mapActions("systemMasterApi", ["getUnitTypes", "getExpenseCategories", "getCurrencies", "getFailureCategories"]),
    ...mapActions("systemUserApi", ["getPartners"]),
    ...mapActions("jobOrderAPI", ["getJobOrders"]),
    ...mapActions("billOfMaterialAPI", ["postBillOfMaterial"]),
    async fixJson(val) {
      let partnerList = this.userPartners.results;
      let jobOrderList = this.jobOrders.results;
      let expenseCategoryList = this.expenseCategories.results;
      let usdId = (this.currencies.results).filter(item => item.code == "USD")[0].id;
      let failureId = this.failureCategories.results[0].id
      // console.log(val);
      // データの整形
      let jsonData = val.map((bom, index) => {
        let returnData = {
          "key": index,
          "company": this.loginUserData.companyId,
          "createdBy": this.loginUserData.id,
          "modifiedBy": this.loginUserData.id,
          "material": bom.material,
          "surface_treatment": bom.surface_treatment,
          "unit_number": bom.unit_number,
          "amount": bom.amount,
          "note": bom.bom_id,
          "unit": this.unitTypes.results[0].id// 個数単位
          // "isbom": true
        }
        // 部品名　*部品名なしの場合は"No parts nameと入力"
        (bom.part_name)?returnData.name = bom.part_name:returnData.name = "No parts name";

        // // 作業指図書
        if(bom.wis_code) {
          let jobOrderData = jobOrderList.filter(item => item.mfgNo == bom.wis_code)[0];
          // 工事番号が元データに存在しない場合、エラー用工事番号を設定
          (jobOrderData)?returnData.jobOrder = jobOrderData.id:returnData.jobOrder = jobOrderList.filter(item => item.mfgNo == 0)[0].id;
        }

        // 部品分類
        let typeDetail = expenseCategoryList.filter(item => item.categoryNumber == bom.component_kind_type)[0];
        (typeDetail)?returnData.type = typeDetail.id:returnData.type="No type";

        // メーカー *取引先マスタから挿入
        if(bom.maker_code) {
          let manufacturer_data = partnerList.filter(item => item.note == bom.maker_code)[0];
          (manufacturer_data)?returnData.manufacturer = manufacturer_data.id:returnData.manufacturer="No manufacturer";
        }

        // 在庫充当数
        (bom.apply_amount === "NULL")?returnData.stockAppropriation=0:returnData.stockAppropriation=bom.apply_amount;

        // 型式 *加工部品の場合は図面番号に入力
        (typeDetail.isProcessedParts)?returnData.drawingNumber=bom.standard:returnData.standard=bom.standard;

        // 通貨・単価
        if(bom.unit_price_us && bom.unit_price_us!="NULL"){
          // USDの場合
          // レートの計算
          let n = 10;  //小数点以下n桁未満を切り捨て
          let rateCalculation = Math.floor((bom.unit_price_us / bom.unit_price) * Math.pow(10, n)) / Math.pow(10, n);
          (!isFinite(rateCalculation))?returnData.rate=1:returnData.rate=rateCalculation; //単価が0の場合はレートに1を代入
          returnData.unitPrice = bom.unit_price_us // USD単価の挿入
          returnData.currency = usdId; // 通貨種別の挿入
        } else {
          // IDRの場合
          returnData.unitPrice = bom.unit_price // IDR単価の挿入
          returnData.rate = 1.0 //レートの挿入
          returnData.currency = this.loginUserData.defaultCurrencyId; // 通貨種別の挿入
        };

        // 希望納期
        returnData.desiredDeliveryDate = this.changeISODate(bom.time_of_delivery);

        // 印刷フラグ
        (bom.bom_flag === 0)?returnData.isPrinted = false:returnData.isPrinted = true;

        // 仕損品
        (bom.bom_failure === 0)?returnData.failure = null:returnData.failure = failureId;

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
    this.getCurrencies();
    this.getJobOrders({params: {company: this.loginUserData.companyId, page_size: 1000}});
    this.getPartners({params: {company: this.loginUserData.companyId, page_size: 1000, is_manufacturer: true}});
    this.getExpenseCategories({params: {order_by: "category_number"}});
    this.getFailureCategories({params: {order_by: "category_number"}});
  // this.getPartners({params: this.params})
  }
}
</script>