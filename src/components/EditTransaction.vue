<template>
  <div>
    <div class="header">
      <div class="title">Edit transaction</div>
    </div>
    <div class="contents">
      <input type="text"
              id="amount"
              name="amount"
              :value="amount"
              v-bind:placeholder="0 | currency" autocomplete="off">

      <input type="checkbox"
              id="income"
              name="income"
              class="left"
              @click="toggleIncome" :checked="!expense">
      <label for="income" class="right">Income</label>

      <label for="budget_item" class="left">Budget item</label>
      <select id="budget_item"
              name="budget_item"
              class="right"
              autocomplete="off"
              :disabled="!expense">
        <option value="" disabled>-- Please pick one --</option>
        <option v-for="(item, index) in items"
              :key="index"
              :value="item.value"
              :selected="item.value == budget_item_id && budget_item_id > 0"
              :disabled="item.value === ''">{{ item.name }}</option>
      </select>

      <input type="text"
              id="description"
              name="description"
              :value="description"
              placeholder="Description" autocomplete="on">

      <label for="when" class="left">When</label>
      <input type="date"
              id="when"
              name="when"
              class="right"
              :value="when | stringDate">

      <input type="hidden" id="repeat_id" :value="repeat">
      <input type="checkbox"
              id="repeat"
              name="repeat"
              class="left"
              @click="toggleRecurrence" :checked="repeat > 0">
      <label for="repeat" class="right">Repeat transaction</label>

      <label for="recurrence" class="left">Recurrence</label>
      <select id="recurrence" name="recurrence" class="right" autocomplete="off" disabled="true">
        <option value="">Monthly</option>
      </select>

      <button class="cancel_button" @click="goBack">Back</button>
      <button class="ok_button" @click="save">Save</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contents {
  padding: 10px;

  font-size: 1em;

  display: grid;
  grid-template-columns: 40% 60%;
  grid-template-rows: auto;

  .left {
    align-self: center;
    justify-self: end;
    padding-right: 3px;
    margin-right: 5px;
  }

  .right {
    align-self: center;
    justify-self: start;
    padding-left: 3px;
  }

  #amount {
    height: 30px;
    font-size: 1.5em;
    text-align: right;

    grid-column-start: 1;
    grid-column-end: span 2;
  }

  #description, button {
    grid-column-start: 1;
    grid-column-end: span 2;
  }

  button {
    text-transform: uppercase;
    width: 100%;
    padding: 5px;
    margin-top: 15px;
    font-size: 0.9em;
  }

  input:not(#amount), label, select {
    font-size: 0.8em;
    margin: 5px 0;
  }

  input, select {
    height: 25px;
    padding: 3px;

    outline: 0;
    border: 0;
    border-radius: 5px;

    background: #f2f2f2;
  }

  select {
    width: 100%;
  }
}
</style>

<script>
async function loadTransaction() {
  const [accountId, transactionId] = this.$route.params.id.split(':');

  await this.$store.dispatch('budget/update');
  await this.$store.dispatch('budget/updateTransactionsForAccount', {
    id: accountId,
  });

  if (transactionId > 0) {
    const t = this.$store.getters['budget/getTransaction'](accountId, transactionId);

    this.amount = t.amount;
    this.expense = t.expense;
    this.budget_item_id = t.budget_item.id;
    this.description = t.description;
    this.when = t.when;
    this.repeat = t.repeat;
  } else {
    this.budget_item_id = 0;
    this.when = new Date();
  }

  this.items = this.$store.getters['budget/getBudgetItemsCondensed']();
}

function saveChanges(ev) {
  const data = {};
  const node = ev.target.parentNode;
  const biNode = node.querySelector('#budget_item');
  const [accountId, transactionId] = this.$route.params.id.split(':');
  const repeatID = parseInt(node.querySelector('#repeat_id').value, 10);

  node.querySelectorAll('button').forEach((el) => {
    el.disabled = true;
  });

  data.amount = parseFloat(node.querySelector('#amount').value);
  data.description = node.querySelector('#description').value;
  data.when = new Date(node.querySelector('#when').value);
  data.expense = !node.querySelector('#income').checked;

  if (node.querySelector('#repeat').checked) {
    data.repeat = repeatID > 0 ? repeatID : -1;
  } else {
    data.repeat = 0;
  }

  if (data.expense) {
    data.budget_item = {
      id: parseInt(biNode.value, 10),
      name: biNode[biNode.selectedIndex].text,
    };
  } else {
    data.budget_item = {
      id: 0,
      name: '',
    };
  }

  data.account_id = parseInt(accountId, 10);
  data.id = parseInt(transactionId, 10);

  fetch(`/api/transactions${data.id !== 0 ? `/${transactionId}` : ''}`, {
    method: data.id !== 0 ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }

    throw new Error('unable to store new transaction');
  }).then((resData) => {
    this.$store.commit('budget/setSingleTransaction', {
      account_id: data.account_id,
      id: data.id === 0 ? parseInt(resData.data.id, 10) * -1 : data.id,
      budget_item: data.budget_item,
      expense: data.expense,
      amount: data.amount,
      when: data.when,
      repeat: data.repeat === -1 ? parseInt(resData.data.repeat_id, 10) : data.repeat,
      description: data.description,
    });

    this.$router.push({ path: `/transactions/${accountId}` });
  }).catch(() => {
    node.querySelectorAll('button').forEach((el) => {
      el.disabled = false;
    });
    // TODO Warn the user, catch(err)
  });
}

export default {
  name: 'EditTransaction',
  created: loadTransaction,
  data: () => ({
    amount: '',
    expense: true,
    budget_item_id: 0,
    description: '',
    when: '',
    repeat: 0,
    recurrence: 0,
    items: {},
  }),
  methods: {
    toggleIncome(ev) {
      document.getElementById('budget_item').disabled = ev.target.checked;
    },
    toggleRecurrence(ev) {
      const recurrenceElms = ['recurrence'];
      for (let i = 0; i < recurrenceElms.length; i++) {
        document.getElementById(recurrenceElms[i]).disabled = !ev.target.checked;
      }
    },
    goBack() {
      window.history.go(-1);
      return false;
    },
    save: saveChanges,
  },
};
</script>
