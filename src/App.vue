<template>
  <div id="app">
    <router-view></router-view>
    <Menu v-if="$route.name !== 'login'" />
  </div>
</template>

<script>
import Menu from './components/subcomponents/Menu.vue';

export default {
  name: 'app',
  components: {
    Menu,
  },
};
</script>

<style lang="scss">
html, body {
  padding: 0;
  margin: 0;
}

button, input {
    font-family: 'Avenir', 'Nunito', sans-serif;
}

.header {
  width: 100%;
  height: 50px;

  color: white;
  background-color: #1D3E4A;
  border-bottom: 1px solid lighten(#1D3E4A, 5%);

  position: sticky;
  top: 0px;

  display: grid;
  grid-template-columns: repeat(1, auto);
  grid-template-rows: auto;

  .title {
    margin: 0 auto;
    align-self: center;
  }
}

.cancel_button {
  -moz-box-shadow:inset 0px 1px 0px 0px #ffffff;
  -webkit-box-shadow:inset 0px 1px 0px 0px #ffffff;
  box-shadow:inset 0px 1px 0px 0px #ffffff;

  background:linear-gradient(to bottom, #ffffff 5%, #f6f6f6 100%);
  background-color:#ffffff;

  border-radius:3px;
  border:1px solid #dcdcdc;

  color:#666666;
  padding:6px 24px;
  text-decoration:none;
  text-shadow:0px 1px 0px #ffffff;
}

.ok_button {
  -moz-box-shadow:inset 0px 1px 0px 0px #54a3f7;
  -webkit-box-shadow:inset 0px 1px 0px 0px #54a3f7;
  box-shadow:inset 0px 1px 0px 0px #54a3f7;

  background:linear-gradient(to bottom, #64C4E1 5%, #0083e0 100%);
  background-color:#64C4E1;

  border-radius:3px;
  border:1px solid #124d77;

  color:#ffffff;
  padding:6px 24px;
  text-decoration:none;
  text-shadow:0px 1px 0px #154682;
}

#app {
  font-family: 'Avenir', 'Nunito', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
