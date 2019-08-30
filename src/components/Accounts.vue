<template>
  <div>
    <div class="header">
      <div class="title">Accounts</div>
    </div>
    <div class="summary">
      <div><span>Net Worth</span></div>
      <div><span>Assets</span></div>
      <div><span>{{ totalAccounts | currency }}</span></div>
      <div><span>{{ totalAccounts | currency }}</span></div>
      <div><span>Debts</span></div>
      <div><span>€0.00</span></div>
    </div>
    <div class="all_accounts">
      <div>All Accounts</div>
      <div>
        <span>{{ totalAccounts | currency }}</span>
        <img src="../assets/selector.svg" />
      </div>
    </div>
    <div class="item" v-for="type in accountTypes" :key="type">
      <div class="title">
        <div>{{ type === '1' ? 'Budget' : 'Savings' }}</div>
        <div>{{ totalByType(type) | currency }}</div>
      </div>
      <div class="content" v-for="account in accounts(type)" :key="account.id"
            :data-id="account.id" v-longpress="editAccount">
        <div>{{ account.name }}</div>
        <div><router-link :to="`/transactions/${account.id}`">
          <span>{{ account.amount | currency }}</span>
          <img src="../assets/selector.svg" />
        </router-link></div>
      </div>
    </div>
    <div class="item">
      <div class="title">
        <div>Manage</div>
      </div>
      <div class="content" @click="newAccount">
        <div>Add Accounts</div>
        <div>
          <span></span>
          <img src="../assets/selector.svg" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
img {
  width: 12px;
  transform: rotate(180deg);
}

.summary {
  width: 100%;
  height: 50px;

  font-size: 0.8em;

  position: sticky;
  top: 50px;

  display: grid;
  grid-template-columns: 50% repeat(2, 1fr);
  grid-template-rows: repeat(2, auto);

  div {
    align-self: stretch;
    border-bottom: 1px solid lighten(#1D3E4A, 5%);

    display: grid;

    span {
      align-self: center;
    }
  }

  div:nth-child(1) {
    text-align: left;
    padding-left: 10px;

    font-weight: bold;
    color: white;
    background-color: #1D3E4A;
  }

  div:nth-child(2), div:nth-child(5) {
    text-align: left;
    padding-left: 10px;

    font-weight: bold;
    color: #64C4E1;
    background-color: #172C37;
  }

  div:nth-child(3), div:nth-child(6) {
    text-align: right;
    padding-right: 10px;

    color: #12A335;
    background-color: #172C37;
  }

  div:nth-child(4) {
    text-align: left;
    padding-left: 10px;

    color: #12A335;
    background-color: #1D3E4A;
  }
}

.all_accounts {
  width: 100%;
  height: 50px;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto;
  justify-content: space-between;

  border-bottom: 5px solid #DDD;

  div {
    align-self: center;
  }

  div:nth-child(1) {
    text-align: left;
    padding-left: 20px;
  }

  div:nth-child(2) {
    text-align: right;
    padding-right: 20px;

    span {
      color: #12A335;
      margin-right: 5px;
    }
  }
}

.item {
  width: 100%;
  border-bottom: 5px solid #DDD;

  .title {
    height: 25px;

    font-weight: bold;
    border-bottom: 1px solid #DDD;

    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
    justify-content: space-between;

    div {
      align-self: center;
    }

    div:nth-child(1) {
      text-align: left;
      padding-left: 20px;
    }

    div:nth-child(2) {
      text-align: right;
      padding-right: 20px;
    }
  }

  .content {
    height: 50px;

    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
    justify-content: space-between;

    a {
      //color: #2c3e50;
      text-decoration: none;
    }

    div {
      align-self: center;
    }

    div:nth-child(1) {
      text-align: left;
      padding-left: 20px;
    }

    div:nth-child(2) {
      text-align: right;
      padding-right: 20px;

      span {
        color: #12A335;
        margin-right: 5px;
      }
    }
  }
}
</style>

<script>
import { mapGetters } from 'vuex';

function getAccounts() {
  this.$store.dispatch('accounts/update');
}

export default {
  name: 'Accounts',
  created: getAccounts,
  computed: {
    ...mapGetters('accounts', {
      accountTypes: 'getAccountTypes',
      accounts: 'getAccountsByType',
      totalAccounts: 'getTotal',
      totalByType: 'getTotalByType',
    }),
  },
  methods: {
    newAccount() {
      this.$router.push({ path: '/accounts/0' });
    },
    editAccount(dataset) {
      this.$router.push({ path: `/accounts/${dataset.id}` });
    },
  },
};
</script>
