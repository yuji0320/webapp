<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-list dense>
        <!-- <v-list-item :to="{ name: 'Main'}" >
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item> -->

        <v-list-group
          v-for="menu in menus"
          :key="menu.text"
          :prepend-icon="menu.icon"
          no-action
        >
          <template v-slot:activator>
              <v-list-item-title >
                {{ menu.title }}
              </v-list-item-title>
          </template>

          <v-list-item
            v-for="subMenu in menu.subMenus"
            :key="subMenu.title"
            link
            :to="subMenu.url"
          >
            <v-list-item-title>
              {{ subMenu.title }}
            </v-list-item-title>
            <v-list-item-icon v-if="subMenu.icon">
              <v-icon>{{ subMenu.icon }}</v-icon>
            </v-list-item-icon>
          </v-list-item>

        </v-list-group>
      </v-list>
    </v-navigation-drawer>



    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="primary"
      dark
    >
      <!-- サイドバー操作 -->
      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
      <v-divider
        class="mx-3"
        inset
        vertical
      ></v-divider>
      <v-toolbar-title v-text="headerTitle"></v-toolbar-title>
      <v-divider
        class="mx-3"
        inset
        vertical></v-divider>
      <!-- ホームボタン -->
      <v-btn 
        icon
        :to="{ name: 'Main'}"
      >
        <v-icon>home</v-icon>
      </v-btn>
      <v-spacer></v-spacer>

      <!-- ログインユーザー情報 -->
      <span class="subheading" v-if="!$vuetify.breakpoint.xs">
        Logged in as {{ loginUserData.fullname }}
      </span>
      <v-divider
        class="mx-3"
        inset
        vertical
      ></v-divider>

      <!-- 右メニュー -->
      <v-menu offset-y>

        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item-group>
            <v-list-item
              v-for="(menu, i) in settingMenus"
              :key="i"
              :to="menu.url"
            >
              <v-list-item-icon>
                <v-icon v-text="menu.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="menu.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
      
    </v-app-bar>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "Header",
  data() {
    return {
      clipped: false,
      settingMenus: [
        {
          icon: "account_circle",
          title: "User Settings",
          url: { name: "ChangePassword" }
        },
        {
          icon: "exit_to_app",
          title: "Log out",
          url: { name: "Logout" }
        }
      ],
      headerTitle: "Business Management System"
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemConfig", ["drawerStatus", "menus"]),
    // サイドメニューのステータスをStoreから取得
    drawer: {
      get() {
        return this.drawerStatus;
      },
      set() {}
    }
  },
  methods: {
    // サイドバー開閉ステータスの保存
    ...mapMutations("systemConfig", ["toggleDrawer", "setMenus"])
  },
  mounted: function() {
    // console.log(this.menus);
    // this.setMenus();
  }
};
</script>
