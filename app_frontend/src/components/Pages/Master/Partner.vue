<template>
  <v-container fluid grid-list-lg>
    <!-- 確認ダイアログ -->
    <app-confirm ref="confirm"></app-confirm>

    <!-- カード形式リストコンポーネント -->
    <app-card-table
      :headers="headers"
      :items="userPartners.results"
      @edit-item="editPartner"
      @double-click="editPartner"
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
          @submit-form="submitPartner"
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

      <!-- カード上部検索機能コンポーネント -->
      <!-- <div slot="search-bar">
        <app-search-bar
          :length="userPartners.pages"
          :count="userPartners.count"
          :orderBy="orderBy"
          :incremental="incremental"
          :params="params"
          @search-list="getList"
        ></app-search-bar>
      </div> -->

      <!-- カード上部検索機能コンポーネント -->
      <div slot="search-bar">
        <app-search-toolbar
          :length="userPartners.pages"
          :count="userPartners.count"
          :params="params"
          :orderBy="orderBy"
          :refineParams="refineParams"
          @search-list="getList"
          @clear-params="clearParams"
          :refineDetail="false"
        >
          <span slot="search-data-content">
            <v-row no-gutters> 
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-text-field 
                  label="Partner Number"
                  v-model="refineParams.partnerNumber"
                  clearable
                  class="ps-2"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-text-field 
                  label="Partner Name"
                  v-model="refineParams.name"
                  clearable
                  class="ps-2"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-text-field 
                  label="Abbr"
                  v-model="refineParams.abbr"
                  clearable
                  class="ps-2"
                ></v-text-field>
              </v-col>
              <!-- ソート機能 *修正中 -->
              <!-- <v-col cols="12" sm="6" md="4" lg="3">
                <v-select
                  v-model="refineParams.order_by"
                  :items="orderSelect"
                  label="Order by"
                  class="ps-2"
                ></v-select>
              </v-col> -->
            </v-row>
            <v-row no-gutters>
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-checkbox
                  v-model="refineParams.is_customer"
                  :label="`is Customer`"
                  class="ps-2"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-checkbox
                  v-model="refineParams.is_delivery_destination"
                  :label="`is Delivery Destination`"
                  class="ps-2"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-checkbox
                  v-model="refineParams.is_supplier"
                  :label="`is Supplier`"
                  class="ps-2"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" sm="6" md="4" lg="3">
                <v-checkbox
                  v-model="refineParams.is_manufacturer"
                  :label="`is Manufacturer`"
                  class="ps-2"
                ></v-checkbox>
              </v-col>
            </v-row>
          </span>
        </app-search-toolbar>
      </div>

    </app-card-table>

  </v-container>
</template>
  
<script>
import { mapState, mapActions } from "vuex";
import CardTable from '@/components/Module/Cards/CardTable.vue';
import SearchToolbar from "@/components/Module/Search/SearchToolbar.vue";
import Dialog from '@/components/Module/Dialogs/Dialog.vue';

export default {
  title: "Partner master",
  name: "Partner",
  components: {
    "app-card-table": CardTable,
    "app-search-toolbar": SearchToolbar,
    "app-dialog": Dialog,
  },
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
      refineParams: {},
      orderSelect: [ "-name", "name" ],
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
      this.$store.commit("systemConfig/setLoading", true);
      let list = await this.getPartners(data);
      this.$store.commit("systemConfig/setLoading", false);
    },
    clearParams() {
      this.refineParams = {};
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
    async submitPartner() {
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
  },
  created () {
    this.getList({ params: this.params });
    // console.log({ params: this.params });
  }
};
</script>
