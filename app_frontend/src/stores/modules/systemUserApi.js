import api from "@/api";

const systemUserState = {
  userCompany: {}
};

export default {
  namespaced: true,
  state: systemUserState,
  mutations: {
    // APIデータ更新
    setCompany(state, payload) {
      state.userCompany = payload;
    }
  },
  actions: {
    // API非同期通信処理
    getCompany({ commit }, params) {
      api.get("system_user/user_companies/", params).then(function(response) {
        if (response.data) {
          commit("setCompany", response.data);
        } else {
          console.log(response.error);
        }
      });
    }
  }
};
