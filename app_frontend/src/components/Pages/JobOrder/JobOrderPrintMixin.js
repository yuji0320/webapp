export default {
  computed: {
    
  },
  methods: {
    createPdfData() {
      let headerText = "Job Order";
      let content = [];

      // データ整形
      let orderDate = "";
      if(this.jobOrder.orderDate){ orderDate = this.jobOrder.orderDate;}
      let deliveryDate = "";
      if(this.jobOrder.deliveryDate){ deliveryDate = this.jobOrder.deliveryDate;}
      let completionDate = "";
      if(this.jobOrder.completionDate){ completionDate = this.jobOrder.completionDate;}
      let billDate = "";
      if(this.jobOrder.billDate){ billDate = this.jobOrder.billDate;}
      let orderPriceText = "Order Price (" + this.jobOrder["orderCurrencyData"].code + ")";
      let orderPriceDefaultText = "Order Price (" + this.loginUserData["defaultCurrencyCode"] + ")";
      let orderRate = "1" + this.jobOrder["orderCurrencyData"].code + " = " + this.jobOrder.orderRate + this.loginUserData["defaultCurrencyCode"];

      // 作業指図書詳細情報
      let JobOrderDetail = {}
      JobOrderDetail.tableBody = [
        [
          {text: "MFG No.", alignment:"center"},
          {text: this.jobOrderData.mfgNo, alignment:"center"},
          {text: "Publisher", alignment:"center"},
          {text: this.jobOrderData.publisherName, alignment:"center"},
          {text: "Designer", alignment:"center"},
          {text: this.jobOrderData.designerName, alignment:"center"},
        ],
        [
          {text: "Product Name", alignment:"center", colSpan: 2},{},
          {text: this.jobOrderData.name , colSpan: 4},{},{},{},
        ],
        [
          {text: "Customer", alignment:"center", colSpan: 2},{},
          {text: this.jobOrderData.customerName, colSpan: 4},{},{},{},
        ],
        [
          {text: "Delivery Destination", alignment:"center", colSpan: 2},{},
          {text: this.jobOrderData.deliveryDestinationName, colSpan: 4},{},{},{},
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
          {text: this.jobOrderData.orderPriceDisplay, alignment:"right"},
          {text: "Order Currency", alignment:"center"},
          {text: this.jobOrderData.orderCurrencyCodeDisplay, alignment:"center"},
          {text: "Order Rate", alignment:"center"},
          {text: orderRate, alignment:"center"}
        ],
        [
          {text: orderPriceDefaultText, alignment:"right", colSpan: 2},{},
          {text: this.jobOrderData.orderPriceDefault, alignment:"right", colSpan: 2},{},
          {text: "(Exclude Tax)", alignment:"left", colSpan: 2},{},
        ],
        [
          {text:"Tax", alignment:"right", colSpan: 2},{},
          {text: this.jobOrderData.taxPrice, alignment:"right", colSpan: 2},{},
          {text: this.jobOrderData.taxPercent, alignment:"left", colSpan: 2},{},
        ],
        [
          {text:"Total", alignment:"right", colSpan: 2},{},
          {text: this.jobOrderData.orderTotal, alignment:"right", colSpan: 2},{},
          {text: "", alignment:"left", colSpan: 2},{},
        ],
        [
          {text: "Related Party's MFG No", alignment:"center", colSpan: 2},{},
          {text: this.jobOrderData["relatedPartyMfgNo"], colSpan: 2},{},
          {text: "Bill Date", alignment:"center"},
          {text: billDate, alignment:"center"}
        ],
        [
          {text: "Note", alignment:"center"},
          {text: this.jobOrderData["notes"], colSpan: 5},{},{},{}, {}
        ],
      ];
      // 直接材料費集計
      let materialCost = {};
      materialCost.tableBody = [
        [
          {text:"Material Cost", alignment:"center"},
          {text: "Budget", alignment:"center"},
          {text: "Results", alignment:"center"},
          {text: "Failure", alignment:"center"},
        ],
        [
          {text:"Commercial parts costs", alignment:"left", margin:[10,0,0,0]},
          {text: this.jobOrderData.commercialPartsBudgetDisplay, alignment:"right"},
          {text: this.jobOrderData.commercialPartsResult, alignment:"right"},
          {text: "", alignment:"right"},
        ],
        [
          {text:"Electrical parts costs", alignment:"left", margin:[10,0,0,0]},
          {text: this.jobOrderData.electricalPartsBudgetDisplay, alignment:"right"},
          {text: this.jobOrderData.electricalPartsResult, alignment:"right"},
          {text: "", alignment:"right"},
        ],
        [
          {text:"Processed parts costs", alignment:"left", margin:[10,0,0,0]},
          {text: this.jobOrderData.processedPartsBudgetDisplay, alignment:"right"},
          {text: this.jobOrderData.processedPartsResult, alignment:"right"},
          {text: "", alignment:"right"},
        ],
        [
          {text:"Outsourcing Mechanical Design Costs", alignment:"left", margin:[10,0,0,0]},
          {text: this.jobOrderData.outsourcingMechanicalDesignBudgetDisplay, alignment:"right"},
          {text: this.jobOrderData.outsourcingMechanicalDesignResult, alignment:"right"},
          {text: "", alignment:"right"},
        ],
        [
          {text:"Outsourcing Electrical Design Costs", alignment:"left", margin:[10,0,0,0]},
          {text: this.jobOrderData.outsourcingElectricalDesignBudgetDisplay, alignment:"right"},
          {text: this.jobOrderData.outsourcingElectricalDesignResult, alignment:"right"},
          {text: "", alignment:"right"},
        ],
        [
          {text:"Outsourcing Other Costs", alignment:"left", margin:[10,0,0,0]},
          {text: this.jobOrderData.outsourcingOtherBudgetDisplay, alignment:"right"},
          {text: this.jobOrderData.outsourcingOtherResult, alignment:"right"},
          {text: "", alignment:"right"},
        ],
        [
          {text:"Shipping Cost", alignment:"left", margin:[10,0,0,0]},
          {text: this.jobOrderData.shippingCostBudgetDisplay, alignment:"right"},
          {text: this.jobOrderData.shippingCostResult, alignment:"right"},
          {text: "", alignment:"right"},
        ],
        [
          {text:"Direct Cost", alignment:"left", margin:[10,0,0,0], decoration: 'underline'},
          {text: this.jobOrderData.directCostBudgetDisplay, alignment:"right", decoration: 'underline'},
          {text: this.jobOrderData.directCostResult, alignment:"right", decoration: 'underline'},
          {text: "", alignment:"right", decoration: 'underline'},
        ],
        [
          {text:"Limit Profit", alignment:"left", margin:[10,0,0,0], decoration: 'underline', decorationStyle: 'double'},
          {text: this.jobOrderData.limitProfitBudgetDisplay, alignment:"right", decoration: 'underline', decorationStyle: 'double'},
          {text: this.jobOrderData.limitProfitResult, alignment:"right", decoration: 'underline', decorationStyle: 'double'},
          {text: "", alignment:"right", decoration: 'underline', decorationStyle: 'double'},
        ],
        [
          {text:"Limit Profit Percentage", alignment:"left", margin:[10,0,0,0], decoration: 'underline', decorationStyle: 'wavy'},
          {text: this.jobOrderData.limitProfitPercentageBudget, alignment:"right", decoration: 'underline', decorationStyle: 'wavy'},
          {text: this.jobOrderData.limitProfitPercentageResult, alignment:"right", decoration: 'underline', decorationStyle: 'wavy'},
          {text: "", alignment:"right", decoration: 'underline', decorationStyle: 'wavy'},
        ]
      ];
      // 労務費集計
      let laborCost = {};
      laborCost.tableBody = [
        [
          {text:"Material Cost", alignment:"center"},
          {text: "Hours", alignment:"center"},
          {text: "Budget", alignment:"center"},
          {text: "Hours", alignment:"center"},
          {text: "Results", alignment:"center"},
          {text: "Hours", alignment:"center"},
          {text: "Failure", alignment:"center"},
        ],
        [
          {text:"Mechanical Design", alignment:"left", margin:[10,0,0,0]},
          {text: this.jobOrderData.mechanicalDesignBudgetHoursDisplay, alignment:"right"},
          {text: this.jobOrderData.mechanicalDesignBudgetPrice, alignment:"right"},
          {text: this.jobOrderData.mechanicalDesignResultHoursDisplay, alignment:"right"},
          {text: this.jobOrderData.mechanicalDesignResultPrice, alignment:"right"},
          {text: "", alignment:"right"},
          {text: "", alignment:"right"},
        ],
        [
          {text:"Electrical Design", alignment:"left", margin:[10,0,0,0]},
          {text: this.jobOrderData.electricalDesignBudgetHoursDisplay, alignment:"right"},
          {text: this.jobOrderData.electricalDesignBudgetPrice, alignment:"right"},
          {text: this.jobOrderData.electricalDesignResultHoursDisplay, alignment:"right"},
          {text: this.jobOrderData.electricalDesignResultPrice, alignment:"right"},
          {text: "", alignment:"right"},
          {text: "", alignment:"right"},
        ],
        [
          {text:"Assembly and Adjustment", alignment:"left", margin:[10,0,0,0]},
          {text: this.jobOrderData.assemblyBudgetHoursDisplay, alignment:"right"},
          {text: this.jobOrderData.assemblyBudgetPrice, alignment:"right"},
          {text: this.jobOrderData.assemblyResultHoursDisplay, alignment:"right"},
          {text: this.jobOrderData.assemblyResultPrice, alignment:"right"},
          {text: "", alignment:"right"},
          {text: "", alignment:"right"},
        ],
        [
          {text:"Electrical Wiring", alignment:"left", margin:[10,0,0,0]},
          {text: this.jobOrderData.electricalWiringBudgetHoursDisplay, alignment:"right"},
          {text: this.jobOrderData.electricalWiringBudgetPrice, alignment:"right"},
          {text: this.jobOrderData.electricalWiringResultHoursDisplay, alignment:"right"},
          {text: this.jobOrderData.electricalWiringResultPrice, alignment:"right"},
          {text: "", alignment:"right"},
          {text: "", alignment:"right"},
        ],
        [
          {text:"Installation", alignment:"left", margin:[10,0,0,0]},
          {text: this.jobOrderData.installationBudgetHoursDisplay, alignment:"right"},
          {text: this.jobOrderData.installationBudgetPrice, alignment:"right"},
          {text: this.jobOrderData.installationResultHoursDisplay, alignment:"right"},
          {text: this.jobOrderData.installationResultPrice, alignment:"right"},
          {text: "", alignment:"right"},
          {text: "", alignment:"right"},
        ],
        [
          {text:"Labor Cost Total", alignment:"left", margin:[10,0,0,0], decoration: 'underline'},
          {text: this.jobOrderData.workingHoursBudgetDisplay, alignment:"right", decoration: 'underline'},
          {text: this.jobOrderData.laborCostBudgetDisplay, alignment:"right", decoration: 'underline'},
          {text: this.jobOrderData.workingHoursResultDisplay, alignment:"right", decoration: 'underline'},
          {text: this.jobOrderData.laborCostResultDisplay, alignment:"right", decoration: 'underline'},
          {text: "", alignment:"right", decoration: 'underline'},
          {text: "", alignment:"right", decoration: 'underline'},
        ]
      ];
      // 総合計
      let totalProfit = {};
      totalProfit.tableBody = [
        [
          {text:"", alignment:"center"},
          {text: "Budget", alignment:"center"},
          {text: "Results", alignment:"center"},
          {text: "Failure", alignment:"center"},
        ],
        [
          {text:"Manufacturing cost", alignment:"left", margin:[10,0,0,0], decoration: 'underline'},
          {text: this.jobOrderData.manufacturingCostBudgetDisplay, alignment:"right", decoration: 'underline'},
          {text: this.jobOrderData.manufacturingCostResultDisplay, alignment:"right", decoration: 'underline'},
          {text: "", alignment:"right", decoration: 'underline'},
        ],
        [
          {text:"Profit", alignment:"left", margin:[10,0,0,0], decoration: 'underline', decorationStyle: 'double'},
          {text: this.jobOrderData.totalProfitBudgetDisplay, alignment:"right", decoration: 'underline', decorationStyle: 'double'},
          {text: this.jobOrderData.totalProfitResultDisplay, alignment:"right", decoration: 'underline', decorationStyle: 'double'},
          {text: "", alignment:"right", decoration: 'underline', decorationStyle: 'double'},
        ],
        [
          {text:"Profit Percentage", alignment:"left", margin:[10,0,0,0], decoration: 'underline', decorationStyle: 'wavy'},
          {text: this.jobOrderData.totalProfitPercentageBudget, alignment:"right", decoration: 'underline', decorationStyle: 'wavy'},
          {text: this.jobOrderData.totalProfitPercentageResult, alignment:"right", decoration: 'underline', decorationStyle: 'wavy'},
          {text: "", alignment:"right", decoration: 'underline', decorationStyle: 'wavy'},
        ]
      ]

      JobOrderDetail.tableWidth = ["*", "*", "*", "*", "*", "*"];
      content[0] = this.createTableData(JobOrderDetail);
      materialCost.tableWidth = [168, 125, 125, 125];
      content[1] = { text: "\n", alignment:"right" }
      content[2] = this.createTableData(materialCost);
      let timeChargeText = "* Time Charge = $ " + this.userCompany.timeCharge + " / Hour";
      content[3] = { text: "\n", alignment:"right" };
      content[4] = { text: timeChargeText, alignment:"right" };
      laborCost.tableWidth = [168, 43, 75, 43, 75, 43, 75];
      content[5] = this.createTableData(laborCost);
      content[6] = { text: "\n", alignment:"right" };
      totalProfit.tableWidth = [168, 125, 125, 125];
      content[7] = this.createTableData(totalProfit);

      let styles = {
        tableStyle: {
          fontSize: 9,
          margin: [ 0, 0, 0, 0]
        }
      };

      // 出力データ整形
      let contents = {
        "hideFooter": true,
        "headerText": headerText,
        "content": content,
        "styles": styles,
        "header": this.pdfHeader(),
        "pageMargins": [20,50,20,0],
      }
      return contents;
    },
    createTableData(val) {
      return {
        style: 'tableStyle',
        table: {
          headerRows: 0,
          widths: val.tableWidth,
          body: val.tableBody,
        },
        layout: {
          paddingLeft: function(i, node) { return 3; },
          paddingRight: function(i, node) { return 3; },
          paddingTop: function(i, node) { return 3; },
          paddingBottom: function(i, node) { return 3; }
        }
      }
    },
    // PDFデフォルトヘッダー
    pdfHeader() {
      return {
        text: "Job Order", 
        margin: [0,20,0,0],
        alignment: "center",
        fontSize: 15,
        bold: true
      }; 
    }
  }
}