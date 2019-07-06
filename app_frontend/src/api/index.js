// Storeのインポート
import Store from '@/stores';
import axios from 'axios';

// axios を require してインスタンスを生成する
const axiosBase = axios;
// const host = process.env.VUE_APP_API_BASE_URL;

// const host = 'https://localhost/api/';
const host = 'https://192.168.2.200/api/';

export default {
  async request(method, url, params) {
    // トークンを取得する
    const token = Store.state.auth.token;

    // ヘッダー情報を登録する
    const axios = axiosBase.create({
      headers: {
        // "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Headers":
        // "Origin, X-Requested-With, Content-Type, Accept",
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + token,
      },
      proxy: false,
      responseType: 'json',
    });

    axios.defaults.baseURL = host;
    axios.defaults.withCredentials = true;

    // エラー時のレスポンス処理変更
    axios.interceptors.response.use(
        (response) => {
          if (response.status === 204) {
          // 削除成功時はdataに空の値を代入する
            response.data = {};
          }
          // console.log(response);
          return Promise.resolve({
            data: response.data,
          });
        },
        (error) => {
          let snackData = {color: 'error'};
          if (error.response.status === 500) {
          // internal エラー
            snackData.snack = 'This data can not change or delete';
            error.response.data = '';
          } else if (error.response.data.detail) {
          // APIからエラーメッセージが帰ってくる場合
            snackData.snack = error.response.data.detail;
          } else {
          // APIの返答がない場合
            snackData = '';
          }
          // スナックバー情報の追加
          error.response.snack = snackData;
          return Promise.resolve({
            error: error.response,
          });
        }
    );

    let promise = null;
    // url = process.env.VUE_APP_API_BASE_URL + url;

    if (method === 'get') {
      promise = axios.get(url, params);
    } else if (method === 'post') {
      promise = axios.post(url, params);
    } else if (method === 'put') {
      promise = axios.put(url, params);
    } else if (method === 'delete') {
      promise = axios.delete(url, params);
    }
    // console.log(process.env.VUE_APP_API_BASE_URL);
    return promise;
  },

  // get処理
  async get({commit}, url, data, commitName) {
    data = data || {};
    if (data.detail) {
      url = url + data.detail + '/';
    }
    const response = await this.request('get', url, data);
    // console.log(response);
    if (response.data) {
      commit(commitName, response.data);
      return response.data;
    } else {
      // console.log(response.error);
      return response.error;
    }
  },

  // 追加更新処理統合関数
  submitResponse({commit}, val, commitName, submitType) {
    const snackText = submitType;
    if (val.data) {
      // 成功時
      commit(commitName, val);
      commit('error', {});
      val.snack = {snack: snackText + ' is success!', color: 'success'};
      return val;
    } else {
      // 失敗時
      commit('error', val.error.data);
      if (val.error.snack) {
        // エラー処理結果がある場合
        val.snack = val.error.snack;
      } else {
        // エラーメッセージがない場合
        val.snack = {snack: snackText + ' is failed!', color: 'error'};
      }
      return val;
    }
  },
  // post処理(新規追加、問い合わせ)
  async post({commit}, url, data, commitName) {
    const res = await this.request('post', url, data);
    const submitType = 'Create';
    return this.submitResponse({commit}, res, commitName, submitType);
  },
  // put処理(更新)
  async put({commit}, url, data, commitName) {
    const res = await this.request('put', url, data);
    const submitType = 'Update';
    return this.submitResponse({commit}, res, commitName, submitType);
  },
  // delete処理
  async delete({commit}, url, data, commitName) {
    const res = await this.request('delete', url, data);
    const submitType = 'Delete';
    return this.submitResponse({commit}, res, commitName, submitType);
  },
  // 認証API処理
  post_auth(url, params) {
    return this.request('post', url, params);
  },
};
