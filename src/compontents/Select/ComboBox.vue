<template>
  <div class="alert">
     <section :class="'modal-mask' + ( hidden ? ' modal-hide' : '' )" ref="mask" >
        <header class="modal-header">
            <header class="heading" v-text="title">弹出层</header>
            <span class="close" @click="HandleClick">完成</span>
        </header>
        <section class="modal-body">
            <div class="box">
              <dl class="modal-body-con" ref="box">
                  <dd v-for="n of value" v-text='n'></dd>
              </dl>
            </div>
            <section class="borders"> </section>
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

  updated () {

    if (!this.value.length) return
    if (this.value.length > 0) {
        let box = this.$refs['box']
        let pos = box.querySelectorAll('dd')

        for (let i = 0; i < pos.length; i++) {
          let className = pos[i].setAttribute('class', '')
        }

        new _touch({
            element: box,
            subElement: 'dd',
            active: 'active',
            pos: this.comPos
        })
    }
  },
  
  methods: {
    HandleClick() {
      
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
