<template>
      <section id="member">
        <section class="base-info">
          <section class="content">
            <section class="member-pic">
               <img :src="basicInfo.fphoto && basicInfo.fphoto != '无' ? basicInfo.fphoto : require('../assets/head4.png')" />
            </section>
            <section class="base-info-main">
               <span class="member-name">
                  {{basicInfo.ftruename}}
               </span>
               <span class="member-phone">
                  {{basicInfo.mobile && (basicInfo.mobile.substr(0, 3) + '****' + basicInfo.mobile.substr(7, 4))}}
               </span>
            </section>
          </section>
          <section class="add-to-address-book">
            <a class="add"  event-param="30000|20001" href="javascript:void(0)" @click="appends(basicInfo.ftruename, basicInfo.mobile)" 
                  >+通讯录</a>
          </section>
        </section>
        <section class="remark">
          <section class="remark-item" @click="redirect()" v-if="basicInfo.labelAndRemark && (basicInfo.labelAndRemark.label && basicInfo.labelAndRemark.label.length > 0)">
            <span class="lab">标签</span>
            <span class="detail">
              <span class="con">
                 {{ basicInfo.labelAndRemark && basicInfo.labelAndRemark.label && basicInfo.labelAndRemark.label.join(',') }}
              </span>
            </span>
            <div class="point"></div>
          </section>
          <section class="remark-item" @click="redirect()" v-if="basicInfo.labelAndRemark && basicInfo.labelAndRemark.remark">
            <span class="lab">备注</span>
            <section class="detail" >
                <div class="thunb" v-if="basicInfo.labelAndRemark.picLabel.length"></div>
                <div class="remark-detail">
                  <span class="con con2 ">
                     {{basicInfo.labelAndRemark.remark}}
                  </span>
                </div>
            </section>
            <div class="point"></div>
          </section>
          <section class="remark-item" @click="redirect()" v-if="basicInfo.labelAndRemark && basicInfo.labelAndRemark.label && !basicInfo.labelAndRemark.label.length && !basicInfo.labelAndRemark.remark && !basicInfo.labelAndRemark.picLabel.length">
            <span class="lab">标签&备注</span>
            <span class="detail"></span>
            <div class="point"></div>
          </section>
        </section>
        <section class="base-info-detail">
          <tabs :on-tab-switch="onTabSwitch" :tabItems="tabItems"/>
        </section>
        <dl class="row-0">
           <dd class="row-list" v-if="index==0">
             <sub-title text="反馈信息"/>
             <items :data="userInfo.accountInfo" :redirects="redirect3"/>
             <sub-title text="用户基础信息"/>
             <items :data="userInfo.userBaseInfo" />
             <sub-title text="用户状态信息"/>
             <items :data="userInfo.userStatusInfo" />
             <sub-title :text="!userInfo.userBabyInfo.babyList || !userInfo.userBabyInfo.babyList.length ? '宝宝信息(暂无)' : '宝宝信息'"/>
             <baby :data="userInfo.userBabyInfo && userInfo.userBabyInfo.babyList"/>
             <sub-title text="疑似二胎&门店距离"/>
             <items :data="userInfo.userStoreInfo" />
             <sub-title text="与公司员工关系"/>
             <items :data="userInfo.userCompanyInfo" />
           </dd>

           <dd class="row-list" v-if="index==1">
             <sub-title text="用户活跃度"/>
             <items :data="activityInfo.userActivity" />
             <sub-title text="感性标签"/>
             <div class="mytype" v-text="activityInfo.userSensitivity"></div>
             <sub-title text="用户品类购买组合"/>
             <items :data="activityInfo.userCategory" />
             <sub-title text="购物习惯倾向"/>
             <items :data="activityInfo.userWont" />
           </dd>
           <dd class="row-list" v-if="index==2">
             <div class="member-pay" @click="redirect2()">
                <sub-title text="会员消费"/>
                <span class="more"><span>查看会员消费记录</span></span>
             </div>
             <sub-title text="消费时间节点标签"/>
             <items :data="consumpInfo.consumpTime" />
             <sub-title text="首次消费费用"/>
             <items :data="consumpInfo.firstConsump" />
             <sub-title text="最近一次购买费用"/>
             <items :data="consumpInfo.consumpLabel" />
             <sub-title text="下单总笔数"/>
             <items :data="consumpInfo.orderSum" />
             <sub-title text="下单总金额"/>
             <items :data="consumpInfo.moneySum" />
             <sub-title text="近30天单均"/>
             <items :data="consumpInfo.lastAvg" />
             <sub-title text="是否购买过相关产品"/>
             <items :data="consumpInfo.isGoods" />
             <sub-title text="消费周期"/>
             <items :data="consumpInfo.consumpLabel" />
             <sub-title text="退货情况及其他"/>
             <items :data="consumpInfo.returnGoods" />
             <sub-title text="消费标签"/>
             <items :data="consumpInfo.caonsumpLabel" />
           </dd>
           <dd class="row-list" v-if="index==3">
             <sub-title text="反馈信息"/>
             <items :data="otherInfo.backInfo" />
             <!--<sub-title text="会员行为"/>-->
             <!--<items :data="consumpInfo.caonsumpLabel" />-->
           </dd>
        </dl>
        <div class="site"></div>
        <section class="row row-6">
          <ul>
            <li><a :href="'sms:'+phone"   event-param="30000|200010">发短信</a></li>
            <li><a :href="'?cmd=imconversation&userid=' + uid + '&scenetype=11'+ '&keyshowtype=4'"  event-param="30000|200011">发券</a></li>
            <li><a :href="'?cmd=imconversation&userid=' + uid + '&scenetype=11'" event-param="200014" >即时消息</a></li>
            <li><a :href="'javascript:void(0)'" event-param="30000|200012" @click="onCall">打电话</a></li>
          </ul>
        </section>
        <showtip :msg="msg" />
        <conform 
          :name="name" 
          :phone="phone" 
          :show="show"
          :babyList="userInfo.userBabyInfo && userInfo.userBabyInfo.babyList"
          @onSure="onSure"
          @onCancel="onCancel"
        />
        <phones 
          :flag="flag"
          :phone1="phone1" 
          :phone2="phone2" 
          @closed="closed" 
        />
    </section>
</template>

<script>
  import Tabs from '../component/Tabs'
  import subTitle from '../component/subTitle'
  import items from '../component/items'
  import baby from '../component/baby'
  import showtip from '../component/showtip'
  import conform from '../component/conform'
  import phones from '../component/phone'

  export default {
    props: {
      obj: {
        type: Object,
        default: {}
      },
      brand: {
        type: [Number, String],
        default: ''
      },
      uid: {
        type: [Number, String],
        default: ''
      },
      hidephone: {
        type: [Number, String],
        default: ''
      },
      battleId: {
        type: [Number, String],
        default: ''
      },
      msg: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        activeIndex: 0,
        tabItems: ['用户信息', '活跃度及个人偏好', '消费信息', '其他'],
        activityInfo: {},
        consumpInfo: {},
        otherInfo: {},
        userInfo: {},
        index: 0,
        phone1:null,
        phone2: null,
        name: null,
        phone: null,
        show: false,
        flag: false,
        basicInfo: {}
      }
    },
    created() {
      if(this.msg) return
      this.loadData()
    },
    components: {
      Tabs,
      subTitle,
      items,
      baby,
      showtip,
      conform,
      phones
    },
    methods: {
      redirect() {
        return window.location = '//rkhy.haiziwang.com/member/label.html?memberCode=' + this.uid
      },
      redirect2() {
        return window.location = `//rkhy.haiziwang.com/member/detail-consume.html?memberCode=${this.uid}&brand=${this.brand}`
      },
      redirect3(items) {
        if (items.keys == '账户优惠券' && items.value > 0) {
          return window.location.href = `//rkhy.haiziwang.com/member/detail-coupon.html?uid=${this.uid}&mobile=${this.phone}`
        }
        if (items.keys == '账户游乐卡' && items.value > 0) {
          return window.location.href = `//rkhy.haiziwang.com/member/carnie-card.html?uid=${this.uid}`
        }
      },
      loadData() {
       
            this.activityInfo = this.obj.label.activityInfo
            this.userInfo = this.obj.label.userInfo
            this.consumpInfo = this.obj.label.consumpInfo
            this.otherInfo = this.obj.label.otherInfo
            this.basicInfo = this.obj.headInfo
            this.phone = this.basicInfo.mobile

            this.userInfo.accountInfo = this.collectData(this.userInfo.accountInfo)
            this.userInfo.userBaseInfo = this.collectData(this.userInfo.userBaseInfo)
            this.userInfo.userStatusInfo = this.collectData(this.userInfo.userStatusInfo)
            this.userInfo.userStoreInfo = this.collectData(this.userInfo.userStoreInfo)
            this.userInfo.userCompanyInfo = this.collectData(this.userInfo.userCompanyInfo)
            //用户信息部分数据整理
            this.activityInfo.userActivity = this.collectData(this.activityInfo.userActivity, 1)
            this.activityInfo.userCategory = this.collectData(this.activityInfo.userCategory, 1)
            this.activityInfo.userWont = this.collectData(this.activityInfo.userWont, 1)
            //活跃度及个人偏好数据整理
            this.consumpInfo.caonsumpLabel = this.collectData(this.consumpInfo.caonsumpLabel, 1)
            this.consumpInfo.consumpLabel = this.collectData(this.consumpInfo.consumpLabel, 1)
            this.consumpInfo.consumpTime = this.collectData(this.consumpInfo.consumpTime, 1)
            this.consumpInfo.firstConsump = this.collectData(this.consumpInfo.firstConsump, 1)
            this.consumpInfo.isGoods = this.collectData(this.consumpInfo.isGoods, 1)
            this.consumpInfo.lastAvg = this.collectData(this.consumpInfo.lastAvg, 1)
            this.consumpInfo.lastConsump = this.collectData(this.consumpInfo.lastConsump, 1)
            this.consumpInfo.moneySum = this.collectData(this.consumpInfo.moneySum, 1)
            this.consumpInfo.orderSum = this.collectData(this.consumpInfo.orderSum, 1)
            this.consumpInfo.returnGoods = this.collectData(this.consumpInfo.returnGoods, 1)
            // 消费信息数据整理
            this.otherInfo.backInfo = this.collectData(this.otherInfo.backInfo, 1)
      },

      appends(name, phone){
        if (this.hidephone) return
        this.show = true
        this.name = name
        this.phone = phone
        
      },
      onSure() {
        this.show = false
      },
      onCancel() {
        this.show = false
      },
      onCall() {

        this.flag = true
        this.phone1 = this.uid;
        this.phone2 = this.phone || '';
        if(!this.phone2) {
          alert('app没有绑定手机!')
          return
        }
      },
      closed() {
        this.phone1 = '';
        this.phone2 = '';   
        this.flag = false  
      },
      
      collectData(data, page) {
        let arr = new Array(data.length);
        let arr2 = []
        let num = 0
        for (let key of Object.keys(data)) {
           let obj = {}
           obj = {
             keys: key,
             value: data[key]
           }
          arr[num] = obj
          num ++
        }
        num = 0
        
        while(num < arr.length) {
          if (page) {
            arr2.push([arr[num]])
            num = num + 1
            continue
          }
          if (arr[num].keys == '用户评级' &&  arr[num + 1].keys == '用户等级') {
            arr2.push([arr[num], arr[num + 1]])
            num = num + 2
            continue
          }

          if (arr[num].keys.length >= 11 || arr[num].value.length >= 11 || arr[num].keys.match('时间') || arr[num].keys.match('详细地址')) {
              arr2.push([arr[num]])
              num = num + 1
          } else if (arr[num + 1] && (arr[num + 1].keys.length >= 11 || arr[num + 1].value.length >= 11 || arr[num + 1].keys.match('时间') || arr[num + 1].keys.match('详细地址'))) {
              arr2.push([arr[num]])
              num = num + 1
          } else {
            arr2.push([arr[num], arr[num + 1]])
            num = num + 2
          }
        }
        
        return arr2
      },
      onTabSwitch(index) {
        this.index = index
      }
    }
  }
</script>

<style lang='scss'>
html, body, div, p, section, span, ul, li, em, a, dl, dd {
  padding:0;
  margin:0;
  list-style: none
}
@function turnToRem($px) {
  @return 64px * $px / 75px / 32px * 1rem;
}
.member-pay {
  background: #F8F8F8;
  padding-bottom: turnToRem(15px);
  position: relative;
}
.remark {
  color: #333;

}

.mytype {
  line-height: turnToRem(48px);
  padding: 0 turnToRem(30px)
}
.more {
  position: absolute;
  right:turnToRem(15px);
  top: turnToRem(30px);
  background: url('../assets/arrow-right.png') no-repeat right center;
  background-size: turnToRem(16px) turnToRem(28px);
  span {
    color: #666;
    padding-right: turnToRem(25px)
  }
}
.row {
    margin-bottom: .58667rem;
    background: #fff;
    ul {
      display: flex;
      align-items: center;
      width: 100%;
      li {
        flex: 1;
        height: 2.66667rem;
        overflow: hidden;
        text-align: center;
        line-height: 4.26667rem;
        &:nth-of-type(1) {
          background: url("../assets/member/icon2.jpg") center .53333rem no-repeat;
          background-size: turnToRem(44px) turnToRem(34px);
        }
        &:nth-of-type(2) {
          background: url(data:image/png;base64,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) center .53333rem no-repeat;
          background-size: turnToRem(44px) turnToRem(34px);
          border-left: 1px solid #e4e3e8;
          box-sizing: border-box
        }
        &:nth-of-type(3) {
          background: url("../assets/member/icon1.jpg") center .53333rem no-repeat;
          background-size: turnToRem(44px) turnToRem(34px);
          border-left: 1px solid #e4e3e8;
          box-sizing: border-box
        }
         &:nth-of-type(4) {
           background: url("../assets/member/icon4.jpg") center .53333rem no-repeat;
           background-size: turnToRem(44px) turnToRem(34px);
           border-left: 1px solid #e4e3e8;
           box-sizing: border-box
        }
      }
    }
  }
  .row-6 {
    position: fixed;
    bottom: 0;
    width: 100%;
    margin: 0;
    border-top: 1px solid #e4e3e8
  }

  @media only screen and (width: 375px) and (min-height: 684px){
    .site {
      padding-bottom: turnToRem(84px)
    }
    .row-6 {
      ul {
        li {
          height: 2.66667rem + turnToRem(84px);
          line-height: 4.26667rem;
        }
      }
    }
}

    
   

  .content {
    flex: 4;
    display: flex;
    align-items: center
  }
  .base-info {
    display: flex;
    background: #fff;
    align-items: center;
    margin-bottom: turnToRem(20px);
    height: turnToRem(140px)
  }
  .add-to-address-book {
    flex: 1;
    .add {
      margin-right: turnToRem(30px);
      text-align: center;
      border-radius: 10px;
      color: #fff;
      font-size: .64rem;
      height: .93333rem;
      line-height: .96rem;
      background: rgb(255, 57, 126);
      display: block;
    }
  }
  .member-pic {
    flex: 1;
    text-align: center;
    img {
      width: turnToRem(80px);
      height: turnToRem(80px);
      border-radius: turnToRem(80px)
    }
  }
  .base-info-main {
    flex: 4
  }
  .member-name {
    display: block;
    font-size: turnToRem(32px)
  }
  .member-phone {
    display: block;
    font-size: turnToRem(28px);
    color:#999
  }
  .base-info-detail {
    background: #fff
  }
  .remark {
    background: #fff;
    margin-bottom: turnToRem(20px);
    .con {
      display:block;
      width: turnToRem(560px);
      white-space:nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .con2 {
      width: turnToRem(530px)
    }
  }
  .remark-item {
    display: flex;
    height: turnToRem(90px);
    align-items: center;
    justify-content: space-around;
    box-sizing: border-box;
    padding: 0 turnToRem(20px);
    &:first-child {
      border-bottom: 1px solid #F8F8F8
    }
    .lab {
      font-size: turnToRem(30px);
      color: #666
    }
    .detail {
      flex: 2;
      display: flex;
      margin: 0 turnToRem(20px) 0 turnToRem(40px);
      color: #FF397E;
      font-size: turnToRem(30px);
    }
    .point {
      width: turnToRem(16px);
      height: turnToRem(28px);
      background: url('../assets/arrow-right.png') no-repeat center center;
      background-size: turnToRem(16px) turnToRem(28px)
    }
    .remark-detail {
      display:inline-block;
      vertical-align: middle;
      color:#333
    }
    .thunb {
      display:inline-block;
      vertical-align: middle;
      margin-top: turnToRem(6px);
      margin-right: turnToRem(7px);
      width: turnToRem(32px);
      height: turnToRem(28px);
      background: url("../assets/thunb.png") no-repeat;
      background-size: turnToRem(32px) turnToRem(28px)
      
    }
    
  }

  .site {
    height: turnToRem(140px);
  }
  .row-0 {
    margin: 0;
    background: #fff;
    dd {
      width: 100%;
      li {
        display: flex;
        align-items: center;
       
        padding: 0 turnToRem(10px);
        justify-content: space-around;
        &:nth-child(odd) {
          background: #F8F8F8
        }
        &:nth-child(even) {
          background: #fff
        }
      }
    }
  }
</style>
