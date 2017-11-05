// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';

import io from 'socket.io-client';
import VueLazyLoad from 'vue-lazyload';
import infiniteScroll from 'vue-infinite-scroll';
import App from './App.vue';
import router from './router';


Vue.config.productionTip = false;


const socket = io.connect('localhost:3001', { transports: ['websocket'] });
socket.on('chat message', function (msg) {
  console.log(msg);
});


Vue.use(Vuex);
Vue.use(VueLazyLoad, {
  loading: '/static/loading-svg/loading-bars.svg',
});

Vue.use(infiniteScroll);

const store = new Vuex.Store({
  state: {
    nickName: '',
    carCount: 0,
    loginModalFlag: false,
    message: '',
    messageModalFlag: false,
    cartList: [],
  },
  mutations: {
    updateUserInfo(state, user) {
      state.nickName = user.fullname;
      state.cartList = user.cartList;
    },
    updateCartCount(state, cartCount) {
      state.carCount += cartCount;
    },
    loginModal(state, popup) {
      state.loginModalFlag = popup;
    },
    messageModalUpdate(state, message) {
      state.message = message;
      state.messageModalFlag = !state.messageModalFlag;
    },
    cartListUpdate(state, cartList) {
      state.cartList = cartList;
    },
  },
  getters: {
    greeting(state) {
      if (state.nickName) {
        return `Hi, ${state.nickName}!`;
      }
      return '';
    },
    nickName(state) {
      return state.nickName;
    },
  },
});

new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },
});
