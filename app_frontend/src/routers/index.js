import Vue from "vue";
import Router from "vue-router";

// 認証情報のインポート
import Store from "@/stores";

// ページのインポート
import Root from "@/components/Root.vue";
import Login from "@/components/Login.vue";
import Logout from "@/components/Logout.vue";
import Top from "@/components/Top.vue";
import Main from "@/components/Pages/Main.vue";
import Master from "@/components/Pages/Master/Master.vue";
import Company from "@/components/Pages/Master/Company.vue";
import Staff from "@/components/Pages/Master/Staff.vue";
import Partner from "@/components/Pages/Master/Partner.vue";

Vue.use(Router);
Vue.use(Store);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
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
                  path: "partner",
                  name: "Partner",
                  component: Partner
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
