import "@babel/polyfill";
// 基本ライブラリのインポート
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import Router from "@/routers";
import Store from "@/stores";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";
// ユーティリティファイルのインポート
import titleMixin from "./util/title";
// 時刻データ操作ライブラリのインポート
import moment from "moment";
// バリデーションライブラリのインポート
import VeeValidate from "vee-validate";

// コンポーネントのグローバル適用
import Confirm from "@/components/Module/Confirm.vue";
Vue.component("app-confirm", Confirm);
import ExcelUpload from "@/components/Module/ExcelUpload.vue";
Vue.component("app-excel-upload", ExcelUpload);
import SearchBar from "@/components/Module/SearchBar.vue";
Vue.component("app-search-bar", SearchBar);
import CardTable from "@/components/Module/CardTable.vue";
Vue.component("app-card-table", CardTable);
import Dialog from "@/components/Module/Dialog.vue";
Vue.component("app-dialog", Dialog);

Vue.use(VeeValidate);
Vue.mixin(titleMixin);

// 開発ステータスの定義
Vue.config.productionTip = false;

// 日付表示フィルター定義
Vue.filter("printDate", function(val) {
  return moment(val)
    .locale("ja")
    .format("YYYY年MM月DD日(ddd) HH時mm分ss秒");
});

new Vue({
  router: Router,
  store: Store,
  render: h => h(App)
}).$mount("#app");
