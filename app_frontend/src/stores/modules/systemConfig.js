// システムの設定関係の情報を集約する
const systemConfigState = {
  drawerStatus: true,
  menus: [
    {
      icon: "bubble_chart",
      title: "Purchasing Menu",
      subMenus: [
        {
          icon: "work",
          title: "Job order"
        },
        {
          icon: "list",
          title: "Bill of material"
        },
        {
          icon: "send",
          title: "Order"
        },
        {
          icon: "move_to_inbox",
          title: "Purchase"
        }
      ]
    },
    {
      icon: "account_box",
      title: "Man-hour management",
      subMenus: [
        {
          icon: "access_time",
          title: "Man Hour"
        }
      ]
    },
    {
      icon: "search",
      title: "Investigate",
      subMenus: []
    },
    {
      icon: "settings_applications",
      title: "Master file",
      subMenus: [
        {
          icon: "domain",
          title: "Company master"
        },
        {
          icon: "",
          title: "Staff master"
        },
        {
          icon: "",
          title: "Client master"
        },
        {
          icon: "",
          title: "Man-hour master"
        }
      ]
    }
  ]
};

export default {
  namespaced: true,
  state: systemConfigState,
  mutations: {
    // APIデータ更新
    toggleDrawer(state) {
      state.drawerStatus = !state.drawerStatus;
    }
  },
  actions: {}
};
