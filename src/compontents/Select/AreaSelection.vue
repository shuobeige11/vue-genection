<template>
  <div class="alert">
     <section class="value" v-text="values" @click="HandleClick1"></section>
     <section :class="'modal' + ( !shows ? ' modal-hide' : '' )">
        <section class="modal-mask" ref="mask" :style="'display:' + (!shows ? 'none' : 'block')">
            <section class="modal-mask" ref="mask">
                <header class="modal-header">
                    <header class="heading">地区选择</header>
                    <span class="close" @click="HandleClick">完成</span>
                </header>
                <section class="modal-body">
                    <div class="box" ref="province1">
                      <dl class="modal-body-con" ref="province">
                          <dd v-for="n in province" v-text="n.text" :data-value="n.value"></dd>
                      </dl>
                    </div>
                    <div class="box" ref="city1">
                      <dl class="modal-body-con" ref="city">
                          <dd v-for="n in prov_city" v-text="n.text" :data-value="n.value"></dd>
                      </dl>
                    </div>
                    <div class="box" ref="dists1">
                      <dl class="modal-body-con" ref="dists">
                          <dd v-for="n in prov_dist" v-text="n.text" :data-value="n.value"></dd>
                      </dl>
                    </div>
                    <section class="borders"> </section>
                </section>
            </section>
        </section>
     </section>
  </div>
</template>

<script>
import _touch from './util'
import timers from './timers'

export default {
  props: {
    provs: {
      type: Array,
      default() {
        return []
      }
    },
    citys: {
      type: Object,
      default() {
        return {}
      }
    },
    dists: {
      type: Object,
      default() {
        return {}
      }
    }
  },
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
    document.addEventListener("touchend", (e) => {
      setTimeout(() => {
        let el = e.target.getAttribute('class')
        if (el === 'modal') {
            this.shows = false
        }
      }, 350)
    }, false)
  },
  watch: {
    provs() {
      this.province = this.provs
      this.prov_city = this.citys[this.provs[0].value]
      this.prov_dist = this.dists[this.prov_city[0].value]
    }
  },

  methods: {
    HandleClick1() {
      this.shows = true
      setTimeout(() => {
        this.provElement = this.$refs['province']
        this.cityElement = this.$refs['city']
        this.distElement = this.$refs['dists']
        this.provElement1 = this.$refs['province1']
        this.cityElement1 = this.$refs['city1']
        this.distElement1 = this.$refs['dists1']
        if (this.provElement.querySelector('.active')) {
          this.pos.prov = this.provElement.getAttribute('data-pos') || 0
        }
        if (this.cityElement.querySelector('.active')) {
          this.pos.city = this.cityElement.getAttribute('data-pos') || 0
        }
        if (this.distElement.querySelector('.active')) {
          this.pos.dist = this.distElement.getAttribute('data-pos') || 0
        }

        if (!this.provs.length) return

        this.province = this.provs
        this.prov_city = this.citys[this.provs[this.pos.prov].value]
        this.prov_dist = this.dists[this.prov_city[this.pos.city].value]

        new _touch({
          parElement: this.provElement1,
          element: this.provElement,
          subElement: 'dd',
          active: 'active',
          pos: this.pos.prov,
          fn: (scroll, b) => {
            b.setAttribute('class', 'active')
            let city = b.getAttribute('data-value')
          
              this.cityElement.style['WebkitTransform'] = 'translate3d(0px, 0px, 0) scale(1)'
              this.distElement.style['WebkitTransform'] = "translate3d(0px, 0px, 0) scale(1)"
        

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
            this.prov_city = this.citys[city]
            this.prov_dist = this.dists[dist]
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
          parElement: this.cityElement1,
          element: this.cityElement,
          subElement: 'dd',
          active: 'active',
          pos: this.pos.city, 
          fn: (scroll, b) => {
            b.setAttribute('class', 'active')
            let dist = b.getAttribute('data-value')
            this.distElement.style['WebkitTransform'] = "translate3d(0px, 0px, 0) scale(1)"       
            let el2 = this.distElement.querySelectorAll('dd')
            for (let i = 0; i < el2.length; i++) {
              el2[i].setAttribute('class', '')
            }

            el2[0].setAttribute('class', 'active')

            this.prov_dist = this.dists[dist]
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
          parElement: this.distElement1,
          element: this.distElement,
          subElement: 'dd',
          active: 'active',
          pos: this.pos.dist,
          fn: (scroll, b) => {

            b.setAttribute('class', 'active')
          }
        })
       }, 1)
    },
   
    HandleClick() {
      let province = this.$refs['province'].querySelector('.active').innerText
      let city = this.$refs['city'].querySelector('.active').innerText
      let dists = this.$refs['dists'].querySelector('.active').innerText
      let provCode = this.$refs['province'].querySelector('.active').getAttribute('data-value')
      let cityCode = this.$refs['city'].querySelector('.active').getAttribute('data-value')
      let distsCode = this.$refs['dists'].querySelector('.active').getAttribute('data-value')
      this.values = province + city + dists
      this.code = {
        provCode: provCode,
        cityCode: cityCode,
        distsCode: distsCode,
        value: this.values
      }
      this.shows = false
      this.$emit('HandleChangeArea', this.code)
    }
  }
}
</script>

<style lang='scss' scoped>
  @import './main.scss';
</style>
