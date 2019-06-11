<template>
  <v-container 
    fluid
    grid-list-lg
  >
    <v-card>
      <v-toolbar card>
        <v-icon>work</v-icon>
        <v-toolbar-title class="font-weight-light">
          Job Order Detail of {{ jobOrder.mfgNo }} : {{ jobOrder.name }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- 一覧へ戻る -->
        <v-btn @click="backToList">
          <v-icon>reply</v-icon>
          Back to List
        </v-btn>
        <!-- 編集ボタン -->
        <v-btn
          fab
          small
          @click="edit"
        >
          <v-icon>edit</v-icon>
        </v-btn>
        <v-btn 
          @click="print"
          color="primary"
        ><v-icon>print</v-icon> Print</v-btn>
      </v-toolbar>

      <v-card-text>
        <v-container 
          fluid
          grid-list-lg
        >
          <!-- 作業指図書表示グループ -->
            <table class="table table-bordered">
              <tbody>
                <tr class="" style="visibility: hidden;">
                  <td style="width : 100px !important;"></td>
                  <td style="width : 100px !important;"></td>
                  <td style="width : 100px !important;"></td>
                  <td style="width : 100px !important;"></td>
                  <td style="width : 100px !important;"></td>
                  <td style="width : 100px !important;"></td>
                </tr>
                <tr>
                  <td colspan="1" class="text-center">{{ tableData[0][0].text }}</td>
                  <td colspan="1">{{ tableData[0][1].text }}</td>
                  <td colspan="1" class="text-center">{{ tableData[0][2].text }}</td>
                  <td colspan="1" class="text-center">{{ tableData[0][3].text }}</td>
                <td colspan="1" class="text-center">{{ tableData[0][4].text }}</td>
                  <td colspan="1" class="text-center">{{ tableData[0][5].text }}</td>
                </tr>
                <tr>
                  <td colspan="2" class="text-center">{{ tableData[1][0].text }}</td>
                  <td colspan="4">{{ tableData[1][2].text }}</td>
                </tr>
                <tr>
                  <td colspan="2" class="text-center">{{ tableData[2][0].text }}</td>
                  <td colspan="4">{{ tableData[2][2].text }}</td>
                </tr>
                <tr>
                  <td colspan="2" class="text-center">{{ tableData[3][0].text }}</td>
                  <td colspan="4">{{ tableData[3][2].text }}</td>
                </tr>
                <tr>						
                  <td class="text-center">{{ tableData[4][0].text }}</td>				
                  <td>{{ tableData[4][1].text }}</td>
                  <td class="text-center">{{ tableData[4][2].text }}</td>					
                  <td>{{ tableData[4][3].text }}</td>
                  <td class="text-center">{{ tableData[4][4].text }}</td>
                  <td>{{ tableData[4][5].text }}</td>
                </tr>
                <tr>
                  <td class="text-center">{{ tableData[5][0].text }}</td>				
                  <td class="text-right">{{ tableData[5][1].text }}</td>
                  <td class="text-center">{{ tableData[5][2].text }}</td>					
                  <td class="text-center">{{ tableData[5][3].text }}</td>
                  <td class="text-center">{{ tableData[5][4].text }}</td>
                  <td class="text-center">{{ tableData[5][5].text }}</td>                
                </tr>

                <tr>
                  <td colspan="2" class="text-right">{{ tableData[6][0].text }}</td>
                  <td colspan="2" class="text-right">{{ tableData[6][2].text }}</td>
                  <td colspan="2">{{ tableData[6][4].text }}</td>
                </tr>
                <tr>
                  <td colspan="2" class="text-right">{{ tableData[7][0].text }}</td>
                  <td colspan="2" class="text-right">{{ tableData[7][2].text }}</td>
                  <td colspan="2">{{ tableData[7][4].text }}</td>
                </tr>
                <tr>
                  <td colspan="2" class="text-right"><strong>{{ tableData[8][0].text }}</strong></td>
                  <td colspan="2" class="text-right"><strong>{{ tableData[8][2].text }}</strong></td>
                  <td colspan="2"></td>
                </tr>
                <tr>
                  <td colspan="2" class="text-center">{{ tableData[9][0].text }}</td>
                  <td colspan="4">{{ tableData[9][2].text }}</td>
                </tr>
                <tr>
                  <td colspan="1" class="text-center">{{ tableData[10][0].text }}</td>
                  <td colspan="5">{{ tableData[10][3].text }}</td>
                </tr>
              </tbody>
            </table>

            <table class="table table-bordered">
              <thead>
                <tr>
                  <td class="text-center" style="width : 200px !important;">{{ tableData[11][0].text }}</td>
                  <td class="text-center" style="width : 100px !important;">{{ tableData[11][3].text }}</td>
                  <td class="text-center" style="width : 100px !important;">{{ tableData[11][4].text }}</td>
                  <td class="text-center" style="width : 100px !important;">{{ tableData[11][5].text }}</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-center">{{ tableData[12][0].text }}</td>
                  <td class="text-right">{{ tableData[12][3].text }}</td>
                  <td class="text-right">{{ tableData[12][4].text }}</td>
                  <td class="text-right">{{ tableData[12][5].text }}</td>
                </tr>
                <tr>
                  <td class="text-center">{{ tableData[13][0].text }}</td>
                  <td class="text-right">{{ tableData[13][3].text }}</td>
                  <td class="text-right">{{ tableData[13][4].text }}</td>
                  <td class="text-right">{{ tableData[13][5].text }}</td>
                </tr>
                <tr>
                  <td class="text-center">{{ tableData[14][0].text }}</td>
                  <td class="text-right">{{ tableData[14][3].text }}</td>
                  <td class="text-right">{{ tableData[14][4].text }}</td>
                  <td class="text-right">{{ tableData[14][5].text }}</td>
                </tr>
                <tr>
                  <td class="text-center">{{ tableData[15][0].text }}</td>
                  <td class="text-right">{{ tableData[15][3].text }}</td>
                  <td class="text-right">{{ tableData[15][4].text }}</td>
                  <td class="text-right">{{ tableData[15][5].text }}</td>
                </tr>
                <tr>
                  <td class="text-center">{{ tableData[16][0].text }}</td>
                  <td class="text-right">{{ tableData[16][3].text }}</td>
                  <td class="text-right">{{ tableData[16][4].text }}</td>
                  <td class="text-right">{{ tableData[16][5].text }}</td>
                </tr>
                <tr>
                  <td class="text-center"><strong>{{ tableData[17][0].text }}</strong></td>
                  <td class="text-right"><strong>{{ tableData[17][3].text }}</strong></td>
                  <td class="text-right"><strong>{{ tableData[17][4].text }}</strong></td>
                  <td class="text-right"><strong>{{ tableData[17][5].text }}</strong></td>
                </tr>
              </tbody>
            </table>
        </v-container>
      </v-card-text>

      <!-- Cardフッター -->
      <v-footer 
        card
        height="auto"
      >
      </v-footer>

    </v-card>

  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Job Order Detail",
  name: "JobOrderDetail",
  data() {
    return {
      orderBy: "-created_at"
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["expenseCategories"]),
    ...mapState("jobOrderAPI", [
      "responseError",
      "mfgNo",
      "jobOrders",
      "jobOrder",
      "jobOrderStatus"
    ]),
    ...mapState("billOfMaterialAPI", ["billOfMaterials"]),
    params() {
      return {
        company: this.loginUserData.companyId,
        job_order: this.mfgNo,
        order_by: this.orderBy,
        page_size: 5000
      };
    },
    // 部品種別毎の部品表仕分け
    partsData() {
      // PDF作成用のデータを構築
      return function (val) {
        const list = this.billOfMaterials.results.filter(x => x.type === val);
        return list
      }
    },
    // 部品種別毎の部品表仕分け
    partsTotal() {
      // PDF作成用のデータを構築
      return function (val) {
        let total = 0
        for(let t in val) {
          total += val[t].totalDefaultCurrencyPrice;
        }
        return total
      }
    },
    // 直接原価集計
    drectCosts() {
      const categories = this.expenseCategories.results;
      let results = []
      let drectCost = 0
      for(let c in categories) {
        // 部品毎集計
        let t = (Math.round(this.partsTotal(this.partsData(categories[c].id)) * 100) / 100);
        // 合計金額への加算
        drectCost += t
        results.push(t);
      }
      drectCost = Math.round( drectCost * 100) / 100;
      let orderAmount = Number(this.jobOrder.defaultCurrencyOrderAmount.split(',').join(''))
      let limitProfit = (Math.round(( orderAmount - drectCost) * 100) / 100);
      let limitProfitPercentage = 0
      if(limitProfit > 0) {
        limitProfitPercentage = Math.round((limitProfit / orderAmount * 100) * 100) / 100;
      } else if(limitProfit < 0) {
        limitProfitPercentage = Math.round((limitProfit / orderAmount * 100) * 100) / 100;
      }
      return {
        results: results,
        drectCost: drectCost,
        limitProfit: limitProfit,
        limitProfitPercentage: limitProfitPercentage
      };
    },
    tableData() {
      // デフォルト通貨記号
      let defaultDisplay = this.loginUserData.defaultCurrencyDisplay + " ";

      // 作業指図書発行者
      let publisher = ""
      if(this.jobOrder.publisher){
        publisher = this.jobOrder.publisherData.staffNumber + " : " + this.jobOrder.publisherData.fullName
      }
      // 設計者
      let designer = ""
      if(this.jobOrder.designer){
        designer = this.jobOrder.designerData.staffNumber + " : " + this.jobOrder.designerData.fullName
      }
      // 作業指図書発行者
      let customer = ""
      if(this.jobOrder.customer){
        customer = this.jobOrder.customerData.name;
      }
      // 作業指図書発行者
      let deliveryDestination = ""
      if(this.jobOrder.deliveryDestination){
        deliveryDestination = this.jobOrder.deliveryDestinationData.name;
      }
      // 受注金額
      let orderPriceText = "Order Price (" + this.jobOrder.orderCurrencyData.code + ")";
      let orderPrice = this.jobOrder.orderCurrencyData.display + " " + this.moneyComma(this.jobOrder.orderPrice);
      let orderDate = "";
      if(this.jobOrder.orderDate){ orderDate = this.jobOrder.orderDate;};
      let deliveryDate = "";
      if(this.jobOrder.deliveryDate){ deliveryDate = this.jobOrder.deliveryDate;};
      let completionDate = "";
      if(this.jobOrder.completionDate){ completionDate = this.jobOrder.completionDate;};
      // レート換算
      // let orderRate = "1" + this.jobOrder.orderCurrencyData.code + " = " + this.jobOrder.orderRate + this.loginUserData.defaultCurrencyCode;
      let orderRate = "1" + this.jobOrder.orderCurrencyData.code + " = \n" + this.jobOrder.orderRate + this.loginUserData.defaultCurrencyCode;
      // 受注金額基準通貨
      let orderPriceDefaultText = "Order Price (" + this.loginUserData.defaultCurrencyCode + ")";
      let orderPriceDefault = defaultDisplay + this.jobOrder.defaultCurrencyOrderAmount;
      // 税額
      let taxPrice = defaultDisplay + this.jobOrder.costs.taxPrice;
      let taxPercent = "(" + this.jobOrder.taxPercent + "%)"
      // 合計金額
      let orderTotal = defaultDisplay + this.jobOrder.costs.orderTotal;
      let commercialPartsBudget = defaultDisplay + this.moneyComma(this.jobOrder.commercialPartsBudget);
      let electricalPartsBudget = defaultDisplay + this.moneyComma(this.jobOrder.electricalPartsBudget);
      let processedPartsBudget = defaultDisplay + this.moneyComma(this.jobOrder.processedPartsBudget);
      let commercialPartsResult = "";
      let processedPartsResult = "";
      let electricalPartsResult = "";
      if(this.jobOrder) {
        commercialPartsResult = defaultDisplay + this.moneyComma(this.drectCosts.results[0].toFixed(2));
        processedPartsResult = defaultDisplay + this.moneyComma(this.drectCosts.results[2].toFixed(2));
        electricalPartsResult = defaultDisplay + this.moneyComma(this.drectCosts.results[1].toFixed(2));
      }
      let directCostBudget = defaultDisplay + this.jobOrder.costs.directCostBudget;
      let directCostResult = defaultDisplay + this.moneyComma(this.drectCosts.drectCost.toFixed(2));
      let limitProfitBudget = defaultDisplay + this.jobOrder.costs.limitProfitBudget;
      let limitProfitResult = defaultDisplay + this.moneyComma(this.drectCosts.limitProfit.toFixed(2));
      let limitProfitPercentageBudget =this.jobOrder.costs.limitProfitPercentageBudget + "%";
      let limitProfitPercentageResult =this.drectCosts.limitProfitPercentage + "%";

      let tableData = [
        [
          {text: "MFG No.", alignment:"center"}, 
          {text: this.jobOrder.mfgNo, alignment:"center"}, 
          {text: "Publisher", alignment:"center"}, 
          {text: publisher, alignment:"center"}, 
          {text: "Designer", alignment:"center"}, 
          {text: designer, alignment:"center"}, 
        ],
        [
          {text: "Product Name", alignment:"center", colSpan: 2},{}, 
          {text: this.jobOrder.name , colSpan: 4},{},{},{}, 
        ],
        [
          {text: "Customer", alignment:"center", colSpan: 2},{}, 
          {text: customer, colSpan: 4},{},{},{}, 
        ],
        [
          {text: "Delivery Destination", alignment:"center", colSpan: 2},{}, 
          {text: deliveryDestination, colSpan: 4},{},{},{}, 
        ],
        [
          {text: "Order Date", alignment:"center"},
          {text: orderDate, alignment:"center"},
          {text: "Delivery Date", alignment:"center"},
          {text: deliveryDate, alignment:"center"},
          {text: "Completion Date", alignment:"center"},
          {text: completionDate, alignment:"center"}
        ],
        [
          {text: orderPriceText, alignment:"center"},
          {text: orderPrice, alignment:"right"},
          {text: "Order Currency", alignment:"center"},
          {text: this.jobOrder.orderCurrencyData.code, alignment:"center"},
          {text: "Order Rate", alignment:"center"},
          {text: orderRate, alignment:"center"}
        ],
        [
          {text: orderPriceDefaultText, alignment:"right", colSpan: 2},{},
          {text: orderPriceDefault, alignment:"right", colSpan: 2},{},
          {text: "(Exclude Tax)", alignment:"left", colSpan: 2},{},
        ],
        [
          {text:"Tax", alignment:"right", colSpan: 2},{},
          {text: taxPrice, alignment:"right", colSpan: 2},{},
          {text: taxPercent, alignment:"left", colSpan: 2},{},
        ],
        [
          {text:"Total", alignment:"right", colSpan: 2},{},
          {text: orderTotal, alignment:"right", colSpan: 2},{},
          {text: "", alignment:"left", colSpan: 2},{},
        ],
        [
          {text: "Related Party's MFG No", alignment:"center", colSpan: 2},{},
          {text: this.jobOrder.relatedPartyMfgNo, colSpan: 4},{},{},{}
        ],  
        [
          {text: "Note", alignment:"center"}, 
          {text: this.jobOrder.notes, colSpan: 5},{},{},{}, {}
        ],
        [
          {text:"", alignment:"right", colSpan: 3},{},{},
          {text: "Budjet", alignment:"center"},
          {text: "Results", alignment:"center"},
          {text: "Failure", alignment:"center"},
        ],
        [
          {text:"Commercial parts costs", alignment:"center", colSpan: 3},{},{},
          {text: commercialPartsBudget, alignment:"right"},
          {text: commercialPartsResult, alignment:"right"},
          {text: "", alignment:"right"},
        ],
        [
          {text:"Electrical parts costs	", alignment:"center", colSpan: 3},{},{},
          {text: electricalPartsBudget, alignment:"right"},
          {text: electricalPartsResult, alignment:"right"},
          {text: "", alignment:"right"},
        ],
        [
          {text:"Processed parts costs	", alignment:"center", colSpan: 3},{},{},
          {text: processedPartsBudget, alignment:"right"},
          {text: processedPartsResult, alignment:"right"},
          {text: "", alignment:"right"},
        ],
        [
          {text:"Direct Cost", alignment:"center", colSpan: 3},{},{},
          {text: directCostBudget, alignment:"right"},
          {text: directCostResult, alignment:"right"},
          {text: "", alignment:"right"},
        ],
        [
          {text:"Limit Profit", alignment:"center", colSpan: 3},{},{},
          {text: limitProfitBudget, alignment:"right"},
          {text: limitProfitResult, alignment:"right"},
          {text: "", alignment:"right"},
        ],
        [
          {text:"Limit Profit Percentage", bold: true, alignment:"center", colSpan: 3},{},{},
          {text: limitProfitPercentageBudget, alignment:"right"},
          {text: limitProfitPercentageResult, alignment:"right"},
          {text: "", alignment:"right"},
        ]
      ];
      return tableData;
    }
  },
  methods: {
    ...mapActions("jobOrderAPI", ["getJobOrder", "isEdit"]),
    ...mapActions("systemMasterApi", ["getExpenseCategories"]),
    ...mapActions("billOfMaterialAPI", ["getBillOfMaterials"]),
    edit() {
      this.isEdit();
      this.$router.push({ name: "JobOrderEdit" });
    },
    backToList() {
      this.$router.push({ name: "JobOrderList" });
    },
    moneyComma(value) {
      return value.toString().replace(/(\d)(?=(\d{3})+($|\.\d+))/g, '$1,');
    },
    // 印刷実行
    print() {
      let docDefinition = this.createData();
      let pdfname = docDefinition.header().text + "_" + new Date();

      let pdfData = {
        "docDefinition": docDefinition,
        "pdfName": pdfname
      }

      // プリントの実行
      this.pdfgen(pdfData);

    },
    // PDF用データ作成
    createData() {
      // ヘッダー用テキストを定義      
      let headerText = "Job order " + " : " + this.jobOrder.mfgNo + " - " + this.jobOrder.name;

      let tableData = {
          style: 'tableStyle',
          table: {
            headerRows: 0,
            widths: ["*", "*", "*", "*", "*", "*"],
            heights: 190,
            body: this.tableData
          },
          layout: {
            paddingLeft: function(i, node) { return 5; },
            paddingRight: function(i, node) { return 5; },
            paddingTop: function(i, node) { return 5; },
            paddingBottom: function(i, node) { return 5; }
          }
        }

      var docDefinition = { 
        // ヘッダー等
        header: function(){
          return {
            text: headerText, 
            margin: [50,20],
            alignment: "center",
            fonsSize: 20
          };
        },
        // データ表示部分
        content: [
          tableData
        ],
        // 印刷プロパティ
        pageSize: 'LETTER',
        pageMargins: [20,60,20,50],
        defaultStyle: {
          font: 'GenShin',
          fontSize: 9
        },
        styles: {
          tableStyle: {
            fontSize: 11,
            margin: [ 0, 0, 0, 0]
          }
        },
      }  
      return docDefinition;
    },
    // プリント機能関数
    pdfgen(val) {
      pdfMake.fonts = {
        // 日本語が使用可能なフォントを設定
        GenShin: {
          normal: "GenShinGothic-Normal-Sub.ttf",
          bold: "GenShinGothic-Normal-Sub.ttf",
          italics: "GenShinGothic-Normal-Sub.ttf",
          bolditalics: "GenShinGothic-Normal-Sub.ttf"
        }
      };
      // PDF発行
      pdfMake.createPdf(val.docDefinition).download(val.pdfName);
    },
  },
  created() {
    this.getExpenseCategories({params: {"order_by": "category_number"}});
  },
  mounted() {
    this.getJobOrder(this.mfgNo);
    this.getBillOfMaterials({params: this.params});
  }
};
</script>
