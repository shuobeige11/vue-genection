<template>
  <div class="alert">
     <section class="value" @click="HandleClick1"></section>
     <section :class="'modal' + ( !shows ? ' modal-hide' : '' )">
        <section class="modal-mask" ref="mask" :style="'display:' + (!shows ? 'none' : 'block')">
            <header class="modal-header">
                <header class="heading">日历选择</header>
                <span class="close" @click="HandleClick">完成</span>
            </header>
            <section class="modal-body">
                <div class="box" ref="box1">
                  <dl class="modal-body-con" ref="year">
                      <dd v-for="n of space.year" v-text='!min ? (1980 + n) : (mins.year - 1 + n)'></dd>
                  </dl>
                </div>
                <div class="box" ref="box2">
                  <dl class="modal-body-con" ref="month">
                      <dd v-for="n of space.month" v-text=" month + n"></dd>
                  </dl>
                </div>
                <div class="box" ref="box3">
                  <dl class="modal-body-con" ref="day">
                      <dd v-for="n of space.day" v-text=" day + n "></dd>
                  </dl>
                </div>
                <section class="borders"></section>
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
    maxDay: {
      type: String,
      default: ''
    },
    minDay: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      yearElement: null,
      monthElement: null,
      dayElement: null,
      container1: null,
      container2: null,
      container3: null,
      values: '',
      val: null,      
      flag: 0,
      space: {
        year: 0,
        month: 0,
        day: 0
      },
      mins:{
        year: 0,
        month: 0,
        day: 0
      },
      maxs:{
        year: 0,
        month: 0,
        day: 0
      },
      pos: {
        year: 0,
        month: 0,
        day: 0
      },
      month: 0,
      day: 0,
      shows: false,
      max: null,
      min: null
    }
  },

  created () {
     let value = this.times() 
     let nowDay = +new Date()
     let year =  Math.ceil(value.split('-')[0])
     if (!this.maxDay && !this.minDay) {
      this.flag = 3
      this.max = '2050-12-31'
      this.min = '1980-01-01'
      this.val = value
      return
     }

     if (this.maxDay && !this.minDay) {
      this.max = this.maxDay
      this.min = '1980-01-01'
     }

     if (!this.maxDay && this.minDay) {
      this.max = '2050-12-31'
      this.min = this.minDay
     }

     if(this.maxDay && this.minDay) {
      this.max = this.maxDay
      this.min = this.minDay
     }

     let max = !this.maxDay ? '' : this.maxDay.replace(/\-/g, '/')
     let min = !this.minDay ? '' : this.minDay.replace(/\-/g, '/')
    
     let space = !max ? '' : (+new Date(max)) - nowDay
     let space1 = !min ? '' : (+new Date(min)) - nowDay

     if ( Math.ceil(max.split('/')[0]) == Math.ceil(min.split('/')[0])) {
       this.val = this.values = this.minDay
       this.flag = 4
       return
     }

     if (space && space < 0) {
       this.val = this.values = this.maxDay
       this.flag = 1
       return
     }

     if(space1 && space1 > 0) {
       this.val = this.values = this.minDay
       this.flag = 2
       return
     } 
    
     if ((space >= 0 && space1 <= 0) || (space >= 0 && !space1) || (!space && !space1 <= 0)) {
       this.flag = 3
       this.val =this.values = value
       return
     }
  },

  mounted() {
    document.addEventListener("click", (e) => {
      let el = e.target.getAttribute('class')
      if (el === 'modal') {
          this.shows = false
      }
    }, false)
  },
  
  // components: {
  //   pickerStop
  // },

  methods: {
    init(value) {
       let year,
          month,
          day,
          minYear,
          minMonth,
          minDay,
          maxYear,
          maxMonth,
          maxDay
      
      year = Math.ceil(value.split('-')[0])
      month = Math.ceil(value.split('-')[1])
      day = Math.ceil(value.split('-')[2])

      this.maxs.year = Math.ceil(this.max.split('-')[0])
      this.maxs.month = Math.ceil(this.max.split('-')[1])
      this.maxs.day = Math.ceil(this.max.split('-')[2])

      this.mins.year = Math.ceil(this.min.split('-')[0])
      this.mins.month = Math.ceil(this.min.split('-')[1])
      this.mins.day = Math.ceil(this.min.split('-')[2])

      this.space.year = this.maxs.year - this.mins.year + 1

      if (this.flag == 1) {
        this.pos.year = this.maxs.year - this.mins.year
        this.month = 0
        this.day = 0

        this.space.month = this.maxs.month
        this.space.day = timers(year, month)

        this.pos.month = 0
        this.pos.day = 0
      }
      
      if (this.flag == 2) {
        this.pos.year = 0
        this.month = month - 1
        this.day = day - 1
        
        this.space.month = 13 - month
        this.space.day = timers(year, month) - day

        this.pos.month = 0
        this.pos.day = 0
      }
      
      if (this.flag == 3) {
        this.pos.year = year - this.mins.year
        this.month = 0
        this.day = 0
        this.space.month = (year - this.mins.year) > 0 ? 12 : this.maxs.month
        this.space.day = timers(year, month)

        this.pos.month = month - 1
        this.pos.day = day - 1
      }

      if (this.flag == 4) {
        this.pos.year = year - this.mins.year
        this.month = this.mins.month - 1
        this.day = this.mins.day - 1
        this.space.month = this.maxs.month - this.mins.month + 1
        this.space.day = timers(year, month) - this.mins.day
        this.pos.month = 0
        this.pos.day = 0
      }
    },

    HandleClick1() {
      this.shows = true
      this.init(this.val)
      this.yearElement = this.$refs['year']
      this.monthElement = this.$refs['month']
      this.dayElement = this.$refs['day']
      this.container1 = this.$refs['box1']
      this.container2 = this.$refs['box2']
      this.container3 = this.$refs['box3']

      let year = new _touch({
        parElement: this.container1,
        element: this.yearElement,
        subElement: 'dd',
        active: 'active',
        pos: this.pos.year,
        fn: (scroll, b ) => {
          b.setAttribute('class', 'active')
          let year = Math.ceil(this.$refs['year'].querySelector('.active').innerText)
          let month = Math.ceil(this.$refs['month'].querySelector('.active').innerText)
          let dd = Math.ceil(this.$refs['day'].querySelector('.active').clientHeight)
          let sum = 0
          if (year == this.mins.year) {
            this.creatMonth(this.min, year, 0)
          } else if(year == this.maxs.year) {
            this.creatMonth(this.max, year, 1)
          } else {
            this.day = 0
            let day = timers(year, month)
            this.space.day = day - this.day
            

            for (let i = 0; i < this.space.day - 1; i++) {
              sum += dd
            }
            
            setTimeout(() => {
              this.dayElement.querySelectorAll('dd')[this.space.day - 1].setAttribute('class', 'active')
              this.dayElement.style['WebkitTransform'] = 'translate3d(0px, 0px, 0) scale(1)'
            }, 120)
          }
        }
      })


      let month = new _touch({
        parElement: this.container2,
        element: this.monthElement,
        subElement: 'dd',
        active: 'active',
        pos: this.pos.month,
        fn: (scroll, b) => {
          b.setAttribute('class', 'active')
          let year = Math.ceil(this.$refs['year'].querySelector('.active').innerText)
          let month = Math.ceil(this.$refs['month'].querySelector('.active').innerText)
          let dd = Math.ceil(this.$refs['day'].querySelector('.active').clientHeight)
          let sum = 0
          
          this.day = 0
          let day = timers(year, month)
          this.space.day = day - this.day
          
          for (let i = 0; i < this.space.day - 1; i++) {
            sum += dd
          }
          setTimeout(() => {
            this.dayElement.querySelectorAll('dd')[this.space.day - 1].setAttribute('class', 'active')
            this.dayElement.style['WebkitTransform'] = 'translate3d(0px, 0px, 0) scale(1)'
          }, 120)
        }
        
      })

      new _touch({
        parElement: this.container3,
        element: this.dayElement,
        subElement: 'dd',
        active: 'active',
        pos: this.pos.day,
        fn: (scroll, b) => {
          b.setAttribute('class', 'active')
        }
      })

    },
    creatMonth (value, year, flag) {
      let years = Math.ceil(this.$refs['year'].querySelector('.active').innerText)
      let month = Math.ceil(this.$refs['month'].querySelector('.active').innerText)
      let dd =  Math.ceil(this.$refs['month'].querySelector('.active').clientHeight)
      let sum = 0
      let plus = 0
      let day = 0
      let el = this.monthElement.querySelectorAll('dd')
      this.month = Math.ceil(value.split('-')[1]) - 1
      this.day = Math.ceil(value.split('-')[2]) - 1
      if(year == this.maxs.year || year == this.mins.year) {
        this.day = 0
      }

      for (let i = 0; i < el.length; i++) {
        el[i].setAttribute('class', '')
      }
      if (!flag) {
        this.space.month = 12 - this.month
        plus = month - this.month - 1
        for (let i = 0; i < plus; i++) {
          sum += dd
        }
        setTimeout(() => {
          el[plus].setAttribute('class', 'active')
          this.monthElement.style['WebkitTransform'] = 'translate3d(0px, 0px, 0) scale(1)'
          day = timers(year, month)
        }, 120)
      } else {
        this.space.month = this.month + 1
        this.month = 0
        setTimeout(() => {
          el[0].setAttribute('class', 'active')
          this.monthElement.style['WebkitTransform'] = 'translate3d(0px, 0px, 0) scale(1)'
          day = timers(year, this.month + 1)
        }, 120)
      }

      this.space.day = day - this.day

    },

    creatDay(value, month, year, flag) {
      this.day = Math.ceil(value.split('-')[2]) - 1
      let day = timers(year, month)
      this.space.day = day - this.day

      if (!flag) {
        this.space.day = this.day + 1
        this.day = 0
      }
    },

    times() {
      let time = new Date()
      return time.getFullYear() + '-' + ((time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : '0' + (time.getMonth() + 1)) +
            '-' + (time.getDate() > 9 ? time.getDate() : '0' + time.getDate())
    },

    HandleClick() {
      let year = this.$refs['year'].querySelector('.active').innerText
      let month = this.$refs['month'].querySelector('.active').innerText
      let day = this.$refs['day'].querySelector('.active').innerText
      this.values = year + '-' + (Math.ceil(month) > 9 ? month : '0' + month) + '-' + (Math.ceil(day) > 9 ? day : '0' + day)
      this.shows = false
      this.$emit('HandleDatepicker', this.values)
    }
  }
}
</script>

<style lang='scss' scoped>
  @import './main.scss';
</style>
