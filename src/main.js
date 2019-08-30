import '@/assets/css/font.css';

import Vue from 'vue';
import VueCookie from 'vue-cookie';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(VueCookie);

Vue.filter('currency', (value) => {
  if (typeof value !== 'number') {
    return value;
  }

  const formatter = new Intl.NumberFormat('en', {
    style: 'currency',
    currency: 'EUR',
  });

  return formatter.format(value);
});

Vue.filter('date', (value) => {
  if (!(value instanceof Date)) {
    return value;
  }

  return value.toLocaleDateString('pt-PT');
});

Vue.filter('stringDate', (value) => {
  if (typeof value === 'undefined' || value === '') {
    value = new Date();
  }

  const day = `${value.getDate()}`;
  const month = `${value.getMonth() + 1}`;
  const year = value.getFullYear();

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
});

Vue.directive('longpress', {
  bind(el, binding, vNode) {
    if (typeof binding.value !== 'function') {
      const compName = vNode.context.name;
      let warn = `[longpress:] provided expression '${binding.expression}' is not a function`;

      if (compName) {
        warn += `Found in component '${compName}`;
      }

      console.log(warn);
    }

    const handler = (ev) => {
      binding.value(ev);
    };

    let pressTimer = null;

    const start = (ev) => {
      if (ev.type === 'click' && ev.button !== 0) {
        return;
      }

      if (pressTimer === null) {
        pressTimer = setTimeout(() => {
          handler(el.dataset);
        }, 1000);
      }
    };

    const cancel = () => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };

    el.addEventListener('mousedown', start);
    el.addEventListener('touchstart', start);

    el.addEventListener('click', cancel);
    el.addEventListener('mouseout', cancel);
    el.addEventListener('touchend', cancel);
    el.addEventListener('touchcancel', cancel);
  },
});

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
