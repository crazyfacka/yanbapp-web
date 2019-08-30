<template>
  <div class="container">
    <div class="group item">
      <div><span>{{ item.name }}</span></div>
      <div>Budgeted<br><span>{{ item.budgeted | currency }}</span></div>
      <div>Available<br><span>{{ item.available | currency }}</span></div>
    </div>
    <div class="notgroup item" v-for="(si, key) in item.subitems" :key="key">
      <div>{{ si.name }}</div>
      <div @click="editBudgetItem">
        <span>
          {{ si.amount | currency }}
        </span>
        <input type="text"
                v-on:blur="commitBudgetItem"
                :id="`budget_${key}`"
                :name="`budget_${key}`"
                :value="si.amount"
                :data-oldvalue="si.amount"
                style="display: none;" autocomplete="off">
      </div>
      <div>
        <span :class="si.available >= 0 ? 'ok' : 'nok'">
          {{ si.available | currency }}
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;

  border-bottom: 5px solid #DDD;

  .item {
    height: 50px;

    display: grid;
    grid-template-columns: 40% repeat(2, 1fr);
    grid-template-rows: auto;
    justify-content: space-between;

    border-bottom: 1px solid #DDD;

    div {
      align-self: center;
    }

    div:nth-child(1) {
      text-align: left;
      padding-left: 10px;
    }
  }

  .group {
    span {
      font-weight: bold;
    }
  }

  .notgroup {
    input {
      font-size: 1em;
      text-align: center;
      outline: none;

      width: 90px;
      padding: 3px 0;
      border: 1px solid #DDD;
      border-radius: 25px / 100%;
    }

    div:nth-child(2) {
      color: #64C4E1;
      font-weight: bold;
    }

    div:nth-child(3) {
      color: white;
      font-weight: bold;

      span {
        padding: 1px 8px;
        border-radius: 25px / 100%;
      }

      .ok {
        background-color: #12A335;
      }

      .nok {
        background-color: red;
      }
    }
  }
}
</style>

<script>
export default {
  name: 'BudgetGroup',
  props: ['item'],
  methods: {
    editBudgetItem({ target }) {
      let input;
      let span;

      if (target.tagName === 'SPAN') {
        input = target.nextElementSibling;
        span = target;
      } else if (target.tagName === 'DIV') {
        [input] = target.getElementsByTagName('input');
        [span] = target.getElementsByTagName('span');
      }

      if (input.offsetParent === null) {
        span.style.display = 'none';
        input.style.removeProperty('display');
        input.focus();
      }
    },

    commitBudgetItem({ target }) {
      const span = target.previousElementSibling;
      const oldValue = target.dataset.oldvalue;
      const data = {
        id: parseInt(target.id.substring(7), 10),
        amount: parseFloat(target.value),
      };

      target.style.display = 'none';
      span.style.removeProperty('display');

      this.$store.commit('budget/setBudgetItem', data);

      fetch(`/api/budget/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((res) => {
        if (!res.ok) {
          this.$store.commit('budget/setBudgetItem', {
            id: data.id,
            amount: oldValue,
          });

          throw new Error('unable to save new budget amount');
        }

        target.dataset.oldvalue = data.amount;
      }).catch(() => {
        // TODO Warn the user, catch(err)
      });
    },
  },
};
</script>
