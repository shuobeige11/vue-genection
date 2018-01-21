<template>
  <div class="swiper-wrapper" ref="swiper">
    <slot></slot>
  </div>
</template>

<script>
  import touch from '../util/touch'
  export default {
    data() {
      return {    
        option: {},
        ele1: null
      }
    },
    updated() {
      this.ele1.remveEvent().init()
    },
    mounted() {
      this.option = {
        el: this.$refs['swiper']
      }
      this.ele1 = new touch(this.option)
      this.ele1.init()
    },
  }
</script>