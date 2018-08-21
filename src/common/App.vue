<template>
  <div id="app">
    <titlerefresher />
    <router-view></router-view>
    <alert :msg="codeMsg" />
  </div>
</template>

<script>
  import titlerefresher from '@/titlerefresher'
  import alert from '@/alert'

  export default {
    computed: {
      codeMsg () {
        return this.$store.getters.codeMsg
      }
    },
    components: {
      alert,
      titlerefresher
    },
  }
</script>

<style lang="scss">
  @import '../assets/css/common.scss';
</style>