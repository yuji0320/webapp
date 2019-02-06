<template>
  <v-container 
    fluid
    grid-list-lg
  >
    <v-card>
      <v-toolbar card>
        <v-icon>domain</v-icon>
        <v-toolbar-title class="font-weight-light">Company Master</v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- 編集トグルボタン -->
        <v-btn
          fab
          small
          @click="toggleIsEditing"
        >
          <v-icon v-if="isEditing">close</v-icon>
          <v-icon v-else>edit</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <!-- 会社情報表示 -->
        <v-select
          :disabled="!isEditing"
          v-model="userCompany.country"
          :items="countries.results"
          item-text="name"
          item-value="id"
          label="Country"
          name="country"
        ></v-select>
        <v-text-field
          :disabled="!isEditing"
          label="Company name"
          v-model="userCompany.name"
        ></v-text-field>
        <v-text-field
          :disabled="!isEditing"
          label="Postal code"
          v-model="userCompany.postalCode"
        ></v-text-field>
        <v-text-field
          :disabled="!isEditing"
          label="Address"
          v-model="userCompany.address"
        ></v-text-field>
        <v-text-field
          :disabled="!isEditing"
          label="Phone"
          v-model="userCompany.phone"
        ></v-text-field>
        <v-text-field
          :disabled="!isEditing"
          label="Fax"
          v-model="userCompany.fax"
        ></v-text-field>
        <!-- 通貨情報はあえて変更不可とする -->
        <v-select
          :disabled=true
          v-model="userCompany.defaultCurrency"
          :items="currencies.results"
          item-text="name"
          item-value="id"
          label="Currency"
          name="currency"
        ></v-select>
      </v-card-text>
      <v-footer 
        card
        height="auto"
      >
        <v-spacer></v-spacer>
        <!-- 修正情報反映ボタン -->
        <v-btn 
          color="primary"
          :disabled="!isEditing"
          @click="updateCompany"
        >Update</v-btn>
      </v-footer>
    </v-card>

  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  title: "Company master",
  name: "Company",
  data() {
    return {
      isEditing: false
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemUserApi", ["userCompany"]),
    ...mapState("systemMasterApi", ["countries", "currencies"])
  },
  methods: {
    ...mapActions("systemUserApi", ["getCompany", "putCompany"]),
    ...mapActions("systemMasterApi", ["getCountries", "getCurrencies"]),
    ...mapActions("systemConfig", ["showSnackbar"]),
    toggleIsEditing: function() {
      let self = this;
      this.isEditing = !this.isEditing;
      if (!this.isEditing) {
        // 保存せずに終了する
        self.getCompany({ detail: this.loginUserData.companyId });
        self.showSnackbar({ snack: "It was to exit without saving." });
      }
    },
    updateCompany: function() {
      let self = this; //Promisseのthisスコープ回避のため
      this.putCompany(this.userCompany).then(function(response) {
        if (response.data) {
          self.getCompany({ detail: self.loginUserData.companyId });
          // 更新成功を知らせ、編集ステータスを終了する
          self.showSnackbar({ snack: "Update is success!", color: "success" });
          self.isEditing = false;
        }
      });
    }
  },
  mounted() {
    this.getCompany({ detail: this.loginUserData.companyId });
    this.getCountries();
    this.getCurrencies();
  }
};
</script>

<style>
</style>
