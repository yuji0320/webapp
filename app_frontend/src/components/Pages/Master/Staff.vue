<template>
  <v-container 
    fluid
    grid-list-lg
  >
    <!-- 確認ダイアログ -->
    <confirm ref="confirm"></confirm>

    <!-- カード形式リストコンポーネント -->
    <app-card-table
      :headers="headers"
      :items="userStaffs.results"
      @edit-item="editStaff"
      @delete-item="deleteStsaff"
    >
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>people</v-icon></span>
      <span slot="card-header-title">Staff Master</span>

      <!-- ダイアログ関係スロット -->
      <span slot="card-dialog">
        <app-dialog
          :formName="'staffForm'"
          @clear-form="clearStaff"
          @submit-form="submitStaff"
          ref="dialog"
        >
          <!-- フォーム内容 -->
          <span slot="dialog-contents">

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
                <!-- ユーザーフォーム -->
                <v-flex xs6>
                  <v-text-field 
                    label="Staff Number*"
                    v-model="userStaff.staffNumber"
                    :error-messages="responseError.staffNumber"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field 
                    label="Company*"
                    v-model="loginUserData.companyName"
                    disabled
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field 
                    label="Full Name*" 
                    v-model="userStaff.fullName"
                    :error-messages="responseError.fullName"
                  ></v-text-field>
                </v-flex>
                <v-flex xs6>
                  <v-text-field 
                    label="Ruby"
                    v-model="userStaff.ruby"
                    :error-messages="responseError.ruby"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field 
                    label="Mobile"
                    v-model="userStaff.mobile"
                    :error-messages="responseError.mobile"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field 
                    label="E-mail"
                    v-model="userStaff.email"
                    :error-messages="responseError.email"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field 
                    label="Postal Code"
                    v-model="userStaff.postalCode"
                    :error-messages="responseError.postalCode"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-textarea 
                    label="Address"
                    v-model="userStaff.address"
                    :error-messages="responseError.address"
                  ></v-textarea>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field 
                    label="Date birth"
                    v-model="userStaff.dateBirth"
                    :error-messages="responseError.dateBirth"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field 
                    label="Date joined"
                    v-model="userStaff.dateJoined"
                    :error-messages="responseError.dateJoined"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-text-field 
                    label="Date left"
                    v-model="userStaff.dateLeft"
                    :error-messages="responseError.dateLeft"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 lg6>
                  <v-checkbox
                    label="is loginUser"
                    v-model="userStaff.isLoginUser"
                  ></v-checkbox>
                </v-flex>
              </v-layout>
        
          </span>
        </app-dialog>
      </span>

      <!-- カード上部検索機能コンポーネント -->
      <div slot="search-bar">
        <app-search-bar
          :length="userStaffs.pages"
          :count="userStaffs.count"
          :orderBy="orderBy"
          :incremental="incremental"
          @search-list="getStaffs"
        ></app-search-bar>
      </div>

    </app-card-table>

  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import CardTable from "@/components/Module/CardTable.vue";
import Dialog from "@/components/Module/Dialog.vue";
import SearchBar from "@/components/Module/SearchBar.vue";

export default {
  title: "Staff master",
  name: "Staff",
  data() {
    return {
      orderBy: "-created_at",
      // テーブルヘッダー
      headers: [
        { text: "Staff number", value: "staffNumber" },
        { text: "Login id", value: "isLoginUser" },
        { text: "Full name", value: "fullName" },
        { text: "E-mail", value: "email" },
        { text: "Mobile", value: "mobile" },
        { text: "Created At", value: "createdAt" },
        { text: "Modified At", value: "modifiedAt" },
        { text: "Action", value: "action" }
      ],
      incremental: {
        // 検索カラムリスト
        tableSelectItems: [
          { text: "Staff Number", value: "staffNumber" },
          { text: "Full Name", value: "fullName" },
          { text: "Ruby", value: "ruby" }
        ],
        // 検索数値の初期値および返り値
        tableSelectValue: "fullName",
        tableSearch: ""
      }
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemUserApi", ["userStaffs", "userStaff", "responseError"]),
    params() {
      return {
        company: this.loginUserData.companyId,
        order_by: this.orderBy
      };
    }
  },
  watch: {},
  methods: {
    ...mapActions("systemConfig", ["showSnackbar"]),
    ...mapActions("systemUserApi", [
      "clearStaff",
      "getStaffs",
      "setStaff",
      "postStaff",
      "putStaff",
      "deleteStaff"
    ]),
    // 処理結果統合フォーム
    responseFunction(val) {
      // リストをリロード
      this.getStaffs({ params: this.params });
      // Snackbar表示
      this.showSnackbar(val.snack);
    },
    // モーダル関係
    // 編集
    editStaff(val) {
      this.setStaff(val);
      this.$refs.dialog.editForm();
    },
    // Submit時処理
    async submitStaff() {
      // コンポーネントの編集ステータスに応じて新規と更新を切り替える
      let res = {};
      if (this.$refs.dialog.editedIndex == -1) {
        // 新規追加時の処理
        this.userStaff.company = this.loginUserData.companyId;
        res = await this.postStaff(this.userStaff);
      } else if (this.$refs.dialog.editedIndex == 0) {
        // 更新時
        res = await this.putStaff(this.userStaff);
      }
      if (res.data) {
        // 成功時はモーダルを閉じる
        this.$refs.dialog.closeDialog();
      } else {
        // 失敗時
        console.log("Failed");
      }
      this.responseFunction(res);
    },
    // 削除処理
    async deleteStsaff(val) {
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
        res = await this.deleteStaff(val);
      } else {
        // Noの場合はスナックバーにキャンセルの旨を表示
        res.snack = { snack: "Delete is cancelled" };
      }
      this.responseFunction(res);
    }
  },
  created() {
    // ページ作成時にgetでデータを取得
    this.getStaffs({
      params: this.params
    });
  },
  components: {
    "app-card-table": CardTable,
    "app-dialog": Dialog,
    "app-search-bar": SearchBar
  }
};
</script>
