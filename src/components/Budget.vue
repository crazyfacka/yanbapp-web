<template>
  <div>
    <WhenHeader />
    <div class="tobudget">
      <div class="text">To be budgeted</div>
      <div class="amount">{{ toBudget | currency }}</div>
    </div>
    <BudgetGroup v-for="item in budget" :key="item.id" v-bind:item="item" />
  </div>
</template>

<style lang="scss" scoped>
.tobudget {
  width: 100%;
  height: 50px;

  color: white;
  background-color: #12A335;

  position: sticky;
  top: 50px;

  display: grid;
  grid-template-columns: repeat(2, auto);
  grid-template-rows: auto;
  justify-content: space-between;

  .text, .amount {
    margin: 0 10px;
    align-self: center;
  }

  .text {
    text-align: left;
    text-transform: uppercase;
    font-weight: bold;
    line-height: 1.1em;

    width: 60px;
  }

  .amount {
    font-size: 1.8em;
  }
}
</style>

<script>
import { mapState } from 'vuex';
import WhenHeader from './subcomponents/WhenHeader.vue';
import BudgetGroup from './BudgetGroup.vue';

function getBudgetItems() {
  this.$store.dispatch('budget/update');
}

export default {
  name: 'Budget',
  components: {
    WhenHeader,
    BudgetGroup,
  },
  created: getBudgetItems,
  computed: {
    ...mapState('budget', {
      budget: state => state.items,
    }),
    toBudget() {
      let toBudget = this.$store.getters['accounts/getTotalByType'](1);

      const keys = Object.keys(this.budget);
      for (let i = 0; i < keys.length; i++) {
        toBudget -= this.budget[keys[i]].budgeted;
      }

      return toBudget;
    },
  },
};
</script>
