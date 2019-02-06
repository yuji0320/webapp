import api from "@/api";

const systemUserState = {
  responseError: {},
  userCompany: {},
  userStaffs: {},
  userStaff: {},
  userPartners: {},
  userPartner: {}
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
    // ユーザー情報更新
    setStaff(state, payload) {
      state.userStaff = payload;
    },
    // 取引先リスト取得
    setPartners(state, payload) {
      state.userPartners = payload;
    },
    // 取引先情報更新
    setPartner(state, payload) {
      state.userPartner = payload;
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
      console.log(data);
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
    },
    // 取引先リスト取得
    getPartners({ commit }, data) {
      let url = "system_user/user_partners/";
      let commitName = "setPartners";
      api.get({ commit }, url, data, commitName);
    },
    // 取引先State情報クリア
    clearPartner({ commit }) {
      commit("setPartner", {});
      commit("error", {});
    },
    // 取引先Stateセット
    setPartner({ commit }, data) {
      commit("setPartner", data);
    },
    // 取引先新規登録
    async postPartner({ commit }, data) {
      let url = "system_user/user_partners/";
      let commitName = "setPartner";
      const res = await api.post({ commit }, url, data, commitName);
      return res;
    },
    // 取引先情報更新
    async putPartner({ commit }, data) {
      let url = "system_user/user_partners/" + data.id + "/";
      let commitName = "setPartner";
      const res = await api.put({ commit }, url, data, commitName);
      return res;
    },
    // 取引先削除
    async deletePartner({ commit }, data) {
      let url = "system_user/user_partners/" + data.id + "/";
      let commitName = "setPartner";
      const res = await api.delete({ commit }, url, data, commitName);
      return res;
    }
  }
};
