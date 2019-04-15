import api from '@/api';

const makingOrderState = {
  responseError: {},
  jobOrderID: '',
  partsType: '',
  supplierID: '',
  makingOrders: {},
  makingOrder: {},
  reprint: false,
};

export default {
  namespaced: true,
  state: makingOrderState,
  mutations: {
    // エラーハンドリング用
    error(state, payload) {
      state.responseError = payload;
    },
    // 工事番号指定
    setJobOrderID(state, payload) {
      state.jobOrderID = payload;
    },
    // 部品種別設定
    setPartsType(state, payload) {
      state.partsType = payload;
    },
    // 部品種別設定
    setSupplierID(state, payload) {
      state.supplierID = payload;
    },
    // 部品表リスト取得
    setMakingOrders(state, payload) {
      state.makingOrders = payload;
    },
    // 部品表単体取得
    setMakingOrder(state, payload) {
      state.makingOrder = payload;
    },
    // 印刷ステータス登録
    setReprint(state, payload) {
      state.reprint = payload;
    },
  },
  actions: {
    // 作業指図書IDセット
    setJobOrderID({commit}, data) {
      commit('setJobOrderID', data);
    },
    // 部品種別IDセット
    setPartsType({commit}, data) {
      commit('setPartsType', data);
    },
    // 仕入先IDセット
    setSupplierID({commit}, data) {
      commit('setSupplierID', data);
    },
    // 部品表リスト取得
    async getMakingOrders({commit}, data) {
      const url = 'manufacturing_data/making_order/';
      const commitName = 'setMakingOrders';
      const res = api.get({commit}, url, data, commitName);
      return res;
    },
    // 部品表単体セット
    setMakingOrder({commit}, data) {
      commit('setMakingOrder', data);
    },
    // 部品表エラーState情報クリア
    clearMakingOrderError({commit}) {
      commit('error', {});
    },
    // 部品表リストセット
    setMakingOrders({commit}, data) {
      commit('setMakingOrders', data);
    },
    // 部品表新規登録
    async postMakingOrder({commit}, data) {
      const url = 'manufacturing_data/making_order/';
      const commitName = 'setMakingOrder';
      const res = await api.post({commit}, url, data, commitName);
      return res;
    },
    // 部品表情報更新
    async putMakingOrder({commit}, data) {
      const url = 'manufacturing_data/making_order/' + data.id + '/';
      const commitName = 'setMakingOrder';
      const res = await api.put({commit}, url, data, commitName);
      return res;
    },
    // 部品表削除
    async deleteMakingOrder({commit}, data) {
      const url = 'manufacturing_data/making_order/' + data.id + '/';
      const commitName = 'setMakingOrder';
      const res = await api.delete({commit}, url, data, commitName);
      return res;
    },
    // 新規作成
    setReprint({commit}, data) {
      commit('setReprint', data);
    },
  },
};
