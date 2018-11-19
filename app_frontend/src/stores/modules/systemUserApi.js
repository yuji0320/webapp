import api from "@/api";

const systemUserState = {
  userCompany: {},
  userStaffs: {}
};

export default {
  namespaced: true,
  state: systemUserState,
  mutations: {
    // APIデータ更新
    setCompany(state, payload) {
      state.userCompany = payload;
    },
    setStaffs(state, payload) {
      state.userStaffs = payload;
    }
  },
  actions: {
    // API非同期通信処理
    getCompany({ commit }, data) {
      let url = "system_user/user_companies/";
      let commitName = "setCompany";
      api.get({ commit }, url, data, commitName);
    },
    putCompany({ commit }, data) {
      let url = "system_user/user_companies/" + data.id + "/";
      let commitName = "setCompany";
      return api
        .put({ commit }, url, data, commitName)
        .then(function(response) {
          return response;
        });
    },
    getStaffs({ commit }, data) {
      let url = "system_user/user_staffs/";
      let commitName = "setStaffs";
      api.get({ commit }, url, data, commitName);
    }
  }
};
