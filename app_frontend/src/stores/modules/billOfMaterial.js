import api from "@/api";

const billOfMaterialState = {
  responseError: {},
  jobOrderID: "",
  partsType: "",
  billOfMaterials: {}
};

export default {
  namespaced: true,
  state: billOfMaterialState,
  mutations: {
    // 工事番号指定
    setJobOrderID(state, payload) {
      state.jobOrderID = payload;
    },
    // 部品種別設定
    setPartsType(state, payload) {
      state.partsType = payload;
    },
    // 部品表取得
    setBillOfMaterials(state, payload) {
      state.billOfMaterials = payload;
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
    // 作業指図書リスト取得
    getBillOfMaterials({ commit }, data) {
      let url = "manufacturing_data/bill_of_material/";
      let commitName = "setBillOfMaterials";
      api.get({ commit }, url, data, commitName);
    },
  }
}
