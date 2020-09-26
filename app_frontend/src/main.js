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

// Bootstrap Vueのインポート
// import BootstrapVue from 'bootstrap-vue';
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap-vue/dist/bootstrap-vue.css';

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
// import SearchToolbar from '@/components/Module/Search/SearchToolbar.vue';
// Vue.component('app-search-toolbar', SearchToolbar);
// import SearchBar from '@/components/Module/SearchBar.vue';
// Vue.component('app-search-bar', SearchBar);
// import CardTable from '@/components/Module/Cards/CardTable.vue';
// Vue.component('app-card-table', CardTable);
import Card from '@/components/Module/Cards/Card.vue';
Vue.component('app-card', Card);
import DataTable from '@/components/Module/DataTable.vue';
Vue.component('app-data-table', DataTable);
// import Dialog from '@/components/Module/Dialog.vue';
// Vue.component('app-dialog', Dialog);
// 検索関係
import IncrementalModelSearch from '@/components/Module/IncrementalModelSearch.vue';
Vue.component('app-incremental-model-search', IncrementalModelSearch);
// import Pagination from '@/components/Module/Search/Pagination.vue';
// Vue.component('app-pagination', Pagination);
// 入力関係
import InputDate from '@/components/Module/InputDate.vue';
Vue.component('app-input-date', InputDate);
// PDF作成
import PdfMakeMixin from '@/components/Module/PdfMake/PdfMakeMixin.js';
Vue.mixin(PdfMakeMixin);

// ダイアログコンポーネント
// eslint-disable-next-line max-len
// import BillOfMaterialDialog from '@/components/Module/Dialogs/BillOfMaterialDialog.vue';
// Vue.component('app-bom-dialog', BillOfMaterialDialog);
// import MakingOrderDialog from '@/components/Module/Dialogs/MakingOrderDialog.vue';
// Vue.component('app-order-dialog', MakingOrderDialog);
// import ReceivingProcessDialog from '@/components/Module/Dialogs/ReceivingProcessDialog.vue';
// Vue.component('app-received-dialog', ReceivingProcessDialog);
// import ManHourDialog from '@/components/Module/Dialogs/ManHourDialog.vue';
// Vue.component('app-man-hour-dialog', ManHourDialog);

import vuetify from './plugins/vuetify';

Vue.use(VeeValidate);
Vue.mixin(titleMixin);
Vue.mixin(dateFormetMixin);
// Vue.use(BootstrapVue);

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
