// システムの設定関係の情報を集約する
const systemConfigState = {
  drawerStatus: true,
  loading: true,
  menus: [
    {
      icon: 'work',
      title: 'Job Order Menu',
      subMenus: [
        {
          icon: 'work',
          title: 'Job order',
          url: {name: 'JobOrderList'},
        },
      ],
    },
    {
      icon: 'bubble_chart',
      title: 'Purchasing Menu',
      subMenus: [
        {
          icon: 'list',
          title: 'Bill of material',
          url: {name: 'BillOfMaterialMenu'},
        },
        {
          icon: 'send',
          title: 'Order',
          url: {name: 'MakingOrderMenu'},
        },
        {
          icon: 'move_to_inbox',
          title: 'Receive',
          url: {name: 'ReceivingProcessMenu'},
        },
      ],
    },
    {
      icon: 'account_box',
      title: 'Man-hour management',
      subMenus: [
        {
          icon: 'access_time',
          title: 'Man Hour',
          url: {name: 'ManHourMenu'},
        },
      ],
    },
    {
      icon: 'list_alt',
      title: 'Inventory Data',
      subMenus: [
        {
          icon: 'list_alt',
          title: 'Inv. Menu',
          url: {name: 'InventoryDataMenu'},
        },
      ],
    },
    {
      icon: 'search',
      title: 'Investigation',
      subMenus: [
        {
          icon: 'poll',
          title: 'Reports',
          url: {name: 'ReportsMenu'},
        },
        {
          icon: 'search',
          title: 'Search',
          url: {name: 'SearchMenu'},
        },
      ],
    },
    {
      icon: 'settings_applications',
      title: 'Master file',
      subMenus: [
        {
          icon: 'domain',
          title: 'Company master',
          url: {name: 'Company'},
        },
        {
          icon: 'people',
          title: 'Staff master',
          url: {name: 'Staff'},
        },
        {
          icon: 'people_outline',
          title: 'Partner master',
          url: {name: 'Partner'},
        }
      ]
    }
  ],
  snackbar: {
    snack: '',
    color: '',
    snackbarStatus: false,
    timeout: 3000,
  },
  excelJson: [],
  moneySetting: {
    prefix: '',
    suffix: '',
    thousands: ',',
    decimal: '.',
    precision: 2,
  },
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
    onSnackbar(state, {snack, color}) {
      state.snackbar.snackbarStatus = true;
      state.snackbar.snack = snack;
      state.snackbar.color = color;
    },
    offSnackbar(state) {
      state.snackbar.snackbarStatus = false;
      state.snackbar.snack = '';
      state.snackbar.color = '';
    },
    setExcelJson(state, payload) {
      state.excelJson = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setMenus(state, payload) {
      state.menus = payload;
    },
  },
  actions: {
    showSnackbar({commit}, {snack, color}) {
      clearTimeout();
      commit('offSnackbar');
      commit('onSnackbar', {snack: snack, color: color});
      setTimeout(function() {
        commit('offSnackbar');
      }, 4000);
    },
    // jsonデータセット
    setExcelJson({commit}, data) {
      commit('setExcelJson', data);
    },
    // setMenus({commit}) {
    //   commit('setMenus', this.systemConfigState.menus);
    // },
  },
};
