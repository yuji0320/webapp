import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

// システム設定情報の読み込み
import systemConfig from "./modules/systemConfig";

// ログイン処理読み込み
import auth from "./modules/auth";

// その他API処理読み込み
import systemMasterApi from "./modules/systemMasterApi.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    systemConfig,
    auth,
    systemMasterApi
  },
  state: {},
  mutations: {},
  getters: {},
  actions: {},
  plugins: [createPersistedState()]
});
