<template>
  <section @click="onClick">
    1231
  </section>
</template>

<script>
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator' // eslint-disable-line
  export default class Test extends Vue {
    created () {
      console.log(123)
    }
    onClick = () => {
      this.$store.dispatch('getMessage')
    }
  }
</script>