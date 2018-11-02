const systemConfigState = {
  drawerStatus: true
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
