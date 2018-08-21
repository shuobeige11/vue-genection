<template>
  <div>
    <router-view></router-view>
    <div class="login"></div>
  </div>
</template>

<script>
export default {
  created () {
    console.log(11111)
  }
}
</script>
<style lang="scss">
.login {
  width: 150px;
  height: 150px;
  background: url("../../assets/image/timg.jpg");
}
</style>
