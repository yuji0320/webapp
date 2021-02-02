<template>
  <div class="pa-2">
    <app-card noSearchBar="true">
      <span slot="card-header-icon"><v-icon large left>work</v-icon></span>
      <span slot="card-header-title">
        Job order
        <span v-if="jobOrderStatus.isEditing">Edit</span>
        <span v-else>Create</span>
      </span>

      <!-- 戻るボタン -->
      <span slot="card-header-button">
        <v-btn @click="backToList" class="me-2">
          <v-icon>reply</v-icon>
          Back to List
        </v-btn>
      </span>    
      <!-- 拡張ボタン -->
      <span slot="card-header-button">
        <!-- 詳細閲覧ボタン -->
        <v-btn
          fab
          small
          @click="viewDetail"
          v-show="jobOrderStatus.isEditing"
          class="me-2"
        >
          <v-icon>visibility</v-icon>
        </v-btn>
      </span>

      <span slot="card-content">
        <v-form @submit.prevent="submitForm" id="submitJobOrder" ref="form" v-model="valid" lazy-validation>
          <v-row no-gutters>
            <!-- エラー表示 -->
            <v-col class="ps-2" cols="12">
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
            </v-col>
            <!-- 工事番号 -->
            <v-col class="ps-2" cols="12" sm="6" md="4">
              <v-text-field 
                label="Manfacturing Number*"
                v-model="jobOrder.mfgNo"
                :error-messages="responseError.mfgNo"
              ></v-text-field>
            </v-col>
            <!-- 作業指図書作成者 -->
            <v-col class="ps-2" cols="12" sm="6" md="4">
              <app-incremental-model-search
              label="Publisher*"
              orderBy="ruby"
              v-model="jobOrder.publisher"
              searchType="staff"
              :errorMessages="responseError.publisher"
              ></app-incremental-model-search>
            </v-col>
            <!-- 設計者 -->
            <v-col class="ps-2" cols="12" sm="6" md="4">
              <app-incremental-model-search
              label="Designer"
              orderBy="ruby"
              v-model="jobOrder.designer"
              searchType="staff"
              :errorMessages="responseError.designer"
              ></app-incremental-model-search>
            </v-col>
            <!-- 製品名 -->
            <v-col class="ps-2" cols="12">
              <v-text-field 
                label="Product Name*"
                v-model="jobOrder.name"
                :error-messages="responseError.name"
              ></v-text-field>
            </v-col>
            <!-- 取引先 -->
            <v-col class="ps-2" cols="12" sm="6" md="4">
              <app-incremental-model-search
              label="Customer"
              orderBy="name"
              v-model="jobOrder.customer"
              searchType="partner"
              filter="customer"
              :errorMessages="responseError.customer"
              :required="rules"
              ></app-incremental-model-search>
            </v-col>
            <!-- 納入先 -->
            <v-col class="ps-2" cols="12" sm="6" md="4">
              <app-incremental-model-search
              label="Delivery Destination"
              orderBy="name"
              v-model="jobOrder.deliveryDestination"
              searchType="partner"
              filter="delivery"
              :errorMessages="responseError.deliveryDestination"
              :required="rules"
              ></app-incremental-model-search>
            </v-col>
            <v-col class="ps-2" cols="12" sm="6" md="4"></v-col>
            <!-- 受注日 -->
            <v-col class="ps-2" cols="12" sm="6" md="4">
              <app-input-date 
                label="Order Date"
                v-model="jobOrder.orderDate"
                :errorMessages="responseError.orderDate"
              ></app-input-date >
            </v-col>
            <!-- 納入日 -->
            <v-col class="ps-2" cols="12" sm="6" md="4">
              <app-input-date 
                label="Delivery Date"
                v-model="jobOrder.deliveryDate"
                :errorMessages="responseError.deliveryDate"
              ></app-input-date >
            </v-col>
            <!-- 工事完了日 -->
            <v-col class="ps-2" cols="12" sm="6" md="4">
              <app-input-date 
                label="Completion Date"
                v-model="jobOrder.completionDate"
                :errorMessages="responseError.completionDate"
              ></app-input-date >
            </v-col>
            <!-- 請求日 -->
            <v-col class="ps-2" cols="12" sm="6" md="4">
              <app-input-date 
                label="Bill Date"
                v-model="jobOrder.billDate"
                :errorMessages="responseError.billDate"
              ></app-input-date >
            </v-col>
            <v-col class="ps-2" cols="12" sm="12" md="8"></v-col>
            <!-- 受注金額 -->
            <v-col class="ps-2" cols="12" sm="6" md="4">
              <v-text-field 
                label="Order Price*"
                v-model="jobOrder.orderPrice"
                :error-messages="responseError.orderPrice"
                class="right-input"
              ></v-text-field >
            </v-col>
            <!-- 受注通貨 -->
            <v-col class="ps-2" cols="12" sm="6" md="4">
              <app-incremental-model-search
              label="Order Currency"
              orderBy="id"
              v-model="jobOrder.orderCurrency"
              searchType="currency"
              :errorMessages="responseError.orderCurrency"
              ></app-incremental-model-search>
            </v-col>
            <!-- 受注レート -->
            <v-col class="ps-2" cols="12" sm="4" md="2">
              <v-text-field 
                label="Order Rate"
                v-model="jobOrder.orderRate"
                :error-messages="responseError.orderRate"
                :suffix="loginUserData.defaultCurrencyCode"
                hint="1 Order currency = "
                :persistent-hint="true"
                class="right-input"
              ></v-text-field >
            </v-col>
            <!-- 税率 -->
            <v-col class="ps-2" cols="12" sm="4" md="2">
              <v-text-field 
                label="Tax Percent"
                v-model="jobOrder.taxPercent"
                :error-messages="responseError.taxPercent"
                class="right-input"
                suffix="%"
              ></v-text-field >
            </v-col>   
            <!-- メモ -->
            <v-col class="ps-2" cols="12">
              <v-textarea
                label="Notes"
                v-model="jobOrder.notes"
                :error-messages="responseError.notes"
              ></v-textarea>
            </v-col>
            <!-- 製品名 -->
            <v-col class="ps-2" cols="12">
              <v-text-field 
                label="Related Party MFG No"
                v-model="jobOrder.relatedPartyMfgNo"
                :error-messages="responseError.relatedPartyMfgNo"
              ></v-text-field>
            </v-col>
            <v-col class="ps-2" cols="12">
              <h3>Direct Cost Budget</h3>
            </v-col>
            <!-- 市販部品予算 -->
            <v-col class="ps-2" cols="12" sm="4" md="3" lg="2">
              <v-text-field 
                label="Commercial Parts Budget"
                v-model="jobOrder.commercialPartsBudget"
                :error-messages="responseError.commercialPartsBudget"
                class="right-input"
                :suffix="loginUserData.defaultCurrencyCode"
              ></v-text-field >
            </v-col>   
            <!-- 電気部品予算 -->
            <v-col class="ps-2" cols="12" sm="4" md="3" lg="2">
              <v-text-field 
                label="Electrical Parts Budget"
                v-model="jobOrder.electricalPartsBudget"
                :error-messages="responseError.electricalPartsBudget"
                class="right-input"
                :suffix="loginUserData.defaultCurrencyCode"
              ></v-text-field >
            </v-col>   
            <!-- 加工部品予算 -->
            <v-col class="ps-2" cols="12" sm="4" md="3" lg="2">
              <v-text-field 
                label="Processed Parts Budget"
                v-model="jobOrder.processedPartsBudget"
                :error-messages="responseError.processedPartsBudget"
                class="right-input"
                :suffix="loginUserData.defaultCurrencyCode"
              ></v-text-field >
            </v-col>
            <!-- 外注機構設計予算 -->
            <v-col class="ps-2" cols="12" sm="4" md="3" lg="2">
              <v-text-field 
                label="Outsourcing Mechanical Design Budget"
                v-model="jobOrder.outsourcingMechanicalDesignBudget"
                :error-messages="responseError.outsourcingMechanicalDesignBudget"
                class="right-input"
                :suffix="loginUserData.defaultCurrencyCode"
              ></v-text-field >
            </v-col>
            <!-- 外注電気設計予算 -->
            <v-col class="ps-2" cols="12" sm="4" md="3" lg="2">
              <v-text-field 
                label="Outsourcing Electrical DesignBudget"
                v-model="jobOrder.outsourcingElectricalDesignBudget"
                :error-messages="responseError.outsourcingElectricalDesignBudget"
                class="right-input"
                :suffix="loginUserData.defaultCurrencyCode"
              ></v-text-field >
            </v-col>
            <!-- 外注その他予算 -->
            <v-col class="ps-2" cols="12" sm="4" md="3" lg="2">
              <v-text-field 
                label="Outsourcing Other Budget"
                v-model="jobOrder.outsourcingOtherBudget"
                :error-messages="responseError.outsourcingOtherBudget"
                class="right-input"
                :suffix="loginUserData.defaultCurrencyCode"
              ></v-text-field >
            </v-col>
            <!-- 運送費予算 -->
            <v-col class="ps-2" cols="12" sm="4" md="3" lg="2">
              <v-text-field 
                label="Shipping Cost Budget"
                v-model="jobOrder.shippingCostBudget"
                :error-messages="responseError.shippingCostBudget"
                class="right-input"
                :suffix="loginUserData.defaultCurrencyCode"
              ></v-text-field >
            </v-col>
            <v-col class="ps-2" cols="12">
              <h3>Budget Work Time</h3>
            </v-col>
            <!-- 機械設計予算時間 -->
            <v-col class="ps-2" cols="12" sm="4" md="3" lg="2">
              <v-text-field 
                label="Mechanical Design Budget Hours"
                v-model="jobOrder.mechanicalDesignBudgetHours"
                :error-messages="responseError.mechanicalDesignBudgetHours"
                class="right-input"
                suffix="Hours"
              ></v-text-field >
            </v-col>
            <!-- 電気設計予算時間 -->
            <v-col class="ps-2" cols="12" sm="4" md="3" lg="2">
              <v-text-field 
                label="Electrical Design Budget Hours"
                v-model="jobOrder.electricalDesignBudgetHours"
                :error-messages="responseError.electricalDesignBudgetHours"
                class="right-input"
                suffix="Hours"
              ></v-text-field >
            </v-col>
            <!-- 組み立て調整予算時間 -->
            <v-col class="ps-2" cols="12" sm="4" md="3" lg="2">
              <v-text-field 
                label="Assembly Budget Hours"
                v-model="jobOrder.assemblyBudgetHours"
                :error-messages="responseError.assemblyBudgetHours"
                class="right-input"
                suffix="Hours"
              ></v-text-field >
            </v-col>
            <!-- 電気工事予算時間 -->
            <v-col class="ps-2" cols="12" sm="4" md="3" lg="2">
              <v-text-field 
                label="Electrical Wiring Budget Hours"
                v-model="jobOrder.electricalWiringBudgetHours"
                :error-messages="responseError.electricalWiringBudgetHours"
                class="right-input"
                suffix="Hours"
              ></v-text-field >
            </v-col>
            <!-- 現地調整予算時間 -->
            <v-col class="ps-2" cols="12" sm="4" md="3" lg="2">
              <v-text-field 
                label="Installation BudgetHours"
                v-model="jobOrder.installationBudgetHours"
                :error-messages="responseError.installationBudgetHours"
                class="right-input"
                suffix="Hours"
              ></v-text-field >
            </v-col>
            <v-col class="ps-2" cols="12">
              <h3>Shipping Cost Result</h3>
            </v-col>
            <!-- 運送費実績 -->
            <v-col class="ps-2" cols="12" sm="4" md="3" lg="2">
              <v-text-field 
                label="Shipping Cost Result"
                v-model="jobOrder.shippingCostResult"
                :error-messages="responseError.shippingCostResult"
                class="right-input"
                :suffix="loginUserData.defaultCurrencyCode"
              ></v-text-field >
            </v-col>
            <v-col class="ps-2 text-right" cols="12">
              <v-btn 
                outlined
                color="darken-1"
                class="me-2"
                @click="clearJobOrder()"
              >Clear</v-btn>
              <v-btn 
                outlined
                color="blue darken-1"
                @click="submitForm()"
              >Save</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </span>
    </app-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Job Order Edit",
  name: "JobOrderEdit",
  data() {
    return {
      newJobOrder: {
        orderRate: 1,
        taxPercent: 0,
        commercialPartsBudget: 0,
        electricalPartsBudget: 0,
        processedPartsBudget: 0
      },
      valid: true,
      rules: [
        value => !!value || 'Required.',
      ]
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("jobOrderAPI", ["responseError", "jobOrderStatus", "jobOrder"])
  },
  methods: {
    ...mapActions("systemConfig", ["showSnackbar"]),
    ...mapActions("jobOrderAPI", [
      "setMfgNo",
      "clearError",
      "getJobOrders",
      "setJobOrder",
      "postJobOrder",
      "putJobOrder",
      "clearJobOrder"
    ]),
    responseFunction(val) {
      // Snackbar表示
      this.showSnackbar(val.snack);
    },
    async submitForm() {
      // フロントエンドバリデーション
      if(this.$refs.form.validate()) {
        // コンポーネントの編集ステータスに応じて新規と更新を切り替える
        let res = {};
        if (!this.jobOrderStatus.isEditing) {
          // 新規追加時の処理
          this.jobOrder.company = this.loginUserData.companyId;
          this.jobOrder.createdBy = this.loginUserData.id;
          this.jobOrder.modifiedBy = this.loginUserData.id;
          res = await this.postJobOrder(this.jobOrder);
        } else {
          // 更新時
          this.jobOrder.modifiedBy = this.loginUserData.id;
          // 日付値がblankの場合の修正
          if(this.jobOrder.orderDate == "") this.jobOrder.orderDate = null; 
          if(this.jobOrder.deliveryDate == "") this.jobOrder.deliveryDate = null; 
          if(this.jobOrder.completionDate == "") this.jobOrder.completionDate = null; 
          if(this.jobOrder.billDate == "") this.jobOrder.billDate = null; 
          res = await this.putJobOrder(this.jobOrder);
        }
        if (res.data) {
          // 成功時
          this.responseFunction(res);
          this.setJobOrder(res.data);
          this.setMfgNo(res.data.id);
          this.$router.push({ name: "JobOrderDetail" });
        } else {
          // 失敗時
          this.responseFunction(res);
          console.log(res);
        }
      } else {
        // バリデーションエラーの場合
        this.showSnackbar({color:"red", snack:"Required field is blank!"});
      }
    },
    viewDetail() {
      this.$router.push({ name: "JobOrderDetail" });
    },
    backToList() {
      this.$router.push({ name: "JobOrderList" });
    }
  },
  created() {
    // 読み込み時にエラーをクリア
    this.clearError();
    
    // 編集ステータスに応じてパラメータを設定
    if (!this.jobOrderStatus.isEditing) {
      // 新規作成時デフォルトデータを入力
      this.newJobOrder.publisher = this.loginUserData.staffId;
      this.newJobOrder.orderCurrency = this.loginUserData.defaultCurrencyId;
      this.setJobOrder(this.newJobOrder);
    } else {
      // 更新時は指図書IDを登録
      this.setMfgNo(this.jobOrder.id);
    }
  }
};
</script>
