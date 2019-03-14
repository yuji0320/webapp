import api from "@/api";

const systemMasterState = {
  countries: {},
  currencies: {},
  expenseCategories: {},
  expenseCategory: {},
  failureCategories: {}
};

export default {
  namespaced: true,
  state: systemMasterState,
  mutations: {
    // APIデータ更新
    setCountries(state, payload) {
      state.countries = payload;
    },
    setCurrencies(state, payload) {
      state.currencies = payload;
    },
    // 費用種別リスト取得用
    setExpenseCategories(state, payload) {
      state.expenseCategories = payload;
    },
    // 費用種別取得用
    setExpenseCategory(state, payload) {
      state.expenseCategory = payload;
    },
    // 仕損費種別取得用
    setFailureCategories(state, payload) {
      state.failureCategories = payload;
    }
  },
  actions: {
    // API非同期通信処理
    getCountries({ commit }, data) {
      let url = "system_master/countries/";
      let commitName = "setCountries";
      api.get({ commit }, url, data, commitName);
    },
    getCurrencies({ commit }, data) {
      let url = "system_master/currencies/";
      let commitName = "setCurrencies";
      api.get({ commit }, url, data, commitName);
    },
    // 費用種別リスト取得用
    async getExpenseCategories({ commit }, data) {
      let url = "system_master/expense_categories/";
      let commitName = "setExpenseCategories";
      api.get({ commit }, url, data, commitName);
    },
    // 費用種別取得用
    async getExpenseCategory({ commit }, data) {
      let url = "system_master/expense_categories/" + data + "/";
      let commitName = "setExpenseCategory";
      api.get({ commit }, url, data, commitName);
    },
    // 仕損費種別取得用
    async getFailureCategories({ commit }, data) {
      let url = "system_master/failure_categories/";
      let commitName = "setFailureCategories";
      api.get({ commit }, url, data, commitName);
    }
  }
};
