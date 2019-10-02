<template>
  <v-container 
    fluid
    grid-list-lg
  >

    <v-card>
      <v-toolbar card>
        <v-icon>work</v-icon>
        <v-toolbar-title class="font-weight-light">
          Job Order
          <span v-if="jobOrderStatus.isEditing">Edit</span>
          <span v-else>Create</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- 一覧へ戻る -->
        <v-btn @click="backToList">
          <v-icon>reply</v-icon>
          Back to List
        </v-btn>
        <!-- 詳細閲覧ボタン -->
        <v-btn
          fab
          small
          @click="viewDetail"
          v-show="jobOrderStatus.isEditing"
        >
          <v-icon>visibility</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form @submit.prevent="submitForm" id="submitJobOrder" ref="form" v-model="valid" lazy-validation>
          <v-layout wrap>
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
            <!-- 工事番号 -->
            <v-flex xs4>
              <v-text-field 
                label="Manfacturing Number*"
                v-model="jobOrder.mfgNo"
                :error-messages="responseError.mfgNo"
              ></v-text-field>
            </v-flex>
            <!-- 作業指図書作成者 -->
            <v-flex xs4>
              <app-incremental-model-search
              label="Publisher*"
              orderBy="ruby"
              v-model="jobOrder.publisher"
              searchType="staff"
              :errorMessages="responseError.publisher"
              ></app-incremental-model-search>
            </v-flex>
            <!-- 設計者 -->
            <v-flex xs4>
              <app-incremental-model-search
              label="Designer"
              orderBy="ruby"
              v-model="jobOrder.designer"
              searchType="staff"
              :errorMessages="responseError.designer"
              ></app-incremental-model-search>
            </v-flex>
            <!-- 製品名 -->
            <v-flex xs12>
              <v-text-field 
                label="Product Name*"
                v-model="jobOrder.name"
                :error-messages="responseError.name"
              ></v-text-field>
            </v-flex>
            <!-- 取引先 -->
            <v-flex xs4>
              <app-incremental-model-search
              label="Customer"
              orderBy="name"
              v-model="jobOrder.customer"
              searchType="partner"
              filter="customer"
              :errorMessages="responseError.customer"
              :required="rules"
              ></app-incremental-model-search>
            </v-flex>
            <!-- 納入先 -->
            <v-flex xs4>
              <app-incremental-model-search
              label="Delivery Destination"
              orderBy="name"
              v-model="jobOrder.deliveryDestination"
              searchType="partner"
              filter="delivery"
              :errorMessages="responseError.deliveryDestination"
              :required="rules"
              ></app-incremental-model-search>
            </v-flex>
            <v-flex xs4></v-flex>
            <!-- 受注日 -->
            <v-flex xs4>
              <app-input-date 
                label="Order Date"
                v-model="jobOrder.orderDate"
                :errorMessages="responseError.orderDate"
              ></app-input-date >
            </v-flex>
            <!-- 納入日 -->
            <v-flex xs4>
              <app-input-date 
                label="Delivery Date"
                v-model="jobOrder.deliveryDate"
                :errorMessages="responseError.deliveryDate"
              ></app-input-date >
            </v-flex>
            <!-- 工事完了日 -->
            <v-flex xs4>
              <app-input-date 
                label="Completion Date"
                v-model="jobOrder.completionDate"
                :errorMessages="responseError.completionDate"
              ></app-input-date >
            </v-flex>
            <!-- 工事完了日 -->
            <v-flex xs4>
              <app-input-date 
                label="Bill Date"
                v-model="jobOrder.billDate"
                :errorMessages="responseError.billDate"
              ></app-input-date >
            </v-flex>
            <!-- 受注金額 -->
            <v-flex xs4>
              <v-text-field 
                label="Order Price*"
                v-model="jobOrder.orderPrice"
                :error-messages="responseError.orderPrice"
                class="right-input"
              ></v-text-field >
            </v-flex>
            <!-- 受注通貨 -->
            <v-flex xs4>
              <app-incremental-model-search
              label="Order Currency"
              orderBy="id"
              v-model="jobOrder.orderCurrency"
              searchType="currency"
              :errorMessages="responseError.orderCurrency"
              ></app-incremental-model-search>
            </v-flex>
            <!-- 受注レート -->
            <v-flex xs2>
              <v-text-field 
                label="Order Rate"
                v-model="jobOrder.orderRate"
                :error-messages="responseError.orderRate"
                :suffix="loginUserData.defaultCurrencyCode"
                hint="1 Order currency = "
                :persistent-hint="true"
                class="right-input"
              ></v-text-field >
            </v-flex>
            <!-- 税率 -->
            <v-flex xs2>
              <v-text-field 
                label="Tax Percent"
                v-model="jobOrder.taxPercent"
                :error-messages="responseError.taxPercent"
                class="right-input"
                suffix="%"
              ></v-text-field >
            </v-flex>   
            <!-- メモ -->
            <v-flex xs12>
              <v-textarea
                label="Notes"
                v-model="jobOrder.notes"
                :error-messages="responseError.notes"
              ></v-textarea>
            </v-flex>
            <!-- 製品名 -->
            <v-flex xs12>
              <v-text-field 
                label="Related Party MFG No"
                v-model="jobOrder.relatedPartyMfgNo"
                :error-messages="responseError.relatedPartyMfgNo"
              ></v-text-field>
            </v-flex>
            <v-flex xs12>
              <h3>Direct Cost Budget</h3>
            </v-flex>
            <!-- 市販部品予算 -->
            <v-flex xs4>
              <v-text-field 
                label="Commercial Parts Budget"
                v-model="jobOrder.commercialPartsBudget"
                :error-messages="responseError.commercialPartsBudget"
                class="right-input"
                :suffix="loginUserData.defaultCurrencyCode"
              ></v-text-field >
            </v-flex>   
            <!-- 電気部品予算 -->
            <v-flex xs4>
              <v-text-field 
                label="Electrical Parts Budget"
                v-model="jobOrder.electricalPartsBudget"
                :error-messages="responseError.electricalPartsBudget"
                class="right-input"
                :suffix="loginUserData.defaultCurrencyCode"
              ></v-text-field >
            </v-flex>   
            <!-- 加工部品予算 -->
            <v-flex xs4>
              <v-text-field 
                label="Processed Parts Budget"
                v-model="jobOrder.processedPartsBudget"
                :error-messages="responseError.processedPartsBudget"
                class="right-input"
                :suffix="loginUserData.defaultCurrencyCode"
              ></v-text-field >
            </v-flex>
            <!-- 外注機構設計予算 -->
            <v-flex xs4>
              <v-text-field 
                label="Outsourcing Mechanical Design Budget"
                v-model="jobOrder.outsourcingMechanicalDesignBudget"
                :error-messages="responseError.outsourcingMechanicalDesignBudget"
                class="right-input"
                :suffix="loginUserData.defaultCurrencyCode"
              ></v-text-field >
            </v-flex>
            <!-- 外注電気設計予算 -->
            <v-flex xs4>
              <v-text-field 
                label="Outsourcing Electrical DesignBudget"
                v-model="jobOrder.outsourcingElectricalDesignBudget"
                :error-messages="responseError.outsourcingElectricalDesignBudget"
                class="right-input"
                :suffix="loginUserData.defaultCurrencyCode"
              ></v-text-field >
            </v-flex>
            <!-- 外注その他予算 -->
            <v-flex xs4>
              <v-text-field 
                label="Outsourcing Other Budget"
                v-model="jobOrder.outsourcingOtherBudget"
                :error-messages="responseError.outsourcingOtherBudget"
                class="right-input"
                :suffix="loginUserData.defaultCurrencyCode"
              ></v-text-field >
            </v-flex>
            <!-- 運送費予算 -->
            <v-flex xs4>
              <v-text-field 
                label="Shipping Cost Budget"
                v-model="jobOrder.shippingCostBudget"
                :error-messages="responseError.shippingCostBudget"
                class="right-input"
                :suffix="loginUserData.defaultCurrencyCode"
              ></v-text-field >
            </v-flex>
            <v-flex xs12>
              <h3>Budget Work Time</h3>
            </v-flex>
            <!-- 機械設計予算時間 -->
            <v-flex xs4>
              <v-text-field 
                label="Mechanical Design Budget Hours"
                v-model="jobOrder.mechanicalDesignBudgetHours"
                :error-messages="responseError.mechanicalDesignBudgetHours"
                class="right-input"
                suffix="Hours"
              ></v-text-field >
            </v-flex>
            <!-- 電気設計予算時間 -->
            <v-flex xs4>
              <v-text-field 
                label="Electrical Design Budget Hours"
                v-model="jobOrder.electricalDesignBudgetHours"
                :error-messages="responseError.electricalDesignBudgetHours"
                class="right-input"
                suffix="Hours"
              ></v-text-field >
            </v-flex>
            <!-- 組み立て調整予算時間 -->
            <v-flex xs4>
              <v-text-field 
                label="Assembly Budget Hours"
                v-model="jobOrder.assemblyBudgetHours"
                :error-messages="responseError.assemblyBudgetHours"
                class="right-input"
                suffix="Hours"
              ></v-text-field >
            </v-flex>
            <!-- 電気工事予算時間 -->
            <v-flex xs4>
              <v-text-field 
                label="Electrical Wiring Budget Hours"
                v-model="jobOrder.electricalWiringBudgetHours"
                :error-messages="responseError.electricalWiringBudgetHours"
                class="right-input"
                suffix="Hours"
              ></v-text-field >
            </v-flex>
            <!-- 現地調整予算時間 -->
            <v-flex xs4>
              <v-text-field 
                label="Installation BudgetHours"
                v-model="jobOrder.installationBudgetHours"
                :error-messages="responseError.installationBudgetHours"
                class="right-input"
                suffix="Hours"
              ></v-text-field >
            </v-flex>
            <v-flex xs12>
              <h3>Shipping Cost Result</h3>
            </v-flex>
            <!-- 運送費実績 -->
            <v-flex xs4>
              <v-text-field 
                label="Shipping Cost Result"
                v-model="jobOrder.shippingCostResult"
                :error-messages="responseError.shippingCostResult"
                class="right-input"
                :suffix="loginUserData.defaultCurrencyCode"
              ></v-text-field >
            </v-flex>
            <v-flex xs12 class="text-xs-right">
              <v-btn 
                color="darken-1"
                @click="clearJobOrder()"
                outline
              >Clear</v-btn>
              <v-btn 
                color="blue darken-1"
                @click="submitForm()"
                outline
              >Save</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
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
