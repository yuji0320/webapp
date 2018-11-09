// システムの設定関係の情報を集約する
const systemConfigState = {
  drawerStatus: true,
  menus: [
    {
      icon: "work",
      title: "Job order Menu",
      subMenus: [
        {
          icon: "work",
          title: "Job order",
          url: ""
        }
      ]
    },
    {
      icon: "bubble_chart",
      title: "Purchasing Menu",
      subMenus: [
        {
          icon: "list",
          title: "Bill of material",
          url: ""
        },
        {
          icon: "send",
          title: "Order",
          url: ""
        },
        {
          icon: "move_to_inbox",
          title: "Purchase",
          url: ""
        }
      ]
    },
    {
      icon: "account_box",
      title: "Man-hour management",
      subMenus: [
        {
          icon: "access_time",
          title: "Man Hour",
          url: ""
        }
      ]
    },
    {
      icon: "search",
      title: "Investigation",
      subMenus: []
    },
    {
      icon: "settings_applications",
      title: "Master file",
      subMenus: [
        {
          icon: "domain",
          title: "Company master",
          url: { name: "Company" }
        },
        {
          icon: "",
          title: "Staff master",
          url: "test"
        },
        {
          icon: "",
          title: "Client master",
          url: ""
        },
        {
          icon: "",
          title: "Man-hour master",
          url: ""
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
