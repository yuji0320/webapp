// システムの設定関係の情報を集約する
const systemConfigState = {
  drawerStatus: true,
  menus: [
    {
      icon: "work",
      title: "Job Order Menu",
      subMenus: [
        {
          icon: "work",
          title: "Job order",
          url: { name: "JobOrderList" }
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
          url: { name: "BillOfMaterialMenu" }
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
          icon: "people",
          title: "Staff master",
          url: { name: "Staff" }
        },
        {
          icon: "people_outline",
          title: "Partner master",
          url: { name: "Partner" }
        },
        {
          icon: "",
          title: "Man-hour master",
          url: ""
        }
      ]
    }
  ],
  snackbar: {
    snack: "",
    color: "",
    snackbarStatus: false,
    timeout: 2000
  },
  excelJson: []
};

export default {
  namespaced: true,
  state: systemConfigState,
  mutations: {
    // APIデータ更新
    // サイドバー操作
    toggleDrawer(state) {
      state.drawerStatus = !state.drawerStatus;
    },
    // Snackbarステータス操作
    onSnackbar(state, { snack, color }) {
      state.snackbar.snackbarStatus = true;
      state.snackbar.snack = snack;
      state.snackbar.color = color;
    },
    offSnackbar(state) {
      state.snackbar.snackbarStatus = false;
      state.snackbar.snack = "";
      state.snackbar.color = "";
    },
    setExcelJson(state, payload) {
      state.excelJson = payload;
    }
  },
  actions: {
    showSnackbar({ commit }, { snack, color }) {
      commit("onSnackbar", { snack: snack, color: color });
      setTimeout(function() {
        commit("offSnackbar");
      }, 2000);
    },
    // jsonデータセット
    setExcelJson({ commit }, data) {
      commit("setExcelJson", data);
    },    
  }
};
