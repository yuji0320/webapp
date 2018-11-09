// Storeのインポート
import Store from "@/stores";

// axios を require してインスタンスを生成する
const axiosBase = require("axios");

export default {
  request(method, url, params) {
    // トークンを取得する
    var token = Store.state.auth.token;

    // ヘッダー情報を登録する
    const axios = axiosBase.create({
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "*",
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

    if (method === "get") {
      promise = axios.get(url, params);
      // console.log(promise);
    } else if (method === "post") {
      promise = axios.post(url, params);
      // console.log(promise);
    }
    // promise.catch(function() {
    //   console.log(promise);
    // });
    return promise;
  },

  get(url, params) {
    return this.request("get", url, params);
  },

  post(url, params) {
    return this.request("post", url, params);
  }
};
