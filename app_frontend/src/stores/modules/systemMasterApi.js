import api from "@/api";

const systemMasterState = {
  countries: {}
};

export default {
  namespaced: true,
  state: systemMasterState,
  mutations: {
    // APIデータ更新
    setCountries(state, payload) {
      state.countries = payload;
    }
  },
  actions: {
    // API非同期通信処理
    getCountries({ commit }, data) {
      let url = "system_master/countries/";
      let commitName = "setCountries";
      api.get({ commit }, url, data, commitName);
    }
  }
};
