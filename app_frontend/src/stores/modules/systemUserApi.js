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
    getCompany({ commit }, data) {
      let url = "system_user/user_companies/";
      let commitName = "setCompany";
      api.get({ commit }, url, data, commitName);
      // api.get(url, data).then(function(response) {
      //   if (response.data) {
      //     commit(commitName, response.data);
      //   } else {
      //     console.log(response.error);
      //   }
      // });
    }
  }
};
