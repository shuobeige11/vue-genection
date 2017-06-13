<template>
  <div class="alert">
     <section class="value" v-text="values" @click="HandleClick1"></section>
     
     <section class="modal-mask" ref="mask" :style="'display:' + (!shows ? 'none' : 'block')">
        <header class="modal-header">
            <header class="heading">地区选择</header>
            <span class="close" @click="HandleClick">完成</span>
        </header>
        <section class="modal-body">
            <div class="box">
              <dl class="modal-body-con" ref="province">
                  <dd v-for="n in province" v-text="n.text" :data-value="n.value"></dd>
              </dl>
            </div>
            <div class="box">
              <dl class="modal-body-con" ref="city">
                  <dd v-for="n in prov_city" v-text="n.text" :data-value="n.value"></dd>
              </dl>
            </div>
            <div class="box">
              <dl class="modal-body-con" ref="dists">
                  <dd v-for="n in prov_dist" v-text="n.text" :data-value="n.value"></dd>
              </dl>
            </div>
            <section class="borders"> </section>
        </section>
     </section>
  </div>
</template>

<script>
import _touch from './util'
import timers from './timers'
import { provs, citys, dists } from './city'

export default {
  data () {
    return {
      values: '请输入地址',
      shows: false,
      province: null,
      prov_city: null,
      prov_dist: null,
      pos: {
        prov: 0,
        city: 0,
        dist: 0
      }
    }
  },

  mounted () {
    document.body.addEventListener("click", (e) => {
      let el = e.target.nodeName
      if (el === 'HTML') {
          this.shows = false
      }
    }, false)
    this.province = provs
    this.prov_city = citys[provs[0].value]
    this.prov_dist = dists[this.prov_city[0].value]
  },

  methods: {
    HandleClick1() {
      this.shows = true
      this.provElement = this.$refs['province']
      this.cityElement = this.$refs['city']
      this.distElement = this.$refs['dists']
      if (this.provElement.querySelector('.active')) {
        this.pos.prov = this.provElement.getAttribute('data-pos') || 0
      }
      if (this.cityElement.querySelector('.active')) {
        this.pos.city = this.cityElement.getAttribute('data-pos') || 0
      }
      if (this.distElement.querySelector('.active')) {
        this.pos.dist = this.distElement.getAttribute('data-pos') || 0
      }


      this.province = provs
      this.prov_city = citys[provs[this.pos.prov].value]
      this.prov_dist = dists[this.prov_city[this.pos.city].value]

      new _touch({
        element: this.provElement,
        subElement: 'dd',
        active: 'active',
        pos: this.pos.prov,
        fn: () => {
          let city = this.provElement.querySelector('.active').getAttribute('data-value')
          this.cityElement.style.cssText = "-webkit-transform: translateY(0px)"
          this.distElement.style.cssText = "-webkit-transform: translateY(0px)"
          let el1 = this.cityElement.querySelectorAll('dd')
          let el2 = this.distElement.querySelectorAll('dd')
          for (let i = 0; i < el1.length; i++) {
            el1[i].setAttribute('class', '')
          }
          for (let i = 0; i < el2.length; i++) {
            el2[i].setAttribute('class', '')
          }

          el1[0].setAttribute('class', 'active')
          el2[0].setAttribute('class', 'active')

          let provCode = city.substr(0,3)
          let dist = provCode + '100'
          this.prov_city = citys[city]
          this.prov_dist = dists[dist]
          this.pos.dist = 0
          this.pos.city = 0
          this.provElement.setAttribute('data-pos', '0')
          this.cityElement.setAttribute('data-pos', '0')
          this.distElement.setAttribute('data-pos', '0')
          /*new _touch({
            element: this.cityElement,
            subElement: 'dd',
            active: 'active',
            pos: 0
          })

          new _touch({
            element: this.distElement,
            subElement: 'dd',
            active: 'active',
            pos: 0
          })*/
        }
       })

      new _touch({
        element: this.cityElement,
        subElement: 'dd',
        active: 'active',
        pos: this.pos.city, 
        fn: () => {
           let dist = this.cityElement.querySelector('.active').getAttribute('data-value')
           this.distElement.style.cssText = "-webkit-transform: translateY(0px)"
           let el2 = this.distElement.querySelectorAll('dd')
           for (let i = 0; i < el2.length; i++) {
            el2[i].setAttribute('class', '')
           }

           el2[0].setAttribute('class', 'active')

           this.prov_dist = dists[dist]
           this.pos.dist = 0
           /*new _touch({
             element: this.distElement,
             subElement: 'dd',
             active: 'active',
             pos: 0
          })*/
        }
       })

      new _touch({
        element: this.distElement,
        subElement: 'dd',
        active: 'active',
        pos: this.pos.dist
       })
    },
   
    HandleClick() {
      let province = this.$refs['province'].querySelector('.active').innerText
      let city = this.$refs['city'].querySelector('.active').innerText
      let dists = this.$refs['dists'].querySelector('.active').innerText
      this.values = province + city + dists
      this.shows = false

      this.$emit('HandleAreaSelection', this.values)
    }
  }
}
</script>

<style lang='scss' scoped>
  @import './main.scss';
</style>
