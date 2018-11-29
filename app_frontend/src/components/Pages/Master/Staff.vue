<template>
  <v-container 
    fluid
    grid-list-lg
  >

  <!-- {{ userStaffs.results }} -->
    <!-- カード形式リストコンポーネント -->
    <app-card-table
      :length="userStaffs.pages"
      :count="userStaffs.count"
      :headers="headers"
      :items="userStaffs.results"
    >
      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>people</v-icon></span>
      <span slot="card-header-title">Staff Master</span>

      <v-dialog v-model="dialog" scrollable max-width="600px" slot="card-dialog">
        <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">New Item</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container grid-list-md>
              <v-form @submit.prevent="submitStaff" id="staffForm">
                <v-layout wrap>
                  <v-flex xs12>
                    <v-alert 
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
                  <v-flex xs6>
                    <v-text-field 
                      label="Staff Number*"
                      v-model="userStaff.staffNumber"
                      :error-messages="responseError.staffNumber"
                      required
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
                      required
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
                </v-layout>
              </v-form>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
            <v-btn 
              color="blue darken-1"
              form="staffForm"
              type="submit"
              flat
            >Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- ページネーションコンポーネント -->
      <span slot="table-pagination">
        <app-pagination
          v-model="search.page"
          :length="userStaffs.pages"
          :count="userStaffs.count"
        ></app-pagination>
      </span>

      <!-- 検索バーコンポーネント -->
      <div slot="table-search">
        <app-search
          v-model="search.incremental"
        ></app-search>
      </div>
    </app-card-table>

  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import CardTable from "@/components/Module/CardTable.vue";
import Pagination from "@/components/Module/Pagination.vue";
import Search from "@/components/Module/Search.vue";

export default {
  title: "Staff master",
  name: "Staff",
  data() {
    return {
      // 検索関係データバインド
      search: {
        // ページネーション初期値
        page: 1,
        // 絞り込み検索
        incremental: {
          // 検索カラムリスト
          tableSelectItems: [
            {text:"Full Name", value:"fullName"},
            {text:"Staff Number", value:"staffNumber"},
            {text:"Ruby", value:"ruby"}
          ],
          // 検索数値の初期値および返り値
          tableSelectValue: "fullName",
          tableSearch: ""
        },
        // デフォルトソート順指定(サーバーサイド)
        orderBy: "-created_at",
      },
      dialog: false,
      // テーブルヘッダー
      headers: [
        { text: "Staff number", value: "staffNumber" },
        { text: "Login id", value: "isLoginUser" },
        { text: "Full name", value: "fullName" },
        { text: "E-mail", value: "email" },
        { text: "Mobile", value: "mobile" },
        { text: "Created At", value: "createdAt" }
      ],
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemUserApi", ["userStaffs", "userStaff", "responseError"]),
    // データ検索用パラメータを格納
    params() {
      return { company: this.loginUserData.companyId, order_by: this.search.orderBy };
    }
  },
  watch: {
    // 検索及びページネーションステータスの変更
    search: {
      handler: function(val) {
        // ページネションパラメータ挿入
        this.params.page = val.page

        // 絞り込み検索条件挿入
        const keyname = val.incremental.tableSelectValue;
        this.params[keyname] = val.incremental.tableSearch;

        // 変更後のステータスでデータを更新
        this.getStaffs({
          params: this.params
        });
      },
      deep: true
    }
  },
  methods: {
    ...mapActions("systemUserApi", ["getStaffs", "newStaff", "newStaff2"]),
    // モーダル関係
    async submitStaff() {
      this.userStaff.company = this.loginUserData.companyId
      // console.log(this.userStaff);
      const res = await this.newStaff(this.userStaff);
      if (res.data) {
        // 追加成功時
        console.log("Ok!");
        // モーダルを閉じる
        this.dialog=false
        // リストをリロード
        this.getStaffs({
          params: { company: this.loginUserData.companyId, order_by: this.orderBy }
        });
      } else {
        console.log("No");
        console.log(res.error.data);
      }
    }
  },
  created() {
    // ページ作成時にgetでデータを取得
    this.getStaffs({
      params: this.params
    });
  },
  components: {
    "app-pagination": Pagination,
    "app-search": Search,
    "app-card-table": CardTable
  }
};
</script>
