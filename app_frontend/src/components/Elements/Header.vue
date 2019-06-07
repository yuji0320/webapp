<template>
  <div>
    <!-- サイドバー -->
    <v-navigation-drawer
    persistent
    :clipped="!clipped"
    v-model="drawer"
    enable-resize-watcher
    fixed
    app
    >

      <!-- <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title text-xs-center">
              Side Menu
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar> -->

      <!-- <v-divider></v-divider> -->

      <v-list>
        <v-list-tile 
          :to="{ name: 'Main'}" 
        >
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              Dashbord
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>   
        <!-- サイドバー項目はVuex Steteから取得 -->
        <v-list-group
          v-for="menu in menus"
          :key="menu.title"
          :prepend-icon="menu.icon"
          no-action
          disable-route-watcher 
          enable-resize-watcher
        >
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title v-text="menu.title"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          
          <!-- サブメニュー -->
          <v-list-tile
            v-for="subMenu in menu.subMenus"
            :key="subMenu.title"
            :to="subMenu.url"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ subMenu.title }}</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-icon>{{ subMenu.icon }}</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <!-- ヘッダーツールバー -->
    <v-toolbar
    app
    :clipped-left="!clipped"
    dark 
    color="primary"
    class="white--text"
    >
      <!-- サイドバー操作 -->
      <v-toolbar-side-icon @click="toggleDrawer"></v-toolbar-side-icon>
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
      <span class="subheading">
        Logged in as {{ loginUserData.fullname }}
      </span>
      <v-divider
        class="mx-3"
        inset
        vertical
      ></v-divider>
      <!-- 右メニュー -->
      <v-menu offset-y>
        <v-toolbar-title slot="activator">
          <v-icon>settings</v-icon>
        </v-toolbar-title>
        <v-list>
          <v-list-tile
            v-for="(menu, i) in settingMenus"
            :key="i"
            :to="menu.url"
          >
            <v-list-tile-action>
              <v-icon v-html="menu.icon"></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="menu.title"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>  
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
        // {
        //   icon: "settings",
        //   title: "Setting",
        //   url: ""
        // },
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
