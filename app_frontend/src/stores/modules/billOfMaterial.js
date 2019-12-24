import api from '@/api';

const billOfMaterialState = {
  responseError: {},
  jobOrderID: '',
  partsType: '',
  isProcessed: false,
  billOfMaterials: {},
  billOfMaterial: {},
  reprint: false,
};

export default {
  namespaced: true,
  state: billOfMaterialState,
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
    // 加工部品かどうか
    setIsProcessed(state, payload) {
      state.isProcessed = payload;
    },
    // 部品表リスト取得
    setBillOfMaterials(state, payload) {
      state.billOfMaterials = payload;
    },
    // 部品表単体取得
    setBillOfMaterial(state, payload) {
      state.billOfMaterial = payload;
    },
    // 印刷ステータス登録
    setReprint(state, payload) {
      state.reprint = payload;
    },
  },
  // API非同期通信処理
  actions: {
    // 作業指図書IDセット
    setJobOrderID({commit}, data) {
      commit('setJobOrderID', data);
    },
    // 部品種別IDセット
    setPartsType({commit}, data) {
      commit('setPartsType', data);
    },
    // 加工部品かどうかセット
    setIsProcessed({commit}, data) {
      commit('setIsProcessed', data);
    },
    // 部品表リスト取得
    async getBillOfMaterials({commit}, data) {
      const url = 'manufacturing_data/bill_of_material/';
      const commitName = 'setBillOfMaterials';
      const res = api.get({commit}, url, data, commitName);
      return res;
    },
    // 部品表単体セット
    setBillOfMaterial({commit}, data) {
      commit('setBillOfMaterial', data);
    },
    // 部品表エラーState情報クリア
    clearBillOfMaterialError({commit}) {
      commit('error', {});
    },
    // 部品表リストセット
    setBillOfMaterials({commit}, data) {
      commit('setBillOfMaterials', data);
    },
    // 部品表新規登録
    async postBillOfMaterial({commit}, data) {
      const url = 'manufacturing_data/bill_of_material/';
      const commitName = 'setBillOfMaterial';
      const res = await api.post({commit}, url, data, commitName);
      return res;
    },
    // 部品表情報更新
    async putBillOfMaterial({commit}, data) {
      const url = 'manufacturing_data/bill_of_material/' + data.id + '/';
      const commitName = 'setBillOfMaterial';
      const res = await api.put({commit}, url, data, commitName);
      return res;
    },
    // 部品表削除
    async deleteBillOfMaterial({commit}, data) {
      const url = 'manufacturing_data/bill_of_material/' + data.id + '/';
      const commitName = 'setBillOfMaterial';
      const res = await api.delete({commit}, url, data, commitName);
      return res;
    },
    // 新規作成
    setReprint({commit}, data) {
      commit('setReprint', data);
    },
  },
};
