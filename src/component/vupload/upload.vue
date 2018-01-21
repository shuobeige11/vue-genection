<template>
  <section v-model="types">
    <slot></slot>
    <scaleimg 
       :ScaleImg="list.imgList" 
       v-on:closed="onClose" 
       :length="list.imgList.length" 
       :pos="types.pos"
       :hide="types.hide"
    />
  </section>
</template>

<script>
import scaleimg from './component/scaleimg'

export default {
  props: {
    list: {
      type: Object,
      default: {}
    },
    server: {
      type: String,
      default: '/' 
    },
    multiple: {
      type: Boolean,
      default: true
    },
    quality: {
      type: [String, Number],
      default() {
        return 0.5
      }
    },
    max: {
      type: [String, Number],
      default() {
        return 5
      }
    },
    compress: {
      type: Boolean,
      default: true
    },
    start: {
      type: Function,
      default: () => {}
    },
    progress: {
      type: Function,
      default: () => {}
    },
    success: {
      type: Function,
      default: () => {}
    },
    error: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      types: {
        pos: 0,
        hide: true,
        max: this.max,
        failed: -1
      }
    }
  },
  methods: {
    onClose() {
      this.types.pos = null
      this.types.hide = true
    }
  },
  components: {
    scaleimg
  }
}
</script>