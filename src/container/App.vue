<template>
  <div id="app">
    <div class="cover" @click="hide" :style="'display:' + (!cover ? 'none' : 'block')"></div>
    
    <div class="add"></div>
    <div class="addC" @click="show" >
          <div class="add-con" :style="'display:' + (!cover ? 'none' : 'block')">
            <div class="point"></div>
             <div class="add-map">
              <ul>
                <li>
                  <span class="icon icon1"></span>
                  <span class="icon-add" @click="HandleMember(2)">赠送黄历</span>
                </li>
                <li>
                  <span class="icon icon2"></span>
                  <span class="icon-add" @click="HandleMember(3)">八一下</span>
                </li>
                 <li>
                  <span class="icon icon3"></span>
                  <span class="icon-add" @click="HandleMember(5)">添加黄历</span>
                </li>
              </ul>
             </div>
          </div>
       </div>
    <header class="header">
       <section class="member">
          <section class="member-icon"></section>
          <section class="member-con">
             <div class="member-name" v-text="userName" @click="HandleMember(1)"></div>
             <!--<div class="member-items" v-text="birthDay">1994年11月12日</div>-->
          </section>
       </section>
       <div class="goback" @click="goback">今天</div>
       
       <section class="timers" >
          <span v-text="value" class="timer-value"></span>
          <span class="icon-down"></span>
       </section>
       <section class="changeTimer" >
          <Datepicker v-on:HandleDatepicker="HandleDateChange" />
       </section>
    </header>
    <div class="content" ref="calendar">
      
      <Calendar :timerList="timerList" v-on:HandleUp="HandleTouchEnd" :month="month" :zodiars="zodiar" v-on:HandleCreat="HandleCreated"/>
    </div>

    <div class="taboo taboo1" :style="'display:' + (badDay == '初五' || badDay == '十四' || badDay == '廿三' ? 'block' : 'none')">
      <div class="detail">
        <div class="point"></div>
        <div class="enlarge">
          <div class="amplify">
            <div class="amplify-top">黑道日</div>
          </div>
          <div class="lunarce">
           
          </div>
        </div>
      </div>
    </div>

    <div class="taboo taboo1" :style="'display:' + (divisions ? 'block' : 'none')" @click="HandleMember(4)">
      <div class="detail">
        <div class="mb-point"></div>
        <div class="enlarge">
          <div class="amplify">
            <div class="amplify-top" v-text="divisions">雨水</div>
          </div>
          <div class="lunarce">
            <div class="lunarcel" v-if="hours">
              <div class="lunarcel-top" v-text="hours + '点' + minutes + '分' + getSeconds + '秒交节' "></div>
              <div class="lunarcel-bot" v-text="'距离今天还有' + difference + '天'"  :style="'display:' + (difference >= 0 ? 'block' : 'none')">距离今天还有3天</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    

    <div class="taboo">
      <div class="detail">
        <div class="divinatory">
          <img :src="imgs || ''" class="kuCan"/><span class="tday" v-text="special ? (special + '日') : ''"></span>
        </div>
        <div class="enlarge">
          <div class="amplify">
            <div :class="'amplify-top ' + (Math.ceil(types) == 0 ? 'amplify-good' : Math.ceil(types) == 1 ? 'amplify-bad' : Math.ceil(types) == 2 ? 'amplify-normal' : 'amplify-half')" v-text="today">15</div>
            <div :class="'amplify-bot ' + (Math.ceil(types) == 0 ? 'amplify-good' : Math.ceil(types) == 1 ? 'amplify-bad' : Math.ceil(types) == 2 ? 'amplify-normal' : 'amplify-half')" v-text="todayWeek">星期三</div>
          </div>
          <div class="lunarce">
            <div class="lunarcel">
              <div class="lunarcel-top" v-text="'农历'  + chinaDate"></div>
              <div class="lunarcel-bot" v-text="heavYear + '年' + zodiac + '年 ' + heavMonth + '月 ' + heavDay + '日'">丁酉年鸡年 壬寅月 癸酉日</div>
            </div>
            <div :class="'luck ' + (Math.ceil(types) == 0 ? 'luck-good' : Math.ceil(types) == 1 ? 'luck-bad' : Math.ceil(types) == 2 ? 'luck-normal' : 'luck-half') "></div>
          </div>
        </div>
        <div class="wants">
          <div class="should">
            <div class="should-top">
              <span class="should-box">宜</span>
            </div>
            <div class="should-bot">
              <div class="works" v-for="item of suite" v-text="item"></div>
            </div>
          </div>
          <div class="bogey">
            <div class="bogey-top">
              <span class="should-box should-box-bad">忌</span>
            </div>
            <div class="bogey-bot">
              <div class="works" v-for="item of unsuite" v-text="item"></div>
            </div>
          </div>
        </div>
        <div class="details">
          <a :href="'/fuwuhao/index.php/Home/Calendars/day_explain?id=' + directId"> 宜忌详解 </a>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

import Cookie from 'js-cookie'
import store from 'store'
import util from '../assets/util'

import animation from '../assets/animation/animation'

import Calendar from '../compontents/Calendar/index'
import Datepicker from '../compontents/Select/Datepicker'

import serverOption from '../actions'
import * as api from '../constants/api'

export default {
  data() {
      return {
          value: new Date(),
          timers: new Date().toString(),
          min: null,
          max: null,
          month: null,
          years: null,
          timerList: [],
          pos: 0,
          userName: null,
          birthDay: null,
          chinaDate: '',
          heavYear: '',
          heavMonth: '',
          heavDay: '',
          zodiac: '',
          weekdays: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
          todayWeek: null,
          today: null,
          data1:[],
          val: null,
          types: 0,
          suite: [],
          unsuite: [],
          imgs: null,
          special: '',
          monthDay: null,
          divisions: null,
          cover: false,
          hours: null,
          minutes: null,
          getSeconds: null,
          difference: null,
          badDay: null,
          directDay: null,
          directId: null,
          memberId: null,
          zodiar: []
      }
  },
  created() {
    this.val = this.value

    let year = this.value.getFullYear()
    let days = this.value.getDate()
    this.min = year + '-' + '01-01'
    this.max = year + '-' + '12-31'
    this.month = this.value.getMonth() + 1
    this.years = this.value.getFullYear()
    this.directDay = this.years + (this.month > 9 ? month : '0' + this.month) + (days > 9 ? days : '0' + days)
    this.value = this.years + '年' + (this.month > 9 ? month : '0' + this.month) + '月'
   // console.log(util.solarToLunar('2017', '03', '01'), util.calendar('2017','02'))
    //this.directDay = this.years + (this.month > 9 ? month : '0' + this.month) + (this.value.getDate() > 9 ? this.value.getDate() : '0' + this.value.getDate())
    
    for (let i = 0; i < 14; i++) {
        let month = ''
        if (i == 0) {
          let year = this.years - 1
          month = year + '/' + '12/01'
        } else if (i == 13 ) {
          let year = this.years + 1
          month = year + '/' + '1/01'
        } else {
          month = this.years + '/' + i + '/01'
        }
        
        this.timerList.push(new Date(month).toString())  
    }
    
  },
 
  components: {
    Calendar,
    Datepicker
  },
  mounted() {
    let calendar = this.$refs['calendar']
    calendar.addEventListener('click', () => { this.HandleClick() }, false)
    document.body.addEventListener("touchend", (e) => {
      let el = e.target.getAttribute('class')
      if (el == 'cover') {
        this.cover = false
      }
      
    }, false)
  },
  methods: {
     HandleMember(id) {
      switch (id) {
        case 1:
          return window.location.href = '/fuwuhao/index.php/Home/Calendars/switch_cal'
          break
        case 2:
          return window.location.href = '/fuwuhao/index.php/Home/Calendars/gift_cal'
          break
        case 3:
          return window.location.href = '/fuwuhao/index.php/Home/Calendars/eight_cal'
          break
        case 4:
          return window.location.href = '/fuwuhao/index.php/Home/Calendars/term_detail?timer=' + this.directDay
          break
        case 5: 
          return window.location.href = '/fuwuhao/index.php/Home/Order/renew'
          break
        default :
          return window.location.href = '/fuwuhao/index.php/Home/Calendars/day_explain?id=' + this.directId
          break
         
      } 
    },
    
    show () {
      this.cover = true
    },
    hide () {
      this.cover = false
    },
    HandleClick () {
      let ev = window.event || event
      let el = ev.target
      let parent = el.parentNode
      while (parent && parent.nodeName !== 'TD') {
        parent = parent.parentNode
      }
      
      if (!parent) return

      if (!parent.childNodes) return
      if ( /disabled/g.test(parent.getAttribute('class'))) {
        alert('当日没有订阅黄历')
        return
      }
      let td = calendar.querySelectorAll('td')
      let className
      for (let i = 0; i < td.length; i++) {
         className = td[i].getAttribute('class')
         if (/red/g.test(className)) {
           className = className.split('red')
           let classes = ''
           for (let j = 0; j < className.length; j++) {
              if (className[j]) {
                classes += className[j]
              }
           }
           td[i].setAttribute('class', classes)
         }
      }
      
      className = parent.getAttribute('class');
      if (!/red/.test(className)) {
        parent.setAttribute('class', className + ' red');
      }
      if (this.monthDay == 0) this.monthDay = 12
      if (this.monthDay == 13) this.monthDay = 1
      let day = this.val.getFullYear() + '/' + this.monthDay + '/' + (parent.index + 1)
    
      let v = new Date(day)
      
      let badDay = util.solarToLunar(this.years, this.monthDay, parent.index + 1)
      this.badDay = badDay.lunarDayName
      this.updatedClearDay(v)
    },

    updatedClearDay(value) {
      let today = value.getDay()
      let obj = util.solarToLunar(value.getFullYear(), value.getMonth() + 1, value.getDate())
      
      
      this.todayWeek = this.weekdays[ today - 1]
      if (today == 0) this.todayWeek = this.weekdays[6]
      this.today = value.getDate() > 9 ? value.getDate() : '0' + value.getDate()
      this.chinaDate = obj.lunarMonthName + obj.lunarDayName
      this.heavYear = obj.GanZhiYear
      this.heavMonth = obj.GanZhiMonth
      this.heavDay = obj.GanZhiDay
      this.zodiac = obj.zodiac
      this.types = this.data1[value.getDate() - 1].type
      //console.log(this.data1[value.getDate()-1])
      let nid = Cookie.get('a_n')
   
      let times = value.getFullYear().toString() + ((value.getMonth() + 1) > 9 ? (value.getMonth() + 1).toString() : '0' + (value.getMonth() + 1)) + this.today.toString()
      this.directDay = times
      //console.log(this.directDay) 
      serverOption(api.getDay, {
        timer: times,
        nid: nid
      }).then(data => {
        let a = data.yi.split('；')
        let b = data.ji.split('；')
        this.divisions = data.zodiac.z_name
        if (data.zodiac.z_name) {
          this.difference = data.zodiac.z_day
          this.hours = data.zodiac.z_time.split(':')[0]
          this.minutes = data.zodiac.z_time.split(':')[1]
          this.getSeconds = data.zodiac.z_time.split(':')[2]
          
        } else {
          this.difference = null
        }
       
        this.directId = data.id
        this.suite = [].slice.call(a)
        this.unsuite = [].slice.call(b)
        this.imgs = data.guapic
        this.special = data.guapic.split('/')
        this.special = this.special[this.special.length - 1].match(/([\u4E00-\u9FA5\uF900-\uFA2D])+/)[0]
    
      })
    },
    HandleCreated(list) {
      let obj = store.get('name')
      if (!obj) return
      this.userName = obj.name
      this.birthDay = obj.birth
      this.data1 = list
      this.monthDay = this.val.getMonth() + 1
      this.updatedClearDay(this.val)
    },

    HandleDateChange(value) {
      let date = store.get('date')
      let values = value.split('-')
      this.monthDay = Math.ceil(values[1])
      let flag = false
      for (let i = 0; i < date.length; i++) {
        if (Math.ceil(values[1]) == Math.ceil(date[i])) {
          flag = true
        }
      }
      
      
      let month = this.value.split('年')[1].split('月')[0]
      this.value = values[0] + '年' +  values[1] + '月'
      // if (values[1] == month || flag) {
      //   this.ChangeCalendar(values, '', 0)
      //   //return
      // }
      this.years = values[0]
      
      this.createdDay()
      let times = value.split('-')
      times = times[0] + times[1] + times[2]
      let nid = Cookie.get('a_n')

      let td = document.querySelectorAll('td')
      
      for (let i = 0; i < td.length; i++) {
        if (/weekends/g.test(td[i].getAttribute('class'))) {
            td[i].setAttribute('class', 'weekends')
        } else {
          td[i].setAttribute('class', '')
        }
      }     
      
      serverOption(api.getMonth, {
        timer: times,
        nid: nid
      }).then(data => {
        
         if (Math.ceil(data) < 0) {
            this.ChangeCalendar(values, data, 0)
            return
         }
         
         let data1 = data.month
         this.data1 = data1
         this.ChangeCalendar(values, data1, 0)
         let month = Math.ceil(value.split('-')[1])
         date[month - 1] = month
         let t = times.substr(0, 4) + '/' + times.substr(4, 2) + '/' + times.substr(6, 2)
         //console.log(t)
         let v = new Date(t)

         this.updatedClearDay(v)
         store.set('date', date)
      })
    },
    
    HandleTouchEnd (swiper){
      let date = store.get('date')
      let month = this.value.split('年')[1].split('月')[0]
      //console.log(swiper.realIndex)
      let m = swiper.realIndex > 9 ? swiper.realIndex : '0' + swiper.realIndex
      let year = ''
      this.monthDay = swiper.realIndex
      let el = document.querySelector('.swiper-wrapper')
      let dd = document.querySelectorAll('.swiper-item')
      let td = document.querySelectorAll('td')
      
      for (let i = 0; i < td.length; i++) {
        if (/weekends/g.test(td[i].getAttribute('class'))) {
            td[i].setAttribute('class', 'weekends')
        } else {
          td[i].setAttribute('class', '')
        }
      }

      
      let sum = 0

      let flag = false
      for (let i = 0; i < date.length; i++) {
        if (Math.ceil(m) == Math.ceil(date[i])) {
          flag = true
        }
      }
      
      year = this.years
      if (swiper.realIndex == 0) {
        year = Math.ceil(this.years) - 1
        m = 12
        this.years = year
        for (let i = 0; i < 12; i++) {
            sum += dd[0].clientWidth + 30
        }
        
        this.createdDay()
        setTimeout(() => {
          el.style.cssText = "-webkit-transition-duration: 0ms; transform: translate3d("+ (0 - sum) + "px, 0px, 0px)"
        }, 120)
      } else if (swiper.realIndex == 13) {
        let total = dd[0].clientWidth + 30
        year = Math.ceil(this.years) + 1
        m = '01'
        this.years = year
        this.createdDay()
        setTimeout(() => {
          this.el.style.cssText = "-webkit-transition-duration: 0ms; transform: translate3d("+ (0 - total) +"px, 0px, 0px)"
        }, 120)
      }
      
      
        m = m.toString()

        
        let values = [year, m, '01']
        
        // if (swiper.realIndex == Math.ceil(month) || flag) {
        //   this.ChangeCalendar(values, '', 1)
        //   //return
        // }

        let times = year + m + '01'
        let nid = Cookie.get('a_n')
        serverOption(api.getMonth, {
          timer: times,
          nid: nid
        }).then(data => {
          if (Math.ceil(data) < 0) {
            this.ChangeCalendar(values, data, 1)
            this.value = year + '年' + m + '月'
            return
          }
          let data1 = data.month
          this.data1 = data1
          this.ChangeCalendar(values, data1, 1)
          let date = store.get('date')
          let month = times[1]
          this.zodiar = data.zodiac
          date[swiper.realIndex] = Math.ceil(values[1])
          store.set('date', date)
        })
        this.val = new Date(year + '/' + m + '/' + '01')
        this.value = year + '年' + m + '月'
  
    },

    createdDay() {
      this.timerList = []
      for (let i = 0; i < 14; i++) {
        let month = ''
        if (i == 0) {
          let year = this.years - 1
          month = year + '/' + '12/01'
        } else if (i == 13 ) {
          let year = this.years + 1
          month = year + '/' + '1/01'
        } else {
          month = this.years + '/' + i + '/01'
        }
        
        this.timerList.push(new Date(month).toString())  
      }
    },

    isArray(o) {
      return Object.prototype.toString.call(o) === '[object Array]';
    },

    goback() {
      window.location.href = location.href+'?time='+((new Date()).getTime())
    },

    ChangeCalendar (values, list, flag) {
     
      let sum = 0
      this.el = document.querySelector('.swiper-wrapper')
      let dd = document.querySelectorAll('.swiper-item')
      let table = document.querySelectorAll('table')
      let cMonth = Math.ceil(values[1])
      let cDay = Math.ceil(values[2])
      
      let td = table[cMonth].querySelectorAll('td')
      let num = 0
      let dataCache = []

       
        if (!flag) {
            for (let i = 0; i < Math.ceil(values[1]); i++) {
                sum += dd[i].clientWidth + 30
            }
            sum  = 0 - sum
            animation(this.el, () => {
              return {
                cssText: "-webkit-transform: translate3d(" + sum + "px, 0, 0);",
                cssStart: this.el.style.cssText,
                timer: 1200
              }
            })
        }

      if (this.isArray(list)) {
        for (let i = 0; i < td.length; i++) {
          if (!td[i].childNodes.length) {
            dataCache.push(-1)
          } else {
            dataCache.push(list[num].type)
            num++
          }
        }
      } else {
        for (let i = 0; i < td.length; i++) {
          td[i].setAttribute('class', 'disabled')
        }
        return
      }

      num = 0;
      for (let i = 0; i < td.length; i++) {
          if (!td[i].childNodes.length) continue
          
          if (/weekends/g.test(td[i].getAttribute('class'))) {
            td[i].setAttribute('class', 'weekends')
          } else {
            td[i].setAttribute('class', '')
          }

          let className = td[i].getAttribute('class') || ''
          if ((num == cDay - 1)) {
              td[i].setAttribute('class', className + ' red')
              className = td[i].getAttribute('class') || ''
          }

          if (this.isArray(list)) {
            td[i].index = num
            switch (Math.ceil(dataCache[i])) {
                case 0:
                  td[i].setAttribute('class', className + ' good')
                 // console.log(1)
                  break
                case 1:
                  td[i].setAttribute('class', className + ' bad')
                  break
                case -1: 
                  td[i].setAttribute('class', className + ' disabled')
                  break
                default:
                  td[i].setAttribute('class', className)
                  break
            }
          }
          num++
      } 

       
    }
  }
}

</script>

<style lang='scss' scoped>
@import '../assets/common.scss';
.calendar-con {
  width:100%
}
.content {
  width:100%;
  position:relative;
  background:#fff;
  margin-top:toRem(96px)
}
.header {
  width: 100%;
  height:toRem(96px);
  background:#df001f;
  position:fixed;
  display:flex;
  top:0;
  left:0;
  z-index:4000
}
.timers {
   position: absolute;
   z-index:6;
   width:45%;
   left:26%;
   line-height:toRem(96px);
   text-align:center;
   color:#fff;
   
}
.changeTimer {
   position:absolute;
   height:toRem(96px);
   width:45%;
   left:21%;
   z-index:7;
   text-align:center
}
.timer-value {
   display:inline-block;
   vertical-align: middle;
   font-size:toRem(30px);
   
}
.icon-down {
  width:toRem(18px);
  height:toRem(10px);
  display:inline-block;
  background:url(../assets/icon_down.png) no-repeat;
  background-size:100% auto
}
.member {
  position:absolute;
  height:toRem(36px);
  left:toRem(24px);
  top:toRem(30px);
  width:toRem(254px);
  z-index:6;
  span {
    display:inline-block;
    vertical-align:middle
  }
}
.member-icon {
  display:inline-block;
  width: toRem(30px);
  height: toRem(29px);
  background:url(../assets/icon_member.png) no-repeat;
  background-size:100% auto;
  margin-right:toRem(5px);
  vertical-align:middle;
}
.member-con {
   display:inline-block;
   vertical-align:middle;
   color:#fff;
   line-height:toRem(22px)
}
.member-items {
  font-size:toRem(16px);
  color:#f5f5f5
}

.add {
  width:toRem(33px);
  height:toRem(65px);
  background:url(../assets/icon_plus.png) no-repeat;
  position:fixed;
  z-index:10001;
  background-size:100% auto;
  right:toRem(24px);
  top:toRem(30px);
}

.addC {
  width:toRem(33px);
  height:toRem(65px);
  position:fixed;
  z-index:10002;
  right:toRem(24px);
  top:toRem(37px);
}


.swiper-box {
  width: 100%;
  margin: 0 auto;
  padding-bottom:toRem(30px)
}
.swiper-item {
  background: #fff;
  /* Center slide text vertically */
  display: flex;
  justify-content: center;
  align-items: center;
  .pro-pic {
    width:95%;
    height:toRem(400px);
    display:block;
    border:1px solid #999
  }
}


.answer-con{
  padding:toRem(25px) 0;
  font-size:toRem(28px);
  color:#fe397e
}



.taboo{
  width: toRem(750px);
  background: rgb(245,245,245);
}
.detail{
  background:#fff;
  border: 1px solid rgb(231,231,231);
  margin: toRem(10px) toRem(20px) toRem(194px) toRem(20px);
  border-radius: toRem(10px);
}
.divinatory{
  height: toRem(70px);
  line-height: toRem(70px);
  border-bottom: 1px solid rgb(231,231,231);
  font-size: toRem(29px);
  text-align: center;
}
.enlarge{
  height: toRem(167px);
  border-bottom: 1px solid rgb(231,231,231);
  /*padding:toRem(31px) 0;*/
  display: -webkit-box;
  -webkit-box-align:center;
  /*-webkit-box-pack: center;*/
  color: rgb(226,0,17);
}
.amplify{
  display: flex;
  flex-flow: column;
  height: toRem(108px);
  width: toRem(154px);
  border-right: 1px solid rgb(231,231,231);
  text-align: center;
}
.amplify-top{
  height: toRem(69px);
  line-height: toRem(70px);
  font-size: toRem(84px);
}
.amplify-bot{
  height: toRem(29px);
  line-height: toRem(50px);
  font-size: toRem(29px);
}
.lunarce{
  height: toRem(108px);
  width: toRem(553px);
}
.lunarcel{
  float: left;
  margin-left: toRem(30px);
}
.lunarcel-top{
  height: toRem(60px);
  line-height: toRem(60px);
  font-size: toRem(40px);
  color: rgb(50,50,50);
}
.lunarcel-bot{
  height: toRem(48px);
  line-height: toRem(48px);
  font-size: toRem(24px);
  color: rgb(170,170,170);
}
.luck{
  float: right;
  width:toRem(108px);
  height:toRem(108px);
  margin-right: toRem(30px);
  background-repeat: no-repeat;
  background-size:100% auto
}
.luck-good {
  background-image:url(../assets/good.png)
}
.luck-half {
  background-image:url(../assets/half.png)
}
.luck-normal {
  background-image:url(../assets/normal.png)
}
.luck-bad {
  background-image:url(../assets/bad.png)
}
.wants{
  display: -webkit-box;
  border-bottom: 1px solid rgb(231,231,231);
}
.should{
  width: toRem(354px);
  height: 100%;
  color: rgb(226,0,17);
}
.should-top, .bogey-top{
  height: toRem(63px);
  line-height: toRem(63px);
  text-align: center;
  font-size: toRem(30px);
  border-bottom: 1px solid rgb(231,231,231);
}
.should-bot, .bogey-bot{
  display: flex;
  flex-wrap:wrap;
  padding: toRem(6px) toRem(20px) toRem(22px) toRem(20px);
  font-size: toRem(24px);
}
.bogey{
  width: toRem(353px);
  border-left: 1px solid rgb(231,231,231);
  color: rgb(50,50,50);
}
.works{
  line-height: toRem(24px);
  margin: toRem(20px) toRem(8px);
  margin-bottom: 0;
}
.details{
  a {
    display:block;
    margin:0 auto;
    width:toRem(120px);
    height: toRem(69px);
    line-height: toRem(69px);
    text-align: center;
    font-size: toRem(24px);
    color: rgb(170,170,170);
    padding-right: toRem(8px);
    background:url(../assets/icon-p.png) no-repeat right toRem(30px);
    background-size:toRem(8px) toRem(14px)
  } 
}

.should-box {
  display:block;
  border:1px solid #df001f;
  width:toRem(40px);
  line-height:toRem(40px);
  margin: toRem(15px) auto 0 auto
  
}

.should-box-bad {
  border:1px solid #444
}

.taboo1 {
  .detail {
    margin-bottom:0;
    position:relative
  }
  .amplify {
    width: auto;
    padding:0 toRem(15px) 0 toRem(30px);
    border:0;
  }
  .lunarce {
    width:toRem(470px);
  }
  .lunarcel {
    margin-left:toRem(12px);
  }
  .lunarcel-top {
    font-size:toRem(28px);
    line-height:toRem(48px);
    height:toRem(48px);
    margin-top:toRem(12px)
  }
  .lunarcel-bot {
    line-height:toRem(26px)
  }
  .amplify-top {
    color: #323232;
    line-height: toRem(100px);
    font-size:toRem(60px);
  }
}
.amplify-bad {
  color:#323232
}
.amplify-normal, .amplify-half {
  color:#aaa
}

.kuCan {
  display:inline-block;
  width:toRem(36px);
  height:toRem(36px);
  vertical-align:middle;
  margin-right:toRem(5px);
  border:0
}
.tday {
  display:inline-block;
  vertical-align:middle
}

.add-con {
  position: relative
}
.cover {
  height:100%;
  width:100%;
  position:fixed;
  z-index:5000;
  top:0;
  left:0;
  background:rgba(0, 0, 0, .3)
}
.add-map {
  position:absolute;
  width:toRem(240px);
  border-radius: 6px;
  background:#fff;
  left:toRem(-185px);
  top:toRem(60px);
  z-index:20000;
  li {
    padding:toRem(20px) 0;
    width:80%;
    text-align:left;
    padding-left:20%;
    border-bottom:1px solid #e7e7e7;
    &:last-child {
      border:0
    }
  }

}

  .point {
    width: 0;
    height: 0;
    border-top: toRem(24px) solid #fff;
    border-right: toRem(24px) solid transparent;
    position:absolute;
    top: toRem(50px);
    -webkit-transform:rotate(45deg);
    z-index:20000;
  }

  .icon {
    display:inline-block;
    width:toRem(40px);
    height:toRem(40px);
    background-repeat:no-repeat;
    background-size:100% auto;
    vertical-align:middle;
  }
  .icon-add {
    margin-left:toRem(5px);
    display:inline-block;
    vertical-align:middle;
  }
  .icon1 {
    background-image:url(../assets/icon1.png)
  }
  .icon2 {
    background-image:url(../assets/icon2.png)
  }
  .icon3 {
    background-image:url(../assets/p.png)
  }
  .member-name{
    font-size:toRem(32px);
  }

  .goback {
     position:absolute;
     padding:toRem(2px) toRem(18px);
     border:1px solid #fff;
     border-radius:4px;
     top:toRem(30px);
     color:#fff;
     right:toRem(120px);
     z-index:6
  }

  .go-back {
     position:absolute;
     padding:toRem(2px) toRem(18px);
     top:toRem(30px);
     color:#fff;
     right:toRem(120px);
     z-index:10;
     opacity:0
  }

  .mb-point {
    position:absolute;
    right:toRem(25px);
    width:toRem(46px);
    height:toRem(46px);
    top:50%;
    margin-top:toRem(-23px);
    background:url(../assets/iconfont.png) no-repeat;
    background-size:100% auto
  }
</style>
