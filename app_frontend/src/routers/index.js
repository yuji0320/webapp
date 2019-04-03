import Vue from "vue";
import Router from "vue-router";
import process from "process";

// 認証情報のインポート
import Store from "@/stores";

// ページのインポート
import Root from "@/components/Root.vue";
import Login from "@/components/Login.vue";
import Logout from "@/components/Logout.vue";
import Top from "@/components/Top.vue";
import Main from "@/components/Pages/Main.vue";
import JobOrder from "@/components/Pages/JobOrder/JobOrder.vue";
import JobOrderList from "@/components/Pages/JobOrder/JobOrderList.vue";
import JobOrderDetail from "@/components/Pages/JobOrder/JobOrderDetail.vue";
import JobOrderEdit from "@/components/Pages/JobOrder/JobOrderEdit.vue";
import JobOrderUpload from "@/components/Pages/JobOrder/JobOrderUpload.vue";
import BillOfMaterial from "@/components/Pages/BillOfMaterial/BillOfMaterial.vue";
import BillOfMaterialMenu from "@/components/Pages/BillOfMaterial/BillOfMaterialMenu.vue";
import BillOfMaterialList from "@/components/Pages/BillOfMaterial/BillOfMaterialList.vue";
import BillOfMaterialUpload from "@/components/Pages/BillOfMaterial/BillOfMaterialUpload.vue";
import BillOfMaterialPrint from "@/components/Pages/BillOfMaterial/BillOfMaterialPrint.vue";

import Master from "@/components/Pages/Master/Master.vue";
import Company from "@/components/Pages/Master/Company.vue";
import Staff from "@/components/Pages/Master/Staff.vue";
import StaffUpload from "@/components/Pages/Master/StaffUpload.vue";
import Partner from "@/components/Pages/Master/Partner.vue";
import PartnerUpload from "@/components/Pages/Master/PartnerUpload.vue";


import ExcelUpload from "@/components/Module/ExcelUpload.vue";

Vue.use(Router);
Vue.use(Store);

const router = new Router({
  mode: "history",
  base: process.env.VUE_APP_BASE_URL,
  routes: [
    {
      path: "*",
      redirect: "/"
    },
    {
      path: "/",
      name: "Root",
      component: Root,
      redirect: "/bms",

      // "login"と"Top"に分け、階層構造を定義する
      children: [
        {
          path: "login",
          name: "Login",
          component: Login
        },
        {
          path: "logout",
          name: "Logout",
          component: Logout
        },
        {
          path: "bms",
          name: "Bms",
          component: Top,
          redirect: "/bms/main_menu",
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "main_menu",
              name: "Main",
              component: Main
            },
            {
              path: "excel",
              name: "excel",
              component: ExcelUpload
            },
            {
              path: "job_order",
              name: "JobOrder",
              component: JobOrder,
              children: [
                {
                  path: "list",
                  name: "JobOrderList",
                  component: JobOrderList
                },
                {
                  path: "create",
                  name: "JobOrderCreate",
                  component: JobOrderEdit
                },
                {
                  path: "detail",
                  name: "JobOrderDetail",
                  component: JobOrderDetail
                },
                {
                  path: "edit",
                  name: "JobOrderEdit",
                  component: JobOrderEdit
                },
                {
                  path: "upload",
                  name: "JobOrderUpload",
                  component: JobOrderUpload
                }
              ]
            },
            {
              path: "bill_of_material",
              name: "BillOfMaterial",
              component: BillOfMaterial,
              children: [
                {
                  path: "menu",
                  name: "BillOfMaterialMenu",
                  component: BillOfMaterialMenu
                },
                {
                  path: "list",
                  name: "BillOfMaterialList",
                  component: BillOfMaterialList
                },
                {
                  path: "upload",
                  name: "BillOfMaterialUpload",
                  component: BillOfMaterialUpload
                },
                {
                  path: "print",
                  name: "BillOfMaterialPrint",
                  component: BillOfMaterialPrint
                }
              ]
            },
            {
              path: "master",
              name: "Master",
              component: Master,
              children: [
                {
                  path: "company",
                  name: "Company",
                  component: Company
                },
                {
                  path: "staff",
                  name: "Staff",
                  component: Staff
                },
                {
                  path: "staff_upload",
                  name: "StaffUpload",
                  component: StaffUpload
                },
                {
                  path: "partner",
                  name: "Partner",
                  component: Partner
                },
                {
                  path: "partner_upload",
                  name: "PartnerUpload",
                  component: PartnerUpload
                }
              ]
            }
          ]
        }
      ]
    }
  ]
});

// ログイン認証
router.beforeEach((to, from, next) => {
  if (
    to.matched.some(record => record.meta.requiresAuth) &&
    !Store.state.auth.loggedIn
  ) {
    next({
      path: "/login"
    });
  } else {
    next();
  }
});

export default router;
