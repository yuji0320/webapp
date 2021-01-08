<template>
  <v-autocomplete
    v-model="model"
    :items="searchItems"
    :search-input.sync="search"
    item-text="incrementalField"
    item-value="id"
    :cache-items="true"
    :placeholder="label"
    :label="label"
    :error-messages="errorMessages"
    :disabled="disabled"
    :rules="required"
    class="pl-2"
  >
    <!-- Clearアイコン -->
    <template v-slot:append-outer>
      <v-icon
        @click="clearItem"
        :disabled="disabled"
        v-show="!hideClear"
        class="pr-2"
      >
        clear
      </v-icon>
    </template>
  </v-autocomplete>
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
      items: [],
      rules: [
        value => !!value || 'Required.',
      ],
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
    errorMessages: { required: false },
    // disabled
    disabled: { required: false },
    required: { required: false },    
    hideClear: { required: false }
  },
  // watch: {
  //   value: function (val) {
  //     console.log("test");
  //     this.model = "";
  //   },
  // },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemMasterApi", ["currencies", "unitTypes", "failureCategories", "jobTypes", "expenseCategories"]),
    ...mapState("systemUserApi", [
      "searchUserStaffs",
      "searchUserPartners",
      "searchPartnerCustomers",
      "searchPartnerDeliveries",
      "searchPartnerSuppliers",
      "searchPartnerManufacturers"
    ]),
    ...mapState("jobOrderAPI", ["searchJobOrder"]), 
    searchItems() {
      switch(this.searchType) {
        case "staff":
          return this.searchUserStaffs.results;
          // break;
        case "currency":
          return this.currencies.results;
          // break;
        case "unitType":
          return this.unitTypes.results;
          // break;
        case "failure":
          return this.failureCategories.results;
          // break;
        case "partner":
          switch(this.filter) {
            case "customer":
              return this.searchPartnerCustomers.results;
              // break;
            case "delivery":
              return this.searchPartnerDeliveries.results;
              // break;
            case "supplier":
              return this.searchPartnerSuppliers.results;
              // break;
            case "manufacturer":
              return this.searchPartnerManufacturers.results;
              // break;
          }
          break;
        case "jobOrder":
          return this.searchJobOrder.results;
          // break;
        case "jobType":
          return this.jobTypes.results;
        case "expenseCategory":
          return this.expenseCategories.results;
      }
    },
    // データ検索用共通パラメータを格納
    params() {
      return {
        company: this.loginUserData["companyId"],
        order_by: this.orderBy,
        page_size: 100000
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
    ...mapActions("systemMasterApi", ["getCurrencies", "getUnitTypes", "getFailureCategories", "getJobTypes", "getExpenseCategories"]),
    ...mapActions("systemUserApi", [
      "getSearchUserStaffs",
      "getSearchUserPartners",
      "getSearchPartnerCustomers",
      "getSearchPartnerDeliveries",
      "getSearchPartnerSuppliers",
      "getSearchPartnerManufacturers"
    ]),
    ...mapActions("jobOrderAPI", ["getSearchJobOrder"]),
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
        case "unitType":
          this.getUnitTypes(search);
          break;
        case "failure":
          this.getFailureCategories(search);
          break;
        case "partner":
          switch(this.filter) {
            case "customer":
              this.getSearchPartnerCustomers(search);
              break;
            case "delivery":
              this.getSearchPartnerDeliveries(search);
              break;
            case "supplier":
              this.getSearchPartnerSuppliers(search);
              break;
            case "manufacturer":
              this.getSearchPartnerManufacturers(search);
              break;
          }
          break;
        case "jobOrder":
          this.getSearchJobOrder(search);
          break;
        case "jobType":
          this.getJobTypes(search);
          break;
        case "expenseCategory":
          this.getExpenseCategories(search);
          break;
      }
    },
    clearItem() {
      this.model = "";
      this.$emit("clear-item");
    },
    setData(val) {
      this.model = val;
      // console.log(val);
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
