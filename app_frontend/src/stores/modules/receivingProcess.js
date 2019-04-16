import api from '@/api';

const receivingProcessState = {
  responseError: {},
  jobOrderID: '',
  partsType: '',
  supplierID: '',
  receivingProcesses: {},
  receivingProcess: {},
};

export default {
  namespaced: true,
  state: receivingProcessState,
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
    // 仕入れファイルリスト取得
    setReceivingProcesses(state, payload) {
      state.receivingProcesses = payload;
    },
    // 仕入れファイル単体取得
    setReceivingProcess(state, payload) {
      state.receivingProcess = payload;
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
    // 仕入れファイルリスト取得
    async getReceivingProcesses({commit}, data) {
      const url = 'manufacturing_data/receiving_process/';
      const commitName = 'setReceivingProcesses';
      const res = api.get({commit}, url, data, commitName);
      // console.log(res);
      return res;
    },
    // 仕入れファイル単体セット
    setReceivingProcess({commit}, data) {
      commit('setReceivingProcess', data);
    },
    // 仕入れファイルエラーState情報クリア
    clearReceivingProcessError({commit}) {
      commit('error', {});
    },
    // 仕入れファイルリストセット
    setReceivingProcessesList({commit}, data) {
      commit('setReceivingProcesses', data);
    },
    // 仕入れファイル新規登録
    async postReceivingProcess({commit}, data) {
      const url = 'manufacturing_data/receiving_process/';
      const commitName = 'setReceivingProcess';
      const res = await api.post({commit}, url, data, commitName);
      return res;
    },
    // 仕入れファイル情報更新
    async putReceivingProcess({commit}, data) {
      const url = 'manufacturing_data/receiving_process/' + data.id + '/';
      const commitName = 'setReceivingProcess';
      const res = await api.put({commit}, url, data, commitName);
      return res;
    },
    // 仕入れファイル削除
    async deleteReceivingProcess({commit}, data) {
      const url = 'manufacturing_data/receiving_process/' + data.id + '/';
      const commitName = 'setReceivingProcess';
      const res = await api.delete({commit}, url, data, commitName);
      return res;
    },
  },
};
