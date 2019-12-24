<template>
  <app-dialog
    :formName="'manHourForm'"
    :hideButtons="false"
    parentTitle="Man Hour"
    dialogWidth="600px"
    @submit-form="submitManHour"
    @clear-form="clearManHour"
    @set-default="setDefault"
    ref="dialog"
  >
    <!-- フォーム内容 -->
    <span slot="dialog-contents">
      <!-- 確認ダイアログ -->
      <app-confirm ref="confirm"></app-confirm>
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

        <v-flex xs12>
          <app-incremental-model-search
            label="Staff*"
            orderBy="staff_number"
            v-model="manHour.staff"
            searchType="staff"
            :errorMessages="responseError.staff"
            ref="staff"
            :disabled="!isAdmin"
          ></app-incremental-model-search>
        </v-flex>

        <v-flex xs12>
          <app-incremental-model-search
            label="Job Order"
            orderBy="mfg_no"
            v-model="manHour.jobOrder"
            searchType="jobOrder"
            :errorMessages="responseError.jobOrder"
            ref="jobOrder"
          ></app-incremental-model-search>
        </v-flex>

        <v-flex xs12>
          <app-incremental-model-search
            label="Job Type*"
            orderBy="number"
            v-model="manHour.type"
            searchType="jobType"
            :errorMessages="responseError.type"
            ref="jobType"
          ></app-incremental-model-search>
        </v-flex>

        <v-flex xs12 md6>
          <v-text-field 
            label="Work Hour*"
            v-model="manHour.workHour"
            :error-messages="responseError.workHour"
            type="number"
            max="24" 
            step="0.25"
            suffix="h"
            hint="ex. 2h 30min => 2.5h, 3h 45min => 3.75h"
            class="right-input"
            :persistent-hint="true"
          ></v-text-field>
        </v-flex>

        <!-- 希望納期 -->
        <v-flex xs12 md4>
          <app-input-date 
            label="Date*"
            v-model="manHour.date"
            :errorMessages="responseError.date"
          ></app-input-date>
        </v-flex>       

        <!-- 仕損費種別 -->
        <v-flex xs12 md8>
          <app-incremental-model-search
          label="Failure"
          orderBy="category_number"
          v-model="manHour.failure"
          searchType="failure"
          :errorMessages="responseError.failure"
          ref="failure"
          ></app-incremental-model-search>
        </v-flex>

        <!-- {{ defaultManHour }} -->

      </v-layout>
    </span>
  </app-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("manHourAPI", ["isAdmin", "manHour", "manHours", "responseError"]),
    // 発注ファイルデフォルト値
    defaultManHour() {
      let date = new Date().toISOString().slice(0, 10);
      // デフォルト配列作成
      let array = {
        company: this.loginUserData.companyId,
        staff: this.loginUserData.staffId,
        date: date,
        type: "",
        jobOrder: "",
        createdBy: this.loginUserData.id
      }
      return array;
    },
  },
  methods: {
    ...mapActions("systemConfig", ["showSnackbar"]),
    ...mapActions("manHourAPI", ["getManHours", "setManHour" ,"clearManHourError", "setManHours", "postManHour", "putManHour", "deleteManHour"
    ]),
    // 頭出しフォームに対するデータ反映
    setIncremental(val) {
      // 従業員データセット
      this.$refs.staff.setData(val.staff);
      // 工事番号データセット
      this.$refs.jobOrder.setData(val.jobOrder);
      // 作業区分データセット
      this.$refs.jobType.setData(val.type);
      // 仕損費データセット
      this.$refs.failure.setData(val.failure);
    },
    // デフォルト値設定
    setDefault() {
      const defaultData = Object.assign({}, this.defaultManHour);
      // console.log(defaultData);
      this.setIncremental(defaultData);
      this.setManHour(defaultData);
    },
    // 工数ファイル編集
    editManHour() {
      this.clearManHourError();
      this.setIncremental(this.manHour);
      this.$refs.dialog.editForm();
      // console.log(this.receivingProcess);
    },
    // フォームおよび子コンポーネントのデータクリア
    clearManHour() {
      // エラーをクリア
      this.clearManHourError();
      // データをクリア
      this.setManHour({});
      // 従業員データクリア
      if(this.isAdmin) {
        this.$refs.staff.setData();
      } else {
        this.manHour.staff = this.loginUserData.staffId;
      }
      // 工事番号データクリア
      this.$refs.jobOrder.setData();
      // 作業区分データクリア
      this.$refs.jobType.setData();
      // 仕損費データクリア
      this.$refs.failure.clearItem();
    },
    async submitManHour() {
      let res = {};
      this.manHour.modifiedBy = this.loginUserData.id;
      // コンポーネントの編集ステータスに応じて新規と更新を切り替える
      if (this.$refs.dialog.editedIndex == -1) {
        // 新規追加時の処理
        this.manHour.createdBy = this.loginUserData.id;
        res = await this.postManHour(this.manHour);
      } else {
        // 更新時
        res = await this.putManHour(this.manHour);
      }
      if (res.data) {
        // 更新成功時はモーダルを閉じる
        if (this.$refs.dialog.editedIndex == -1) {
          this.setManHour({});
          this.setDefault();
          // console.log(this.defaultManHour);
        } else {
          this.$refs.dialog.closeDialog();
        }
        // 登録完了後、親コンポーネントで連携関数を実施する
        this.$emit("response-function", res);
      } else {
        // 失敗時
        console.log("Failed");
        console.log(res);
      }      
    }
  }
}
</script>

<style>

</style>
