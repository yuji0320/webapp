<template>
  <v-container 
    fluid
    grid-list-lg
  >
    <app-excel-upload
      :headers="headerData"
      @back-to-list="backToList"
      @fix-json="fixJson"
      @submit-data="submitData"
    >
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>list</v-icon></span>
      <span slot="card-header-title">Bill of Material Excel Upload : {{ expenseCategory.categoryName }}</span>
    
      <span slot="card-body">
        <!-- {{ userPartners }} -->
      </span>

    </app-excel-upload>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import moment from "moment";

export default {
  title: "Bill of material Upload",
  name: "BillOfMaterialUpload",
  data() {
    return {
      // テーブルヘッダーデータ
      defaultHeadersTop: [
        { text: "Part Name", value: "name" }
      ],
      defaultHeadersEnd: [
        { text: "Amount", value: "amount", class: "text-xs-right", money: true },
        { text: "Unit", value: "unitType" },
        { text: "Stock app", value: "stockAppropriation", class: "text-xs-right", money: true },
        { text: "Currency", value: "currencyCode" },
        { text: "rate", value: "rate", class: "text-xs-right" },
        { text: "Unit Price", value: "unitPrice", class: "text-xs-right", money: true },
        { text: "Delivery", value: "desiredDeliveryDate" },
        { text: "Action", value: "action", class: "text-xs-center" }
      ],
      // 市販部品テーブルヘッダー
      commercialHeaders: [
        { text: "Manufacturer", value: "manufacturerName" , nest: "abbr"},
        { text: "Standard/Form", value: "standard" },
        { text: "Unit number", value: "unitNumber" }
      ],
      // 加工部品テーブルヘッダー
      processedHeaders: [
        { text: "Drawing Number", value: "drawingNumber" },
        { text: "Surface treatment", value: "surfaceTreatment" },
        { text: "Material", value: "material" }
      ]
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemConfig", ["excelJson"]),
    ...mapState("systemUserApi", ["userPartners"]),
    ...mapState("systemMasterApi", ["unitTypes", "expenseCategories", "expenseCategory", "currencies"]),
    ...mapState("jobOrderAPI", ["jobOrder"]),
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
        is_manufacturer: true,
        page_size: 1000
        // order_by: this.orderBy
      };
    },
    currencyList() { return this.currencies.results; },
    partnerList() { return this.userPartners.results; },
    unitTypeList() { return this.unitTypes.results; },
    headerData() {
      // 部品種別ごとにテーブル表示項目を変更
      let header = [];
      if(this.expenseCategory.isProcessedParts) {
        header = this.defaultHeadersTop.concat(this.processedHeaders, this.defaultHeadersEnd);
      } else {
        header = this.defaultHeadersTop.concat(this.commercialHeaders, this.defaultHeadersEnd);
      }
      return header;
    },
  },
  methods: {
    ...mapActions("systemConfig", ["setExcelJson", "showSnackbar"]),
    ...mapActions("systemMasterApi", ["getUnitTypes", "getExpenseCategories", "getExpenseCategory", "getCurrencies"]),
    ...mapActions("systemUserApi", ["getPartners"]),
    ...mapActions("jobOrderAPI", ["getJobOrder"]),
    ...mapActions("billOfMaterialAPI", ["postBillOfMaterial"]),
    backToList() {
      this.$router.push({ name: "BillOfMaterialList" });
    },
    async fixJson(val) {
      for(let i = 0; i < val.length; i++) {
        // オブジェクトの配列番号をkeyとして設定
        val[i].key = i;

        // オブジェクトのエラーコードを初期値とともに設定
        val[i].err = false;

        // アップロードステータスを設定
        val[i].updated = false;

        // ユーザー情報をレコードに挿入
        val[i].company = this.loginUserData.companyId;
        val[i].jobOrder = this.jobOrderID;
        val[i].type = this.partsType;
        val[i].createdBy = this.loginUserData.id;
        val[i].modifiedBy = this.loginUserData.id;

        // メーカー情報の入力
        if(val[i].manufacturerName) {
          // 取引先マスタとメーカー入力値を突合
          for(let c in this.partnerList) {
            if(val[i].manufacturerName===this.partnerList[c].abbr) {
              val[i].manufacturer = this.partnerList[c].id;
              val[i].manufacturerName = this.partnerList[c].abbr;
            }
          }
          if(!val[i].manufacturer) {
            // 値が不一致の場合はエラーを表示
            val[i].manufacturer = "";
            val[i].manufacturerName = "No match";
            val[i].err = true;
          }
        }

        // 数量が未入力の場合の場合０を入力
        if(!val[i].amount) { val[i].amount = 0 }

        // 単位情報を登録
        if(val[i].unitType) {
          // システム通貨マスタと通貨情報を突合
          for(let c in this.unitTypeList) {
            if(val[i].unitType==this.unitTypeList[c].display) {
              val[i].unit = this.unitTypeList[c].id;
              val[i].unitType = this.unitTypeList[c].display;
            }
          }
        } else {
          // 値が未入力の場合はデフォルト通過を設定する
          val[i].unit = this.unitTypes.results[0].id;
          val[i].unitType = this.unitTypes.results[0].display;
        }

        // 在庫充当数量が未入力の場合の場合０を入力
        if(!val[i].stockAppropriation) { val[i].stockAppropriation = 0 }

        // 受注通貨情報を登録
        if(val[i].currencyCode) {
          // システム通貨マスタと通過情報を突合
          for(let c in this.currencyList) {
            if(val[i].currencyCode==this.currencyList[c].code) {
              val[i].currency = this.currencyList[c].id;
            }
          }
          // 値が未入力の場合はデフォルト通貨を設定する
          if(!val[i].currency) {
            val[i].currency = this.loginUserData.defaultCurrencyId;
            val[i].currencyCode = this.loginUserData.defaultCurrencyCode;
          }
        }

        // レートが未入力の場合の場合"1"を入力
        if(!val[i].rate) { val[i].rate = 1 }

        // 単価が未入力の場合の場合"0"を入力
        if(!val[i].unitPrice) { val[i].unitPrice = 0 }

      }
      // データをVuexに格納
      this.setExcelJson(val);
    },
    // データ処理
    async submitData(val) {
      // console.log(val);
      let res = {};
      res = await this.postBillOfMaterial(val);
      if (res.data) {
        // 成功時
        this.showSnackbar(res.snack);
        this.excelJson[val.key].updated = true;
      } else {
        // 失敗時
        this.showSnackbar(res.snack);
        this.excelJson[val.key].err = true;
        console.log(res.error);
      }
    }
  },
  created() {
    // もし工事番号等がクリアの場合はメニューにリダイレクトする
    if(!this.partsType || !this.jobOrderID) {
      this.$router.push({ name: "BillOfMaterialMenu" });
    } else {
      this.getExpenseCategory(this.partsType);
      this.getJobOrder(this.jobOrderID);
    }
  },
  mounted() {
    this.setExcelJson([]);
    this.getCurrencies();
    this.getUnitTypes({ params: {"order_by": "number"} });
    this.getPartners({ params: this.params });
  }
}
</script>