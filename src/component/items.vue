<template>
  <div class="items">
    <ul> 
        <li v-for="(item, index) in data" >
          <div class="tit" v-for="items in item" v-if="items" @click="redirect(items)">
            <div :class="'item-lab'+(items.keys=='详细地址' ? ' f1' : items.keys=='线下节假日购物百分比(工作日和节假日合计100%)' || items.keys=='线上节假日购物百分比(工作日和节假日合计100%)' ? ' f3': '')" >
                {{items.keys}}
            </div>

            <div class="point" v-if="(items.keys=='账户优惠券' && items.value > 0) || (items.keys=='账户游乐卡' && items.value > 0)"></div>
            <div :class="'item-detail'+(items.keys=='详细地址' ? ' f1-1' : items.keys=='线下节假日购物百分比(工作日和节假日合计100%)' || items.keys=='线上节假日购物百分比(工作日和节假日合计100%)' ? ' f3-1': '')">
              <div :class="/[\u4e00-\u9fa5]/.test(items.value) || items.keys=='账户优惠券' || items.keys=='账户游乐卡' ? '' : 'pd10'">
                <span :class="items.keys=='账户优惠券' || items.keys=='账户游乐卡' ? 'red' : 'normal'" v-text="items.keys=='账户优惠券' || items.keys=='账户游乐卡'? items.value + '张': items.value"></span>
              </div>
            </div>
          </div>
        </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      },
      redirects: {
        type: Function,
        default: () => {}
      }
    },
    methods: {
      redirect(items) {
        this.redirects(items)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @function toRem($px) {
    @return 64px * $px / 75px / 32px * 1rem;
  }
  .tit {
    flex: 1;
    padding: toRem(12px) toRem(5px);
    border-right: 2px solid #fff;
    overflow: hidden;
    clear: both;
    justify-content: space-around;
    &:last-child {
      border: 0
    }
  }
  .item-lab {
    color: #666;
    padding-left: toRem(10px);
    float: left;
  }
  .item-detail {
    float: right;
    text-align: right;
    padding-right: toRem(10px)
  }
  .point {
    width: toRem(12px);
    height: toRem(34px);
    padding-left: toRem(10px);
    background: url('../assets/arrow-right.png') no-repeat center center;
    background-size: toRem(12px) toRem(20px);
    float: right;
  }
  .f1-1 {
    width: 79%
  }
  .f3 {
    flex: 3
  }
  .normal {
    display:inline-block;
    vertical-align: middle
  }
  .red {
    color: #FF397E;
    display:inline-block;
    vertical-align: middle
  }
  .tj {
    display: inline-block;
    display:inline-block;
    vertical-align: middle
  }
  .pd10 {
    padding-top: toRem(3px)
  }
</style>