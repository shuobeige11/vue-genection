<template>
  <section class="calendar-con" v-if="timer">
    <section class="calendar-tit-con" v-text="timerY">
    </section>
    <table class="calendar-table" ref="calendar">
        <tr>
            <th class="weekends">日</th>
            <th>一</th>
            <th>二</th>
            <th>三</th>
            <th>四</th>
            <th>五</th>
            <th class="weekends">六</th>
        </tr>
        <tr v-for="n in (Math.ceil(cache[36]) ? 6 : 5)">
            <td v-for= "m in 7" :class="(m-1)%6 == 0 ? 'weekends' : '' "
                v-html="cflag[(n-1) * 7 + (m-1)] == 1 ? 
                      '<span class=timers><em class=num>' + cache[(n-1) *7 + (m-1)] + '</em><em class=cn>'+ (cnDay[(n-1) *7 + (m-1)] || '') +'</em><em class=cn-jx></em></span>' 
                      : ''">
            </td>
        </tr>
    </table>
  </section>
</template>

<script>
import util from '../../assets/util'

export default {
  props: {
    timer: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: []
    },
    zodiar: {
      type:Array,
      default:[]
    }
  },
  data () {
    return {
      timerY: null,
      times: '',
      cache: new Array(42),
      cflag: new Array(42),
      cnDay: new Array(42),
      cnJx: new Array(42),
      types: 0
    }
  },
  watch: { 
    zodiar() {
      this.init()
    }
  },
  methods: {
    init () {
      //let td  =  ? this.$refs['calendar'].querySelectorAll('td')) : ''
    //   for (let i = 0; i < this.cnJx.length; i++){
    //       this.cnJx[i] = -1
    //   }
      
      if (!this.timer) return
      this.cnDay = []
      this.cnDay = new Array(42)

      this.option = this.timer.split(/\s/)
      this.opt = {
        week: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        numMonth: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
      }
      let m = null
      for (let i = 0; i < this.opt.month.length; i++) {
        if (this.option[1] === this.opt.month[i]) {
          m = this.opt.numMonth[i]
          break
        }
      }
      m = m < 10 ? '0' + m : m
      this.timerY = this.option[3] + '-' + m + '-' + this.option[2]
      this.previous(m)
    },
    previous (m) {
      let n = new Date(this.option[3] + '/' + m + '/' + '1').toString().split(/\s/)
      let prev
      let Year = Math.ceil(this.option[3])
      let p = null
      let last
      let frist = 1

      //console.log(this.timer)
      if (n[1] === 'Apr' || n[1] === 'Jun' || n[1] === 'Sep' || n[1] === 'Nov') {
        prev = 31
        last = 30
      } else if (n[1] !== 'Mar' && n[1] !== 'Feb') {
        prev = 30
        last = 31
      } else if (n[1] === 'Mar') {
        prev = this.isYear(Year) ? 29 : 28
        last = 31
      } else {
        last = this.isYear(Year) ? 29 : 28
        prev = 31
      }
      if (n[1] === 'Jan' || n[1] === 'Aug') {
        prev = 31
        last = 31
      }
      for (let i = 0; i < this.opt.week.length; i++) {
        if (n[0] === this.opt.week[i]) {
          p = i
          break
        }
      }
      this.cflag[p] = 1
      //this.list[p].innerHTML = '<span class="timers">' + frist + '</span>'
      this.types = p
      this.cache[p] = frist
      let y = p
      let flag = true
      for (let j = 0; j < this.cache.length; j++) {
        if (j > p) {
          frist++
          flag = frist > last ? 0 : 1
          if (!flag) {
            let next = frist - last
            //this.list[j].innerHTML = '<span class="next">' + next + '</span>'
            //console.log(next)
            this.cache[j] = next
          } else {
            //this.list[j].innerHTML = '<span class="timers">' + frist + '</span>' 
            this.cache[j] = frist
          }
          this.cflag[j] = flag
        }
        if (j < p) {
          let x = (prev + 1) - y
          //this.list[j].innerHTML = '<span class="prev">' + x + '</span>'
          this.cache[j] = x
          this.cflag[j] = 3
          y--
        }
      }
      
      for (let i = 0; i < this.cache.length; i++){
        let m = null
        
        for (let i = 0; i < this.opt.month.length; i++) {
            if (this.option[1] === this.opt.month[i]) {
              m = this.opt.numMonth[i]
              break
            }
        }
        m = m < 10 ? '0' + m : m
        let s = 0

        for (let i = 0; i < this.cache.length; i++) {
          if (this.cache[i] == 1) break
          s++
        }
        let obj = util.solarToLunar(this.option[3], m, this.cache[i])
        //console.log(obj)
       // console.log(obj.term)
        this.cnDay[i] = obj.lunarFestival ? obj.lunarFestival : obj.lunarDayName
        for (let j = 0; j < this.zodiar.length; j++) {
          let t = this.zodiar[j].gongli.substr(6, 2)
          if (Math.ceil(t) == this.cache[i]) {
            this.cnDay[i] = this.zodiar[j].jieqi
          }
        }
         
        // if (f) {
        //   //this.cnDay[i] = this.zodiar[0].jieqi
        //   continue
        // }
        //console.log(this.cnDay[i])
     
      }
      
    },
    isYear (Year) {
      if (((Year % 4) === 0) && ((Year % 100) !== 0) || ((Year % 400) === 0)) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
@function toRem($px) {
  @return 64px * $px / 75px / 32px * 1rem;
}
.calendar-tit-con {
  display:none
}
.calendar-table {
  width:100%;
  padding:toRem(16px) 0;
  td, th {
    text-align:center;
    vertical-align:middle;
  }
  th {
    font:toRem(24px) "Microsoft Yahei",sans-serif;
    color:#323232;
    &.weekends {
      color:#323232
    }
  }
  td {
    position:relative;
    span {
     font:toRem(30px) "Arial",sans-serif;
     color:#323232;
     display:block;
     width: 78%;
     margin:0 auto;
     padding:toRem(12px) 0 toRem(6px) 0;
     em {
         display:block;
         font-style:normal;
         line-height:toRem(24px);
         &.cn {
             color:#323232;
             font-size:toRem(16px);
             padding:0 0 toRem(4px) 0;
             position:absolute;
             top:48%;
             left:50%;
             margin-left:-16%
         }
     }
    }
    .cn-jx {
        width:45%;
        height:toRem(6px);
        background: #fff;
        
        margin:toRem(30px) auto toRem(5px) auto
    }
   &.weekends {
     span {
       color:#d90825;
       em {
         color:#d90825;
         &.cn {
           color:#d90825
         }
       }
     }
   }
   &.red {
      span {
       background:#e30920;
       border-radius:100%; 
       color:#fff;
       em {
         color:#fff;
         &.cn {
           color:#fff
         }
       }
       .cn-jx {
         background: #fff;
       }
     }
    }

    &.disabled {
      span {
       background:#fff;
       border-radius:100%; 
       color:#ccc;
       em {
         color:#ccc;
         &.cn {
           color:#ccc
         }
       }
       .cn-jx {
         background: #fff;
       }
     }
    }

    &.bad {
      .cn-jx {
        background: #323232;
      }
    }
    &.normal {
      .cn-jx {
        border-bottom:3px solid #aaa;
      }
    }
    &.good {
      .cn-jx {
        background: #df001f;
      }
    }
  }
}

</style>
