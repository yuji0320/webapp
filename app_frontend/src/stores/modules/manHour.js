import api from '@/api';

const manHourState = {
  responseError: {},
  isAdmin: "",
  isAnnual: false,
  manHour: {},
  manHours: {}
};

export default {
  namespaced: true,
  state: manHourState,
  mutations: {
    // エラーハンドリング用
    error(state, payload) {
      state.responseError = payload;
    },
    // 管理者かどうか
    setIsAdmin(state, payload) {
      state.isAdmin = payload;
    },
    // 年間検索かどうか
    setIsAnnual(state, payload) {
      state.isAnnual = payload;
    },
    // 仕入れファイルリスト取得
    setManHours(state, payload) {
      state.manHours = payload;
    },
    // 仕入れファイル単体取得
    setManHour(state, payload) {
      state.manHour = payload;
    },
  },
  actions: {
    // 管理者かどうか
    setIsAdmin({commit}, data) {
      commit('setIsAdmin', data);
    },
    // 年間検索かどうか
    setIsAnnual({commit}, data) {
      commit('setIsAnnual', data);
    },
    // 工数単体セット
    setManHour({commit}, data) {
      commit('setManHour', data);
    },
    // 工数リスト取得
    async getManHours({commit}, data) {
      const url = 'manufacturing_data/man_hour/';
      const commitName = 'setManHours';
      // console.log(res);
      return api.get({commit}, url, data, commitName);
    },
    // 工数新規登録
    async postManHour({commit}, data) {
      const url = 'manufacturing_data/man_hour/';
      const commitName = 'setManHour';
      const res = await api.post({commit}, url, data, commitName);
      return res;
    },
    // 工数情報更新
    async putManHour({commit}, data) {
      const url = 'manufacturing_data/man_hour/' + data.id + '/';
      const commitName = 'setManHour';
      const res = await api.put({commit}, url, data, commitName);
      return res;
    },
    // 工数削除
    async deleteManHour({commit}, data) {
      const url = 'manufacturing_data/man_hour/' + data.id + '/';
      const commitName = 'setManHour';
      const res = await api.delete({commit}, url, data, commitName);
      return res;
    },
    // 工数エラーState情報クリア
    clearManHourError({commit}) {
      commit('error', {});
    },
    // 工数リストセット
    setManHours({commit}, data) {
      commit('setManHours', data);
    },
  }
}