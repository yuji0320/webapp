<template>
  <v-container fluid grid-list-lg>

    <!-- 読み込み中ダイアログコンポーネント -->
    <app-loading-dialog></app-loading-dialog>

    <app-card noSeachBar="true">
      <span slot="card-header-icon"><v-icon>work</v-icon></span>
      <span slot="card-header-title">Job Order Detail of {{ jobOrder.mfgNo }} : {{ jobOrder.name }}</span>

      <!-- 戻るボタン -->
      <span slot="card-header-buck-button">
        <v-btn @click="backToMenu" >
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
      </span>

      <!-- 拡張ボタン -->
      <span slot="card-header-buck-button">
        <!-- 編集ボタン -->
        <v-btn fab small @click="edit">
          <v-icon>edit</v-icon>
        </v-btn>
        <!-- 印刷ボタン  -->
        <v-btn 
          @click="print"
          color="primary"
          :disabled="!jobOrderData.totalProfitPercentageResult"
        ><v-icon>print</v-icon> Print</v-btn>
      </span>

      <!-- 指図書データ -->
      <span slot="card-content">
        <v-container fluid　grid-list-lg>
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
                  <td class="text-center">MFG No.</td>
                  <td class="text-center">{{ jobOrderData.mfgNo }}</td>
                  <td class="text-center">Publisher</td>
                  <td class="text-center">{{ jobOrderData.publisherName }}</td>
                  <td class="text-center">Designer</td>
                  <td class="text-center">{{ jobOrderData.designerName }}</td>
                </tr>
                <tr>
                  <td colspan="2" class="text-center">Product Name</td>
                  <td colspan="4">{{ jobOrderData.name }}</td>
                </tr>
                <tr>
                  <td colspan="2" class="text-center">Customer</td>
                  <td colspan="4">{{ jobOrderData.customerName }}</td>
                </tr>
                <tr>
                  <td colspan="2" class="text-center">Delivery Destination	</td>
                  <td colspan="4">{{ jobOrderData.deliveryDestinationName }}</td>
                </tr>
                <tr>						
                  <td class="text-center">Order Date</td>				
                  <td class="text-center">{{ jobOrderData.orderDate }}</td>				
                  <td class="text-center">Delivery Date</td>				
                  <td class="text-center">{{ jobOrderData.deliveryDate }}</td>				
                  <td class="text-center">Completion Date</td>				
                  <td class="text-center">{{ jobOrderData.completionDate }}</td>
                </tr>
                <tr>						
                  <td class="text-center">Order Price</td>
                  <td class="text-right">{{ jobOrderData.orderPriceDisplay }}</td>
                  <td class="text-center">Order Currency</td>
                  <td class="text-center">{{ jobOrderData.orderCurrencyCodeDisplay }}</td>
                  <td class="text-center">Order Rate</td>
                  <td class="text-center">{{ jobOrderData.orderRateDisplay }}</td>
                </tr>
                <tr>
                  <td colspan="2" class="text-right">Order Price ({{loginUserData.defaultCurrencyCode}} )</td>
                  <td colspan="2" class="text-right">{{ jobOrderData.orderPriceDefault }}</td>
                  <td colspan="2">(Exclude Tax)</td>
                </tr>
                <tr>
                  <td colspan="2" class="text-right">Tax</td>
                  <td colspan="2" class="text-right">{{ jobOrderData.taxPrice }}</td>
                  <td colspan="2">{{ jobOrderData.taxPercentDisplay }}</td>
                </tr>
                <tr>
                  <td colspan="2" class="text-right"><strong>Total</strong></td>
                  <td colspan="2" class="text-right"><strong>{{ jobOrderData.orderTotal }}</strong></td>
                  <td colspan="2"></td>
                </tr>
                <tr>
                  <td colspan="2" class="text-center">Related Party's MFG No</td>
                  <td colspan="2">{{ jobOrderData.relatedPartyMfgNo }}</td>
                  <td class="text-center">Bill Date</td>				
                  <td class="text-center">{{ jobOrderData.billDate }}</td>
                </tr>
                <tr>
                  <td colspan="1" class="text-center">Notes</td>
                  <td colspan="5">{{ jobOrderData.notes }}</td>
                </tr>
            </tbody>
          </table>

          <table class="table table-bordered">
            <thead>
              <tr>
                <td class="text-center" style="width : 400px !important;">Material Cost</td>
                <td class="text-center" style="width : 240px !important;">Budget</td>
                <td class="text-center" style="width : 240px !important;">Results</td>
                <td class="text-center" style="width : 240px !important;">Failure</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center">Commercial parts costs</td>
                <td class="text-right">{{ jobOrderData.commercialPartsBudgetDisplay }}</td>
                <td class="text-right">{{ jobOrderData.commercialPartsResult }}</td>
                <td class="text-right"></td>
              </tr>
              <tr>
                <td class="text-center">Electrical parts costs</td>
                <td class="text-right">{{ jobOrderData.electricalPartsBudgetDisplay }}</td>
                <td class="text-right">{{ jobOrderData.electricalPartsResult }}</td>
                <td class="text-right"></td>
              </tr>
              <tr>
                <td class="text-center">Processed parts costs</td>
                <td class="text-right">{{ jobOrderData.processedPartsBudgetDisplay }}</td>
                <td class="text-right">{{ jobOrderData.processedPartsResult }}</td>
                <td class="text-right"></td>
              </tr>
              <tr>
                <td class="text-center">Outsourcing Mechanical Design Costs</td>
                <td class="text-right">{{ jobOrderData.outsourcingMechanicalDesignBudgetDisplay }}</td>
                <td class="text-right">{{ jobOrderData.outsourcingMechanicalDesignResult }}</td>
                <td class="text-right"></td>
              </tr>
              <tr>
                <td class="text-center">Outsourcing Electrical Design Costs</td>
                <td class="text-right">{{ jobOrderData.outsourcingElectricalDesignBudgetDisplay }}</td>
                <td class="text-right">{{ jobOrderData.outsourcingElectricalDesignResult}}</td>
                <td class="text-right"></td>
              </tr>
              <tr>
                <td class="text-center">Outsourcing Other Costs</td>
                <td class="text-right">{{ jobOrderData.outsourcingOtherBudgetDisplay }}</td>
                <td class="text-right">{{ jobOrderData.outsourcingOtherResult }}</td>
                <td class="text-right"></td>
              </tr>
              <tr>
                <td class="text-center"><strong>Material Cost Total</strong></td>
                <td class="text-right"><strong>{{ jobOrderData.directCostBudgetDisplay }}</strong></td>
                <td class="text-right"><strong>{{ jobOrderData.directCostResult }}</strong></td>
                <td class="text-right"><strong></strong></td>
              </tr>
              <tr>
                <td class="text-center"><strong>Limit Profit</strong></td>
                <td class="text-right"><strong>{{ jobOrderData.limitProfitBudgetDisplay }}</strong></td>
                <td class="text-right"><strong>{{ jobOrderData.limitProfitResult }}</strong></td>
                <td class="text-right"><strong></strong></td>
              </tr>
              <tr>
                <td class="text-center"><strong>Limit Profit Percentage</strong></td>
                <td class="text-right"><strong>{{ jobOrderData.limitProfitPercentageBudget }}</strong></td>
                <td class="text-right"><strong>{{ jobOrderData.limitProfitPercentageResult }}</strong></td>
                <td class="text-right"><strong></strong></td>
              </tr>
            </tbody>
          </table>
          
          <p class="text-xs-right">* Time Charge = $ {{ userCompany.timeCharge }} / Hour</p>

          <table class="table table-bordered">
            <thead>
              <tr>
                <td class="text-center" style="width : 400px !important;">Labor Cost</td>
                <td class="text-center" style="width : 90px !important;">Hours</td>
                <td class="text-center" style="width : 150px !important;">Budget(予算)</td>
                <td class="text-center" style="width : 90px !important;">Hours</td>
                <td class="text-center" style="width : 150px !important;">Results(実績)</td>
                <td class="text-center" style="width : 90px !important;">Hour</td>
                <td class="text-center" style="width : 150px !important;">Failure(仕損)</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center">Mechanical Design</td>
                <td class="text-right">{{ jobOrderData.mechanicalDesignBudgetHoursDisplay }}</td>
                <td class="text-right">{{ jobOrderData.mechanicalDesignBudgetPrice }}</td>
                <td class="text-right">{{ jobOrderData.mechanicalDesignResultHoursDisplay }}</td>
                <td class="text-right">{{ jobOrderData.mechanicalDesignResultPrice }}</td>
                <td class="text-right"></td>
                <td class="text-right"></td>
              </tr>
              <tr>
                <td class="text-center">Electrical Design</td>
                <td class="text-right">{{ jobOrderData.electricalDesignBudgetHoursDisplay }}</td>
                <td class="text-right">{{ jobOrderData.electricalDesignBudgetPrice }}</td>
                <td class="text-right">{{ jobOrderData.electricalDesignResultHoursDisplay }}</td>
                <td class="text-right">{{ jobOrderData.electricalDesignResultPrice }}</td>
                <td class="text-right"></td>
                <td class="text-right"></td>
              </tr>
              <tr>
                <td class="text-center">Assembly and Adjustment</td>
                <td class="text-right">{{ jobOrderData.assemblyBudgetHoursDisplay }}</td>
                <td class="text-right">{{ jobOrderData.assemblyBudgetPrice }}</td>
                <td class="text-right">{{ jobOrderData.assemblyResultHoursDisplay }}</td>
                <td class="text-right">{{ jobOrderData.assemblyResultPrice }}</td>
                <td class="text-right"></td>
                <td class="text-right"></td>
              </tr>
              <tr>
                <td class="text-center">Electrical Wiring</td>
                <td class="text-right">{{ jobOrderData.electricalWiringBudgetHoursDisplay }}</td>
                <td class="text-right">{{ jobOrderData.electricalWiringBudgetPrice }}</td>
                <td class="text-right">{{ jobOrderData.electricalWiringResultHoursDisplay }}</td>
                <td class="text-right">{{ jobOrderData.electricalWiringResultPrice }}</td>
                <td class="text-right"></td>
                <td class="text-right"></td>
              </tr>
              <tr>
                <td class="text-center">Installation</td>
                <td class="text-right">{{ jobOrderData.installationBudgetHoursDisplay }}</td>
                <td class="text-right">{{ jobOrderData.installationBudgetPrice }}</td>
                <td class="text-right">{{ jobOrderData.installationResultHoursDisplay }}</td>
                <td class="text-right">{{ jobOrderData.installationResultPrice }}</td>
                <td class="text-right"></td>
                <td class="text-right"></td>
              </tr>
              <tr>
                <td class="text-center"><strong>Labor Cost Total</strong></td>
                <td class="text-right"><strong>{{ jobOrderData.workingHoursBudgetDisplay }}</strong></td>
                <td class="text-right"><strong>{{ jobOrderData.laborCostBudgetDisplay }}</strong></td>
                <td class="text-right"><strong>{{ jobOrderData.workingHoursResultDisplay }}</strong></td>
                <td class="text-right"><strong>{{ jobOrderData.laborCostResultDisplay }}</strong></td>
                <td class="text-right"><strong></strong></td>
                <td class="text-right"><strong></strong></td>
              </tr>
            </tbody>
          </table>

          <table class="table table-bordered">
            <thead>
              <tr>
                <td class="text-center" style="width : 400px !important;"></td>
                <td class="text-center" style="width : 240px !important;">Budget</td>
                <td class="text-center" style="width : 240px !important;">Results</td>
                <td class="text-center" style="width : 240px !important;">Failure</td>
              </tr>
            </thead>
            <tr>
              <td class="text-center">Manufacturing cost</td>
              <td class="text-right">{{ jobOrderData.manufacturingCostBudgetDisplay }}</td>
              <td class="text-right">{{ jobOrderData.manufacturingCostResultDisplay }}</td>
              <td class="text-right"></td>
            </tr>
            <tr>
              <td class="text-center"><strong>Profit</strong></td>
              <td class="text-right"><strong>{{ jobOrderData.totalProfitBudgetDisplay }}</strong></td>
              <td class="text-right"><strong>{{ jobOrderData.totalProfitResultDisplay }}</strong></td>
              <td class="text-center"><strong>-</strong></td>
            </tr>
            <tr>
              <td class="text-center"><strong>Profit percentage</strong></td>
              <td class="text-right"><strong>{{ jobOrderData.totalProfitPercentageBudget }}</strong></td>
              <td class="text-right"><strong>{{ jobOrderData.totalProfitPercentageResult }}</strong></td>
              <td class="text-right"><strong></strong></td>
            </tr>
          </table>

        </v-container>
      </span>

    </app-card>
  </v-container>
</template>

<script>
import {mapActions, mapState} from "vuex";
import JobOrderPrintMixin from "./JobOrderPrintMixin.js"

export default {
  title: "Job Order Detail",
  name: "JobOrderDetail",
  mixins: [JobOrderPrintMixin],
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["expenseCategories", "jobTypes"]),
    ...mapState("systemUserApi", ["userCompany"]),
    ...mapState("jobOrderAPI", ["mfgNo", "jobOrder"]),
    ...mapState("billOfMaterialAPI", ["billOfMaterials"]),
    ...mapState("manHourAPI", ["manHours"]),
    paramsBOM() {
      return {
        company: this.loginUserData["companyId"],
        job_order: this.mfgNo,
        page_size: 100000
      };
    },
    // 部品種別毎の部品表仕分け
    partsList() {
      // PDF作成用のデータを構築
      return function (val) {
        if(this.billOfMaterials.results) {
          return this.billOfMaterials.results.filter(x => x.type === val);
        }
      }
    },
    // 直接原価集計
    directCosts() {
      const categories = this.expenseCategories.results;
      let results = [];
      let directCost = 0;
      for(let c in categories) {
        // 部品毎集計
        let t = (Math.round(this.calcPartsTotal(this.partsList(categories[c].id)) * 100) / 100);
        // 合計金額への加算
        directCost += t;
        results.push(t);
      }
      directCost = Math.round( directCost * 100) / 100;
      let orderAmount = Number(this.jobOrder["defaultCurrencyOrderAmount"].split(',').join(''));
      let limitProfit = (Math.round(( orderAmount - directCost) * 100) / 100);
      let limitProfitPercentage = 0;
      if(limitProfit > 0) {
        limitProfitPercentage = Math.round((limitProfit / orderAmount * 100) * 100) / 100;
      } else if(limitProfit < 0) {
        limitProfitPercentage = Math.round((limitProfit / orderAmount * 100) * 100) / 100;
      }
      return {
        results: results,
        directCost: directCost,
        limitProfit: limitProfit,
        limitProfitPercentage: limitProfitPercentage
      };
    },
    // 工数用パラメーター
    paramsManHour() {
      return {
        company: this.loginUserData["companyId"],
        job_order: this.mfgNo,
        page_size: 100000
      };
    },
    // 部品種別毎の部品表仕分け
    manHourList() {
      // PDF作成用のデータを構築
      return function (val) {
        if(this.manHours.results) {
          return this.manHours.results.filter(x => x.type === val);
        }
      }
    },
    laborCost() {
      const types = this.jobTypes.results;
      let results = [];
      let totalWorkHours = 0;
      for(let h=0, type; type=types[h]; h++) {
        // 部品毎集計
        let t = (Math.round(this.calcLaborTotal(this.manHourList(type.id)) * 100) / 100);
        // 合計金額への加算
        totalWorkHours += t;
        results.push(t);        
      }
      return {
        results: results,
        totalWorkHours: totalWorkHours
      };
    },
    jobOrderExists() {
      let data = Object.keys(this.jobOrder).length
      if(data === 0) {
        return data
      } else {
        return data
      }
    },
    // 作業指図書表示用データ作成
    jobOrderData() {
      // デフォルト通貨記号
      let defaultDisplay = this.loginUserData["defaultCurrencyDisplay"] + " ";
      let timeCharge = this.userCompany.timeCharge;
      let jobOrder = {};
      Object.assign(jobOrder, this.jobOrder);
      if (this.jobOrderExists) {
        // 作業指図書発行者
        jobOrder.publisherName = "";
        if(this.jobOrder.publisher){
          jobOrder.publisherName = this.jobOrder["publisherData"]["staffNumber"] + " : " + this.jobOrder["publisherData"]["fullName"];
        }
        // 設計者
        jobOrder.designerName = "";
        if(this.jobOrder.designer){
          jobOrder.designerName = this.jobOrder["designerData"]["staffNumber"] + " : " + this.jobOrder["designerData"]["fullName"];
        }
        // 作業指図書発行者
        jobOrder.customerName = "";
        if(this.jobOrder.customer){
          jobOrder.customerName = this.jobOrder["customerData"].name;
        }
        // 作業指図書発行者
        jobOrder.deliveryDestinationName = "";
        if(this.jobOrder.deliveryDestination){
          jobOrder.deliveryDestinationName = this.jobOrder["deliveryDestinationData"].name;
        }
        // 受注金額
        jobOrder.orderPriceDisplay = this.jobOrder["orderCurrencyData"].display + " " + this.moneyComma(this.jobOrder["orderPrice"]);
        jobOrder.orderCurrencyCodeDisplay = this.jobOrder.orderCurrencyData.code;
        // レート換算
        jobOrder.orderRateDisplay = "1" + this.jobOrder.orderCurrencyData.code + " = \n" + this.jobOrder.orderRate + this.loginUserData["defaultCurrencyCode"];
        // 受注金額基準通貨
        jobOrder.orderPriceDefault = defaultDisplay + this.jobOrder["defaultCurrencyOrderAmount"];
        // 税額
        jobOrder.taxPrice = defaultDisplay + this.jobOrder.costs.taxPrice;
        jobOrder.taxPercentDisplay = "(" + this.jobOrder.taxPercent + "%)";
        // 合計金額
        jobOrder.orderTotal = defaultDisplay + this.jobOrder.costs.orderTotal;
        // 材料費予算
        jobOrder.commercialPartsBudgetDisplay = defaultDisplay + this.moneyComma(this.jobOrder.commercialPartsBudget);
        jobOrder.electricalPartsBudgetDisplay = defaultDisplay + this.moneyComma(this.jobOrder.electricalPartsBudget);
        jobOrder.processedPartsBudgetDisplay = defaultDisplay + this.moneyComma(this.jobOrder.processedPartsBudget);
        jobOrder.outsourcingMechanicalDesignBudgetDisplay = defaultDisplay + this.moneyComma(this.jobOrder.outsourcingMechanicalDesignBudget);
        jobOrder.outsourcingElectricalDesignBudgetDisplay = defaultDisplay + this.moneyComma(this.jobOrder.outsourcingElectricalDesignBudget);
        jobOrder.outsourcingOtherBudgetDisplay = defaultDisplay + this.moneyComma(this.jobOrder.outsourcingOtherBudget);
        jobOrder.directCostBudgetDisplay = defaultDisplay + this.jobOrder["costs"]["directCostBudget"];
        jobOrder.limitProfitBudgetDisplay = defaultDisplay + this.jobOrder["costs"]["limitProfitBudget"];
        jobOrder.limitProfitPercentageBudget =this.jobOrder["costs"]["limitProfitPercentageBudget"] + "%";
        // 材料費実績
        if(this.jobOrderExists) {
          jobOrder.commercialPartsResult = defaultDisplay + this.moneyComma(this.directCosts.results[0].toFixed(2));
          jobOrder.electricalPartsResult = defaultDisplay + this.moneyComma(this.directCosts.results[1].toFixed(2));
          jobOrder.processedPartsResult = defaultDisplay + this.moneyComma(this.directCosts.results[2].toFixed(2));
          jobOrder.outsourcingMechanicalDesignResult = defaultDisplay + this.moneyComma(this.directCosts.results[3].toFixed(2));
          jobOrder.outsourcingElectricalDesignResult = defaultDisplay + this.moneyComma(this.directCosts.results[4].toFixed(2));
          jobOrder.outsourcingOtherResult = defaultDisplay + this.moneyComma(this.directCosts.results[5].toFixed(2));
          jobOrder.directCostResult = defaultDisplay + this.moneyComma(this.directCosts.directCost.toFixed(2));
          jobOrder.limitProfitResult = defaultDisplay + this.moneyComma(this.directCosts.limitProfit.toFixed(2));
          jobOrder.limitProfitPercentageResult =this.directCosts.limitProfitPercentage + "%";
        }
        // 労務費予算
        jobOrder.mechanicalDesignBudgetHoursDisplay = this.jobOrder.mechanicalDesignBudgetHours + " h";
        jobOrder.mechanicalDesignBudgetPrice = defaultDisplay + (this.jobOrder.mechanicalDesignBudgetHours * timeCharge).toFixed(2);
        jobOrder.electricalDesignBudgetHoursDisplay = this.jobOrder.electricalDesignBudgetHours + " h";
        jobOrder.electricalDesignBudgetPrice = defaultDisplay + (this.jobOrder.electricalDesignBudgetHours * timeCharge).toFixed(2);
        jobOrder.assemblyBudgetHoursDisplay = this.jobOrder.assemblyBudgetHours + " h";
        jobOrder.assemblyBudgetPrice = defaultDisplay + (this.jobOrder.assemblyBudgetHours * timeCharge).toFixed(2);
        jobOrder.electricalWiringBudgetHoursDisplay = this.jobOrder.electricalWiringBudgetHours + " h";
        jobOrder.electricalWiringBudgetPrice = defaultDisplay + (this.jobOrder.electricalWiringBudgetHours * timeCharge).toFixed(2);
        jobOrder.installationBudgetHoursDisplay = this.jobOrder.installationBudgetHours + " h";
        jobOrder.installationBudgetPrice = defaultDisplay + (this.jobOrder.installationBudgetHours * timeCharge).toFixed(2);
        jobOrder.workingHoursBudgetDisplay = this.jobOrder["costs"]["workingHoursBudget"] + " h";
        jobOrder.laborCostBudgetDisplay = defaultDisplay + this.jobOrder["costs"]["laborCostBudget"];
        // 労務費実績
        if(this.manHours.results) {
          jobOrder.mechanicalDesignResultHoursDisplay = this.laborCost.results[0].toFixed(2) + " h";
          jobOrder.mechanicalDesignResultPrice = defaultDisplay + (this.laborCost.results[0] * timeCharge).toFixed(2);
          jobOrder.electricalDesignResultHoursDisplay = this.laborCost.results[1].toFixed(2) + " h";
          jobOrder.electricalDesignResultPrice = defaultDisplay + (this.laborCost.results[1] * timeCharge).toFixed(2);
          jobOrder.assemblyResultHoursDisplay = this.laborCost.results[2].toFixed(2) + " h";
          jobOrder.assemblyResultPrice = defaultDisplay + (this.laborCost.results[2] * timeCharge).toFixed(2);
          jobOrder.electricalWiringResultHoursDisplay = this.laborCost.results[3].toFixed(2) + " h";
          jobOrder.electricalWiringResultPrice = defaultDisplay + (this.laborCost.results[3] * timeCharge).toFixed(2);
          jobOrder.installationResultHoursDisplay = this.laborCost.results[4].toFixed(2) + " h";
          jobOrder.installationResultPrice = defaultDisplay + (this.laborCost.results[4] * timeCharge).toFixed(2);
          jobOrder.workingHoursResultDisplay = this.laborCost.totalWorkHours.toFixed(2) + " h";
          jobOrder.laborCostResultDisplay = defaultDisplay + (this.laborCost.totalWorkHours * timeCharge).toFixed(2);
        }
        // 集計値予算
        jobOrder.manufacturingCostBudgetDisplay = defaultDisplay + this.moneyComma(this.jobOrder["costs"]["manufacturingCostBudget"]);
        jobOrder.totalProfitBudgetDisplay = defaultDisplay + this.moneyComma(this.jobOrder["costs"]["totalProfitBudget"]);
        jobOrder.totalProfitPercentageBudget =this.jobOrder["costs"]["totalProfitPercentage"] + "%";
        // 集計値実績
        let manufacturingCostResult = this.directCosts.directCost + (this.laborCost.totalWorkHours * timeCharge);
        let orderAmount = Number(this.jobOrder["defaultCurrencyOrderAmount"].split(',').join(''));
        let profitResult = (Math.round(( orderAmount - manufacturingCostResult) * 100) / 100);
        let profitPercentageResult = 0;
        if(profitResult > 0) {
          profitPercentageResult = Math.round((profitResult / orderAmount * 100) * 100) / 100;
        } else if(profitResult < 0) {
          profitPercentageResult = Math.round((profitResult / orderAmount * 100) * 100) / 100;
        }
        jobOrder.manufacturingCostResultDisplay = defaultDisplay + this.moneyComma(manufacturingCostResult.toFixed(2));
        jobOrder.totalProfitResultDisplay = defaultDisplay + this.moneyComma(profitResult.toFixed(2));
        jobOrder.totalProfitPercentageResult = profitPercentageResult + "%";
      }
      return jobOrder
    }
  },
  methods: {
    ...mapActions("systemMasterApi", ["getExpenseCategories", "getJobTypes"]),
    ...mapActions("systemUserApi", ["getCompany"]),
    ...mapActions("jobOrderAPI", ["getJobOrder", "isEdit"]),
    ...mapActions("billOfMaterialAPI", ["getBillOfMaterials", "setBillOfMaterials"]),
    ...mapActions("manHourAPI", ["getManHours", "setManHours"]),
    // 三点カンマ作成関数
    moneyComma(val) {
      if(val) {
        return val.toString().replace(/(\d)(?=(\d{3})+($|\.\d+))/g, '$1,');
      } else {
        return 0
      }
    },
    // 部品種別毎の部品表仕訳
    calcPartsTotal(val) {
      let total = 0;
      if(val) {
        for (let i = 0; i < val.length; i++) {
            total += val[i].totalDefaultCurrencyPrice;
        }
      }
      return total
    },
    calcLaborTotal(val) {
      let total = 0;
      if(val) {
        for (let i = 0; i < val.length; i++) {
            total += parseFloat(val[i].workHour);
        }
      }
      return total
    },
    async getData() {
      this.$store.commit("systemConfig/setLoading", true);
      this.getExpenseCategories({params: {"order_by": "category_number"}});
      this.getCompany({ detail: this.loginUserData["companyId"] });
      this.getJobTypes({params: {"order_by": "number"}});
      await this.getJobOrder(this.mfgNo);
      await this.getBillOfMaterials({params: this.paramsBOM});
      await this.getManHours({params: this.paramsManHour});
      this.$store.commit("systemConfig/setLoading", false);
    },
    edit() {
      this.isEdit();
      this.$router.push({ name: "JobOrderEdit" });
    },
    print() {
      this.printPDF(this.createPdfData());
    },
    backToMenu() {
      this.$router.push({ name: "JobOrderList" });
    }
  },
  created() {
    this.$store.commit("systemConfig/setLoading", false);
    this.setBillOfMaterials({});
    this.setManHours({});
    this.getData();
  }
}
</script>

<style>

</style>
