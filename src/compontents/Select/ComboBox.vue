<template>
  <div class="alert ">
    <section :class="'modal' + ( hidden ? ' modal-hide' : '' )">
    <section :class="'modal-mask' + ( hidden ? ' modal-hide' : '' )" ref="mask" >
            <header class="modal-header">
                <header class="heading" v-text="title">弹出层</header>
                <span class="close" @click="HandleClick">完成</span>
            </header>
            <section class="modal-body">
                <div class="box" ref="parent">
                  <dl class="modal-body-con" ref="box">
                      <dd v-for="n of value" v-text='n'></dd>
                  </dl>
                </div>
                <section class="borders"> </section>
            </section>
        </section>
     </section>
  </div>
</template>

<script>
import _touch from './util'

export default {
  props: {
    value: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ''
    },
    hidden: {
      type: Boolean,
      default: true
    },
    comPos: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      scroll: null
    }
  },

  watch: {
    hidden() {
      if (!this.hidden) {
        this.init()
      }
    }
  },
  
  methods: {
    init() {
      if (!this.value.length) return
      if (this.value.length > 0) {
          let box = this.$refs['box']
          let parent = this.$refs['parent']
          let pos = box.querySelectorAll('dd')

          for (let i = 0; i < pos.length; i++) {
            let className = pos[i].setAttribute('class', '')
          }
          this.scroll = new _touch({
              parElement: parent,
              element: box,
              subElement: 'dd',
              active: 'active',
              pos: this.comPos,
              fn: (a, b) => {
                b.setAttribute('class', 'active')
              }
          })
      }
    },

    HandleClick() {
      let parent = this.$refs['parent']
      parent.removeEventListener('touchstart', this.scroll.handleTouchStart, false)
      parent.removeEventListener('touchmove', this.scroll.handleTouchMove, false)
      parent.removeEventListener('touchend', this.scroll.handleTouchEnd, false)

      this.values = this.$refs['box'].querySelector('.active').innerText
      let pos = this.$refs['box'].querySelectorAll('dd')

      for (let i = 0; i < pos.length; i++) {
          let className = pos[i].getAttribute('class')
          if (className == 'active') {
              this.pos = i
          }
      }
      this.$emit('HandleClick', { value: this.values, pos: this.pos })
    }
  }
}
</script>

<style lang='scss' scoped>
  @import './main.scss';
</style>
