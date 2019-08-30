<template>
  <div>
    <div class="header">
      <div class="title">Edit account</div>
    </div>
    <div class="contents">
      <label for="Name" class="span-two">Name</label>
      <input type="text"
              class="span-two"
              id="name"
              name="name"
              :value="name"
              placeholder="Name" autocomplete="on">

      <label for="amount" class="span-two">{{ amountLabel }}</label>
      <input type="text"
              class="span-two"
              id="amount"
              name="amount"
              :value="amount"
              :disabled="parseInt($route.params.id, 10) !== 0"
              v-bind:placeholder="0 | currency" autocomplete="off">

      <input type="checkbox"
              id="savings"
              name="savings"
              class="left"
              :checked="type > 1">
      <label for="savings" class="right">Savings account</label>

      <button class="cancel_button span-two" @click="goBack">Back</button>
      <button class="ok_button span-two" @click="save">Save</button>
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

  .span-two {
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

  input, label, select {
    text-align: left;
    font-size: 0.8em;
    margin: 5px 0;
  }

  input {
    height: 25px;
    padding: 3px;

    outline: 0;
    border: 0;
    border-radius: 5px;

    background: #f2f2f2;
  }
}
</style>

<script>
async function loadAccount() {
  const accountId = parseInt(this.$route.params.id, 10);

  await this.$store.dispatch('accounts/update');

  if (accountId > 0) {
    const a = this.$store.getters['accounts/getAccountById'](accountId);

    this.name = a.name;
    this.amount = a.amount;
    this.type = a.type;
  }
}

function saveChanges(ev) {
  const data = {};
  const node = ev.target.parentNode;
  const accountId = parseInt(this.$route.params.id, 10);

  node.querySelectorAll('button').forEach((el) => {
    el.disabled = true;
  });

  data.name = node.querySelector('#name').value;
  data.amount = parseFloat(node.querySelector('#amount').value);
  data.id = accountId;
  data.active = true;
  data.type = node.querySelector('#savings').checked ? 2 : 1;

  fetch(`/api/accounts${data.id !== 0 ? `/${accountId}` : ''}`, {
    method: data.id !== 0 ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }

    throw new Error('unable to store new account');
  }).then((resData) => {
    this.$store.commit('accounts/setAccount', {
      id: data.id === 0 ? parseInt(resData.msg, 10) * -1 : data.id,
      active: data.active,
      amount: data.amount,
      name: data.name,
      type: data.type,
    });

    this.$router.push({ path: '/accounts' });
  }).catch(() => {
    node.querySelectorAll('button').forEach((el) => {
      el.disabled = false;
    });
    // TODO Warn the user, catch(err)
  });
}

export default {
  name: 'EditAccount',
  created: loadAccount,
  data: () => ({
    name: '',
    amount: '',
    type: 1,
  }),
  computed: {
    amountLabel() {
      return parseInt(this.$route.params.id, 10) !== 0 ? 'Amount' : 'Initial amount';
    },
  },
  methods: {
    goBack() {
      window.history.go(-1);
      return false;
    },
    save: saveChanges,
  },
};
</script>

