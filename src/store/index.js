import Vue from 'vue';
import Vuex from 'vuex';
import accounts from './modules/accounts';
import budget from './modules/budget';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    accounts,
    budget,
  },
});
