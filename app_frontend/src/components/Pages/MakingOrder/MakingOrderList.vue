<template>
  <v-container 
    fluid
    grid-list-lg
  >
    <!-- 確認ダイアログ -->
    <app-confirm ref="confirm"></app-confirm>

    <!-- {{ billOfMaterials.count }} -->

    <!-- カード形式リストコンポーネント -->
    <app-card-table
      :headers="headerData"
      :items="makingOrders.results"
      :viewIcon="false"
      @edit-item="editMakingOrder"
      @delete-item="deleteMakingOrderData"
    >
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>send</v-icon></span>
      <span slot="card-header-title">Order - {{ expenseCategory.categoryName }} : "{{ jobOrder.mfgNo }} - {{ jobOrder.name }}" </span>

      <!-- 戻るボタン -->
      <span slot="card-header-buck-button">
        <v-btn @click="backToMenu" >
          <v-icon>reply</v-icon>
          Back to Menu
        </v-btn>
      </span>

      <!-- ダイアログ関係スロット -->
      <span slot="card-dialog">
        <app-dialog
          :formName="'makingOrderForm'"
          :hideButtons="true"
          dialogWidth="600px"
          @submit-form="submitMakingOrder"
          @clear-form="clearMakingOrder"
          ref="dialog"
        >

          <!-- フォーム内容 -->
          <span slot="dialog-contents">
            <v-layout wrap>
              <!-- 発注ファイルフォーム -->
              <h3 class="headline mb-0">Order File</h3>
              {{ makingOrder.billOfMaterialId }}

              <!-- エラー表示 -->
              <v-flex xs12>
                <v-alert 
                  value="true"
                  type="error"
                  v-if="responseError.nonFieldErrors"
                >
                  <li
                    v-for="(error, index) in responseError.nonFieldErrors"
                    :key="index"
                  >
                    {{ error }}
                  </li>
                </v-alert>
              </v-flex>

              <!-- 発注番号 -->
              <v-flex xs2 md2>
                <v-text-field 
                  label="No"
                  class="right-input"
                  disabled
                  v-model="makingOrder.number"
                ></v-text-field>
              </v-flex>
              <!-- 部品名 -->
              <v-flex xs2 md10>
                <v-text-field 
                  label="Part Name*"
                  v-model="makingOrder.name"
                  :error-messages="responseError.name"
                ></v-text-field>
              </v-flex>

              <!-- 加工部品の場合 -->
              <template v-if="this.expenseCategory.isProcessedParts">
                <!-- 図面番号 -->
                <v-flex xs12>
                  <v-text-field 
                    label="Drawing Number"
                    v-model="makingOrder.drawingNumber"
                    :error-messages="responseError.drawingNumber"
                  ></v-text-field>
                </v-flex>
                <!-- 材質 -->
                <v-flex xs12 md6>
                  <v-text-field 
                    label="Material"
                    v-model="makingOrder.material"
                    :error-messages="responseError.material"
                  ></v-text-field>
                </v-flex>
                <!-- 表面処理 -->
                <v-flex xs12 md6>
                  <v-text-field 
                    label="Surface treatment"
                    v-model="makingOrder.surfaceTreatment"
                    :error-messages="responseError.surfaceTreatment"
                  ></v-text-field>
                </v-flex>
              </template>

              <!-- 加工部品以外の場合 -->
              <template v-else>
                <!-- メーカー選択 -->
                <v-flex xs12>
                  <app-incremental-model-search
                    label="Manufacturer"
                    orderBy="name"
                    v-model="makingOrder.manufacturer"
                    searchType="partner"
                    filter="manufacturer"
                    :errorMessages="responseError.manufacturer"
                    ref="manufacturer"
                  ></app-incremental-model-search>
                </v-flex>
                <!-- 規格・寸法 -->
                <v-flex xs12 md6>
                  <v-text-field 
                    label="Standard/Form"
                    v-model="makingOrder.standard"
                    :error-messages="responseError.standard"
                  ></v-text-field>
                </v-flex>
                <!-- ユニット番号 -->
                <v-flex xs12 md6>
                  <v-text-field 
                    label="Unit Number"
                    v-model="makingOrder.unitNumber"
                    :error-messages="responseError.unitNumber"
                  ></v-text-field>
                </v-flex>
              </template>

              <!-- 個数 -->
              <v-flex xs12 md4>
                <v-text-field 
                  label="Amount"
                  v-model="makingOrder.amount"
                  class="right-input"
                  :error-messages="responseError.amount"
                ></v-text-field>
              </v-flex>
              <!-- 単位選択 -->
              <v-flex xs12 md8>
                <app-incremental-model-search
                  label="Unit Type"
                  orderBy="number"
                  v-model="makingOrder.unit"
                  searchType="unitType"
                  :errorMessages="responseError.unit"
                  ref="unitType"
                ></app-incremental-model-search>
              </v-flex>
              <!-- 金額 -->
              <v-flex xs4>
                <v-text-field 
                  label="Unit Price"
                  v-model="makingOrder.unitPrice"
                  :error-messages="responseError.unitPrice"
                  class="right-input"
                  @blur="checkPrice"
                ></v-text-field >
              </v-flex>
              <!-- 通貨 -->
              <v-flex xs12 md8>
                <app-incremental-model-search
                label="Currency"
                orderBy="id"
                v-model="makingOrder.currency"
                searchType="currency"
                :errorMessages="responseError.currency"
                ref="currency"
                ></app-incremental-model-search>
              </v-flex>
              <!-- レート -->
              <v-flex xs12 md4>
                <v-text-field 
                  label="Rate"
                  v-model="makingOrder.rate"
                  :error-messages="responseError.rate"
                  :suffix="loginUserData.defaultCurrencyCode"
                  hint="1 Order currency = "
                  :persistent-hint="true"
                  class="right-input"
                ></v-text-field >
              </v-flex>
              <!-- 仕入先選択 -->
              <v-flex xs12 md8>
                <app-incremental-model-search
                  label="Supplier"
                  orderBy="name"
                  v-model="makingOrder.supplier"
                  searchType="partner"
                  filter="supplier"
                  :errorMessages="responseError.supplier"
                  ref="supplier"
                ></app-incremental-model-search>
              </v-flex>
              <!-- 希望納期 -->
              <v-flex xs12 md4>
                <app-input-date 
                  label="Desired Delivery Date"
                  v-model="makingOrder.desiredDeliveryDate"
                  :errorMessages="responseError.desiredDeliveryDate"
                ></app-input-date>
              </v-flex>              

              <!-- 部品表編集ダイアログボタン -->
              <v-spacer></v-spacer>
              <v-btn color="primary" dark class="mb-2" @click="editMoBillOfMaterial">
                Edit Bill of material
              </v-btn>

              <!-- {{ makingOrder.billOfMaterial }} -->

              <!-- 部品表編集フォーム -->
              <app-dialog
                :formName="'moBillOfMaterialForm'"
                dialogWidth="600px"
                :hideButtons="true"
                dialogTitle="Edit Bill of Material"
                @submit-form="submitBillOfMaterial"
                ref="dialog_bom"
              >
                <!-- 部品表フォーム -->
                <span slot="dialog-contents" v-if="editBOM">
                  <!-- 部品名 -->
                  <v-flex xs12>
                    <v-text-field 
                      label="Part Name*"
                      v-model="billOfMaterial.name"
                    ></v-text-field>
                  </v-flex>

                  <template v-if="this.expenseCategory.isProcessedParts">
                    <!-- 図面番号 -->
                    <v-flex xs12>
                      <v-text-field 
                        label="Drawing Number"
                        v-model="billOfMaterial.drawingNumber"
                        :error-messages="responseError.drawingNumber"
                      ></v-text-field>
                    </v-flex>
                    <!-- 材質 -->
                    <v-flex xs12 md6>
                      <v-text-field 
                        label="Material"
                        v-model="billOfMaterial.material"
                        :error-messages="responseError.material"
                      ></v-text-field>
                    </v-flex>
                    <!-- 表面処理 -->
                    <v-flex xs12 md6>
                      <v-text-field 
                        label="Surface treatment"
                        v-model="billOfMaterial.surfaceTreatment"
                        :error-messages="responseError.surfaceTreatment"
                      ></v-text-field>
                    </v-flex>
                  </template>

                  <template v-else>
                    <!-- メーカー選択 -->
                    <v-flex xs12>
                      <app-incremental-model-search
                        label="Manufacturer"
                        orderBy="name"
                        v-model="billOfMaterial.manufacturer"
                        searchType="partner"
                        filter="manufacturer"
                        :errorMessages="responseError.manufacturer"
                        ref="manufacturer"
                      ></app-incremental-model-search>
                    </v-flex>
                    <!-- 規格・寸法 -->
                    <v-flex xs12 md6>
                      <v-text-field 
                        label="Standard/Form"
                        v-model="billOfMaterial.standard"
                        :error-messages="responseError.standard"
                      ></v-text-field>
                    </v-flex>
                    <!-- ユニット番号 -->
                    <v-flex xs12 md6>
                      <v-text-field 
                        label="Unit Number"
                        v-model="billOfMaterial.unitNumber"
                        :error-messages="responseError.unitNumber"
                      ></v-text-field>
                    </v-flex>
                  </template>

                  <!-- 個数 -->
                  <v-flex xs12 md4>
                    <v-text-field 
                      label="Amount"
                      v-model="billOfMaterial.amount"
                      class="right-input"
                      :error-messages="responseError.amount"
                    ></v-text-field>
                  </v-flex>
                  <!-- 単位選択 -->
                  <v-flex xs12 md8>
                    <app-incremental-model-search
                      label="Unit Type"
                      orderBy="number"
                      v-model="billOfMaterial.unit"
                      searchType="unitType"
                      :errorMessages="responseError.unit"
                      ref="unitType"
                    ></app-incremental-model-search>
                  </v-flex>
                  <!-- 在庫充当個数 -->
                  <v-flex xs12 md4>
                    <v-text-field 
                      label="Stock Appropriation"
                      v-model="billOfMaterial.stockAppropriation"
                      class="right-input"
                      :error-messages="responseError.stockAppropriation"
                    ></v-text-field>
                  </v-flex> 
                  <v-flex xs12 md8>
                  </v-flex> 
                  <!-- 金額 -->
                  <v-flex xs4>
                    <v-text-field 
                      label="Unit Price"
                      v-model="billOfMaterial.unitPrice"
                      :error-messages="responseError.unitPrice"
                      class="right-input"
                    ></v-text-field >
                  </v-flex>
                  <!-- 通貨 -->
                  <v-flex xs12 md8>
                    <app-incremental-model-search
                    label="Currency"
                    orderBy="id"
                    v-model="billOfMaterial.currency"
                    searchType="currency"
                    :errorMessages="responseError.currency"
                    ref="currency"
                    ></app-incremental-model-search>
                  </v-flex>
                  <!-- レート -->
                  <v-flex xs12 md4>
                    <v-text-field 
                      label="Rate"
                      v-model="billOfMaterial.rate"
                      :error-messages="responseError.rate"
                      :suffix="loginUserData.defaultCurrencyCode"
                      hint="1 Order currency = "
                      :persistent-hint="true"
                      class="right-input"
                    ></v-text-field >
                  </v-flex>
                  <!-- 希望納期 -->
                  <v-flex xs12 md4>
                    <app-input-date 
                      label="Desired Delivery Date"
                      v-model="billOfMaterial.desiredDeliveryDate"
                      :errorMessages="responseError.desiredDeliveryDate"
                    ></app-input-date >
                  </v-flex>       
                  <!-- 支給品Boolern -->
                  <v-flex xs12 md6>
                    <v-checkbox
                      label="is Customer Supplied"
                      v-model="billOfMaterial.isCustomerSupplied"
                      :errorMessages="responseError.isCustomerSupplied"
                    ></v-checkbox>
                  </v-flex>
                  <!-- 仕損費種別 -->
                  <v-flex xs12 md8>
                    <app-incremental-model-search
                    label="Failure"
                    orderBy="category_number"
                    v-model="billOfMaterial.failure"
                    searchType="failure"
                    :errorMessages="responseError.failure"
                    ref="failure"
                    ></app-incremental-model-search>
                  </v-flex>


                </span>              
              </app-dialog>
            </v-layout>
          </span>
        </app-dialog>
      </span>


      <!-- カード上部検索機能コンポーネント -->
      <div slot="search-bar">
        <v-layout row wrap>
          <app-search-bar
            :length="makingOrders.pages"
            :count="makingOrders.count"
            :orderBy="orderBy"
            :incremental="incremental"
            :params="params"
            @search-list="getList"
          ></app-search-bar>
        </v-layout>
      </div>


    </app-card-table>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Making Order List",
  name: "MakingOrderList",
  data() {
    return {
      // ダイアログ関係
      dialog: false,
      // 部品表編集ステータス
      editBOM:false,
      // 部品表デフォルト空データ
      bomDefault: {
        name: "",
      },
      // データ関係
      orderBy: "-created_at",
      // テーブルヘッダーデータ
      defaultHeadersTop: [
        { text: "No", value: "number" },
        { text: "Part Name", value: "name" }
      ],
      defaultHeadersEnd: [
        { text: "Supplier", value: "supplierData" , nest: "abbr"},
        { text: "Amount", value: "amount", class: "text-xs-right" },
        { text: "Unit Price", value: "displayPrice", class: "text-xs-right" },
        { text: "Delivery", value: "desiredDeliveryDate" },
        { text: "Action", value: "action", class: "text-xs-center" }
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
    ...mapState("jobOrderAPI", ["jobOrder"]),
    ...mapState("billOfMaterialAPI", ["billOfMaterials", "billOfMaterial"]),
    ...mapState("makingOrderAPI", [
      "responseError", "jobOrderID", "partsType", "makingOrders", "makingOrder"
    ]),
    params() {
      return {
        company: this.loginUserData.companyId,
        bill_of_material__job_order: this.jobOrderID,
        bill_of_material__type: this.partsType,
        order_by: this.orderBy,
      };
    },
    params_bom() {
      return {
        company: this.loginUserData.companyId,
        job_order: this.jobOrderID,
        type: this.partsType,
        is_printed: true,
        order_by: this.orderBy,
        page_size: 1000
      };
    },
    headerData() {
      // 部品種別ごとにテーブル表示項目を変更
      let header = [];
      if(this.expenseCategory.isProcessedParts) {
        header = this.defaultHeadersTop.concat(this.processedHeaders, this.defaultHeadersEnd);
      } else {
        header = this.defaultHeadersTop.concat(this.commercialHeaders, this.defaultHeadersEnd);
      }
      return header;
    },
  },
  methods: {
    ...mapActions("systemConfig", ["showSnackbar"]),
    ...mapActions("systemMasterApi", ["getUnitTypes", "getExpenseCategories", "getExpenseCategory"]),
    ...mapActions("jobOrderAPI", ["getJobOrder"]),
    ...mapActions("billOfMaterialAPI", ["getBillOfMaterials", "setBillOfMaterials", "setBillOfMaterial", "putBillOfMaterial"]),
    ...mapActions("makingOrderAPI", [
      "setJobOrderID", "setPartsType", "getMakingOrders", "setMakingOrder" ,"clearMakingOrderError", "setMakingOrders",
      "postMakingOrder", "putMakingOrder", "deleteMakingOrder"
    ]),
    async getList(data) {
      this.$store.commit("systemConfig/setLoading", true);
      let list = await this.getMakingOrders(data);
      this.$store.commit("systemConfig/setLoading", false);
    },
    // 配列内のデータ存在チェック
    getHashProperties(array, val){
      const list = array.filter(x => x.billOfMaterial.id === val);
        return list
    },
    // 発注ファイルの存在確認
    async checkMakingOrderExist() {
      // 部品表ファイル、発注ファイルを最大値で取得
      var params_order = {};
      Object.assign(params_order , this.params);
      params_order["page_size"] = 1000;
      await this.getBillOfMaterials({params: this.params_bom});
      await this.getMakingOrders({params: params_order});
      const makingOrderList = this.makingOrders.results;
      const billOfMaterialList = this.billOfMaterials.results;
      
      // 部品表を参照している発注ファイルがあるか確認し、なければ作成
      for(let b in billOfMaterialList) {
        // 発注数量が０より大きい場合のみ
        if(billOfMaterialList[b].orderAmount > 0) {
          // 発注ファイルの存在えお確認し、
          let exist = this.getHashProperties(makingOrderList, billOfMaterialList[b].id);
          if(exist.length == 0) {
            // 発注ファイルが存在しない場合は
            // 新規発注ファイルを定義し、
            let newMakingOrder = {};
            // 部品表情報を代入し
            newMakingOrder.company = billOfMaterialList[b].company;
            newMakingOrder.number = null;
            newMakingOrder.billOfMaterialId = billOfMaterialList[b].id;
            newMakingOrder.name = billOfMaterialList[b].name;
            newMakingOrder.manufacturer = billOfMaterialList[b].manufacturer;
            newMakingOrder.standard = billOfMaterialList[b].standard;
            newMakingOrder.unitNumber = billOfMaterialList[b].unitNumber;
            newMakingOrder.drawingNumber = billOfMaterialList[b].drawingNumber;
            newMakingOrder.material = billOfMaterialList[b].material;
            newMakingOrder.surfaceTreatment = billOfMaterialList[b].surfaceTreatment;
            newMakingOrder.amount = billOfMaterialList[b].orderAmount;
            newMakingOrder.unit = billOfMaterialList[b].unit;
            newMakingOrder.currency = billOfMaterialList[b].currency;
            newMakingOrder.rate = billOfMaterialList[b].rate;
            newMakingOrder.unitPrice = billOfMaterialList[b].unitPrice;
            newMakingOrder.rate = billOfMaterialList[b].rate;
            newMakingOrder.desiredDeliveryDate = billOfMaterialList[b].desiredDeliveryDate;
            newMakingOrder.createdBy = billOfMaterialList[b].createdBy;
            newMakingOrder.modifiedBy = billOfMaterialList[b].modifiedBy;
            // 発注ファイルを作成する
            const res = await this.postMakingOrder(newMakingOrder);
            // console.log("create order");
          } else {
            // すでに存在する場合は何もしない
            // console.log(billOfMaterialList[b].id + " is already exists");
          }
        } else {
          // 発注不要な場合は何もしない
          // console.log(billOfMaterialList[b].id + " is already have");
        }
      }
      // forループ終了後、発注ファイルをリロード
      await this.getMakingOrders({params: this.params});
    },
    // 頭出しフォームに対するデータ反映
    setIncremental(val) {
      // メーカーデータをセット
      if(!this.expenseCategory.isProcessedParts) {
        this.$refs.manufacturer.setData(val.manufacturer);
      }
      // 単位データセット
      this.$refs.unitType.setData(val.unit);
      // 通貨データセット
      this.$refs.currency.setData(val.currency);
      // 仕入先データセット
      this.$refs.supplier.setData(val.supplier);
    },
    // フォームおよび子コンポーネントのデータクリア
    clearMakingOrder() {
      // エラーをクリア
      this.clearMakingOrderError();
      // データをクリア
      this.setMakingOrder({});
      // メーカーデータを削除
      if(!this.expenseCategory.isProcessedParts) {
        this.$refs.manufacturer.clearItem();
      }
      // 単位データクリア
      this.$refs.unitType.clearItem();
      // 通貨データクリア
      this.$refs.currency.clearItem();
      // 仕損費データクリア
      this.$refs.supplier.clearItem();
    },
    // 発注ファイル編集
    editMakingOrder(val) {
      this.setIncremental(val);
      this.setMakingOrder(val);
      this.$refs.dialog.editForm();
    },
    // 部品表ファイル編集
    editMoBillOfMaterial() {
      // console.log("edit BOM"); 
      this.editBOM = true;
      this.setBillOfMaterial(this.makingOrder.billOfMaterial);
      this.$refs.dialog_bom.editForm();
    },
    // 部品表アップデート
    async submitBillOfMaterial() {
      let res = {};
      this.billOfMaterial.modifiedBy = this.loginUserData.id;
      res = await this.putBillOfMaterial(this.billOfMaterial);
      if (res.data) {
        // 更新成功時はモーダルを閉じる
        this.$refs.dialog_bom.closeDialog();
        this.showSnackbar(res.snack);
      } else {
        // 失敗時
        console.log("Failed");
        console.log(res);
      }
      console.log("update bom");
    },
    // 発注ファイル編集データ送信
    async submitMakingOrder() {
      let res = {};
      this.makingOrder.modifiedBy = this.loginUserData.id;
      this.makingOrder.billOfMaterialId = this.makingOrder.billOfMaterial.id;
      // console.log(this.makingOrder);
      res = await this.putMakingOrder(this.makingOrder);
      // console.log(res);
      if (res.data) {
        // 更新成功時はモーダルを閉じる
        this.$refs.dialog.closeDialog();
        // リストをリロード
        this.getMakingOrders({ params: this.params });
        // Snackbar表示
        this.showSnackbar(res.snack);
      } else {
        // 失敗時
        console.log("Failed");
        console.log(res);
      }
      // console.log("submit!");
    },
    // 発注ファイル削除
    async deleteMakingOrderData(val) {
      let res = {};
      // 削除確認
      if (
        await this.$refs.confirm.open(
          "Delete",
          "Are you sure delete this data?",
          { color: "red" }
        )
      ) {
        // Yesの場合は削除処理
        res = await this.deleteMakingOrder(val);
      } else {
        // Noの場合はスナックバーにキャンセルの旨を表示
        res.snack = { snack: "Delete is cancelled" };
      }
      // リストをリロード
      this.getMakingOrders({ params: this.params });
      // Snackbar表示
      this.showSnackbar(res.snack);
    },
    // 発注ファイルと部品表の金額差チェック
    async checkPrice() {
      let res = {};
      // console.log("start check price");
      let order = this.makingOrder.unitPrice;
      let bom = this.makingOrder.billOfMaterial.unitPrice;
      if(order!=bom) {
        // 発注ファイルと部品表で単価が違う場合
        // console.log("different!");

        // アラート文
        let alertText = ("Order's unit price is '" + order.replace(/(\d)(?=(\d{3})+($|\.\d+))/g , '$1,') + 
                        "'\nBOM's unit price is   '" + bom.replace(/(\d)(?=(\d{3})+($|\.\d+))/g , '$1,') + "'" + 
                        "\nAre you sure change Bill ob material's unit price?")
        if (
          await this.$refs.confirm.open(
            "Unit Price is different!",
            alertText,
            { color: "blue" }
          )
        ) {
          // Yesの場合は削除処理
          this.setBillOfMaterial(this.makingOrder.billOfMaterial);
          this.billOfMaterial.unitPrice = order;
          this.submitBillOfMaterial();
          // res = await this.deleteMakingOrder(val);
        } else {
          // Noの場合はスナックバーにキャンセルの旨を表示
          res.snack = { snack: "Bill of Material's price is not changed." };
          this.showSnackbar(res.snack);
        }
      } else {
        // 単価が同じ場合は処理しない
        // console.log("Same. OK");
      }
      console.log("order is " + order + ", bom is " + bom);
      
    },
    // メニューに戻る
    backToMenu() {
      this.$router.push({ name: "MakingOrderMenu" });
    },
  },
  created() {
    // もし工事番号等がクリアの場合はメニューにリダイレクトする
    if(!this.partsType || !this.jobOrderID) {
      this.$router.push({ name: "MakingOrderMenu" });
    } else {
      this.getExpenseCategory(this.partsType);
      this.getJobOrder(this.jobOrderID);
    }
  },
  mounted() {
    this.checkMakingOrderExist();

  }
}
</script>

<style>

</style>
