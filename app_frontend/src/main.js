/* eslint-disable max-len */
import '@babel/polyfill';
// 基本ライブラリのインポート
import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import Router from '@/routers';
import Store from '@/stores';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
// ユーティリティファイルのインポート
import titleMixin from './util/title';
import dateFormetMixin from './util/dateFormat';

// ライブラリのインポート
// 時刻データ操作ライブラリのインポート
import moment from 'moment';
// バリデーションライブラリのインポート
import VeeValidate from 'vee-validate';

// v-moneyのインポート
import money from 'v-money';
Vue.use(money, {
  prefix: '',
  suffix: '',
  thousands: ',',
  decimal: '.',
  precision: 2,
});

const moneyConfig = {
  prefix: '',
  suffix: '',
  thousands: ',',
  decimal: '.',
  precision: 2,
};
Vue.use(moneyConfig);

// コンポーネントのグローバル適用
import Confirm from '@/components/Module/Confirm.vue';
Vue.component('app-confirm', Confirm);
import LoadingDialog from '@/components/Module/LoadingDialog.vue';
Vue.component('app-loading-dialog', LoadingDialog);
import ExcelUpload from '@/components/Module/ExcelUpload.vue';
Vue.component('app-excel-upload', ExcelUpload);
import ExcelDownload from '@/components/Module/ExcelDownload.vue';
Vue.component('app-excel-download', ExcelDownload);
import Card from '@/components/Module/Cards/Card.vue';
Vue.component('app-card', Card);
import DataTable from '@/components/Module/DataTable.vue';
Vue.component('app-data-table', DataTable);
// 検索関係
import IncrementalModelSearch from '@/components/Module/IncrementalModelSearch.vue';
Vue.component('app-incremental-model-search', IncrementalModelSearch);
// 入力関係
import InputDate from '@/components/Module/InputDate.vue';
Vue.component('app-input-date', InputDate);
// PDF作成
import PdfMakeMixin from '@/components/Module/PdfMake/PdfMakeMixin.js';
Vue.mixin(PdfMakeMixin);

import vuetify from './plugins/vuetify';

Vue.use(VeeValidate);
Vue.mixin(titleMixin);
Vue.mixin(dateFormetMixin);

// 開発ステータスの定義
Vue.config.productionTip = false;

// 日付表示フィルター定義
Vue.filter('printDate', function(val) {
  return moment(val)
      .locale('ja')
      .format('YYYY年MM月DD日(ddd) HH時mm分ss秒');
});

Vue.filter('moneyDelemiter', function(value) {
  return value.toString().replace(/(\d)(?=(\d{3})+($|\.\d+))/g, '$1,');
  // return value.toString().replace(/^(-?[0-9]+)(?=\.|$)/, function(s){ return s.replace(/([0-9]+?)(?=(?:[0-9]{3})+$)/g, '$1,');});
});

new Vue({
  router: Router,
  store: Store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app');
