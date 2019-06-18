import Vue from 'vue';
import Router from 'vue-router';
import process from 'process';

// 認証情報のインポート
import Store from '@/stores';

// ページのインポート
import Root from '@/components/Root.vue';
import Login from '@/components/Login.vue';
import Logout from '@/components/Logout.vue';
import Top from '@/components/Top.vue';
import Main from '@/components/Pages/Main.vue';
// 作業指図書
import JobOrderList from '@/components/Pages/JobOrder/JobOrderList.vue';
import JobOrderDetail from '@/components/Pages/JobOrder/JobOrderDetail.vue';
import JobOrderEdit from '@/components/Pages/JobOrder/JobOrderEdit.vue';
import JobOrderUpload from '@/components/Pages/JobOrder/JobOrderUpload.vue';
// 部品表
import BillOfMaterialMenu from '@/components/Pages/BillOfMaterial/BillOfMaterialMenu.vue'; /* eslint-disable-line max-len */
import BillOfMaterialList from '@/components/Pages/BillOfMaterial/BillOfMaterialList.vue'; /* eslint-disable-line max-len */
import BillOfMaterialUpload from '@/components/Pages/BillOfMaterial/BillOfMaterialUpload.vue'; /* eslint-disable-line max-len */
import BillOfMaterialPrint from '@/components/Pages/BillOfMaterial/BillOfMaterialPrint.vue'; /* eslint-disable-line max-len */
// 発注
import MakingOrderMenu from '@/components/Pages/MakingOrder/MakingOrderMenu.vue'; /* eslint-disable-line max-len */
import MakingOrderList from '@/components/Pages/MakingOrder/MakingOrderList.vue'; /* eslint-disable-line max-len */
import MakingOrderUpload from '@/components/Pages/MakingOrder/MakingOrderUpload.vue'; /* eslint-disable-line max-len */
import MakingOrderPrint from '@/components/Pages/MakingOrder/MakingOrderPrint.vue'; /* eslint-disable-line max-len */
import MakingOrderNotyet from '@/components/Pages/MakingOrder/MakingOrderNotyet.vue'; /* eslint-disable-line max-len */
// 仕入れ
import ReceivingProcessMenu from '@/components/Pages/ReceivingProcess/ReceivingProcessMenu.vue'; /* eslint-disable-line max-len */
import ReceivingProcessNotyet from '@/components/Pages/ReceivingProcess/ReceivingProcessNotyet.vue'; /* eslint-disable-line max-len */
import ReceivingProcessList from '@/components/Pages/ReceivingProcess/ReceivingProcessList.vue'; /* eslint-disable-line max-len */
import ReceivingProcessEditList from '@/components/Pages/ReceivingProcess/ReceivingProcessEditList.vue'; /* eslint-disable-line max-len */
// 調査
import ReportsMenu from '@/components/Pages/Investigation/Reports/ReportsMenu.vue';
import SalesByPeriod from '@/components/Pages/Investigation/Reports/SalesByPeriod.vue';
import PartsSearch from '@/components/Pages/Investigation/PartsSearch.vue';
// マスター
import Company from '@/components/Pages/Master/Company.vue';
import Staff from '@/components/Pages/Master/Staff.vue';
import StaffUpload from '@/components/Pages/Master/StaffUpload.vue';
import Partner from '@/components/Pages/Master/Partner.vue';
import PartnerUpload from '@/components/Pages/Master/PartnerUpload.vue';
// ユーザー設定
import ChangePassword from '@/components/Pages/UserSettings/ChangePassword.vue';


import ExcelUpload from '@/components/Module/ExcelUpload.vue';

Vue.use(Router);
Vue.use(Store);

const router = new Router({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL,
  routes: [
    {
      path: '*',
      redirect: '/',
    },
    {
      path: '/',
      name: 'Root',
      component: Root,
      redirect: '/bms',

      // "login"と"Top"に分け、階層構造を定義する
      children: [
        {
          path: 'login',
          name: 'Login',
          component: Login,
        },
        {
          path: 'logout',
          name: 'Logout',
          component: Logout,
        },
        {
          path: 'bms',
          name: 'Bms',
          component: Top,
          redirect: '/bms/main_menu',
          meta: {
            requiresAuth: true,
          },
          children: [
            {
              path: 'main_menu',
              name: 'Main',
              component: Main,
            },
            {
              path: 'excel',
              name: 'excel',
              component: ExcelUpload,
            },
            {
              path: 'user_settings',
              name: 'UserSettings',
              component: Root,
              children: [
                {
                  path: 'change_password',
                  name: 'ChangePassword',
                  component: ChangePassword,
                },
              ]
            },
            {
              path: 'job_order',
              name: 'JobOrder',
              component: Root,
              children: [
                {
                  path: 'list',
                  name: 'JobOrderList',
                  component: JobOrderList,
                },
                {
                  path: 'create',
                  name: 'JobOrderCreate',
                  component: JobOrderEdit,
                },
                {
                  path: 'detail',
                  name: 'JobOrderDetail',
                  component: JobOrderDetail,
                },
                {
                  path: 'edit',
                  name: 'JobOrderEdit',
                  component: JobOrderEdit,
                },
                {
                  path: 'upload',
                  name: 'JobOrderUpload',
                  component: JobOrderUpload,
                },
              ],
            },
            {
              path: 'bill_of_material',
              name: 'BillOfMaterial',
              component: Root,
              children: [
                {
                  path: 'menu',
                  name: 'BillOfMaterialMenu',
                  component: BillOfMaterialMenu,
                },
                {
                  path: 'list',
                  name: 'BillOfMaterialList',
                  component: BillOfMaterialList,
                },
                {
                  path: 'upload',
                  name: 'BillOfMaterialUpload',
                  component: BillOfMaterialUpload,
                },
                {
                  path: 'print',
                  name: 'BillOfMaterialPrint',
                  component: BillOfMaterialPrint,
                },
              ],
            },
            {
              path: 'making_order',
              name: 'MakingOrder',
              component: Root,
              children: [
                {
                  path: 'menu',
                  name: 'MakingOrderMenu',
                  component: MakingOrderMenu,
                },
                {
                  path: 'list',
                  name: 'MakingOrderList',
                  component: MakingOrderList,
                },
                {
                  path: 'upload',
                  name: 'MakingOrderUpload',
                  component: MakingOrderUpload,
                },
                {
                  path: 'print',
                  name: 'MakingOrderPrint',
                  component: MakingOrderPrint,
                },
                {
                  path: 'notyet',
                  name: 'MakingOrderNotyet',
                  component: MakingOrderNotyet,
                },
              ],
            },
            {
              path: 'receiving_process',
              name: 'ReceivingProcess',
              component: Root,
              children: [
                {
                  path: 'menu',
                  name: 'ReceivingProcessMenu',
                  component: ReceivingProcessMenu,
                },
                {
                  path: 'receiving',
                  name: 'ReceivingProcessList',
                  component: ReceivingProcessList,
                },
                {
                  path: 'edit',
                  name: 'ReceivingProcessEditList',
                  component: ReceivingProcessEditList,
                },
                {
                  path: 'notyet',
                  name: 'ReceivingProcessNotyet',
                  component: ReceivingProcessNotyet,
                },
              ],
            },
            {
              path: 'investigation',
              name: 'Investigation',
              component: Root,
              children: [
                {
                  path: 'parts_search',
                  name: 'PartsSearch',
                  component: PartsSearch,
                },
                {
                  path: 'reports',
                  name: 'Reports',
                  component: Root,
                  children: [
                    {
                      path: 'menu',
                      name: 'ReportsMenu',
                      component: ReportsMenu,
                    },
                    {
                      path: 'sales_by_period',
                      name: 'SalesByPeriod',
                      component: SalesByPeriod,
                    },
                  ],
                },
              ],
            },
            {
              path: 'master',
              name: 'Master',
              component: Root,
              children: [
                {
                  path: 'company',
                  name: 'Company',
                  component: Company,
                },
                {
                  path: 'staff',
                  name: 'Staff',
                  component: Staff,
                },
                {
                  path: 'staff_upload',
                  name: 'StaffUpload',
                  component: StaffUpload,
                },
                {
                  path: 'partner',
                  name: 'Partner',
                  component: Partner,
                },
                {
                  path: 'partner_upload',
                  name: 'PartnerUpload',
                  component: PartnerUpload,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});

// ログイン認証
router.beforeEach((to, from, next) => {
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !Store.state.auth.loggedIn
  ) {
    next({
      path: '/login',
    });
  } else {
    next();
  }
});

export default router;
