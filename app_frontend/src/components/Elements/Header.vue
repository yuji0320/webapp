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
      <v-list>
        <v-list-tile
        value="true"
        v-for="(menu, i) in drawerMenus"
        :key="i"
        >
          <v-list-tile-action>
            <v-icon v-html="menu.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="menu.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <!-- ヘッダーツールバー -->
    <v-toolbar
    app
    :clipped-left="!clipped"
    >
      <!-- サイドバー操作 -->
      <v-toolbar-side-icon @click="toggleDrawer"></v-toolbar-side-icon>
      <v-divider
        class="mx-3"
        inset
        vertical
      ></v-divider>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <span class="subheading">
        Logged in as {{ loginUserData.fullname }}
      </span>
      <v-divider
        class="mx-3"
        inset
        vertical></v-divider>
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
      // drawer: true,
      drawerMenus: [
        {
          icon: "bubble_chart",
          title: "Menu"
        }
      ],
      settingMenus: [
        {
          icon: "settings",
          title: "Setting",
          url: ""
        },
        {
          icon: "account_circle",
          title: "User",
          url: ""
        },
        {
          icon: "exit_to_app",
          title: "Log out",
          url: "/logout"
        }
      ],
      title: "Business Management System"
    };
  },
  computed: {
    ...mapState("auth", ["loginUserData"]),
    ...mapState("systemConfig", ["drawerStatus"]),
    drawer: {
      get() {
        return this.drawerStatus;
      },
      set() {}
    }
  },
  methods: {
    ...mapMutations("systemConfig", ["toggleDrawer"])
  },
  mounted: function() {
    console.log(this.drawer);
  }
};
</script>
