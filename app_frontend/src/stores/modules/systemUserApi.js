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
  // API非同期通信処理
  actions: {
    // 会社情報取得
    getCompany({ commit }, data) {
      let url = "system_user/user_companies/";
      let commitName = "setCompany";
      api.get({ commit }, url, data, commitName);
    },
    // 会社情報更新
    putCompany({ commit }, data) {
      let url = "system_user/user_companies/" + data.id + "/";
      let commitName = "setCompany";
      return api
        .put({ commit }, url, data, commitName)
        .then(function(response) {
          return response;
        });
    },
    // 従業員リスト取得
    getStaffs({ commit }, data) {
      let url = "system_user/user_staffs/";
      let commitName = "setStaffs";
      api.get({ commit }, url, data, commitName);
    },
    // 従業員State情報クリア
    clearStaff({ commit }) {
      commit("setStaff", {});
      commit("error", {});
    },
    // 従業員Stateセット
    setStaff({ commit }, data) {
      commit("setStaff", data);
    },
    // 従業員新規作成
    async postStaff({ commit }, data) {
      let url = "system_user/user_staffs/";
      let commitName = "setStaff";
      const res = await api.post({ commit }, url, data, commitName);
      return res;
    },
    // 従業員情報更新
    async putStaff({ commit }, data) {
      let url = "system_user/user_staffs/" + data.id + "/";
      let commitName = "setStaff";
      const res = await api.put({ commit }, url, data, commitName);
      return res;
    },
    // 従業員削除
    async deleteStaff({ commit }, data) {
      let url = "system_user/user_staffs/" + data.id + "/";
      let commitName = "setStaff";
      const res = await api.delete({ commit }, url, data, commitName);
      return res;
    }
  }
};
