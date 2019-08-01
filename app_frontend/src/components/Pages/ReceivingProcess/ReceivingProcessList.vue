<template>
  <v-container fluid grid-list-lg>

    <!-- 確認ダイアログ -->
    <app-confirm ref="confirm"></app-confirm>

    <app-card>
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>move_to_inbox</v-icon></span>
      <span slot="card-header-title">Receiving process {{ switchParams.title }}</span>

      <!-- 戻るボタン -->
      <span slot="card-header-buck-button">
        <v-btn @click="backToMenu" >
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
      </span>

      <!-- カード上部検索機能コンポーネント -->
      <span slot="search-bar">
        <v-layout row wrap>
          <app-search-bar
                  :length="receivingProcesses.pages"
                  :count="receivingProcesses.count"
                  :orderBy="orderBy"
                  :incremental="incremental"
                  :params="switchParams.params"
                  @search-list="getList"
          ></app-search-bar>
        </v-layout>
      </span>

      <!-- Cardタイトル -->
      <span slot="card-title-text">
        <h2 class="font-weight-light">{{ userPartner.name }}</h2>
      </span>

      <span slot="card-content">
      <!-- テーブル内容 -->
        <v-data-table
                :headers="headers"
                :items="receivingProcesses.results"
                :hide-actions="true"
                class="elevation-1"
                disable-initial-sort
                :loading="$store.state.systemConfig.loading"
        >
          <!-- テーブルデータ -->
          <template slot="items" slot-scope="props">
            <tr 
              :class="{
                'suspenseComplete': props.item.suspenseReceivedDate,
                'dataList': true
                }" 
              @dblclick="editReceivingProcess(props.item)"
              max-width="100%"
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
                  <template v-if="props.item.orderData['manufacturerData']">
                    {{ props.item.orderData['manufacturerData'].abbr }}
                  </template>
                </template>
              </td>
              <td>{{ props.item.orderData.desiredDeliveryDate }}</td>
              <td>
                <app-input-date
                        label="Received Date"
                        v-model="props.item['receivedDate']"
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
              <td class="text-xs-right">{{ props.item.orderData["displayPrice"] }}</td>
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
        
        <v-dialog v-model="dialog" max-width="400">
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
      </span>

    </app-card>

    <app-received-dialog @response-function="responseFunction" ref="receive_dialog">
      <span slot="edit-order" d-inline-flex>
        <v-btn color="primary" dark @click="editMakingOrder">Edit Order File</v-btn>
        <v-btn color="primary" dark @click="editBillOfMaterial" v-if="hasMFGNo">Edit BOM File</v-btn>
      </span>
    </app-received-dialog>

    <!-- 発注ファイル -->
    <app-order-dialog @response-function="responseFunction" ref="order_dialog"></app-order-dialog>
    <!-- 部品票ダイアログ -->
    <app-bom-dialog @response-function="responseFunction" ref="bom_dialog" :hideButtons="true"></app-bom-dialog>

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
                orderBy: "-order__desired_delivery_date",
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
                // テーブル検索用データ
                incremental: {
                    // 検索カラムリスト
                    tableSelectItems: [
                        { label: "Part Name", value: "name" }
                    ],
                    // 検索数値の初期値および返り値
                    tableSelectValue: "name",
                    tableSearch: ""
                }
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
                    // 工事番号なしの場合
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
            ...mapActions("billOfMaterialAPI", ["setBillOfMaterial", "putBillOfMaterial"]),
            ...mapActions("makingOrderAPI", ["setMakingOrder", "postMakingOrder", "putMakingOrder"]),
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
            async submitData(val) {
                let err = false;
                this.errorList = [];
                // let deliveryDate = val.orderData.desiredDeliveryDate;
                let receivedDate = val["receivedDate"];
                let orderAmount = val.orderData.amount;
                let receivedAmount = val.amount;
                // let orderUP = val.orderData.unitPrice;
                let receivedUP = val.unitPrice;
                let orderData = val.orderData;

                if(!receivedDate) {
                    err = true;
                    this.errorList.push("Received date is require field");
                }
                if(!receivedAmount) {
                    err = true;
                    this.errorList.push("Received amount is require field");
                } else {
                    let amount = orderAmount - receivedAmount;
                    if(amount !== 0) {
                        err = true;
                        this.errorList.push("Order amount and received amount does not match");
                    }
                }
                if(!receivedUP) {
                    err = true;
                    this.errorList.push("Received Unit Price is required field");
                } else if (!this.isNumber(receivedUP)) {
                    err = true;
                    // console.log(receivedUP);
                    this.errorList.push("Received Unit Price allow only number (decimal 2)");
                } else {
                    if (receivedUP.match("^[-+]?[0-9]+$")) {
                        // 整数の場合は".00"を追加する
                        receivedUP = parseInt(receivedUP).toFixed(2);
                        console.log(receivedUP);
                    }
                    let res = "";
                    res = await this.checkPrice(receivedUP, orderData);
                    if(!res) {
                      this.errorList.push("Received Price and Order Price is not same. \n Please edit order file and input correct price.");
                    }
                }
                if(err) {
                    this.dialog = true;
                } else {
                    // console.log(val);
                    val.modifiedBy = this.loginUserData.id;
                    // 仮仕入未処理の場合は仕入日を入れる
                    if(!val.suspenseReceivedDate) {
                      val.suspenseReceivedDate = receivedDate;
                    }
                    val.isReceived = true;

                    await this.putReceivingProcess(val);
                    this.loadData();
                }
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
            // 仕入ファイルと発注の金額差チェック
            async checkPrice(receivedUP, orderData) {
                let res = {};
                let received = receivedUP;
                let order = orderData.unitPrice;
                console.log(orderData);
                if(received!==order) {
                  this.setMakingOrder(this.receivingProcess.orderData);
                  this.$refs["order_dialog"].editMakingOrder();
                  return false;
                } else {
                  // console.log("matched ");
                  // 単価が同じ場合は処理しない
                  return true;
                }
            },
            // 仕入れファイル編集
            editReceivingProcess(val) {
                this.setReceivingProcess(val);
                console.log(val.orderData);
                this.$refs["receive_dialog"].editReceivingProcess();
            },
            // 発注ファイル編集
            editMakingOrder() {
                this.setMakingOrder(this.receivingProcess.orderData);
                this.$refs["order_dialog"].editMakingOrder();
            },
            // 部品表ファイル編集
            editBillOfMaterial() {
                this.setBillOfMaterial(this.receivingProcess.orderData.billOfMaterial);
                this.$refs["bom_dialog"].editBillOfMaterial();
            },
            // 処理結果統合フォーム
            responseFunction(val) {
                // リストをリロード
                this.getList({ params: this.switchParams.params });
                // Snackbar表示
                this.showSnackbar(val.snack);
            },
        },
        created() {
            // もし工事番号等がクリアの場合はメニューにリダイレクトする
            if(!this.supplierID && !this.orderNumber) {
                this.$router.push({ name: "ReceivingProcessMenu" });
            } else {
                this.setReceivingProcessesList({});
                this.loadData();
            }
        },
    }
</script>

<style>

</style>
