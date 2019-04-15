import api from '@/api';

const systemUserState = {
  responseError: {},
  userCompany: {},
  userStaffs: {},
  userStaff: {},
  userPartners: {},
  userPartner: {},
  searchUserStaffs: {},
  searchUserPartners: {},
  searchPartnerCustomers: {},
  searchPartnerDeliveries: {},
  searchPartnerSuppliers: {},
  searchPartnerManufacturers: {},
};

export default {
  namespaced: true,
  state: systemUserState,
  mutations: {
    // エラーハンドリング用
    error(state, payload) {
      state.responseError = payload;
    },
    // APIデータ更新
    // 会社情報更新用
    setCompany(state, payload) {
      state.userCompany = payload;
    },
    // ユーザーリスト取得
    setStaffs(state, payload) {
      state.userStaffs = payload;
    },
    // ユーザー情報更新
    setStaff(state, payload) {
      state.userStaff = payload;
    },
    // 取引先リスト取得
    setPartners(state, payload) {
      state.userPartners = payload;
    },
    // 取引先情報更新
    setPartner(state, payload) {
      state.userPartner = payload;
    },
    // 従業員インクリメンタル検索用
    setSearchUserStaffs(state, payload) {
      state.searchUserStaffs = payload;
    },
    // 取引先インクリメンタル検索用
    setSearchUserPartners(state, payload) {
      state.searchUserPartners = payload;
    },
    // 得意先インクリメンタル検索用
    setSearchPartnerCustomers(state, payload) {
      state.searchPartnerCustomers = payload;
    },
    // 納入先インクリメンタル検索用
    setSearchPartnerDeliveries(state, payload) {
      state.searchPartnerDeliveries = payload;
    },
    // 仕入先インクリメンタル検索用
    setSearchPartnerSuppliers(state, payload) {
      state.searchPartnerSuppliers = payload;
    },
    // メーカーインクリメンタル検索用
    setSearchPartnerManufacturers(state, payload) {
      state.searchPartnerManufacturers = payload;
    },
  },
  // API非同期通信処理
  actions: {
    // 会社情報取得
    getCompany({commit}, data) {
      const url = 'system_user/user_companies/';
      const commitName = 'setCompany';
      api.get({commit}, url, data, commitName);
    },
    // 会社情報更新
    putCompany({commit}, data) {
      const url = 'system_user/user_companies/' + data.id + '/';
      const commitName = 'setCompany';
      // console.log(data);
      return api
          .put({commit}, url, data, commitName)
          .then(function(response) {
          // console.log(response);
            return response;
          });
    },
    // 従業員リスト取得
    getStaffs({commit}, data) {
      const url = 'system_user/user_staffs/';
      const commitName = 'setStaffs';
      api.get({commit}, url, data, commitName);
    },
    // 従業員個別取得
    getStaff({commit}, data) {
      const url = 'system_user/user_staffs/' + data.id + '/';
      const commitName = 'setStaff';
      api.get({commit}, url, data, commitName);
    },
    // 従業員State情報クリア
    clearStaff({commit}) {
      commit('setStaff', {});
      commit('error', {});
    },
    // 従業員Stateセット
    setStaff({commit}, data) {
      commit('setStaff', data);
    },
    // 従業員新規作成
    async postStaff({commit}, data) {
      const url = 'system_user/user_staffs/';
      const commitName = 'setStaff';
      const res = await api.post({commit}, url, data, commitName);
      return res;
    },
    // 従業員情報更新
    async putStaff({commit}, data) {
      const url = 'system_user/user_staffs/' + data.id + '/';
      const commitName = 'setStaff';
      const res = await api.put({commit}, url, data, commitName);
      return res;
    },
    // 従業員削除
    async deleteStaff({commit}, data) {
      const url = 'system_user/user_staffs/' + data.id + '/';
      const commitName = 'setStaff';
      const res = await api.delete({commit}, url, data, commitName);
      return res;
    },
    // 取引先リスト取得
    getPartners({commit}, data) {
      const url = 'system_user/user_partners/';
      const commitName = 'setPartners';
      api.get({commit}, url, data, commitName);
    },
    // 取引先State情報クリア
    clearPartner({commit}) {
      commit('setPartner', {});
      commit('error', {});
    },
    // 取引先Stateセット
    setPartner({commit}, data) {
      commit('setPartner', data);
    },
    // 取引先単体取得
    getPartner({commit}, data) {
      const url = 'system_user/user_partners/' + data + '/';
      const commitName = 'setPartner';
      return api
          .get({commit}, url, data, commitName)
          .then(function(response) {
            return response;
          });
    },
    // 取引先新規登録
    async postPartner({commit}, data) {
      const url = 'system_user/user_partners/';
      const commitName = 'setPartner';
      const res = await api.post({commit}, url, data, commitName);
      return res;
    },
    // 取引先情報更新
    async putPartner({commit}, data) {
      const url = 'system_user/user_partners/' + data.id + '/';
      const commitName = 'setPartner';
      const res = await api.put({commit}, url, data, commitName);
      return res;
    },
    // 取引先削除
    async deletePartner({commit}, data) {
      const url = 'system_user/user_partners/' + data.id + '/';
      const commitName = 'setPartner';
      const res = await api.delete({commit}, url, data, commitName);
      return res;
    },
    // 従業員インクリメンタル検索用
    async getSearchUserStaffs({commit}, data) {
      const url = 'system_user/user_staffs/';
      const commitName = 'setSearchUserStaffs';
      api.get({commit}, url, data, commitName);
    },
    // 取引先インクリメンタル検索用
    async getSearchUserPartners({commit}, data) {
      const url = 'system_user/user_partners/';
      const commitName = 'setSearchUserPartners';
      api.get({commit}, url, data, commitName);
    },
    // 得意先インクリメンタル検索用
    async getSearchPartnerCustomers({commit}, data) {
      data.params.is_customer = 'true';
      const url = 'system_user/user_partners/';
      const commitName = 'setSearchPartnerCustomers';
      api.get({commit}, url, data, commitName);
    },
    // 納入先インクリメンタル検索用
    async getSearchPartnerDeliveries({commit}, data) {
      data.params.is_delivery_destination = 'true';
      const url = 'system_user/user_partners/';
      const commitName = 'setSearchPartnerDeliveries';
      api.get({commit}, url, data, commitName);
    },
    // メーカーインクリメンタル検索用
    async getSearchPartnerManufacturers({commit}, data) {
      data.params.is_manufacturer = 'true';
      const url = 'system_user/user_partners/';
      const commitName = 'setSearchPartnerManufacturers';
      api.get({commit}, url, data, commitName);
    },
    // 仕入先インクリメンタル検索用
    async getSearchPartnerSuppliers({commit}, data) {
      data.params.is_supplier = 'true';
      const url = 'system_user/user_partners/';
      const commitName = 'setSearchPartnerSuppliers';
      api.get({commit}, url, data, commitName);
    },
  },
};
