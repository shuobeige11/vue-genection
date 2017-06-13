<template>
    <div id="calendar">
     
       <swiper :options="swiperOption" class="swiper-box" >
          <swiper-slide class="swiper-item" v-for="item of timerList">
            <Calendars :timer="item" :list="list" :zodiar="zodiar"/>
          </swiper-slide>
      </swiper>
    </div>
</template>

<script>
import Cookie from 'js-cookie'
import store from 'store'

import { swiper, swiperSlide } from 'vue-awesome-swiper'
import _touch from '../../assets/animation/util'
import serverOption from '../../actions'

import * as api from '../../constants/api'
import Calendars from './Calendars'

export default {
  props: {
     timerList: {
        type: Array,
        default:[]
    },
    month: {
        type: Number,
        default: ''
    },
    zodiars: {
        type: Array,
        default() {
          return []
        }
    }
  },
  data() {
    return {
        pos: 0,
        date: new Array(12),
        count: 0,
        el: null,
        list: [],
        nid: '',
        zodiar: [],
        swiperOption: {
          pagination: '.swiper-pagination',
          slidesPerView: 1,
          paginationClickable: true,
          spaceBetween: 30,
          mousewheelControl: true,
          onSlideChangeEnd: swiper => {
            swiper.start = this.pos
            this.$emit('HandleUp', swiper)
          }
        }
    }
 },
watch: {
  zodiars() {
      this.zodiar = this.zodiars
  }
},
created () {
    window.localStorage.clear()
    // console.log(this.year)
    for (let i = 0; i < 13; i++) {
        if ((i + 1) == (this.month + 1)) {
            this.pos = i
        }
    }
    this.nid = Cookie.get('a_n')
    
},
mounted() {
  let timer = new Date()
  let times = this.formateTimer(timer)
  console.log(2)
  let flag = true
  serverOption(api.getMonth, {
      timer: times,
      nid: this.nid
    }).then(data => {
      if (!data.month) {
          flag = false
      } else {
        data.month.map(value => {
            this.list.push(value)
        })
        data.zodiac.map(value => {
            this.zodiar.push(value)
        })
      }
      this.el = document.querySelector('.swiper-wrapper')
      let dd = document.querySelectorAll('.swiper-item')
      setTimeout(() => {
        let sum = 0
        let tab = document.querySelectorAll('table')
        let table = tab[this.pos]
        let td = table.querySelectorAll('td')
       
        let day = timer.getDate()
        let tdCache = []
        let num = 0
        for (let i = 0; i < td.length; i++) {
            if (!td[i].childNodes.length) {
               tdCache.push('')
            } else {
               if (flag) {
                 tdCache.push(this.list[num].type)
               } else {
                 tdCache.push(-1)
               }
               num++             
            }
    
        }
        num  = 0
        for (let i = 0; i < td.length; i++) {
            td[i].index = num
            if (!td[i].childNodes.length) continue
            let className = td[i].getAttribute('class') || ''
            if (num == day - 1) {
               td[i].setAttribute('class', className + ' red')
               className = td[i].getAttribute('class') || ''
            }
            switch (Math.ceil(tdCache[i])) {
                case 0:
                  td[i].setAttribute('class', className + ' good')
                  break
                case 1:
                  td[i].setAttribute('class', className + ' bad')
                  break
                case -1: 
                  td[i].setAttribute('class', className + ' disabled')
                  break
                default:
                  break
            }
            num++
        } 
        
       this.date[this.pos] = this.pos + 1
       store.set('date', this.date)
        for (let i = 0; i < this.pos; i++) {
            sum += dd[i].clientWidth + this.swiperOption.spaceBetween
        }
        sum  = 0 - sum
        this.el.style.cssText = "-webkit-transition-duration: 0ms; transform: translate3d(" + sum + "px, 0px, 0px)"
     
     store.set('name', data.name_info)   
     this.$emit('HandleCreat', data.month)
     }, 120)
  })
},
components: {
    Calendars,
    swiper,
    swiperSlide
 },
 methods: {
    formateTimer(timer) {
      return timer.getFullYear() + ((timer.getMonth() + 1) > 9 ? (timer.getMonth() + 1) : '0' + (timer.getMonth() + 1)) + (timer.getDate() > 9 ? timer.getDate() : '0' + timer.getDate())
    },
 }
}
</script>

<style lang='scss' scoped>
    @function toRem($px) {
        @return 64px * $px / 75px / 32px * 1rem;
    }
    #calendar {
      -webkit-transform-origin: 0px 0px 0px;
      transform-origin: 0px 0px 0px;
    }
    dl {
        margin:0;
        padding:0;
        display:flex;
        z-index:6;
        width:100%
    }
    dd {
        flex-shrink: 0;
        margin:0;
        padding:0;
        width:toRem(750px);
        height:70px
    }

    
</style>