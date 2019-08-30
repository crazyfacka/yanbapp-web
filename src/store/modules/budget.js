import Vue from 'vue';

const state = {
  updated: null,
  updatedTrans: {},
  items: {},
  subitems: {},
  transactions: {},
};

const mutations = {
  set(st, data) {
    st.updated = (new Date()).getTime();

    for (let i = 0; i < data.length; i++) {
      const bitem = data[i];

      Vue.set(st.items, bitem.id, {
        name: bitem.name,
        active: bitem.active,
        budgeted: 0.0,
        available: 0.0,
        subitems: {},
      });

      for (let j = 0; j < bitem.items.length; j++) {
        const bsubitem = bitem.items[j];

        st.items[bitem.id].budgeted += bsubitem.amount;
        st.items[bitem.id].available += bsubitem.amount;
        st.subitems[bsubitem.id] = {
          name: bsubitem.name,
          amount: bsubitem.amount,
          active: bsubitem.active,
          available: bsubitem.amount,
          parent: st.items[bitem.id],
        };

        Vue.set(st.items[bitem.id].subitems, bsubitem.id, st.subitems[bsubitem.id]);
      }
    }
  },

  setTransactions(st, data) {
    if (data == null) {
      return;
    }

    const ts = [];
    for (let i = 0; i < data.length; i++) {
      const t = data[i];

      if (t.budget_item.id in st.subitems) {
        // TODO Need to reset this when reiterating
        st.subitems[t.budget_item.id].available -= t.amount;
        st.subitems[t.budget_item.id].parent.available -= t.amount;
      }

      ts.push({
        id: t.id,
        budget_item: t.budget_item,
        expense: t.expense,
        amount: t.amount,
        when: new Date(t.when),
        description: t.description,
        repeat: t.repeat,
      });

      if (!(t.account_id in st.transactions)) {
        st.updatedTrans[t.account_id] = (new Date()).getTime();
        Vue.set(st.transactions, t.account_id, ts);
      }
    }
  },

  setSingleTransaction(st, data) {
    if (data == null) {
      return;
    }

    const ts = st.transactions[data.account_id].slice();
    if (data.id <= 0) {
      data.id *= -1;
      ts.push(data);
    } else {
      for (let i = 0; i < ts.length; i++) {
        if (ts[i].id === data.id) {
          ts[i] = data;
          break;
        }
      }
    }

    Vue.set(st.transactions, data.account_id, ts);
  },

  setBudgetItem(st, data) {
    const current = st.subitems[data.id];
    const { parent } = st.subitems[data.id];
    const diff = data.amount - current.amount;

    Vue.set(st.subitems[data.id], 'amount', data.amount);
    Vue.set(st.subitems[data.id], 'available', current.available + diff);

    Vue.set(st.subitems[data.id].parent, 'budgeted', parent.budgeted + diff);
    Vue.set(st.subitems[data.id].parent, 'available', parent.available + diff);
  },
};

const getters = {
  getOrderedTransactions(st) {
    return (id) => {
      const ts = st.transactions[id];
      if (typeof ts === 'undefined') {
        return null;
      }

      return ts.sort((a, b) => a.when - b.when);
    };
  },

  getTransaction(st) {
    return (accountId, transactionId) => {
      for (let i = 0; i < st.transactions[accountId].length; i++) {
        if (st.transactions[accountId][i].id === parseInt(transactionId, 10)) {
          return st.transactions[accountId][i];
        }
      }
      return null;
    };
  },

  getBudgetItemsCondensed(st) {
    return () => {
      const bitems = [];
      // eslint-disable-next-line
      for (const [key, value] of Object.entries(st.items)) {
        bitems.push({
          value: '',
          name: `-- ${value.name} --`,
        });

        // eslint-disable-next-line
        for (const [key2, value2] of Object.entries(st.items[key].subitems)) {
          bitems.push({
            value: key2,
            name: value2.name,
          });
        }
      }

      return bitems;
    };
  },
};

const actions = {
  async update(context) {
    const { rootState, dispatch, commit } = context;
    const { accounts } = rootState;

    await dispatch('accounts/update', null, { root: true });
    if (Object.keys(context.state.items).length !== 0) {
      if ((new Date()).getTime() - context.state.updated < 1000 * 60 * 30) {
        return;
      }
    }

    try {
      const res = await fetch('/api/budget');
      await commit('set', await res.json());

      for (let i = 0; i < accounts.data.length; i++) {
        fetch(`/api/transactions/${accounts.data[i].id}`)
          .then((res2) => {
            if (res2.ok) {
              return res2.json();
            }

            throw new Error(`unable fetch transactions for account ID ${accounts.data[i].id}`);
          })
          .then(resData => commit('setTransactions', resData))
          .catch(() => {
            // TODO Warn the user, catch(err)
          });
      }
    } catch (e) {
      // TODO Warn the user, catch(e)
    }
  },

  async updateTransactionsForAccount(context, { id }) {
    const { commit } = context;
    if (id in context.state.updatedTrans) {
      if ((new Date()).getTime() - context.state.updatedTrans[id] < 1000 * 60 * 30) {
        return;
      }
    }

    try {
      const res = await fetch(`/api/transactions/${id}`);
      await commit('setTransactions', await res.json());
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
