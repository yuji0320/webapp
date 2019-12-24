import api from '@/api';

const receivingProcessState = {
  responseError: {},
  jobOrderID: '',
  partsType: '',
  isDetail: false,
  supplierID: '',
  orderNumber: '',
  receivingProcesses: {},
  receivingProcess: {},
  tableSelected: [],
};

export default {
  namespaced: true,
  state: receivingProcessState,
  mutations: {
    // 詳細検索かどうか
    setIsDetail(state, payload) {
      state.isDetail = payload;
    },
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
    // 発注番号設定
    setOrderNumber(state, payload) {
      state.orderNumber = payload;
    },
    // 仕入れファイルリスト取得
    setReceivingProcesses(state, payload) {
      state.receivingProcesses = payload;
    },
    // 仕入れファイル単体取得
    setReceivingProcess(state, payload) {
      state.receivingProcess = payload;
    },
    setTableSelected(state, payload) {
      state.tableSelected = payload;
    }
  },
  actions: {
    // 詳細検索かどうか
    setIsDetail({commit}, data) {
      commit('setIsDetail', data);
    },
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
    // 発注番号セット
    setOrderNumber({commit}, data) {
      commit('setOrderNumber', data);
    },
    // 仕入れファイルリスト取得
    async getReceivingProcesses({commit}, data) {
      const url = 'manufacturing_data/receiving_process/';
      const commitName = 'setReceivingProcesses';
      // console.log(res);
      return api.get({commit}, url, data, commitName);
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
      return await api.post({commit}, url, data, commitName);
    },
    // 仕入れファイル情報更新
    async putReceivingProcess({commit}, data) {
      const url = 'manufacturing_data/receiving_process/' + data.id + '/';
      const commitName = 'setReceivingProcess';
      return await api.put({commit}, url, data, commitName);
    },
    // 仕入れファイル削除
    async deleteReceivingProcess({commit}, data) {
      const url = 'manufacturing_data/receiving_process/' + data.id + '/';
      const commitName = 'setReceivingProcess';
      return await api.delete({commit}, url, data, commitName);
    },
    setTableSelected({commit}, data) {
      commit('setTableSelected', data);
    }
  },
};
