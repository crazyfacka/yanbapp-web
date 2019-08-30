<template>
  <div class="login-page">
    <div class="form">
      <div class="register-form">
        <input type="text" placeholder="name"/>
        <input type="password" placeholder="password"/>
        <input type="text" placeholder="email address"/>
        <button>create</button>
        <p class="message">Already registered? <a>Sign In</a></p>
      </div>
      <div class="login-form">
        <input name="email" type="text" placeholder="username"/>
        <input name="password" type="password" placeholder="password"/>
        <button @click="doLogin">login</button>
        <p class="message">Not registered? <a>Create an account</a></p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  width: 100%;
  height: 100vh;

  display: grid;
  grid-template-columns: repeat(1, auto);
  grid-template-rows: auto;
  align-items: center;
}

.form {
  z-index: 1;
  background: #ffffff;
  padding: 45px;
  text-align: center;

  input {
    outline: 0;
    background: #f2f2f2;
    width: 100%;
    border: 0;
    margin: 0 0 15px;
    padding: 15px;
    box-sizing: border-box;
    font-size: 0.9em;
    border-radius: 15px;
  }

  button {
    text-transform: uppercase;
    outline: 0;
    background: #12A335;
    width: 100%;
    border: 0;
    padding: 15px;
    color: #ffffff;
    font-size: 0.9em;
    border-radius: 15px;
    -webkit-transition: all 0.3 ease;
    transition: all 0.3 ease;
  }

  .message {
    margin: 15px 0 0;
    color: #b3b3b3;
    font-size: 0.8em;

    a {
      color: #12A335;
      text-decoration: none;
    }
  }

  .register-form {
    display: none;
  }
}
</style>

<script>
function login(ev) {
  const data = {};

  ev.target.parentNode.querySelectorAll('input').forEach((el) => {
    data[el.name] = el.value;
  });

  fetch('/api/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }

    throw new Error('unable to login');
  }).then((resData) => {
    this.$cookie.set('yanbapp_session', resData.session_key, { expires: 30 });
    this.$router.push({ name: 'accounts' });
  }).catch(() => {
    // TODO Warn the user, catch(err)
  });
}

export default {
  name: 'Login',
  methods: {
    doLogin: login,
  },
  beforeMount() {
    this.$cookie.delete('yanbapp_session');
  },
};
</script>
