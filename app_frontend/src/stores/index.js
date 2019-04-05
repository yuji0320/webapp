import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

// システム設定情報の読み込み
import systemConfig from './modules/systemConfig';

// ログイン処理読み込み
import auth from './modules/auth';

// その他API処理読み込み
import systemMasterApi from './modules/systemMasterApi.js';
import systemUserApi from './modules/systemUserApi.js';
import jobOrderAPI from './modules/jobOrder.js';
import billOfMaterialAPI from './modules/billOfMaterial';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    systemConfig,
    auth,
    systemMasterApi,
    systemUserApi,
    jobOrderAPI,
    billOfMaterialAPI,
  },
  state: {},
  mutations: {},
  getters: {},
  actions: {},
  plugins: [
    createPersistedState({
      paths: ['auth', 'systemConfig', 'systemMasterApi', 'jobOrderAPI', 'billOfMaterialAPI'],
      storage: window.sessionStorage,
    }),
  ],
});
