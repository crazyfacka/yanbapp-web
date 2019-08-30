import Vue from 'vue';
import VueRouter from 'vue-router';

import Login from '../components/Login.vue';
import Budget from '../components/Budget.vue';
import Accounts from '../components/Accounts.vue';
import EditAccount from '../components/EditAccount.vue';
import Reports from '../components/Reports.vue';
import Settings from '../components/Settings.vue';
import Transactions from '../components/Transactions.vue';
import EditTransaction from '../components/EditTransaction.vue';

const ifCookieExists = (to, from, next) => {
  const session = Vue.cookie.get('yanbapp_session');
  if (session) {
    next();
    return;
  }

  next('/login');
};

const routes = [
  {
    path: '/login',
    component: Login,
    name: 'login',
  },
  {
    path: '/budget',
    component: Budget,
    beforeEnter: ifCookieExists,
  },
  {
    path: '/accounts/:id',
    component: EditAccount,
    beforeEnter: ifCookieExists,
  },
  {
    path: '/accounts',
    component: Accounts,
    name: 'accounts',
    beforeEnter: ifCookieExists,
  },
  {
    path: '/reports',
    component: Reports,
    beforeEnter: ifCookieExists,
  },
  {
    path: '/settings',
    component: Settings,
    beforeEnter: ifCookieExists,
  },
  {
    path: '/transactions/edit/:id',
    component: EditTransaction,
    beforeEnter: ifCookieExists,
  },
  {
    path: '/transactions/:id',
    component: Transactions,
    beforeEnter: ifCookieExists,
  },
];

Vue.use(VueRouter);

export default new VueRouter({
  routes,
});
