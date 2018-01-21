<template>
  <div class="tit">
    <div class="main">
        {{text}}
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  @function toRem($px) {
    @return 64px * $px / 75px / 32px * 1rem;
  }
  .tit {
    height: toRem(30px);
    background: #fff;
    padding: toRem(30px) 0 ;
  }
  .main {
    padding-left: toRem(20px);
    border-left: 2px solid #ff397e;
    font-size: toRem(28px);
    color:#333
  }
</style>