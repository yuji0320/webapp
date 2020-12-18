import api from '@/api';

const inventoryDataState = {
  responseError: {},
  isStandardInventory: false,
  inventoryMasters: {},
  inventoryMaster: {},
  locationMasters: {},
  locationMaster: {},
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
    // 保存場所マスタリスト取得
    setLocationMasters(state, payload) {
      state.locationMasters = payload;
    },
    // 保存場所マスタ単体取得
    setLocationMaster(state, payload) {
      state.locationMaster = payload;
    },
  },
  // API非同期通信処理
  actions: {
    // 在庫部品マスタエラーState情報クリア
    clearInventoryMasterError({commit}) {
      commit('error', {});
    },
    // 標準在庫かどうかセット
    setIsStandardInventory({commit}, data) {
      commit('setIsStandardInventory', data);
    },
    // 在庫部品マスタリストセット
    setInventoryMasters({commit}, data) {
      commit('setInventoryMasters', data);
    },
    // 在庫部品マスタ単体セット
    setInventoryMaster({commit}, data) {
      commit('setInventoryMaster', data);
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
    // 保存場所マスタリストセット
    setLocationMasters({commit}, data) {
      commit('setLocationMasters', data);
    },
    // 保存場所マスタ単体セット
    setLocationMaster({commit}, data) {
      commit('setLocationMaster', data);
    },
    // 保存場所マスタリスト取得
    async getLocationMasters({commit}, data) {
      const url = 'inventory_data/location_master/';
      const commitName = 'setLocationMasters';
      const res = api.get({commit}, url, data, commitName);
      return res;
    },
    // 保存場所単体取得
    getLocationMaster({commit}, data) {
      const url = 'inventory_data/location_master/' + data + '/';
      const commitName = 'setLocationMaster';
      return api
          .get({commit}, url, data, commitName)
          .then(function(response) {
            return response;
          });
    },
    // 保存場所マスタ新規登録
    async postLocationMaster({commit}, data) {
      const url = 'inventory_data/location_master/';
      const commitName = 'setLocationMaster';
      const res = await api.post({commit}, url, data, commitName);
      return res;
    },
    // 保存場所マスタ情報更新
    async putLocationMaster({commit}, data) {
      const url = 'inventory_data/location_master/' + data.id + '/';
      const commitName = 'setLocationMaster';
      const res = await api.put({commit}, url, data, commitName);
      return res;
    },
    // 保存場所マスタ削除
    async deleteLocationMaster({commit}, data) {
      const url = 'inventory_data/location_master/' + data.id + '/';
      const commitName = 'setLocationMaster';
      const res = await api.delete({commit}, url, data, commitName);
      return res;
    },
  }
}