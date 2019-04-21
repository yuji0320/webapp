<template>
  <v-container fluid grid-list-lg>

    <!-- 確認ダイアログ -->
    <app-confirm ref="confirm"></app-confirm>

    <v-card>
      <!-- Cardヘッダー -->
      <v-toolbar card>
        <v-icon>move_to_inbox</v-icon>
        <v-toolbar-title class="font-weight-light">
          Receiving process "{{ jobOrder.mfgNo }} - {{ jobOrder.name }}"
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn @click="backToMenu" >
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
      </v-toolbar>

      <!-- Cardタイトル -->
      <v-card-title>
        <h2 class="font-weight-light">{{ userPartner.name }}</h2>
      </v-card-title>

      <!-- テーブル内容 -->
      <v-data-table
        :headers="headers"
        :items="receivingProcesses.results"
        :hide-actions="true"
        class="mi-table elevation-1"
        disable-initial-sort
        :loading="$store.state.systemConfig.loading"
      >
        <template slot="headers" slot-scope="props">
            <tr class="mid-headercell">
                <th class="midh-text" v-for="(header, index) in props.headers" :key="index">
                  {{header.text}}
                </th>
            </tr>
        </template>

        <!-- テーブルデータ -->
        <template slot="items" slot-scope="props">
          <tr
            :class="{'complete': props.item.isReceived}"
          >
            <td class="">{{ props.item.orderData.number }}</td>
            <td>{{ props.item.orderData.name }}</td>
            <td>
              <template v-if="props.item.orderData.isProcessed">{{ props.item.orderData.drawingNumber }}</template>
              <template v-else>{{ props.item.orderData.standard }}</template>
            </td>
            <td>
              <template v-if="props.item.orderData.isProcessed">{{ props.item.orderData.material }}</template>
              <template v-else>
                <template v-if="props.item.orderData.manufacturerData">
                  {{ props.item.orderData.manufacturerData.abbr }}
                </template>
              </template>
            </td>
            <td>{{ props.item.orderData.desiredDeliveryDate }}</td>
            <td>
              <app-input-date 
                label="Received Date"
                v-model="props.item.receivedDate"
                :errorMessages="props.error"
                :disabled = "props.item.isReceived"
              ></app-input-date >
            </td>
            <td class="text-xs-right">{{ props.item.orderData.amount }}</td>
            <td>
              <v-text-field
                label="Qty"
                placeholder="Qty"
                v-model="props.item.amount"
                class="right-input"
                :disabled = "props.item.isReceived"
              ></v-text-field>
            </td>
            <td class="text-xs-right">{{ props.item.orderData.displayPrice }}</td>
            <td>
              <v-text-field
                label="Unit Price"
                placeholder="Unit Price"
                v-model="props.item.unitPrice"
                class="right-input"
                :disabled = "props.item.isReceived"
              ></v-text-field>
            </td>
            <td>
              <v-btn 
                @click="submitData(props.item)"
                :disabled = "props.item.isReceived"
              >Submit</v-btn>
            </td>            
          </tr>
        </template>
      </v-data-table>

      <v-dialog
        v-model="dialog"
        max-width="400"
      >
        <v-card>
          <v-card-title class="headline error">There is some error</v-card-title>

          <v-card-text>
            <ul>
              <li v-for="(item, index) in errorList" :key="index">
                {{ item }}
              </li>
            </ul>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="dialog = false">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
  title: "Receiving Process List",
  name: "ReceivingProcessList",
  data() {
    return {
      dialog: false,
      errorList: [],
      orderBy: "modified_at",
      headers: [
        { text: "No.", value:"", width:"10px" },
        { text: "Partner name", value:"", width:"5" },
        { text: "Standard / Dwaring No", value:"", width:"5" },
        { text: "Other Data", value:"", width:"5" },
        { text: "Desire Date", value:"", width:"5" },
        { text: "Received Date", value:"", width:"5" },
        { text: "Order Qty", value:"", width:"5" },
        { text: "Received Qty", value:"", width:"5" },
        { text: "Order Unit Price", value:"", width:"5" },
        { text: "Received Unit Price", value:"", width:"5" },
        { text: "Action", value:"", width:"5%" }
      ],
    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["unitTypes", "expenseCategories", "expenseCategory"]),
    ...mapState("systemUserApi", ["userPartner", "userCompany"]),
    ...mapState("jobOrderAPI", ["jobOrder"]),
    ...mapState("billOfMaterialAPI", ["billOfMaterials", "billOfMaterial"]),
    ...mapState("makingOrderAPI", ["makingOrders"]),
    ...mapState("receivingProcessAPI", [
      "responseError", "jobOrderID", "supplierID", "receivingProcesses", "receivingProcess"
    ]),
    params() {
      return {
        company: this.loginUserData.companyId,
        order__bill_of_material__job_order: this.jobOrderID,
        // is_received: false,
        supplier: this.supplierID,
        order_by: this.orderBy,
        page_size: 1000
      };
    },
  },
  methods: {
    ...mapActions("systemConfig", ["showSnackbar"]),
    ...mapActions("systemMasterApi", ["getUnitTypes", "getExpenseCategories", "getExpenseCategory"]),
    ...mapActions("jobOrderAPI", ["getJobOrder"]),
    ...mapActions("systemUserApi", ["getPartner", "getCompany"]),
    ...mapActions("billOfMaterialAPI", ["setBillOfMaterial", "putBillOfMaterial"]),
    ...mapActions("makingOrderAPI", ["setMakingOrder", "postMakingOrder", "putMakingOrder"]),
    ...mapActions("receivingProcessAPI", ["getReceivingProcesses", "putReceivingProcess"]),
    async submitData(val) {
      let err = false;
      this.errorList = [];
      let deliveryDate = val.orderData.desiredDeliveryDate;
      let receivedDate = val.receivedDate;
      let orderAmount = val.orderData.amount;
      let receivedAmount = val.amount;
      let orderUP = val.orderData.unitPrice;
      let receivedUP = val.unitPrice;

      if(!receivedDate) {
        err = true;
        this.errorList.push("Received date is require field");
      }
      if(!receivedAmount) {
        err = true;
        this.errorList.push("Received amount is require field");
      } else {
        let amount = orderAmount - receivedAmount;
        if(amount != 0) {
          err = true;
          this.errorList.push("Order amount and received amount does not match");
        }
      }
      if(!receivedUP) {
        err = true;
        this.errorList.push("Received Unit Price is require field");
      } else {
        let up = orderUP - receivedUP;
        if(up != 0) {
          err = true;
          this.errorList.push("Order Unit Price and received Unit Price does not match");
        }
      }

      if(err) {
        this.dialog = true;
      } else {
        // console.log(val);
        val.modifiedBy = this.loginUserData.id;
        val.isReceived = true;

        let update = await this.putReceivingProcess(val);
        console.log(update);

        this.loadData();
      }
      
    },
    backToMenu() {
      this.$router.push({ name: "ReceivingProcessMenu" });
    },
    // データの読み込み
    loadData() {
      this.getPartner(this.supplierID);
      this.getExpenseCategories({params: {"order_by": "category_number"}});
      this.getJobOrder(this.jobOrderID);
      this.getReceivingProcesses({params: this.params});
      // this.getMakingOrders({params: this.params});
    },    
  },
  created() {
    // もし工事番号等がクリアの場合はメニューにリダイレクトする
    if(!this.supplierID || !this.jobOrderID) {
      this.$router.push({ name: "ReceivingProcessMenu" });
    } else {
      this.loadData();
    }
  },
}
</script>

<style>
  .mi-table{
    table-layout : fixed;
  }
  .mid-headercell{
    text-align: center;
  }
  .midh-text{
    padding: 0px;
    font-weight: 100;
  }
</style>
