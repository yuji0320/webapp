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
    getCountries({ commit, params }) {
      api.get("system_master/countries/", params).then(function(response) {
        if (response.data) {
          // this.results = response.data.results;
          commit("setCountries", response.data);
        } else {
          console.log(response.error);
        }
      });
    }
  }
};
