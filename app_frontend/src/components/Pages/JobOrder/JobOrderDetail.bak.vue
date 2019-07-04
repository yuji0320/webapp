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
                  <td class="text-center">{{ jobOrder["orderCurrencyData"].code }}</td>
                  <td class="text-center">Order Rate</td>
                  <td class="text-center">{{ jobOrder.orderRateDisplay }}</td>
                </tr>
                <tr>
                  <td colspan="2" class="text-right">Order Price ({{loginUserData["defaultCurrencyCode"]}} )</td>
                  <td colspan="2" class="text-right">{{ jobOrderData.orderPriceDefault }}</td>
                  <td colspan="2">(Exclude Tax)</td>
                </tr>
                <tr>
                  <td colspan="2" class="text-right">Tax</td>
                  <td colspan="2" class="text-right">{{ jobOrder.taxPrice }}</td>
                  <td colspan="2">{{ jobOrder.taxPercent }}</td>
                </tr>
                <tr>
                  <td colspan="2" class="text-right"><strong>Total</strong></td>
                  <td colspan="2" class="text-right"><strong>{{ jobOrder.orderTotal }}</strong></td>
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
                <td class="text-center" style="width : 200px !important;"></td>
                <td class="text-center" style="width : 100px !important;">Budjet</td>
                <td class="text-center" style="width : 100px !important;">Results</td>
                <td class="text-center" style="width : 100px !important;">Failure</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center"></td>
                <td class="text-right"></td>
                <td class="text-right"></td>
                <td class="text-right"></td>
              </tr>
              <tr>
                <td class="text-center"></td>
                <td class="text-right"></td>
                <td class="text-right"></td>
                <td class="text-right"></td>
              </tr>
              <tr>
                <td class="text-center"></td>
                <td class="text-right"></td>
                <td class="text-right"></td>
                <td class="text-right"></td>
              </tr>
              <tr>
                <td class="text-center"></td>
                <td class="text-right"></td>
                <td class="text-right"></td>
                <td class="text-right"></td>
              </tr>
              <tr>
                <td class="text-center"></td>
                <td class="text-right"></td>
                <td class="text-right"></td>
                <td class="text-right"></td>
              </tr>
              <tr>
                <td class="text-center"><strong></strong></td>
                <td class="text-right"><strong></strong></td>
                <td class="text-right"><strong></strong></td>
                <td class="text-right"><strong></strong></td>
              </tr>
            </tbody>
          </table>

        </v-container>
      </span>

    </app-card>
  </v-container>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["expenseCategories"]),
    ...mapState("jobOrderAPI", ["mfgNo", "jobOrder"]),
    ...mapState("billOfMaterialAPI", ["billOfMaterials"]),
    // 作業指図書表示用データ作成
    jobOrderData() {
      // デフォルト通貨記号
      let defaultDisplay = this.loginUserData["defaultCurrencyDisplay"] + " ";
      let jobOrder = this.jobOrder;
      // 作業指図書発行者
      jobOrder.publisherName = "";
      if(this.jobOrder.publisher){
        jobOrder.publisherName = this.jobOrder["publisherData"]["staffNumber"] + " : " + this.jobOrder["publisherData"]["fullName"]
      }
      // 設計者
      jobOrder.designerName = "";
      if(this.jobOrder.designer){
        jobOrder.designerName = this.jobOrder["designerData"]["staffNumber"] + " : " + this.jobOrder["designerData"]["fullName"]
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
      // レート換算
      jobOrder.orderRateDisplay = "1" + this.jobOrder["orderCurrencyData"].code + " = \n" + this.jobOrder.orderRate + this.loginUserData["defaultCurrencyCode"];
      // 受注金額基準通貨
      jobOrder.orderPriceDefault = defaultDisplay + this.jobOrder["defaultCurrencyOrderAmount"];
      // 税額
      jobOrder.taxPrice = defaultDisplay + this.jobOrder["costs"]["taxPrice"];
      jobOrder.taxPercent = "(" + this.jobOrder.taxPercent + "%)";
      // 合計金額
      jobOrder.orderTotal = defaultDisplay + this.jobOrder["costs"]["orderTotal"];







      return jobOrder
    }
  },
  methods: {
    ...mapActions("jobOrderAPI", ["getJobOrder", "isEdit"]),
    ...mapActions("systemMasterApi", ["getExpenseCategories"]),
    ...mapActions("billOfMaterialAPI", ["getBillOfMaterials"]),
    // 三点カンマ作成関数
    moneyComma(value) {
      return value.toString().replace(/(\d)(?=(\d{3})+($|\.\d+))/g, '$1,');
    },
    edit() {
      this.isEdit();
      this.$router.push({ name: "JobOrderEdit" });
    },
    print() {

    },
    backToMenu() {
      this.$router.push({ name: "JobOrderList" });
    },
  },
  created() {
    this.$store.commit("systemConfig/setLoading", false);
    this.getExpenseCategories({params: {"order_by": "category_number"}});
  },
  mounted() {
    this.getJobOrder(this.mfgNo);
    // this.getBillOfMaterials({params: this.params});
  }
}
</script>

<style>

</style>
