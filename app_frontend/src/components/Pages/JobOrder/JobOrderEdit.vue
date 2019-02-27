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
        <v-btn
          :to="{ name: 'JobOrderList' }"
        >
          <v-icon>reply</v-icon>
          Back to List
        </v-btn>
        <!-- 詳細閲覧ボタン -->
        <v-btn
          fab
          small
          @click="viewDetail"
        >
          <v-icon>visibility</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form @submit.prevent="submitForm" id="submitJobOrder">
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
              :errorMessages="responseError.customer"
              ></app-incremental-model-search>
            </v-flex>
            <!-- 納入先 -->
            <v-flex xs4>
              <app-incremental-model-search
              label="Delivery Destination"
              orderBy="name"
              v-model="jobOrder.deliveryDestination"
              searchType="partner"
              :errorMessages="responseError.deliveryDestination"
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
            <v-flex xs2>
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
            <!-- 市販部品予算 -->
            <v-flex xs4>
              <v-text-field 
                label="Commercial parts budget"
                v-model="jobOrder.commercialPartsBudget"
                :error-messages="responseError.commercialPartsBudget"
                class="right-input"
                :suffix="loginUserData.defaultCurrencyCode"
              ></v-text-field >
            </v-flex>   
            <!-- 電気部品予算 -->
            <v-flex xs4>
              <v-text-field 
                label="Electrical parts budget"
                v-model="jobOrder.electricalPartsBudget"
                :error-messages="responseError.electricalPartsBudget"
                class="right-input"
                :suffix="loginUserData.defaultCurrencyCode"
              ></v-text-field >
            </v-flex>   
            <!-- 加工部品予算 -->
            <v-flex xs4>
              <v-text-field 
                label="Processed parts budget"
                v-model="jobOrder.processedPartsBudget"
                :error-messages="responseError.processedPartsBudget"
                class="right-input"
                :suffix="loginUserData.defaultCurrencyCode"
              ></v-text-field >
            </v-flex>
          </v-layout>
        </v-form>

        <v-btn 
          color="blue darken-1"
          @click="submitForm()"
          outline
        >Save</v-btn>

        <v-btn 
          color="darken-1"
          @click="clearJobOrder()"
          outline
        >Clear</v-btn>

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
      }
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("jobOrderAPI", ["responseError", "jobOrderStatus", "jobOrder"]),
    reteHelpText() {
      return "1" + this.jobOrder.orderCurrencyData.code + "=";
    }
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
      // console.log(this.jobOrder);
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
      }
    },
    viewDetail() {
      this.$router.push({ name: "JobOrderDetail" });
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
