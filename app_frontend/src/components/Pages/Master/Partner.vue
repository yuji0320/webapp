<template>
  <v-container 
    fluid
    grid-list-lg
  >
    <!-- 確認ダイアログ -->
    <app-confirm ref="confirm"></app-confirm>

    <!-- カード形式リストコンポーネント -->
    <app-card-table
      :headers="headers"
      :items="userPartners.results"
      @edit-item="editPartner"
      @delete-item="deletePartnerData"
    >

      <!-- ヘッダー部分スロット -->
      <span slot="card-header-icon"><v-icon>people_outline</v-icon></span>
      <span slot="card-header-title">Partner Master</span>

      <!-- ダイアログ関係スロット -->
      <span slot="card-dialog">
        <app-dialog
          :formName="'partnerForm'"
          @clear-form="clearPartner"
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
              <!-- 取引先フォーム -->
              <v-flex xs6>
                <v-text-field 
                  label="Partner Number*"
                  v-model="userPartner.partnerNumber"
                  :error-messages="responseError.partnerNumber"
                ></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field 
                  label="Company*"
                  v-model="loginUserData.companyName"
                  disabled
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field 
                  label="Partner Name*" 
                  v-model="userPartner.name"
                  :error-messages="responseError.name"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field 
                  label="Abbreviation"
                  v-model="userPartner.abbr"
                  :error-messages="responseError.abbr"
                ></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field 
                  label="Phone Number"
                  v-model="userPartner.phone"
                  :error-messages="responseError.phone"
                ></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field 
                  label="Fax Number"
                  v-model="userPartner.fax"
                  :error-messages="responseError.fax"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field 
                  label="Postal Code"
                  v-model="userPartner.postalCode"
                  :error-messages="responseError.postalCode"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-textarea 
                  label="Address"
                  v-model="userPartner.address"
                  :error-messages="responseError.address"
                ></v-textarea>
              </v-flex>
              <v-flex xs12>
                <v-textarea 
                  label="Note"
                  v-model="userPartner.note"
                  :error-messages="responseError.note"
                ></v-textarea>
              </v-flex>
              <v-flex xs12 lg6>
                <v-checkbox
                  label="is customer"
                  v-model="userPartner.isCustomer"
                ></v-checkbox>
              </v-flex>
              <v-flex xs12 lg6>
                <v-checkbox
                  label="is Is delivery destination"
                  v-model="userPartner.isDeliveryDestination"
                ></v-checkbox>
              </v-flex>
              <v-flex xs12 lg6>
                <v-checkbox
                  label="is supplier"
                  v-model="userPartner.isSupplier"
                ></v-checkbox>
              </v-flex>
              <v-flex xs12 lg6>
                <v-checkbox
                  label="is Manufacturer"
                  v-model="userPartner.isManufacturer"
                ></v-checkbox>
              </v-flex>
              <v-flex xs12 lg6>
                <v-checkbox
                  label="is Related party"
                  v-model="userPartner.isRelatedParty"
                ></v-checkbox>
              </v-flex>
            </v-layout>
          </span>
        </app-dialog>
      </span>

      <span slot="card-header-button">
        <v-layout row wrap>
          <!-- エクセルアップロード -->
          <v-btn
            fab
            small
            @click="upload"
          >
            <v-icon>cloud_upload</v-icon>
          </v-btn>
        </v-layout>
      </span>      

      <!-- カード上部検索機能コンポーネント -->
      <div slot="search-bar">
        <app-search-bar
          :length="userPartners.pages"
          :count="userPartners.count"
          :orderBy="orderBy"
          :incremental="incremental"
          :params="params"
          @search-list="getList"
        ></app-search-bar>
      </div>

      <!-- 取引先種別タブ指定 -->
      <div slot="card-tabs">
        <v-tabs
          v-model="tabs.tab"
          align-with-title
          grow
        >
          <v-tabs-slider></v-tabs-slider>
          <v-tab 
            v-for="item in tabs.items" :key="item.id"
            @click="tabClicked(item.refine)"
          >
            {{ item.title }}
          </v-tab>

        </v-tabs>
      </div>

    </app-card-table>

  </v-container>
</template>
  
<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Partner master",
  name: "Partner",
  data() {
    return {
      orderBy: "-created_at",
      // テーブルヘッダー
      headers: [
        { text: "Partner number", value: "partnerNumber" },
        { text: "Partner name", value: "name" },
        { text: "Abbreviation", value: "abbr" },
        { text: "is Customer", value: "isCustomer" },
        { text: "is Delivery Destination", value: "isDeliveryDestination" },
        { text: "is Supplier", value: "isSupplier" },
        { text: "is Manufacturer", value: "isManufacturer" },
        { text: "Action", value: "action" }
      ],
      incremental: {
        // 検索カラムリスト
        tableSelectItems: [
          { label: "Partner Number", value: "partnerNumber" },
          { label: "Partner Name", value: "name" },
          { label: "Abbreviation", value: "abbr" }
        ],
        // 検索数値の初期値および返り値
        tableSelectValue: "name",
        tableSearch: ""
      },
      tabs: {
        tab: 0,
        refine: "",
        params: {},
        items: [
          { title: "All", refine: "" },
          { title: "Customer", refine: "is_customer" },
          { title: "Delivery Destination", refine: "is_delivery_destination" },
          { title: "Supplier", refine: "is_supplier" },
          { title: "Manufacturer", refine: "is_manufacturer" }
        ]
      },
      search:""
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemUserApi", ["userPartners", "userPartner", "responseError"]),
    params() {
      return {
        company: this.loginUserData.companyId,
        order_by: this.orderBy
      };
    }
  },
  methods: {
    ...mapActions("systemConfig", ["showSnackbar"]),
    ...mapActions("systemUserApi", ["clearPartner","getPartners","setPartner","postPartner","putPartner","deletePartner"]),
    // リスト検索
    async getList(data) {
      // console.log(data);
      this.search = data
      this.$store.commit("systemConfig/setLoading", true);
      let list = await this.getPartners(this.search);
      this.$store.commit("systemConfig/setLoading", false);
    },
    // タブ選択情報を更新
    tabClicked(refine) {
      this.tabs.refine = refine;
      this.searchList();
    },
    // タブ絞り込み複合検索関数
    searchList(val) {
      // 検索情報が入力された場合はdataを更新する
      if (val) {
        this.tabs.params = val.params;
      }
      // paramsを宣言
      let params = this.tabs.params;
      // タブ指定情報を初期化
      let len = this.tabs.items;
      for (let i = 1; i < len.length; i++) {
        delete this.tabs.params[len[i].refine];
      }
      // タブ選択がAll以外の場合は検索要件を追加する
      if (!this.tabs.refine == "") {
        params[this.tabs.refine] = true;
      }
      // 上記指定パラメーターで検索を行う
      this.getList({ params: params });
    },
    // 処理結果統合フォーム
    responseFunction(val) {
      // リストをリロード
      this.getPartners({ params: this.params });
      // Snackbar表示
      this.showSnackbar(val.snack);
    },
    // モーダル関係
    // 編集
    editPartner(val) {
      this.setPartner(val);
      this.$refs.dialog.editForm();
    },
    // Submit時処理
    async submitStaff() {
      // コンポーネントの編集ステータスに応じて新規と更新を切り替える
      let res = {};
      if (this.$refs.dialog.editedIndex == -1) {
        // 新規追加時の処理
        this.userPartner.company = this.loginUserData.companyId;
        this.userPartner.createdBy = this.loginUserData.id;
        this.userPartner.modifiedBy = this.loginUserData.id;
        res = await this.postPartner(this.userPartner);
      } else if (this.$refs.dialog.editedIndex == 0) {
        // 更新時
        this.userPartner.modifiedBy = this.loginUserData.id;
        res = await this.putPartner(this.userPartner);
      }
      if (res.data) {
        // 成功時はモーダルを閉じる
        this.$refs.dialog.closeDialog();
        this.responseFunction(res);
      } else {
        // 失敗時
        console.log("Failed");
      }
    },
    // 削除処理
    async deletePartnerData(val) {
      // console.log(val);
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
        res = await this.deletePartner(val);
      } else {
        // Noの場合はスナックバーにキャンセルの旨を表示
        res.snack = { snack: "Delete is cancelled" };
      }
      this.responseFunction(res);
    },
    upload() {
      this.$router.push({ name: "PartnerUpload" });
    }
  }
};
</script>
