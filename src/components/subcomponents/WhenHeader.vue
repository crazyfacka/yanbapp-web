<template>
  <div class="header">
    <div class="when">
      August 2018
      <img src="../../assets/selector.svg" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 50px;

  color: white;
  background-color: #1D3E4A;

  position: sticky;
  top: 0px;

  display: grid;
  grid-template-columns: repeat(1, auto);
  grid-template-rows: auto;

  .when {
    margin: 0 auto;
    align-self: center;

    img {
      width: 12px;
      transform: rotate(-90deg);
    }
  }
}
</style>

<script>
export default {
  name: 'WhenHeader',
};
</script>

