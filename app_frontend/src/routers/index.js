/* eslint-disable */

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
import JobOrderEdit from '@/components/Pages/JobOrder/JobOrderEdit.vue';
import JobOrderDetail from '@/components/Pages/JobOrder/JobOrderDetail.vue';
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
import ReceivingProcessSuspense from '@/components/Pages/ReceivingProcess/ReceivingProcessSuspense.vue'; /* eslint-disable-line max-len */

// 工数管理
import ManHourMenu from '@/components/Pages/ManHour/ManHourMenu.vue';
import ManHourList from '@/components/Pages/ManHour/ManHourList.vue';

// 調査
import ReportsMenu from '@/components/Pages/Investigation/Reports/ReportsMenu.vue';
import SalesByPeriod from '@/components/Pages/Investigation/Reports/Sales/SalesByPeriod.vue';
import OpenPO from '@/components/Pages/Investigation/Reports//Sales/OpenPO.vue';
import PurchasingReport from '@/components/Pages/Investigation/Reports/Purchasing/PurchasingReport.vue';
import ManHourTotal from '@/components/Pages/Investigation/Reports//ManHour/ManHourTotal.vue';
import WIPMaterialCosts from '@/components/Pages/Investigation/Reports//WorkInProcess/WIPMaterialCosts.vue';
import WIPLaborCosts from '@/components/Pages/Investigation/Reports//WorkInProcess/WIPLaborCosts.vue';
import CostingReport from '@/components/Pages/Investigation/Reports//CostingReport/CostingReport.vue';
import SearchMenu from '@/components/Pages/Investigation/Search/SearchMenu.vue';
import SearchBOM from '@/components/Pages/Investigation/Search/SearchBOM.vue';
import SearchOrder from '@/components/Pages/Investigation/Search/SearchOrder.vue';
import SearchReceived from '@/components/Pages/Investigation/Search/SearchReceived.vue';
import SearchCost from '@/components/Pages/Investigation/Search/SearchCost.vue';

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
                  // component: () => import(/* webpackChunkName: "JobOrderList" */ '@/components/Pages/JobOrder/JobOrderList.vue')
                },
                {
                  path: 'create',
                  name: 'JobOrderCreate',
                  component: JobOrderEdit,
                  // component: () => import(/* webpackChunkName: "JobOrderEdit" */ '@/components/Pages/JobOrder/JobOrderEdit.vue')
                },
                {
                  path: 'detail',
                  name: 'JobOrderDetail',
                  component: JobOrderDetail,
                  // component: () => import(/* webpackChunkName: "JobOrderDetail" */ '@/components/Pages/JobOrder/JobOrderDetail.vue')
                },
                {
                  path: 'edit',
                  name: 'JobOrderEdit',
                  component: JobOrderEdit,
                  // component: () => import(/* webpackChunkName: "JobOrderEdit" */ '@/components/Pages/JobOrder/JobOrderEdit.vue')
                },
                {
                  path: 'upload',
                  name: 'JobOrderUpload',
                  component: JobOrderUpload,
                  // component: () => import(/* webpackChunkName: "JobOrderUpload" */ '@/components/Pages/JobOrder/JobOrderUpload.vue')
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
                  // component: () => import(/* webpackChunkName: "BillOfMaterialMenu" */ '@/components/Pages/BillOfMaterial/BillOfMaterialMenu.vue')
                },
                {
                  path: 'list',
                  name: 'BillOfMaterialList',
                  component: BillOfMaterialList,
                  // component: () => import(/* webpackChunkName: "BillOfMaterialList" */ '@/components/Pages/BillOfMaterial/BillOfMaterialList.vue')
                },
                {
                  path: 'upload',
                  name: 'BillOfMaterialUpload',
                  component: BillOfMaterialUpload,
                  // component: () => import(/* webpackChunkName: "BillOfMaterialUpload" */ '@/components/Pages/BillOfMaterial/BillOfMaterialUpload.vue')
                },
                {
                  path: 'print',
                  name: 'BillOfMaterialPrint',
                  component: BillOfMaterialPrint,
                  // component: () => import(/* webpackChunkName: "BillOfMaterialPrint" */ '@/components/Pages/BillOfMaterial/BillOfMaterialPrint.vue')
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
                  // component: () => import(/* webpackChunkName: "MakingOrderMenu" */ '@/components/Pages/MakingOrder/MakingOrderMenu.vue')
                },
                {
                  path: 'list',
                  name: 'MakingOrderList',
                  component: MakingOrderList,
                  // component: () => import(/* webpackChunkName: "MakingOrderList" */ '@/components/Pages/MakingOrder/MakingOrderList.vue')
                },
                {
                  path: 'upload',
                  name: 'MakingOrderUpload',
                  component: MakingOrderUpload,
                  // component: () => import(/* webpackChunkName: "MakingOrderUpload" */ '@/components/Pages/MakingOrder/MakingOrderUpload.vue')
                },
                {
                  path: 'print',
                  name: 'MakingOrderPrint',
                  component: MakingOrderPrint,
                  // component: () => import(/* webpackChunkName: "MakingOrderPrint" */ '@/components/Pages/MakingOrder/MakingOrderPrint.vue')
                },
                {
                  path: 'notyet',
                  name: 'MakingOrderNotyet',
                  component: MakingOrderNotyet,
                  // component: () => import(/* webpackChunkName: "MakingOrderNotyet" */ '@/components/Pages/MakingOrder/MakingOrderNotyet.vue')
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
                  // component: () => import(/* webpackChunkName: "ReceivingProcessMenu" */ '@/components/Pages/ReceivingProcess/ReceivingProcessMenu.vue')
                },
                {
                  path: 'suspense',
                  name: 'ReceivingProcessSuspense',
                  component: ReceivingProcessSuspense,
                  // component: () => import(/* webpackChunkName: "ReceivingProcessSuspense" */ '@/components/Pages/ReceivingProcess/ReceivingProcessSuspense.vue')
                },
                {
                  path: 'receiving',
                  name: 'ReceivingProcessList',
                  component: ReceivingProcessList,
                  // component: () => import(/* webpackChunkName: "ReceivingProcessList" */ '@/components/Pages/ReceivingProcess/ReceivingProcessList.vue')
                },
                {
                  path: 'edit',
                  name: 'ReceivingProcessEditList',
                  component: ReceivingProcessEditList,
                  // component: () => import(/* webpackChunkName: "ReceivingProcessEditList" */ '@/components/Pages/ReceivingProcess/ReceivingProcessEditList.vue')
                },
                {
                  path: 'notyet',
                  name: 'ReceivingProcessNotyet',
                  component: ReceivingProcessNotyet,
                  // component: () => import(/* webpackChunkName: "ReceivingProcessNotyet" */ '@/components/Pages/ReceivingProcess/ReceivingProcessNotyet.vue')
                },
              ],
            },
            {
              path: 'man_hour',
              name: 'ManHour',
              component: Root,
              children: [
                {
                  path: 'menu',
                  name: 'ManHourMenu',
                  component: ManHourMenu,
                  // component: () => import(/* webpackChunkName: "ManHourMenu" */ '@/components/Pages/ManHour/ManHourMenu.vue')
                },     
                {
                  path: 'list',
                  name: 'ManHourList',
                  component: ManHourList,
                  // component: () => import(/* webpackChunkName: "ManHourList" */ '@/components/Pages/ManHour/ManHourList.vue')
                },    
              ]
            },
            {
              path: 'investigation',
              name: 'Investigation',
              component: Root,
              children: [
                {
                  path: 'search',
                  name: 'Search',
                  component: Root,
                  children: [
                    {
                      path: 'menu',
                      name: 'SearchMenu',
                      component: SearchMenu,
                      // component: () => import(/* webpackChunkName: "SearchMenu" */ '@/components/Pages/Investigation/Search/SearchMenu.vue')
                    },               
                    {
                      path: 'search_bom',
                      name: 'SearchBOM',
                      component: SearchBOM,
                      // component: () => import(/* webpackChunkName: "SearchBOM" */ '@/components/Pages/Investigation/Search/SearchBOM.vue')
                    },
                    {
                      path: 'search_order',
                      name: 'SearchOrder',
                      component: SearchOrder,
                      // component: () => import(/* webpackChunkName: "SearchOrder" */ '@/components/Pages/Investigation/Search/SearchOrder.vue')
                    },
                    {
                      path: 'search_received',
                      name: 'SearchReceived',
                      component: SearchReceived,
                      // component: () => import(/* webpackChunkName: "SearchReceived" */ '@/components/Pages/Investigation/Search/SearchReceived.vue')
                    },
                    {
                      path: 'search_cost',
                      name: 'SearchCost',
                      component: SearchCost,
                      // component: () => import(/* webpackChunkName: "SearchCost" */ '@/components/Pages/Investigation/Search/SearchCost.vue')
                    },
                  ]
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
                      // component: () => import(/* webpackChunkName: "ReportsMenu" */ '@/components/Pages/Investigation/Reports/ReportsMenu.vue')
                    },
                    {
                      path: 'sales_by_period',
                      name: 'SalesByPeriod',
                      component: SalesByPeriod,
                      // component: () => import(/* webpackChunkName: "SalesByPeriod" */ '@/components/Pages/Investigation/Reports/Sales/SalesByPeriod.vue')
                    },
                    {
                      path: 'open_po',
                      name: 'OpenPO',
                      component: OpenPO,
                      // component: () => import(/* webpackChunkName: "OpenPO" */ '@/components/Pages/Investigation/Reports/Sales/OpenPO.vue')
                    },
                    {
                      path: 'purchasing_report',
                      name: 'PurchasingReport',
                      component: PurchasingReport,
                      // component: () => import(/* webpackChunkName: "PurchasingReport" */ '@/components/Pages/Investigation/Reports/Purchasing/PurchasingReport.vue')
                    },
                    {
                      path: 'man_hour_total',
                      name: 'ManHourTotal',
                      component: ManHourTotal,
                      // component: () => import(/* webpackChunkName: "ManHourTotal" */ '@/components/Pages/Investigation/Reports/ManHour/ManHourTotal.vue')
                    },
                    {
                      path: 'wip_material_costs',
                      name: 'WIPMaterialCosts',
                      component: WIPMaterialCosts,
                      // component: () => import(/* webpackChunkName: "WIPMaterialCosts" */ '@/components/Pages/Investigation/Reports/WorkInProcess/WIPMaterialCosts.vue')
                    },
                    {
                      path: 'wip_labor_costs',
                      name: 'WIPLaborCosts',
                      component: WIPLaborCosts,
                      // component: () => import(/* webpackChunkName: "WIPLaborCosts" */ '@/components/Pages/Investigation/Reports/WorkInProcess/WIPLaborCosts.vue')
                    },
                    {
                      path: 'costing_report',
                      name: 'CostingReport',
                      component: CostingReport,
                      // component: () => import(/* webpackChunkName: "CostingReport" */ '@/components/Pages/Investigation/Reports/CostingReport/CostingReport.vue')
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
                  // component: () => import(/* webpackChunkName: "Company" */ '@/components/Pages/Master/Company.vue')
                },
                {
                  path: 'staff',
                  name: 'Staff',
                  component: Staff,
                  // component: () => import(/* webpackChunkName: "Staff" */ '@/components/Pages/Master/Staff.vue')
                },
                {
                  path: 'staff_upload',
                  name: 'StaffUpload',
                  component: StaffUpload,
                  // component: () => import(/* webpackChunkName: "StaffUpload" */ '@/components/Pages/Master/StaffUpload.vue')
                },
                {
                  path: 'partner',
                  name: 'Partner',
                  component: Partner,
                  // component: () => import(/* webpackChunkName: "Partner" */ '@/components/Pages/Master/Partner.vue')

                },
                {
                  path: 'partner_upload',
                  name: 'PartnerUpload',
                  component: PartnerUpload,
                  // component: () => import(/* webpackChunkName: "PartnerUpload" */ '@/components/Pages/Master/PartnerUpload.vue')

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

/* eslint-enable */