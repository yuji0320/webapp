import api from '@/api';

const inventoryDataState = {
  responseError: {},
  inventoryMasters: {},
  inventoryMaster: {},
  isStandardInventory: false,
  // jobOrderID: '',
  // partsType: '',
  // isProcessed: false,
  // reprint: false,
};

export default {
  namespaced: true,
  state: inventoryDataState,
  mutations: {
    // エラーハンドリング用
    error(state, payload) {
      state.responseError = payload;
    },
    // 標準在庫かどうか
    setIsStandardInventory(state, payload) {
      state.isStandardInventory = payload;
    },
    // 在庫部品マスタリスト取得
    setInventoryMasters(state, payload) {
      state.inventoryMasters = payload;
    },
    // 在庫部品マスタ単体取得
    setInventoryMaster(state, payload) {
      state.inventoryMaster = payload;
    },
  },
  // API非同期通信処理
  actions: {
    // 在庫部品マスタリストセット
    setInventoryMasters({commit}, data) {
      commit('setInventoryMasters', data);
    },
    // 在庫部品マスタ単体セット
    setInventoryMaster({commit}, data) {
      commit('setInventoryMaster', data);
    },
    // 在庫部品マスタエラーState情報クリア
    clearInventoryMasterError({commit}) {
      commit('error', {});
    },
    // 標準在庫かどうかセット
    setIsStandardInventory({commit}, data) {
      commit('setIsStandardInventory', data);
    },
    // 在庫部品マスタリスト取得
    async getInventoryMasters({commit}, data) {
      const url = 'inventory_data/inventory_master/';
      const commitName = 'setInventoryMasters';
      const res = api.get({commit}, url, data, commitName);
      return res;
    },
    // 在庫部品単体取得
    getInventoryMaster({commit}, data) {
      const url = 'inventory_data/inventory_master/' + data + '/';
      const commitName = 'setInventoryMaster';
      return api
          .get({commit}, url, data, commitName)
          .then(function(response) {
            return response;
          });
    },
    // 在庫マスタ新規登録
    async postInventoryMaster({commit}, data) {
      const url = 'inventory_data/inventory_master/';
      const commitName = 'setInventoryMaster';
      const res = await api.post({commit}, url, data, commitName);
      return res;
    },
    // 在庫マスタ情報更新
    async putInventoryMaster({commit}, data) {
      const url = 'inventory_data/inventory_master/' + data.id + '/';
      const commitName = 'setInventoryMaster';
      const res = await api.put({commit}, url, data, commitName);
      return res;
    },
    // 在庫マスタ削除
    async deleteInventoryMaster({commit}, data) {
      const url = 'inventory_data/inventory_master/' + data.id + '/';
      const commitName = 'setInventoryMaster';
      const res = await api.delete({commit}, url, data, commitName);
      return res;
    },

  }
}