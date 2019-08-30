import Vue from 'vue';

const state = {
  updated: null,
  data: [],
};

// Because multiple modules call this at the same time
let beingUpdated = false;

const mutations = {
  set(st, accounts) {
    st.updated = (new Date()).getTime();
    st.data = accounts;
  },

  setAccount(st, account) {
    if (account == null) {
      return;
    }

    const as = st.data;

    if (account.id <= 0) {
      account.id *= -1;
      as.push(account);
    } else {
      for (let i = 0; i < as.length; i++) {
        if (as[i].id === account.id) {
          Vue.set(as, i, account);
          break;
        }
      }
    }
  },
};

const getters = {
  getAccountTypes(st) {
    const accounts = st.data;
    const types = {};

    for (let i = 0; i < accounts.length; i++) {
      types[accounts[i].type] = null;
    }

    return Object.keys(types);
  },

  getAccountsByType(st) {
    const accounts = st.data;
    return (type) => {
      if (typeof type === 'string') {
        type = parseInt(type, 10);
      }
      return accounts.filter(a => a.type === type);
    };
  },

  getTotal(st) {
    const accounts = st.data;
    return accounts.length === 0 ? 0 : accounts.map(el => el.amount).reduce((a, b) => a + b, 0);
  },

  getTotalByType(st) {
    const accounts = st.data;
    return (type) => {
      if (typeof type === 'string') {
        type = parseInt(type, 10);
      }

      const filtered = accounts.filter(a => a.type === type);
      return filtered.length === 0 ? 0 : filtered.map(el => el.amount).reduce((a, b) => a + b, 0);
    };
  },

  getAccountById(st) {
    return (id) => {
      for (let i = 0; i < st.data.length; i++) {
        const a = st.data[i];
        // eslint-disable-next-line
        if (a.id == id) {
          return a;
        }
      }
      return {};
    };
  },

  getFirstAccountId(st) {
    const accounts = st.data;
    return accounts.length === 0 ? 0 : accounts[0].id;
  },
};

const actions = {
  async update(context) {
    if (beingUpdated) {
      return;
    }

    beingUpdated = true;
    if (context.state.data.length !== 0) {
      if ((new Date()).getTime() - context.state.updated < 1000 * 60 * 30) {
        beingUpdated = false;
        return;
      }
    }

    try {
      const res = await fetch('/api/accounts');
      await context.commit('set', await res.json());
      beingUpdated = false;
    } catch (e) {
      // TODO Warn the user, catch(e)
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
