<template>
  <v-container fluid grid-list-lg>
    <app-card no-search-bar="true">
<!--       Cardヘッダー -->
      <span slot="card-header-icon"><v-icon>print</v-icon></span>
      <span slot="card-header-title">{{ printStatus.cardTitle }}"{{ jobOrder.mfgNo }} - {{ jobOrder.name }}"</span>
<!--       戻るボタン -->
      <span slot="card-header-buck-button">
        <v-btn @click="backToMenu" >
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
        <v-btn @click="printSelected" color="primary" outline>
          <v-icon>print</v-icon> Print Selected
        </v-btn>
        <v-btn @click="printAll" color="primary">
          <v-icon>print</v-icon> Print All
        </v-btn>
      </span>


      <span slot="card-content">
        *{{ printStatus.cardText }}
        <v-tabs v-model="tabs.tab" align-with-title grow>
<!--          タブ表示-->
          <v-tabs-slider></v-tabs-slider>
          <v-tab v-for="item in tabItems" :key="item.number" @click="tabClicked(item)">
            <v-badge>
              <template v-slot:badge><span>{{ item.qty }}</span></template>
              {{ item.title }}
            </v-badge>
          </v-tab>
        </v-tabs>

<!--        タブコンテンツ表示-->
        <br>
        <app-data-table
          :headers="headerData(tabs.isProcessedParts)"
          :items="partsData(tabs.refine)"
          footer="true"
          doNotChangeClass="true"
          selectAll="true"
          ref="data_table"
        >
        </app-data-table>
      </span>
    </app-card>
  </v-container>
</template>

<script>
  import {mapActions, mapState} from "vuex";
  import BillOfMaterialPrintMixin from "./BillOfMaterialPrintMixin.js"
  
  export default {
  title: "Print Bill of Material",
  name: "BillOfMaterialPrint",
  mixins: [BillOfMaterialPrintMixin],
  data() {
    return {
      orderBy: 'manufacturer__name,standard,drawing_number',
      // テーブルヘッダーデータ
      defaultHeadersTop: [
        { text: "Part Name", value: "name" }
      ],
      defaultHeadersEnd: [
        { text: "Amount", value: "amount", class: "text-xs-right" },
        { text: "Delivery", value: "desiredDeliveryDate" }
      ],
      // 市販部品テーブルヘッダー
      commercialHeaders: [
        { text: "Manufacturer", value: "manufacturerData" , nest: "abbr"},
        { text: "Standard/Form", value: "standard" },
        { text: "Unit number", value: "unit_number" }
      ],
      // 加工部品テーブルヘッダー
      processedHeaders: [
        { text: "Drawing Number", value: "drawingNumber" },
        { text: "Surface treatment", value: "surfaceTreatment" },
        { text: "Material", value: "material" }
      ],
      tabs: {
        tab: 0,
        refine: "",
        isProcessedParts:false,
        title: ""
      },
      // selectedDataList: [],
      dataForPDF: {
        page: 0,
        data: []
      }
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["unitTypes", "expenseCategories", "expenseCategory"]),
    ...mapState("jobOrderAPI", ["jobOrder"]),
    ...mapState("billOfMaterialAPI", ["jobOrderID", "partsType", "billOfMaterials", "reprint"]),
    params() {
      return {
        company: this.loginUserData.companyId,
        job_order: this.jobOrderID,
        is_printed: this.reprint,
        order_by: this.orderBy,
        page_size: 1000000
      };
    },
    headerData() {
      // 部品種別ごとにテーブル表示項目を変更
      return function (val) {
        let header = [];
        if(val===true) {
          header = this.defaultHeadersTop.concat(this.processedHeaders, this.defaultHeadersEnd);
        } else {
          header = this.defaultHeadersTop.concat(this.commercialHeaders, this.defaultHeadersEnd);
        }
        return header;
      }
    },
    tabItems: function () {
      let categories = this.expenseCategories.results;
      let list = [];
      for (let c = 0, category; category = categories[c]; c++) {
        let item = {};
        item.title = category.categoryName;
        item.number = category.categoryNumber;
        item.isProcessedParts = category.isProcessedParts;
        item.id = category.id;
        item.qty = this.partsData(item.id).length;
        list.push(item);
      }
      return list
    },
    firstTab() {
      let tab = {};
      if(this.tabItems.length !== 0) {
        tab.id = this.tabItems[0].id;
        tab.title = this.tabItems[0].title;
      }
      return tab
    },
    // 印刷か再印刷で内容が変わる部分を定義
    printStatus() {
      let cardTitle = "Print Bill of Material : ";
      let cardText = "You can print unprinted parts list.";

      if(this.reprint) {
        cardTitle = "Rerint Bill of Material : ";
        cardText = "You can print all parts list that already printed."
      }
      return {
        "cardTitle": cardTitle,
        "cardText": cardText
      }
    }
  },
  methods: {
    ...mapActions("systemConfig", ["showSnackbar"]),
    ...mapActions("systemMasterApi", ["getUnitTypes", "getExpenseCategories", "getExpenseCategory"]),
    ...mapActions("jobOrderAPI", ["getJobOrder"]),
    ...mapActions("billOfMaterialAPI", ["setJobOrderID", "setPartsType", "setBillOfMaterials", "getBillOfMaterials",
                  "putBillOfMaterial"]),
    // プリント実行、データのアップデート
    // 選択印刷
    async printSelected() {
      let selectedDataList = this.$refs.data_table.selected;
      this.dataForPDF.page = 1;
      this.dataForPDF.data = [];
      this.dataForPDF.data[0] = {
        id : this.tabs.refine,
        isProcessedParts : this.tabs.isProcessedParts,
        title : this.tabs.title,
        parts : selectedDataList
      };
      if(selectedDataList.length !== 0) {
        this.printPDF(this.createPrintData(this.dataForPDF));
        // this.createPrintData(this.dataForPDF);
      } else {
        // データを選択していない場合はアラートを出し、ダイアログを閉じる
        this.showSnackbar({color:"red", snack:"No data selected."});
      }
    },
    // 一括印刷
    async printAll() {
      this.dataForPDF.page = this.tabItems.length;
      this.dataForPDF.data = [];
      for (let c = 0, category; category = this.expenseCategories.results[c]; c++) {
        let partsData = {};
        partsData.id = category.id;
        partsData.title = category.categoryName;
        partsData.isProcessedParts = category.isProcessedParts;
        partsData.parts = this.partsData(category.id);
        this.dataForPDF.data.push(partsData);
      }
      this.printPDF(this.createPrintData(this.dataForPDF));
      // this.createPrintData(this.dataForPDF);
    },
    async getList(data) {
      this.$store.commit("systemConfig/setLoading", true);
      await this.getBillOfMaterials(data);
      this.$store.commit("systemConfig/setLoading", false);
    },
    // 部品種別毎の部品表仕分け
    partsData(val) {
      if(this.billOfMaterials.results) {
        return this.billOfMaterials.results.filter(x => x.type === val)
      } else {
        return []
      }
    },
    // メニューに戻る
    backToMenu() {
      this.$router.push({ name: "BillOfMaterialMenu" });
    },
    tabClicked(data) {
      this.tabs.refine = data.id;
      this.tabs.isProcessedParts = data.isProcessedParts;
      this.tabs.title = data.title;
      // console.log(data);
    },
  },
  created() {
    // もし工事番号等がクリアの場合はメニューにリダイレクトする
    if (!this.jobOrderID) {
      this.$router.push({name: "BillOfMaterialMenu"});
    } else {
      // 読み込みの初期化
      this.$store.commit("systemConfig/setLoading", false);
      this.setBillOfMaterials("");
      this.getExpenseCategories({params: {"order_by": "category_number"}});
      this.getJobOrder(this.jobOrderID);
      this.getList({params: this.params});
    }
  },
  mounted() {
    this.tabs.refine = this.firstTab.id;
    this.tabs.title = this.firstTab.title;
  }
  }
</script>