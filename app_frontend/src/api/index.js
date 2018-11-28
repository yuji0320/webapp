// Storeのインポート
import Store from "@/stores";

// axios を require してインスタンスを生成する
const axiosBase = require("axios");

export default {
  async request(method, url, params) {
    // トークンを取得する
    var token = Store.state.auth.token;

    // ヘッダー情報を登録する
    const axios = axiosBase.create({
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "JWT " + token
      },
      proxy: false,
      responseType: "json"
    });

    // エラー時のレスポンス処理変更
    axios.interceptors.response.use(
      response => {
        return Promise.resolve({
          data: response.data
        });
      },
      error => {
        return Promise.resolve({
          error: error.response
        });
      }
    );

    var promise = null;
    url = process.env.VUE_APP_API_BASE_URL + url;
    // console.log(params);

    if (method === "get") {
      promise = axios.get(url, params);
      // console.log(promise);
    } else if (method === "post") {
      promise = axios.post(url, params);
      // console.log(promise);
    } else if (method === "put") {
      promise = axios.put(url, params);
    }

    return promise;
  },

  // get処理
  get({ commit }, url, data, commitName) {
    data = data || {};
    if (data.detail) {
      url = url + data.detail + "/";
    }
    return this.request("get", url, data).then(function(response) {
      if (response.data) {
        commit(commitName, response.data);
      } else {
        console.log(response.error);
      }
    });
  },

  // post処理(新規追加、問い合わせ)
  async post({ commit }, url, data, commitName) {
    const res = await this.request("post", url, data);
    if (res.data) {
      commit(commitName, res.data);
      commit("error", {});
      return res;
    } else {
      commit("error", res.error.data);
      return res;
    }
  },

  // put処理(更新)
  put({ commit }, url, data, commitName) {
    return this.request("put", url, data).then(function(response) {
      if (response.data) {
        commit(commitName, response.data);
        return response;
      } else {
        console.log(response.error);
      }
    });
  },

  post_auth(url, params) {
    return this.request("post", url, params);
  }
};
