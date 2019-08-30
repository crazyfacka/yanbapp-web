<template>
  <div class="container">
    <div class="item"><router-link to="/budget">
      <img src="../../assets/budget.svg" />
      <span>Budget</span>
    </router-link></div>
    <div class="item"><router-link to="/accounts">
      <img src="../../assets/accounts.svg" />
      <span>Accounts</span>
    </router-link></div>
    <div class="item"><router-link :to="`/transactions/edit/${defaultAccount}:0`">
      <img src="../../assets/transaction.svg" />
      <span>Transaction</span>
    </router-link></div>
    <div class="item"><router-link to="/reports">
      <img src="../../assets/reports.svg" />
      <span>Reports</span>
    </router-link></div>
    <div class="item"><router-link to="/settings">
      <img src="../../assets/settings.svg" />
      <span>Settings</span>
    </router-link></div>
  </div>
</template>

<style lang="scss" scoped>
.container  {
  height: 50px;
  border-top: 1px solid #AAA;
  background-color: white;

  position: fixed;
  bottom: 0;
  width: 100%;

  display: grid;
  grid-template-columns: repeat(5, auto);
  grid-template-rows: auto;
  justify-content: space-between;
}

.item {
  margin: 2px;
  width: 50px;
  font-size: 0.6em;

  align-self: center;

  img {
    width: 24px;
  }

  a {
    color: #2c3e50;
    text-decoration: none;
  }
}
</style>

<script>
import { mapGetters } from 'vuex';

function delayAccountUpdate() {
  if (this.defaultAccount === 0) {
    this.$store.dispatch('accounts/update');
  }
}

function getAccounts() {
  setTimeout(delayAccountUpdate.bind(this), 300);
}

export default {
  name: 'Menu',
  created: getAccounts,
  computed: {
    ...mapGetters('accounts', {
      defaultAccount: 'getFirstAccountId',
    }),
  },
};
</script>
