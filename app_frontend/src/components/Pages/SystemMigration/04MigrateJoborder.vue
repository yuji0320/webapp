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
      <span slot="card-header-title">作業指図書インポート : </span>
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
  title: "04MigrateJoborder",
  name: "MigrateJoborder",
  data() {
    return {
      headers: [
        { text: "Key", value: "key"},
        { text: "mfgNo", value: "mfgNo"}, // 工事番号
        { text: "name", value: "name"}, // 製品名
        { text: "customer", value: "customer"}, // 取引先
        { text: "deliveryDestination", value: "deliveryDestination"}, // 納入先
        { text: "publisher", value: "publisher"}, // 作業指図書作成者
        { text: "designer", value: "designer"}, // 設計担当者
        { text: "orderDate", value: "orderDate"}, // 受注日
        { text: "deliveryDate", value: "deliveryDate"}, // 納入日
        { text: "completionDate", value: "completionDate"}, // 工事完了日
        { text: "billDate", value: "billDate"}, // 請求日
        { text: "orderCurrency", value: "orderCurrency"}, // 受注通貨
        { text: "orderRate", value: "orderRate"}, // 受注レート
        { text: "orderPrice", value: "orderPrice"}, // 受注金額
        { text: "taxPercent", value: "taxPercent"}, // 税率
        { text: "relatedPartyMfgNo", value: "relatedPartyMfgNo"}, // 関係会社工事番号 *日本と中国がある場合結合
        { text: "notes", value: "notes"}, // 備考
        { text: "commercialPartsBudget", value: "commercialPartsBudget"}, // 市販部品予算
        { text: "electricalPartsBudget", value: "electricalPartsBudget"}, // 電気部品予算
        { text: "processedPartsBudget", value: "processedPartsBudget"}, // 加工部品予算
        { text: "outsourcingMechanicalDesignBudget", value: "outsourcingMechanicalDesignBudget"}, // 外注機械設計予算額
        { text: "outsourcingElectricalDesignBudget", value: "outsourcingElectricalDesignBudget"}, // 外注電気設計予算額
        { text: "outsourcingOtherBudget", value: "outsourcingOtherBudget"}, // 外注組み立て予算額
        { text: "mechanicalDesignBudgetHours", value: "mechanicalDesignBudgetHours"}, // 機械設計予算時間
        { text: "electricalDesignBudgetHours", value: "electricalDesignBudgetHours"}, // 電気設計予算時間
        { text: "assemblyBudgetHours", value: "assemblyBudgetHours"}, // 組立調整予算時間
        { text: "electricalWiringBudgetHours", value: "electricalWiringBudgetHours"}, // 電気配線予算時間
        { text: "installationBudgetHours", value: "installationBudgetHours"}, // 現地調整予算時間
        { text: "shippingCostBudget", value: "shippingCostBudget"}, // 運送費予算額
        { text: "shippingCostResult", value: "shippingCostResult"}, // 運送費実績額
      ],
      fileName: "result 04 MigrateJoborder"
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemConfig", ["excelJson"]),
    ...mapState("systemUserApi", ["userStaffs", "userPartners"]),
    // ...mapState("jobOrderAPI", ["responseError", "jobOrders", "jobOrder"]),
    params() {
      return {
        company: this.loginUserData.companyId,
        order_by: "-mfg_no"
      };
    }
  },
  methods: {
    ...mapActions("systemConfig", ["setExcelJson", "showSnackbar"]),
    ...mapActions("systemUserApi", ["getStaffs", "getPartners"]),
    ...mapActions("jobOrderAPI", ["getJobOrders", "postJobOrder"]),
    async fixJson(val) {
      let staffList = this.userStaffs.results;
      let partnerList = this.userPartners.results;
      // データの整形
      let jsonData = val.map((jobOrder, index) => {
        let returnData = {
          "key": index,
          "company": this.loginUserData.companyId,
          "createdBy": this.loginUserData.id,
          "modifiedBy": this.loginUserData.id,
          "mfgNo": jobOrder.wis_id,// 工事番号
          "name": jobOrder.wis_title,// 製品名
          "orderDate": this.changeISODate(jobOrder.orderd_date),// 受注日
          "deliveryDate": this.changeISODate(jobOrder.time_for_derivery),// 納入日
          "completionDate": this.changeISODate(jobOrder.completing_date),// 工事完了日
          "billDate": this.changeISODate(jobOrder.completing_date),// 請求日
          "orderCurrency": this.loginUserData.defaultCurrencyId,// 受注通貨
          "orderRate": 1,// 受注レート
          "orderPrice": jobOrder.order_amount,// 受注金額
          "taxPercent": jobOrder.tax,// 税率
          // "relatedPartyMfgNo": jobOrder.wis_id,// 関係会社工事番号 *日本と中国がある場合結合
          "notes": jobOrder.remarks,// 備考
          "commercialPartsBudget": jobOrder.cmp_costs_budget,// 市販部品予算
          "electricalPartsBudget": jobOrder.ep_costs_budget,// 電気部品予算
          "processedPartsBudget": jobOrder.prosessing_costs_budget,// 加工部品予算
          "outsourcingMechanicalDesignBudget": jobOrder.omd_costs_budget,// 外注機械設計予算額
          "outsourcingElectricalDesignBudget": jobOrder.oed_costs_budget,// 外注電気設計予算額
          "outsourcingOtherBudget": jobOrder.oa_costs_budget,// 外注組み立て予算額
          "mechanicalDesignBudgetHours": jobOrder.mdc_hour_budget,// 機械設計予算時間
          "electricalDesignBudgetHours": jobOrder.edc_hour_budget,// 電気設計予算時間
          "assemblyBudgetHours": jobOrder.aac_hour_budget,// 組立調整予算時間
          "electricalWiringBudgetHours": jobOrder.ewwc_hour_budget,// 電気配線予算時間
          "installationBudgetHours": jobOrder.itc_hour_budget,// 現地調整予算時間
          "shippingCostBudget": jobOrder.transportation_costs_budget,// 運送費予算額
          "shippingCostResult": jobOrder.prosessing_costs_results,// 運送費実績額
        }
        // 従業員マスタから挿入
        // 作業指図書作成者
        if(jobOrder.publisher_code !== 0) {
          returnData.publisher = staffList.filter(item => item.staffNumber === jobOrder.publisher_code)[0].id
        }
        // 設計担当者
        if(jobOrder.designer_code !== 0) {
          returnData.designer = staffList.filter(item => item.staffNumber === jobOrder.designer_code)[0].id
        }

        // 取引先マスタから挿入
        // 取引先
        if(jobOrder.client_code) {
          returnData.customer = partnerList.filter(item => item.partnerNumber === jobOrder.client_code)[0].id
        }
        // 納入先
        if(jobOrder.delivery_destination_code) {
          returnData.deliveryDestination = partnerList.filter(item => item.partnerNumber === jobOrder.delivery_destination_code)[0].id
          // returnData.deliveryDestination = returnData.deliveryDestination.id
        }
        return returnData
      });

      // エラーデータ紐付け用作業指図書の作成
      let systemJobOrder = {
        "company": this.loginUserData.companyId,
        "createdBy": this.loginUserData.id,
        "modifiedBy": this.loginUserData.id,
        "mfgNo": "0",// 工事番号
        "name": "For error",// 製品名
        "orderCurrency": this.loginUserData.defaultCurrencyId,// 受注通貨
        "orderRate": 1,// 受注レート
        "orderPrice": 0,// 受注金額
        "taxPercent": 0,// 税率
        // "relatedPartyMfgNo": jobOrder.wis_id,// 関係会社工事番号 *日本と中国がある場合結合
        "notes": "作業指図書が消えてしまっているデータの処理用",// 備考
        "commercialPartsBudget": 0,// 市販部品予算
        "electricalPartsBudget": 0,// 電気部品予算
        "processedPartsBudget": 0,// 加工部品予算
        "outsourcingMechanicalDesignBudget": 0,// 外注機械設計予算額
        "outsourcingElectricalDesignBudget": 0,// 外注電気設計予算額
        "outsourcingOtherBudget": 0,// 外注組み立て予算額
        "mechanicalDesignBudgetHours": 0,// 機械設計予算時間
        "electricalDesignBudgetHours": 0,// 電気設計予算時間
        "assemblyBudgetHours": 0,// 組立調整予算時間
        "electricalWiringBudgetHours": 0,// 電気配線予算時間
        "installationBudgetHours": 0,// 現地調整予算時間
        "shippingCostBudget": 0,// 運送費予算額
        "shippingCostResult": 0,// 運送費実績額
      }

      jsonData.push(systemJobOrder);

      // データをVuexに格納
      this.setExcelJson(jsonData);
    },
    // データ全件登録処理
    async submitAllData() {
      this.$store.commit("systemConfig/setLoading", true);
      let res = {};
      // 登録処理
      res = await this.postJobOrder(this.excelJson);

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
    this.getStaffs({params: {company: this.loginUserData.companyId, page_size: 10000}})
    this.getPartners({params: {company: this.loginUserData.companyId, page_size: 10000}});
  }
}
</script>