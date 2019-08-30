<template>
  <div>
    <WhenHeader />
    <div class="account">
      <div><span>Account:</span>&nbsp;<span>{{ accountName }}</span></div>
    </div>
    <div class="container">
      <div class="transaction"
        v-for="t in transactions" :key="t.id"
        v-on:click="editTransaction(t.id)">
          <div class="main left">{{ t.budget_item.name }}</div>
          <div :class="`main right ${t.expense ? 'expense' : 'income'}`">
            {{ t.amount | currency }}
          </div>
          <div class="details left">{{ t.description }}</div>
          <div class="details right">{{ t.when | date }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.account {
  width: 100%;
  height: 25px;

  font-size: 0.8em;

  position: sticky;
  top: 50px;

  color: white;

  background-color: #1D3E4A;
  border-top: 1px solid lighten(#1D3E4A, 5%);
  border-bottom: 1px solid lighten(#1D3E4A, 5%);

  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;

  div {
    align-self: center;

    span:nth-child(1) {
      font-weight: bold;
    }

    span:nth-child(2) {
      font-style: italic;
    }
  }
}

.container {
  width: 100%;

  .transaction:nth-child(even) {
    background-color: #FAFAFA;
  }

  .transaction {
    height: 40px;

    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 2fr 1fr;

    border-bottom: 1px solid #DDD;

    div {
      align-self: center;
    }

    .left {
      text-align: left;
      padding-left: 10px;
    }

    .right {
      text-align: right;
      padding-right: 20px;
    }

    .main {
      font-size: 0.9em;
    }

    .income {
      color: #12A335;
    }

    .expense {
      color: red;
    }

    .details {
      font-size: 0.8em;
      color: #AAA;
    }
  }
}
</style>

<script>
import WhenHeader from './subcomponents/WhenHeader.vue';

async function getTransactions() {
  await this.$store.dispatch('accounts/update');
  await this.$store.dispatch('budget/updateTransactionsForAccount', {
    id: this.$route.params.id,
  });

  this.transactions = this.$store.getters['budget/getOrderedTransactions'](this.$route.params.id);
}

export default {
  name: 'Transactions',
  components: {
    WhenHeader,
  },
  created: getTransactions,
  data: () => ({
    transactions: [],
  }),
  methods: {
    editTransaction(id) {
      this.$router.push(`/transactions/edit/${this.$route.params.id}:${id}`);
    },
  },
  computed: {
    accountName() {
      return this.$store.getters['accounts/getAccountById'](this.$route.params.id).name;
    },
  },
};
</script>
