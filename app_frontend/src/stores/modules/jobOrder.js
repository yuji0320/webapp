import api from '@/api';

const jobOrderState = {
  responseError: {},
  jobOrderStatus: {
    isEditing: false,
  },
  mfgNo: {},
  jobOrders: {},
  jobOrder: {},
  searchJobOrder: {},
};

export default {
  namespaced: true,
  state: jobOrderState,
  mutations: {
    // エラーハンドリング用
    error(state, payload) {
      state.responseError = payload;
    },
    // 編集ステータス登録
    setIsEditing(state, payload) {
      state.jobOrderStatus.isEditing = payload;
    },
    // 工事番号セット
    setMfgNo(state, payload) {
      state.mfgNo = payload;
    },
    // 作業指図書リスト取得
    setJobOrders(state, payload) {
      state.jobOrders = payload;
    },
    // 作業指図書情報更新
    setJobOrder(state, payload) {
      state.jobOrder = payload;
    },
    // 作業指図書インクリメンタル検索用
    setSearchJobOrder(state, payload) {
      state.searchJobOrder = payload;
    },
  },
  // API非同期通信処理
  actions: {
    // エラーステータスクリア
    clearError({commit}) {
      commit('error', {});
    },
    // 作業指図書リスト取得
    getJobOrders({commit}, data) {
      const url = 'manufacturing_data/job_order/';
      const commitName = 'setJobOrders';
      api.get({commit}, url, data, commitName);
    },
    // 新規作成
    createNew({commit}) {
      commit('setIsEditing', false);
    },
    // 新規作成
    isEdit({commit}) {
      commit('setIsEditing', true);
    },
    // 作業指図書IDセット
    setMfgNo({commit}, data) {
      commit('setMfgNo', data);
    },
    // 作業指図書単体取得
    getJobOrder({commit}, data) {
      const url = 'manufacturing_data/job_order/' + data + '/';
      const commitName = 'setJobOrder';
      return api
          .get({commit}, url, data, commitName)
          .then(function(response) {
            return response;
          });
    },
    // 作業指図書セット
    setJobOrder({commit}, data) {
      commit('setJobOrder', data);
    },
    // 作業指図書新規作成
    async postJobOrder({commit}, data) {
      const url = 'manufacturing_data/job_order/';
      const commitName = 'setJobOrder';
      const res = await api.post({commit}, url, data, commitName);
      return res;
    },
    // 作業指図書更新
    async putJobOrder({commit}, data) {
      const url = 'manufacturing_data/job_order/' + data.id + '/';
      const commitName = 'setJobOrder';
      const res = await api.put({commit}, url, data, commitName);
      return res;
    },
    // 作業指図書削除
    async deleteJobOrder({commit}, data) {
      const url = 'manufacturing_data/job_order/' + data.id + '/';
      const commitName = 'setJobOrder';
      const res = await api.delete({commit}, url, data, commitName);
      return res;
    },
    // 取引先State情報クリア
    clearJobOrder({commit}) {
      commit('setJobOrder', {});
      commit('error', {});
    },
    // 作業指図書インクリメンタル検索用
    async getSearchJobOrder({commit}, data) {
      const url = 'manufacturing_data/job_order/';
      const commitName = 'setSearchJobOrder';
      api.get({commit}, url, data, commitName);
    },
  },
};
