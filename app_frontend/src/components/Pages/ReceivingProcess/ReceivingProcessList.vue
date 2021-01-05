<template>
  <v-container fluid grid-list-lg>
    <!-- 確認ダイアログ -->
    <app-confirm ref="confirm"></app-confirm>

    <app-card-table
      ref="card_table"
      :editableCard="true"
    >
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>move_to_inbox</v-icon></span>
      <span slot="card-header-title">Receiving process {{ switchParams.title }}</span>

      <!-- 戻るボタン -->
      <span slot="card-header-button">
        <v-btn @click="backToMenu" >
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
      </span>

      <!-- テーブル表示 -->
      <span slot="editable-card">

        <!-- Cardタイトル -->
        <v-card-text>
          <p>Supply from : </p><p class="display-1 text--primary">{{ userPartner.name }}</p>
        </v-card-text>

        <v-data-table
          :headers="headers"
          :items="receivingProcesses.results"
          class="elevation-1"
          disable-sort
          hide-default-footer
          :items-per-page="receivingProcesses.results.length"
          :loading="$store.state.systemConfig.loading"
          dense
        >
          <!-- テーブルデータ -->
          <template v-slot:item="props">
            <tr
              :class="{
                'suspenseComplete': props.item.suspenseReceivedDate,
                'dataList': true
              }"
              @dblclick="editReceivingProcess(props.item)"
              max-width="100%"
            >
              <td class="">{{ props.item.orderNumber }}</td>
              <td>{{ props.item.partName }}</td>
              <td>{{ props.item.partDetail }}</td>
              <td>{{ props.item.partDetailOther }}</td>
              <td>{{ props.item.desiredDeliveryDate }}</td>
              <td>
                <app-input-date
                  label="Received Date"
                  v-model="props.item.receivedDate"
                  :errorMessages="props.error"
                  :disabled = "props.item.isReceived"
                ></app-input-date >
              </td>
              <td class="text-right">{{ props.item.orderAmount }}</td>
              <td>
                <v-text-field
                  label="Qty"
                  placeholder="Qty"
                  v-model="props.item.amount"
                  class="right-input"
                  :disabled = "props.item.isReceived"
                ></v-text-field>
              </td>
              <td class="text-right">{{ props.item.orderPriceDisplay }}</td>
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
                <v-btn @click="submitData(props.item)" :disabled = "props.item.isReceived">
                  Submit
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </span>
    </app-card-table>

    <app-received-dialog @response-function="responseFunction" ref="receiveDialog">
      <span slot="edit-order" d-inline-flex>
        <v-btn color="primary" dark @click="editMakingOrder">Edit Order File</v-btn>
      </span>
    </app-received-dialog>

    <!-- 発注ファイル -->
    <app-order-dialog @response-function="responseFunction" ref="orderDialog">
      <span d-inline-flex slot="edit-bom">
        <v-btn color="primary" dark @click="editBillOfMaterial" v-if="hasMFGNo">Edit Bill of Material</v-btn>
      </span>
    </app-order-dialog>
    <!-- 部品票ダイアログ -->
    <app-bom-dialog @response-function="responseFunction" ref="bomDialog" :hideButtons="true"></app-bom-dialog>

    <!-- エラーダイアログ -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="headline error">There is some error</v-card-title>
        <!-- エラー内容表示 -->
        <v-card-text>
          <v-list 
            :flat="true"
          >
            <v-list-item-group>
              <v-list-item
                v-for="(item, i) in errorList"
                :key="i"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ item }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
        <!-- 閉じるボタン -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


  </v-container>
</template>

<script>
  import { mapState, mapActions } from "vuex";
  import CardTable from '@/components/Module/Cards/CardTable.vue';
  import SearchToolbar from "@/components/Module/Search/SearchToolbar.vue";
  import ReceivingProcessDialog from '@/components/Module/Dialogs/ReceivingProcessDialog.vue';
  import MakingOrderDialog from '@/components/Module/Dialogs/MakingOrderDialog.vue';
  import BillOfMaterialDialog from '@/components/Module/Dialogs/BillOfMaterialDialog.vue';

  export default {
    title: "Receiving Process List",
    name: "ReceivingProcessList",
    components: {
      "app-card-table": CardTable,
      "app-search-toolbar": SearchToolbar,
      "app-order-dialog": MakingOrderDialog,
      "app-bom-dialog": BillOfMaterialDialog,
      "app-received-dialog": ReceivingProcessDialog,
    },    
    data() {
      return {
        dialog: false,
        errorList: [],
        orderBy: 'suspense_received_date,order__supplier__name,order__manufacturer__name,order__standard,order__drawing_number',
        headers: [
          { text: "No.", value:"number", width:"5%"},
          { text: "Partner name", value:"name", width:"10%" },
          { text: "Standard / Drawing No", value:"", width:"15%" },
          { text: "Other", value:"", width:"5%" },
          { text: "Desire Date", value:"", width:"5%" },
          { text: "Received Date", value:"", width:"10%" },
          { text: "Order Qty", value:"", width:"5%" },
          { text: "Received Qty", value:"", width:"15%" },
          { text: "Order UP", value:"", width:"5%" },
          { text: "Received UP", value:"", width:"15%" },
          { text: "Action", value:"", width:"10%" }
        ],
      }
    },
    computed: {
      ...mapState("auth", ["loginUserData"]),
      ...mapState("systemMasterApi", ["unitTypes", "expenseCategories", "expenseCategory"]),
      ...mapState("systemUserApi", ["userPartner", "userCompany"]),
      ...mapState("jobOrderAPI", ["jobOrder"]),
      ...mapState("billOfMaterialAPI", ["billOfMaterials", "billOfMaterial"]),
      ...mapState("makingOrderAPI", ["makingOrders", "makingOrder"]),
      ...mapState("receivingProcessAPI", [
        "responseError", "jobOrderID", "supplierID", "orderNumber", "receivingProcesses", "receivingProcess"
      ]),
      hasMFGNo() {
        return !!this.jobOrderID;
      },
      hasOrderNumber() {
        return !!this.orderNumber;
      },
      // ページごとの設定
      switchParams: function () {
        let title = "";
        if (this.hasOrderNumber) {
          // 発注番号ありの場合
          title = " - Order Number " + this.orderNumber;
          return {
            params: {
              company: this.loginUserData["companyId"],
              order__number: this.orderNumber,
              is_received: false,
              order_by: this.orderBy,
            },
            title: title
          }
        } else {
          if (this.hasMFGNo) {
            // 工事番号ありの場合
            title = " : " + this.jobOrder.mfgNo + " - " + this.jobOrder.name;
            return {
              params: {
                company: this.loginUserData["companyId"],
                order__bill_of_material__job_order: this.jobOrderID,
                is_received: false,
                order__supplier: this.supplierID,
                order_by: this.orderBy,
                page_size: 1000
              },
              title: title
            }
          } else {
            // 工事番号なしの場合
            title = " without MFG No";
            return {
              params: {
                company: this.loginUserData["companyId"],
                is_received: false,
                no_bom: true,
                order__supplier: this.supplierID,
                order_by: this.orderBy,
                page_size: 1000
              },
              title: title
            }
          }
        }
      }
    },
    methods: {
      ...mapActions("systemConfig", ["showSnackbar"]),
      ...mapActions("systemMasterApi", ["getUnitTypes", "getExpenseCategories", "getExpenseCategory"]),
      ...mapActions("jobOrderAPI", ["getJobOrder"]),
      ...mapActions("systemUserApi", ["getPartner", "getCompany"]),
      ...mapActions("billOfMaterialAPI", ["setBillOfMaterial", "getBillOfMaterial"]),
      ...mapActions("makingOrderAPI", ["setMakingOrder", "getMakingOrder"]),
      ...mapActions("receivingProcessAPI", ["getReceivingProcesses", "putReceivingProcess", "setReceivingProcessesList", "setReceivingProcess"]),
      // 入力数値確認
      isNumber(numVal){
        // チェック条件パターン(整数15桁、少数2桁)
        let pattern = /^([-+]?[1-9][0-9]{0,14}|0)(\.[0-9]{1,2})?$/;
        // 数値チェック
        return pattern.test(numVal);
      },
      async getList(data) {
        this.$store.commit("systemConfig/setLoading", true);
        await this.getReceivingProcesses(data);
        this.$store.commit("systemConfig/setLoading", false);
      },
      backToMenu() {
        this.$router.push({ name: "ReceivingProcessMenu" });
      },
      // データの読み込み
      loadData() {
        if (this.supplierID) {
          this.getPartner(this.supplierID);
        }
        this.getExpenseCategories({params: {"order_by": "category_number"}});
        if (this.hasMFGNo) {
          this.getJobOrder(this.jobOrderID);
        }
        this.getList({params: this.switchParams.params});
      },
      // 仕入れファイル編集
      editReceivingProcess(val) {
        this.setReceivingProcess(val);
        this.$refs.receiveDialog.openDialogReceive();
      },
      // 発注ファイル編集
      async editMakingOrder() {
        let res = await this.getMakingOrder(this.receivingProcess.order);
        this.setMakingOrder(res);
        this.$refs.orderDialog.openDialogMO();
      },
      // 部品表ファイル編集
      async editBillOfMaterial() {
        let res = await this.getBillOfMaterial(this.makingOrder.billOfMaterial);
        this.setBillOfMaterial(res);
        this.$refs.bomDialog.openDialogBOM();
      },
      // 処理結果統合フォーム
      responseFunction(val) {
        // リストをリロード
        this.getList({ params: this.switchParams.params });
        // Snackbar表示
        this.showSnackbar(val.snack);
      },
      // 仕入処理
      async submitData(val) {
        // console.log(val);
        // let err = false;
        this.errorList = [];
        let receivedDate = val.receivedDate;
        let orderAmount = val.orderAmount;
        let receivedAmount = val.amount;
        let receivedUP = val.unitPrice;
        let orderUP = val.orderPrice;
        // 日付未入力時エラー
        if(!receivedDate) {
          // err = true;
          this.errorList.push("Received date is require field");
        }
        // 個数エラー
        if(!receivedAmount) {
          // 未入力
          // err = true;
          this.errorList.push("Received amount is require field");
        } else {
          // 不一致
          let amount = orderAmount - receivedAmount;
          if(amount !== 0) {
            // err = true;
            this.errorList.push("Order amount and received amount does not match");
          }
        }
        // 単価エラー
        if(!receivedUP) {
          // 金額の入力確認
          this.errorList.push("Received Unit Price is required field");
        } else if (!this.isNumber(receivedUP)) {
          // データフォーマット確認
          this.errorList.push("Received Unit Price allow only number (decimal 2)");
        } else {
          if (receivedUP.match("^[-+]?[0-9]+$")) {
            // 整数の場合は".00"を追加する
            receivedUP = parseInt(receivedUP).toFixed(2);
            console.log(receivedUP);
          }
          let res = "";
          // 発注金額と仕入金額の一致確認
          res = await this.checkPrice(receivedUP, orderUP);
          if(!res) {
            this.errorList.push("Received Price and Order Price is not same. \n Please edit order file and input correct price.");
          }
        }
        // 登録処理
        if(this.errorList.length) {
          this.dialog = true;
        } else {
          // エラーがない場合は仕入処理を行う
          val.modifiedBy = this.loginUserData.id;
          // // 仮仕入未処理の場合は仮仕入日を入れる
          if(!val.suspenseReceivedDate) {
            val.suspenseReceivedDate = receivedDate;
          }
          // 仕入済みステータスの付与
          val.isReceived = true;

          // 更新処理
          let res = await this.putReceivingProcess(val);
          this.showSnackbar(res.snack);
          this.loadData();
        }
      },
      // 仕入ファイルと発注の金額差チェック
      async checkPrice(receivedUP, orderUP) {
        let res = {};
        let received = parseFloat(receivedUP);
        let order = parseFloat(orderUP);
        // console.log(received, order);
        if(received!==order) {
          // 単価が違う場合はFalse
          return false;
        } else {
          // 単価が同じ場合は処理しない
          return true;
        }
      }
    },
    created() {
      // もし工事番号等がクリアの場合はメニューにリダイレクトする
      if(!this.supplierID && !this.orderNumber) {
        this.$router.push({ name: "ReceivingProcessMenu" });
      } else {
        this.setReceivingProcessesList({});
        this.loadData();
        // console.log("load!");
      }
    },
  }
</script>

<style>

</style>
