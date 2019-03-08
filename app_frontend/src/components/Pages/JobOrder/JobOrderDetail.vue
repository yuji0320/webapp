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
                  <td colspan="1" class="text-center">Manufacturing Number</td>
                  <td colspan="1">{{ jobOrder.mfgNo }}</td>
                  <td colspan="1" class="text-center">Publisher</td>
                  <td colspan="1" class="text-center">
                    <span v-if="jobOrder.publisher">
                      {{ jobOrder.publisherData.staffNumber }} : {{ jobOrder.publisherData.fullName }}
                    </span>
                  </td>
                <td colspan="1" class="text-center">Designer</td>
                  <td colspan="1" class="text-center">
                    <span v-if="jobOrder.designer">
                      {{ jobOrder.designerData.staffNumber }} : {{ jobOrder.designerData.fullName }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" class="text-center">Product Name</td>
                  <td colspan="4">{{ jobOrder.name }}</td>
                </tr>
                <tr>
                  <td colspan="2" class="text-center">Customer</td>
                  <td colspan="4">
                    <span v-if="jobOrder.customer">
                      {{ jobOrder.customerData.name }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" class="text-center">Delivery Destination</td>
                  <td colspan="4">
                    <span v-if="jobOrder.deliveryDestination">
                      {{ jobOrder.deliveryDestinationData.name }}
                    </span>
                  </td>
                </tr>
                <tr>						
                  <td class="text-center">Order Date</td>				
                  <td>{{ jobOrder.orderDate }}</td>
                  <td class="text-center">Delivery Date</td>					
                  <td>{{ jobOrder.deliveryDate }}</td>
                  <td class="text-center">Completion Date</td>
                  <td>{{ jobOrder.completionDate }}</td>
                </tr>
                <tr>
                  <td class="text-center">Order Price ({{ jobOrder.orderCurrencyData.code }})</td>				
                  <td class="text-right">{{ jobOrder.orderCurrencyData.display }} {{ jobOrder.orderPrice | moneyDelemiter }}</td>
                  <td class="text-center">Order Currency</td>					
                  <td class="text-center">{{ jobOrder.orderCurrencyData.code }}</td>
                  <td class="text-center">Rate</td>
                  <td class="text-center">1{{ jobOrder.orderCurrencyData.code }} = {{ jobOrder.orderRate }}{{ loginUserData.defaultCurrencyCode }}</td>                
                </tr>

                <tr>
                  <td colspan="2" class="text-right">Order Price({{ loginUserData.defaultCurrencyCode }})</td>
                  <td colspan="2" class="text-right">
                    {{ loginUserData.defaultCurrencyDisplay }} {{ jobOrder.defaultCurrencyOrderAmount }}
                  </td>
                  <td colspan="2">(Exclude tax)</td>
                </tr>
                <tr>
                  <td colspan="2" class="text-right">Tax</td>
                  <td colspan="2" class="text-right">
                    {{ loginUserData.defaultCurrencyDisplay }} {{ jobOrder.costs.taxPrice }}
                  </td>
                  <td colspan="2">({{ jobOrder.taxPercent | moneyDelemiter }}%)</td>
                </tr>
                <tr>
                  <td colspan="2" class="text-right"><strong>Total</strong></td>
                  <td colspan="2" class="text-right">
                    <strong>
                      {{ loginUserData.defaultCurrencyDisplay }} {{ jobOrder.costs.orderTotal | moneyDelemiter }}
                    </strong>
                  </td>
                  <td colspan="2"></td>
                </tr>
                <tr>
                  <td colspan="1" class="text-center">Note</td>
                  <td colspan="5">{{ jobOrder.notes }}</td>
                </tr>
              </tbody>
            </table>

            <table class="table table-bordered">
              <thead>
                <tr>
                  <td class="text-center" style="width : 200px !important;"></td>
                  <td class="text-center" style="width : 100px !important;">Budget</td>
                  <td class="text-center" style="width : 100px !important;">Results</td>
                  <td class="text-center" style="width : 100px !important;">Failure</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-center">Commercial parts costs</td>
                  <td class="text-right">{{ loginUserData.defaultCurrencyDisplay }} {{ jobOrder.commercialPartsBudget }}</td>
                  <td class="text-right"></td>
                  <td class="text-right"></td>
                </tr>
                <tr>
                  <td class="text-center">Electrical parts costs</td>
                  <td class="text-right">{{ loginUserData.defaultCurrencyDisplay }} {{ jobOrder.electricalPartsBudget }}</td>
                  <td class="text-right"></td>
                  <td class="text-right"></td>
                </tr>
                <tr>
                  <td class="text-center">Processed parts costs</td>
                  <td class="text-right">{{ loginUserData.defaultCurrencyDisplay }} {{ jobOrder.processedPartsBudget }}</td>
                  <td class="text-right"></td>
                  <td class="text-right"></td>
                </tr>
                <tr>
                  <td class="text-center">Direct Cost</td>
                  <td class="text-right">{{ loginUserData.defaultCurrencyDisplay }} {{ jobOrder.costs.directCostBudjet }}</td>
                  <td class="text-right"></td>
                  <td class="text-right"></td>
                </tr>
                <tr>
                  <td class="text-center">Limit Profit</td>
                  <td class="text-right">{{ loginUserData.defaultCurrencyDisplay }} {{ jobOrder.costs.limitProfitBudget }}</td>
                  <td class="text-right"></td>
                  <td class="text-right"></td>
                </tr>
                <tr>
                  <td class="text-center"><strong>Limit Profit Percentage</strong></td>
                  <td class="text-right"><strong>{{ jobOrder.costs.limitProfitPercentageBudjet }}%</strong></td>
                  <td class="text-right"></td>
                  <td class="text-right"></td>
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
    return {};
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("jobOrderAPI", [
      "responseError",
      "mfgNo",
      "jobOrders",
      "jobOrder",
      "jobOrderStatus"
    ])
  },
  methods: {
    ...mapActions("jobOrderAPI", ["getJobOrder", "isEdit"]),
    edit() {
      this.isEdit();
      this.$router.push({ name: "JobOrderEdit" });
    },
    backToList() {
      this.$router.push({ name: "JobOrderList" });
    }
  },
  mounted() {
    this.getJobOrder(this.mfgNo);
  }
};
</script>
