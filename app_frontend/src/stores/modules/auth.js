import api from '@/api';

const authState = {
  responseError: {},
  loggedIn: false,
  token: 'token',
  loginUserData: {},
};

export default {
  namespaced: true,
  state: Object.assign({}, authState),
  mutations: {
    error(state, payload) {
      state.responseError = payload;
    },
    login(state, payload) {
      state.loggedIn = true;
      state.token = payload;
    },
    logout(state) {
      state.loggedIn = false;
      state.token = '';
      for (const key in state) {
        if (authState.hasOwnProperty(key)) {
          state[key] = authState[key];
        }
      }
    },
    userData(state, payload) {
      state.loginUserData = payload;
    },
  },
  actions: {
    login({commit}, payload) {
      api
          .post_auth('api-token-auth/', {
            username: payload.username,
            password: payload.password,
          })
          .then(function(response) {
            if (response.data) {
            // エラー解除
              commit('error', {});
              // トークンを保存
              commit('login', response.data.token);
              // ログイン後、リダイレクト
              payload.router.push('/top');
            } else {
            // エラー情報を保存
              commit('error', response.error);
            }
          });
    },
    logout({commit}, payload) {
      commit('logout');
      // ログアウト後リダイレクト
      payload.router.push('/login');
    },
    // ユーザー情報取得
    userData({commit}, data) {
      const url = 'system_user/users/login_user_data/';
      const commitName = 'userData';
      api.get({commit}, url, data, commitName);
    },
  },
};
