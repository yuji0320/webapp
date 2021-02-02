import api from '@/api';

const systemMasterState = {
  countries: {},
  currencies: {},
  unitTypes: {},
  expenseCategories: {},
  expenseCategory: {},
  failureCategories: {},
  jobTypes: {},
};

export default {
  namespaced: true,
  state: systemMasterState,
  mutations: {
    // APIデータ更新
    setCountries(state, payload) {
      state.countries = payload;
    },
    // 通貨取得
    setCurrencies(state, payload) {
      state.currencies = payload;
    },
    // 単位種別リスト取得
    setUnitTypes(state, payload) {
      state.unitTypes = payload;
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
    },
    // 作業種別取得用
    setJobTypes(state, payload) {
      state.jobTypes = payload;
    },
  },
  actions: {
    // API非同期通信処理
    getCountries({commit}, data) {
      const url = 'system_master/countries/';
      const commitName = 'setCountries';
      api.get({commit}, url, data, commitName);
    },
    // 通貨リスト取得
    getCurrencies({commit}, data) {
      const url = 'system_master/currencies/';
      const commitName = 'setCurrencies';
      api.get({commit}, url, data, commitName);
    },
    // 単位リスト取得
    getUnitTypes({commit}, data) {
      const url = 'system_master/unit_types/';
      const commitName = 'setUnitTypes';
      api.get({commit}, url, data, commitName);
    },
    // 費用種別リスト取得用
    async getExpenseCategories({commit}, data) {
      const url = 'system_master/expense_categories/';
      const commitName = 'setExpenseCategories';
      api.get({commit}, url, data, commitName);
    },
    // 費用種別取得用
    async getExpenseCategory({commit}, data) {
      const url = 'system_master/expense_categories/';
      const commitName = 'setExpenseCategory';
      const detail = {detail: data}
      return api
          .get({commit}, url, detail, commitName)
          .then(function(response) {
            return response;
          });
    },
    // 仕損費種別取得用
    async getFailureCategories({commit}, data) {
      const url = 'system_master/failure_categories/';
      const commitName = 'setFailureCategories';
      api.get({commit}, url, data, commitName);
    },
    // 作業種別h崇徳用
    async getJobTypes({commit}, data) {
      const url = 'system_master/job_types/';
      const commitName = 'setJobTypes';
      api.get({commit}, url, data, commitName);
    },
  },
};
