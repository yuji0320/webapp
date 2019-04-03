import api from "@/api";

const billOfMaterialState = {
  responseError: {},
  jobOrderID: "",
  partsType: "",
  billOfMaterials: {},
  billOfMaterial: {}
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
    // 部品表リスト取得
    setBillOfMaterials(state, payload) {
      state.billOfMaterials = payload;
    },
    // 部品表単体取得
    setBillOfMaterial(state, payload) {
      state.billOfMaterial = payload;
    }
  },
  // API非同期通信処理
  actions: {
    // 作業指図書IDセット
    setJobOrderID({ commit }, data) {
      commit("setJobOrderID", data);
    },
    // 部品種別IDセット
    setPartsType({ commit }, data) {
      commit("setPartsType", data);
    },
    // 部品表リスト取得
    getBillOfMaterials({ commit }, data) {
      let url = "manufacturing_data/bill_of_material/";
      let commitName = "setBillOfMaterials";
      api.get({ commit }, url, data, commitName);
    },
    // 部品表単体セット
    setBillOfMaterial({ commit }, data) {
      commit("setBillOfMaterial", data);
    },
    // 部品表State情報クリア
    clearBillOfMaterialError({ commit }) {
      commit("error", {});
    },
    // 部品表リストセット
    setBillOfMaterials({ commit }, data) {
      commit("setBillOfMaterials", data);
    },
    // 部品表新規登録
    async postBillOfMaterial({ commit }, data) {
      let url = "manufacturing_data/bill_of_material/";
      let commitName = "setBillOfMaterial";
      const res = await api.post({ commit }, url, data, commitName);
      return res;
    },
    // 部品表情報更新
    async putBillOfMaterial({ commit }, data) {
      let url = "manufacturing_data/bill_of_material/" + data.id + "/";
      let commitName = "setBillOfMaterial";
      const res = await api.put({ commit }, url, data, commitName);
      return res;
    },
    // 部品表削除
    async deleteBillOfMaterial({ commit }, data) {
      let url = "manufacturing_data/bill_of_material/" + data.id + "/";
      let commitName = "setBillOfMaterial";
      const res = await api.delete({ commit }, url, data, commitName);
      return res;
    },
  }
}
