<template>
  <div class="pa-2">
    <!-- 読み込み中ダイアログコンポーネント -->
    <app-loading-dialog></app-loading-dialog>

    <app-card noSearchBar="true">
      <span slot="card-header-icon"><v-icon large left>work</v-icon></span>
      <span slot="card-header-title">Job Order Detail of {{ jobOrder.mfgNo }} : {{ jobOrder.name }}</span>

      <!-- 戻るボタン -->
      <span slot="card-header-button">
        <v-btn @click="backToMenu" class="me-2">
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
      </span>

      <!-- 拡張ボタン -->
      <span slot="card-header-button">
        <!-- 編集ボタン -->
        <v-btn fab small @click="edit" class="me-2">
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
          <table border="1">
            <tbody>
                <tr class="" style="visibility: hidden;">
                  <td style="width : 300px !important;"></td>
                  <td style="width : 300px !important;"></td>
                  <td style="width : 300px !important;"></td>
                  <td style="width : 300px !important;"></td>
                  <td style="width : 300px !important;"></td>
                  <td style="width : 300px !important;"></td>
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

          <br>

          <table border="1">
            <thead>
              <tr>
                <td class="text-center" style="width : 560px !important;">Material Cost</td>
                <td class="text-center" style="width : 360px !important;">Budget</td>
                <td class="text-center" style="width : 360px !important;">Results</td>
                <td class="text-center" style="width : 360px !important;">Failure</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center">Commercial parts costs</td>
                <td class="text-right">{{ jobOrderData.commercialPartsBudgetDisplay }}</td>
                <td class="text-right">{{ jobOrderData.commercialPartsResult }}</td>
                <td class="text-right">{{ jobOrderData.commercialPartsFailure }}</td>
              </tr>
              <tr>
                <td class="text-center">Electrical parts costs</td>
                <td class="text-right">{{ jobOrderData.electricalPartsBudgetDisplay }}</td>
                <td class="text-right">{{ jobOrderData.electricalPartsResult }}</td>
                <td class="text-right">{{ jobOrderData.electricalPartsFailure }}</td>
              </tr>
              <tr>
                <td class="text-center">Processed parts costs</td>
                <td class="text-right">{{ jobOrderData.processedPartsBudgetDisplay }}</td>
                <td class="text-right">{{ jobOrderData.processedPartsResult }}</td>
                <td class="text-right">{{ jobOrderData.processedPartsFailure }}</td>
              </tr>
              <tr>
                <td class="text-center">Outsourcing Mechanical Design Costs</td>
                <td class="text-right">{{ jobOrderData.outsourcingMechanicalDesignBudgetDisplay }}</td>
                <td class="text-right">{{ jobOrderData.outsourcingMechanicalDesignResult }}</td>
                <td class="text-right">{{ jobOrderData.outsourcingMechanicalDesignFailure }}</td>
              </tr>
              <tr>
                <td class="text-center">Outsourcing Electrical Design Costs</td>
                <td class="text-right">{{ jobOrderData.outsourcingElectricalDesignBudgetDisplay }}</td>
                <td class="text-right">{{ jobOrderData.outsourcingElectricalDesignResult}}</td>
                <td class="text-right">{{ jobOrderData.outsourcingElectricalDesignFailure}}</td>
              </tr>
              <tr>
                <td class="text-center">Outsourcing Other Costs</td>
                <td class="text-right">{{ jobOrderData.outsourcingOtherBudgetDisplay }}</td>
                <td class="text-right">{{ jobOrderData.outsourcingOtherResult }}</td>
                <td class="text-right">{{ jobOrderData.outsourcingOtherFailure }}</td>
              </tr>
              <tr>
                <td class="text-center"><strong>Total Material Cost</strong></td>
                <td class="text-right"><strong>{{ jobOrderData.directCostBudgetDisplay }}</strong></td>
                <td class="text-right"><strong>{{ jobOrderData.directCostResult }}</strong></td>
                <td class="text-right"><strong>{{ jobOrderData.directCostFailure }}</strong></td>
              </tr>
              <tr>
                <td class="text-center"><strong>Limit Profit</strong></td>
                <td class="text-right"><strong>{{ jobOrderData.limitProfitBudgetDisplay }}</strong></td>
                <td class="text-right"><strong>{{ jobOrderData.limitProfitResult }}</strong></td>
                <td class="text-right">　−　</td>
              </tr>
              <tr>
                <td class="text-center"><strong>Limit Profit Percentage</strong></td>
                <td class="text-right"><strong>{{ jobOrderData.limitProfitPercentageBudget }}</strong></td>
                <td class="text-right"><strong>{{ jobOrderData.limitProfitPercentageResult }}</strong></td>
                <td class="text-right"><strong>Failure cost rate ( {{ jobOrderData.failurePercentage }} )</strong></td>
              </tr>
            </tbody>
          </table>
          <br>

          <p class="text-right">* Time Charge = $ {{ userCompany.timeCharge }} / Hour</p>

          <table border="1">
            <thead>
              <tr>
                <td class="text-center" style="width : 560px !important;">Labor Cost</td>
                <td class="text-center" style="width : 130px !important;">Hours</td>
                <td class="text-center" style="width : 230px !important;">Budget(予算)</td>
                <td class="text-center" style="width : 130px !important;">Hours</td>
                <td class="text-center" style="width : 230px !important;">Results(実績)</td>
                <td class="text-center" style="width : 130px !important;">Hour</td>
                <td class="text-center" style="width : 230px !important;">Failure(仕損)</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center">Mechanical Design</td>
                <td class="text-right">{{ jobOrderData.mechanicalDesignBudgetHoursDisplay }}</td>
                <td class="text-right">{{ jobOrderData.mechanicalDesignBudgetPrice }}</td>
                <td class="text-right">{{ jobOrderData.mechanicalDesignResultHoursDisplay }}</td>
                <td class="text-right">{{ jobOrderData.mechanicalDesignResultPrice }}</td>
                <td class="text-right">{{ jobOrderData.mechanicalDesignFailureHoursDisplay }}</td>
                <td class="text-right">{{ jobOrderData.mechanicalDesignFailurePrice }}</td>
              </tr>
              <tr>
                <td class="text-center">Electrical Design</td>
                <td class="text-right">{{ jobOrderData.electricalDesignBudgetHoursDisplay }}</td>
                <td class="text-right">{{ jobOrderData.electricalDesignBudgetPrice }}</td>
                <td class="text-right">{{ jobOrderData.electricalDesignResultHoursDisplay }}</td>
                <td class="text-right">{{ jobOrderData.electricalDesignResultPrice }}</td>
                <td class="text-right">{{ jobOrderData.electricalDesignFailureHoursDisplay }}</td>
                <td class="text-right">{{ jobOrderData.electricalDesignFailurePrice }}</td>
              </tr>
              <tr>
                <td class="text-center">Assembly and Adjustment</td>
                <td class="text-right">{{ jobOrderData.assemblyBudgetHoursDisplay }}</td>
                <td class="text-right">{{ jobOrderData.assemblyBudgetPrice }}</td>
                <td class="text-right">{{ jobOrderData.assemblyResultHoursDisplay }}</td>
                <td class="text-right">{{ jobOrderData.assemblyResultPrice }}</td>
                <td class="text-right">{{ jobOrderData.assemblyFailureHoursDisplay }}</td>
                <td class="text-right">{{ jobOrderData.assemblyFailurePrice }}</td>
              </tr>
              <tr>
                <td class="text-center">Electrical Wiring</td>
                <td class="text-right">{{ jobOrderData.electricalWiringBudgetHoursDisplay }}</td>
                <td class="text-right">{{ jobOrderData.electricalWiringBudgetPrice }}</td>
                <td class="text-right">{{ jobOrderData.electricalWiringResultHoursDisplay }}</td>
                <td class="text-right">{{ jobOrderData.electricalWiringResultPrice }}</td>
                <td class="text-right">{{ jobOrderData.electricalWiringFailureHoursDisplay }}</td>
                <td class="text-right">{{ jobOrderData.electricalWiringFailurePrice }}</td>
              </tr>
              <tr>
                <td class="text-center">Installation</td>
                <td class="text-right">{{ jobOrderData.installationBudgetHoursDisplay }}</td>
                <td class="text-right">{{ jobOrderData.installationBudgetPrice }}</td>
                <td class="text-right">{{ jobOrderData.installationResultHoursDisplay }}</td>
                <td class="text-right">{{ jobOrderData.installationResultPrice }}</td>
                <td class="text-right">{{ jobOrderData.installationFailureHoursDisplay }}</td>
                <td class="text-right">{{ jobOrderData.installationFailurePrice }}</td>
              </tr>
              <tr>
                <td class="text-center"><strong>Total Labor Cost</strong></td>
                <td class="text-right"><strong>{{ jobOrderData.workingHoursBudgetDisplay }}</strong></td>
                <td class="text-right"><strong>{{ jobOrderData.laborCostBudgetDisplay }}</strong></td>
                <td class="text-right"><strong>{{ jobOrderData.workingHoursResultDisplay }}</strong></td>
                <td class="text-right"><strong>{{ jobOrderData.laborCostResultDisplay }}</strong></td>
                <td class="text-right"><strong>{{ jobOrderData.workingHoursFailureDisplay }}</strong></td>
                <td class="text-right"><strong>{{ jobOrderData.laborCostFailureDisplay }}</strong></td>
              </tr>
            </tbody>
          </table>

          <br>

          <table border="1">
            <thead>
              <tr>
                <td class="text-center" style="width : 560px !important;"></td>
                <td class="text-center" style="width : 360px !important;">Budget</td>
                <td class="text-center" style="width : 360px !important;">Results</td>
                <td class="text-center" style="width : 360px !important;">Failure</td>
              </tr>
            </thead>
            <tr>
              <td class="text-center">Shipping Cost</td>
              <td class="text-right">{{ jobOrderData.shippingCostBudgetDisplay }}</td>
              <td class="text-right">{{ jobOrderData.shippingCostResultDisplay }}</td>
              <td class="text-right">　−　</td>
            </tr>
            <tr>
              <td class="text-center">Manufacturing cost</td>
              <td class="text-right">{{ jobOrderData.manufacturingCostBudgetDisplay }}</td>
              <td class="text-right">{{ jobOrderData.manufacturingCostResultDisplay }}</td>
              <td class="text-right">{{ jobOrderData.manufacturingCostFailureDisplay }}</td>
            </tr>
            <tr>
              <td class="text-center"><strong>Profit</strong></td>
              <td class="text-right"><strong>{{ jobOrderData.totalProfitBudgetDisplay }}</strong></td>
              <td class="text-right"><strong>{{ jobOrderData.totalProfitResultDisplay }}</strong></td>
              <td class="text-right">　−　</td>
            </tr>
            <tr>
              <td class="text-center"><strong>Profit percentage</strong></td>
              <td class="text-right"><strong>{{ jobOrderData.totalProfitPercentageBudget }}</strong></td>
              <td class="text-right"><strong>{{ jobOrderData.totalProfitPercentageResult }}</strong></td>
              <td class="text-right"><strong>Total failure cost rate ( {{ jobOrderData.totalFailurePercentage }} )</strong></td>
            </tr>
          </table>

        </v-container>
      </span>

    </app-card>
  </div>
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
      let failure = [];
      let directFailure = 0;

      for (let i = 0; i < categories.length; i++) {
        // 部品毎集計
        let t = (Math.round(this.calcPartsTotal(this.partsList(categories[i].id)) * 100) / 100);
        // 合計金額への加算
        directCost += t;
        results.push(t);
        // 仕損費集計
        let f = (Math.round(this.calcPartsFailureTotal(this.partsList(categories[i].id)) * 100) / 100);
        directFailure += f;
        failure.push(f);
      }
      
      // for (let i = 0; i < val.length; i++) {
      //   total += val[i].totalDefaultCurrencyPrice;
      // }

      directCost = Math.round( (directCost + parseFloat(this.jobOrder.shippingCostResult) ) * 100) / 100;
      let orderAmount = Number(this.jobOrder["defaultCurrencyOrderAmount"].split(',').join(''));
      let limitProfit = (Math.round(( orderAmount - directCost) * 100) / 100);
      let limitProfitPercentage = 0;
      if(limitProfit > 0) {
        limitProfitPercentage = Math.round((limitProfit / orderAmount * 100) * 100) / 100;
      } else if(limitProfit < 0) {
        limitProfitPercentage = Math.round((limitProfit / orderAmount * 100) * 100) / 100;
      }
      // 仕損費率計算
      let failurePercentage = 0;
      if(directCost > 0) {
        failurePercentage = Math.round((directFailure / directCost * 100) * 100) / 100;
      }
      return {
        results: results,
        directCost: directCost,
        limitProfit: limitProfit,
        limitProfitPercentage: limitProfitPercentage,
        failure: failure,
        directFailure: directFailure,
        failurePercentage: failurePercentage,
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
      let failure = [];
      let totalFailure = 0;
      if(types) {
        for(let h=0, type; type=types[h]; h++) {
          // 部品毎集計
          let t = (Math.round(this.calcLaborTotal(this.manHourList(type.id)) * 100) / 100);
          // 合計金額への加算
          totalWorkHours += t;
          results.push(t);        
          // 仕損費集計
          let f = (Math.round(this.calcLaborFailureTotal(this.manHourList(type.id)) * 100) / 100);
          totalFailure += f;
          failure.push(f);
        }
      }
      return {
        results: results,
        totalWorkHours: totalWorkHours,
        failure: failure,
        totalFailure: totalFailure
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
          jobOrder.publisherName = this.jobOrder.publisherName;
        }
        // 設計者
        jobOrder.designerName = "";
        if(this.jobOrder.designer){
          jobOrder.designerName = this.jobOrder.designerName;
        }
        // 作業指図書発行者
        jobOrder.customerName = "";
        if(this.jobOrder.customer){
          jobOrder.customerName = this.jobOrder["customerName"];
        }
        // 作業指図書発行者
        jobOrder.deliveryDestinationName = "";
        if(this.jobOrder.deliveryDestination){
          jobOrder.deliveryDestinationName = this.jobOrder["deliveryDestinationName"];
        }
        // 受注金額
        jobOrder.orderPriceDisplay = this.jobOrder["orderCurrencyDisplay"] + " " + this.moneyComma(this.jobOrder["orderPrice"]);
        jobOrder.orderCurrencyCodeDisplay = this.jobOrder.orderCurrencyCode;
        // レート換算
        jobOrder.orderRateDisplay = "1" + this.jobOrder.orderCurrencyCode + " = \n" + this.jobOrder.orderRate + this.loginUserData["defaultCurrencyCode"];
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
        jobOrder.shippingCostBudgetDisplay = defaultDisplay + this.moneyComma(this.jobOrder.shippingCostBudget);
        jobOrder.directCostBudgetDisplay = defaultDisplay + this.jobOrder["costs"]["directCostBudget"];
        jobOrder.limitProfitBudgetDisplay = defaultDisplay + this.jobOrder["costs"]["limitProfitBudget"];
        jobOrder.limitProfitPercentageBudget =this.jobOrder["costs"]["limitProfitPercentageBudget"] + "%";
        // 材料費実績
        if((this.directCosts.results).length !== 0) {
          // 材料費集計結果
          jobOrder.commercialPartsResult = defaultDisplay + this.moneyComma(this.directCosts.results[0].toFixed(2));
          jobOrder.electricalPartsResult = defaultDisplay + this.moneyComma(this.directCosts.results[1].toFixed(2));
          jobOrder.processedPartsResult = defaultDisplay + this.moneyComma(this.directCosts.results[2].toFixed(2));
          jobOrder.outsourcingMechanicalDesignResult = defaultDisplay + this.moneyComma(this.directCosts.results[3].toFixed(2));
          jobOrder.outsourcingElectricalDesignResult = defaultDisplay + this.moneyComma(this.directCosts.results[4].toFixed(2));
          jobOrder.outsourcingOtherResult = defaultDisplay + this.moneyComma(this.directCosts.results[5].toFixed(2));
          jobOrder.shippingCostResultDisplay = defaultDisplay + this.moneyComma(this.jobOrder.shippingCostResult);
          jobOrder.directCostResult = defaultDisplay + this.moneyComma(this.directCosts.directCost.toFixed(2));
          jobOrder.limitProfitResult = defaultDisplay + this.moneyComma(this.directCosts.limitProfit.toFixed(2));
          jobOrder.limitProfitPercentageResult =this.directCosts.limitProfitPercentage.toFixed(2) + "%";
          // 仕損費集計結果
          jobOrder.commercialPartsFailure = defaultDisplay + this.moneyComma(this.directCosts.failure[0].toFixed(2));
          jobOrder.electricalPartsFailure = defaultDisplay + this.moneyComma(this.directCosts.failure[1].toFixed(2));
          jobOrder.processedPartsFailure = defaultDisplay + this.moneyComma(this.directCosts.failure[2].toFixed(2));
          jobOrder.outsourcingMechanicalDesignFailure = defaultDisplay + this.moneyComma(this.directCosts.failure[3].toFixed(2));
          jobOrder.outsourcingElectricalDesignFailure = defaultDisplay + this.moneyComma(this.directCosts.failure[4].toFixed(2));
          jobOrder.outsourcingOtherFailure = defaultDisplay + this.moneyComma(this.directCosts.failure[5].toFixed(2));
          jobOrder.directCostFailure = defaultDisplay + this.moneyComma(this.directCosts.directFailure.toFixed(2));
          jobOrder.failurePercentage =this.directCosts.failurePercentage.toFixed(2) + "%";
        }
        // 労務費予算
        jobOrder.mechanicalDesignBudgetHoursDisplay = this.jobOrder.mechanicalDesignBudgetHours + " h";
        jobOrder.mechanicalDesignBudgetPrice = defaultDisplay + this.moneyComma((this.jobOrder.mechanicalDesignBudgetHours * timeCharge).toFixed(2));
        jobOrder.electricalDesignBudgetHoursDisplay = this.jobOrder.electricalDesignBudgetHours + " h";
        jobOrder.electricalDesignBudgetPrice = defaultDisplay + this.moneyComma((this.jobOrder.electricalDesignBudgetHours * timeCharge).toFixed(2));
        jobOrder.assemblyBudgetHoursDisplay = this.jobOrder.assemblyBudgetHours + " h";
        jobOrder.assemblyBudgetPrice = defaultDisplay + this.moneyComma((this.jobOrder.assemblyBudgetHours * timeCharge).toFixed(2));
        jobOrder.electricalWiringBudgetHoursDisplay = this.jobOrder.electricalWiringBudgetHours + " h";
        jobOrder.electricalWiringBudgetPrice = defaultDisplay + this.moneyComma((this.jobOrder.electricalWiringBudgetHours * timeCharge).toFixed(2));
        jobOrder.installationBudgetHoursDisplay = this.jobOrder.installationBudgetHours + " h";
        jobOrder.installationBudgetPrice = defaultDisplay + this.moneyComma((this.jobOrder.installationBudgetHours * timeCharge).toFixed(2));
        jobOrder.workingHoursBudgetDisplay = this.jobOrder["costs"]["workingHoursBudget"] + " h";
        jobOrder.laborCostBudgetDisplay = defaultDisplay + this.moneyComma(this.jobOrder["costs"]["laborCostBudget"]);
        // 労務費実績
        if((this.laborCost.results).length !== 0) {
          jobOrder.mechanicalDesignResultHoursDisplay = this.laborCost.results[0].toFixed(2) + " h";
          jobOrder.mechanicalDesignResultPrice = defaultDisplay + this.moneyComma((this.laborCost.results[0] * timeCharge).toFixed(2));
          jobOrder.electricalDesignResultHoursDisplay = this.laborCost.results[1].toFixed(2) + " h";
          jobOrder.electricalDesignResultPrice = defaultDisplay + this.moneyComma((this.laborCost.results[1] * timeCharge).toFixed(2));
          jobOrder.assemblyResultHoursDisplay = this.laborCost.results[2].toFixed(2) + " h";
          jobOrder.assemblyResultPrice = defaultDisplay + this.moneyComma((this.laborCost.results[2] * timeCharge).toFixed(2));
          jobOrder.electricalWiringResultHoursDisplay = this.laborCost.results[3].toFixed(2) + " h";
          jobOrder.electricalWiringResultPrice = defaultDisplay + this.moneyComma((this.laborCost.results[3] * timeCharge).toFixed(2));
          jobOrder.installationResultHoursDisplay = this.laborCost.results[4].toFixed(2) + " h";
          jobOrder.installationResultPrice = defaultDisplay + this.moneyComma((this.laborCost.results[4] * timeCharge).toFixed(2));
          jobOrder.workingHoursResultDisplay = this.laborCost.totalWorkHours.toFixed(2) + " h";
          jobOrder.laborCostResultDisplay = defaultDisplay + this.moneyComma((this.laborCost.totalWorkHours * timeCharge).toFixed(2));
          // 仕損費集計結果
          jobOrder.mechanicalDesignFailureHoursDisplay = this.laborCost.failure[0].toFixed(2) + " h";
          jobOrder.mechanicalDesignFailurePrice = defaultDisplay + this.moneyComma((this.laborCost.failure[0] * timeCharge).toFixed(2));
          jobOrder.electricalDesignFailureHoursDisplay = this.laborCost.failure[1].toFixed(2) + " h";
          jobOrder.electricalDesignFailurePrice = defaultDisplay + this.moneyComma((this.laborCost.failure[1] * timeCharge).toFixed(2));
          jobOrder.assemblyFailureHoursDisplay = this.laborCost.failure[2].toFixed(2) + " h";
          jobOrder.assemblyFailurePrice = defaultDisplay + this.moneyComma((this.laborCost.failure[2] * timeCharge).toFixed(2));
          jobOrder.electricalWiringFailureHoursDisplay = this.laborCost.failure[3].toFixed(2) + " h";
          jobOrder.electricalWiringFailurePrice = defaultDisplay + this.moneyComma((this.laborCost.failure[3] * timeCharge).toFixed(2));
          jobOrder.installationFailureHoursDisplay = this.laborCost.failure[4].toFixed(2) + " h";
          jobOrder.installationFailurePrice = defaultDisplay + this.moneyComma((this.laborCost.failure[4] * timeCharge).toFixed(2));
          jobOrder.workingHoursFailureDisplay = this.laborCost.totalWorkHours.toFixed(2) + " h";
          jobOrder.laborCostFailureDisplay = defaultDisplay + this.moneyComma((this.laborCost.totalFailure * timeCharge).toFixed(2));
        }
        // 集計値予算
        jobOrder.shippingCostBudgetDisplay = defaultDisplay + "0.00";
        jobOrder.manufacturingCostBudgetDisplay = defaultDisplay + this.moneyComma(this.jobOrder["costs"]["manufacturingCostBudget"]);
        jobOrder.totalProfitBudgetDisplay = defaultDisplay + this.moneyComma(this.jobOrder["costs"]["totalProfitBudget"]);
        jobOrder.totalProfitPercentageBudget =this.jobOrder["costs"]["totalProfitPercentage"] + "%";
        // 集計値実績
        jobOrder.shippingCostResultDisplay = defaultDisplay + this.moneyComma(jobOrder.shippingCostResult);
        let manufacturingCostResult = 0;
        manufacturingCostResult = this.directCosts.directCost + (this.laborCost.totalWorkHours * timeCharge);
        let orderAmount = Number(this.jobOrder["defaultCurrencyOrderAmount"].split(',').join(''));
        let profitResult = 0;
        profitResult = (Math.round(( orderAmount - manufacturingCostResult) * 100) / 100);
        let profitPercentageResult = 0;
        if(profitResult > 0) {
          profitPercentageResult = Math.round((profitResult / orderAmount * 100) * 100) / 100;
        } else if(profitResult < 0) {
          profitPercentageResult = Math.round((profitResult / orderAmount * 100) * 100) / 100;
        }
        jobOrder.manufacturingCostResultDisplay = defaultDisplay + this.moneyComma(manufacturingCostResult.toFixed(2));
        jobOrder.totalProfitResultDisplay = defaultDisplay + this.moneyComma(profitResult.toFixed(2));
        jobOrder.totalProfitPercentageResult = profitPercentageResult.toFixed(2) + "%";
        // 仕損費集計結果
        let manufacturingCostFailure = 0;
        manufacturingCostFailure = this.directCosts.directFailure + (this.laborCost.totalFailure * timeCharge);
        let totalFailurePercentage = 0;
        if(manufacturingCostResult > 0) {
          totalFailurePercentage = Math.round((manufacturingCostFailure / manufacturingCostResult * 100) * 100) / 100;
        }
        jobOrder.manufacturingCostFailureDisplay = defaultDisplay + this.moneyComma(manufacturingCostFailure.toFixed(2));
        jobOrder.totalFailurePercentage = totalFailurePercentage.toFixed(2) + "%";
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
    // 直接原価仕損費集計
    calcPartsFailureTotal(val) {
      let total = 0;
      if(val) {
        for (let i = 0; i < val.length; i++) {
          // failureがnullではない場合
          if(val[i].failure !== null) {
            total += val[i].totalDefaultCurrencyPrice;
            // console.log(total);
          }
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
    calcLaborFailureTotal(val) {
      let total = 0;
      if(val) {
        for (let i = 0; i < val.length; i++) {
          // failureがnullではない場合
          if(val[i].failure !== null) {
            total += parseFloat(val[i].workHour);
          }
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
