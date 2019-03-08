<template>
  <!-- <v-layout row wrap>
    <v-flex xs6> -->
      <v-autocomplete
        v-model="model"
        :items="searchItems"
        :search-input.sync="search"
        item-text="incrementalField"
        item-value="id"
        :cache-items="true"
        :placeholder="label"
        :label="label"
        clearable
        :error-messages="errorMessages"
      ></v-autocomplete>
    <!-- </v-flex>
  </v-layout> -->
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "IncrementalModelSearch",
  data() {
    return {
      descriptionLimit: 60,
      isLoading: false,
      model: this.value,
      search: null,
      items: []
    };
  },
  props: {
    // 親からの引き継ぎデータ
    label: { required: true },
    orderBy: { required: true },
    // 親のモデル情報を取得する
    value: { required: true },
    // 検索先モデル指定
    searchType: { required: true },
    // 検索先フィルター
    filter: { required: false },
    // エラー情報
    errorMessages: { required: true }
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["currencies"]),
    ...mapState("systemUserApi", [
      "searchUserStaffs",
      "searchUserPartners",
      "searchPartnerCustomers",
      "searchPartnerDeliveries"
    ]),
    searchItems() {
      switch(this.searchType) {
        case "staff":
          return this.searchUserStaffs.results;
          break;
        case "currency":
          return this.currencies.results;
          break;
        case "partner":
          // return this.searchUserPartners.results;
          switch(this.filter) {
            case "customer":
              return this.searchPartnerCustomers.results;
              break;
            case "delivery":
              return this.searchPartnerDeliveries.results;
              break;
          }
          break;
      }
    },
    // データ検索用共通パラメータを格納
    params() {
      return {
        company: this.loginUserData.companyId,
        order_by: this.orderBy
      };
    },
    fields() {
      if (!this.model) return [];
      return Object.keys(this.model).map(key => {
        return {
          key,
          value: this.model[key] || ""
        };
      });
    }
  },
  methods: {
    ...mapActions("systemMasterApi", ["getCurrencies"]),
    ...mapActions("systemUserApi", [
      "getSearchUserStaffs",
      "getSearchUserPartners",
      "getSearchPartnerCustomers",
      "getSearchPartnerDeliveries"
    ]),
    searchData(val) {
      this.params.incremental_field = val;
      let search = { params: this.params };
      switch(this.searchType) {
        // 従業員検索
        case "staff":
          // 退職者は表示しない
          search.params.is_tenure = true;
          this.getSearchUserStaffs(search);
          break;
        case "currency":
          this.getCurrencies();
          break;
        case "partner":
          switch(this.filter) {
            case "customer":
              this.getSearchPartnerCustomers(search);
              break;
            case "delivery":
              this.getSearchPartnerDeliveries(search);
              break;
          }
          // search.params[this.filter] = "true";
          // this.getSearchUserPartners(search);
          break;
      }
    }
  },
  watch: {
    // 入力値が変化した場合は検索
    search(val) {
      this.searchData(val);
    },
    model(val) {
      // console.log(val);
      if (!val) {
        this.$emit("input", "");
      } else {
        this.$emit("input", val);
      }
    }
  },
  created() {
    this.searchData();
    this.model = this.value;
  }
};
</script>
