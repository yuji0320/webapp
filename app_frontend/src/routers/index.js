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
          name: "login",
          component: Login
        },
        {
          path: "logout",
          name: "logout",
          component: Logout
        },
        {
          path: "bms",
          name: "bms",
          component: Top,
          redirect: "/bms/main_menu",
          meta: {
            requiresAuth: true
          },
          children: [
            {
              path: "main_menu",
              name: "main",
              component: Main
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
