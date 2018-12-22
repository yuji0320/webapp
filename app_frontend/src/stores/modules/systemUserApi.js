import api from "@/api";

const systemUserState = {
  responseError: {},
  userCompany: {},
  userStaffs: {},
  userStaff: {}
};

export default {
  namespaced: true,
  state: systemUserState,
  mutations: {
    // エラーハンドリング用
    error(state, payload) {
      state.responseError = payload;
    },
    // APIデータ更新
    // 会社情報更新用
    setCompany(state, payload) {
      state.userCompany = payload;
    },
    // ユーザーリスト取得
    setStaffs(state, payload) {
      state.userStaffs = payload;
    },
    // ユーザー情報アップロード
    setStaff(state, payload) {
      state.userStaff = payload;
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
    },
    async newStaff({ commit }, data) {
      let url = "system_user/user_staffs/";
      let commitName = "setStaff";
      const res = await api.post({ commit }, url, data, commitName);
      // console.log(res);
      return res;
    },
    async clearStaff({ commit }) {
      commit("setStaff", {});
      commit("error", {});
    },
    async setStaff({ commit }, data) {
      commit("setStaff", data);
    }
  }
};
