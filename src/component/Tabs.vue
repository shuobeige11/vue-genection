<template>
  <div class="m-tabs">
    <span class="item" v-for="(tabItem, index) in tabItems" :class="{active: activeIndex===index}" @click="_tabSwitch(index)" v-text="tabItem" />
  </div>
</template>

<script>
  export default {
    props: {
      tabItems: {
        type: Array,
        default() {
          return ['活动详情', '资源投放情况']
        }
      },
      tabIndex: {
        type: Number,
        default: 0
      },
      onTabSwitch: {
        type: Function
      }
    },
    data() {
      return {
        activeIndex: this.tabIndex
      }
    },
    methods: {
      _tabSwitch(index) {
        this.activeIndex = index
        this.onTabSwitch && this.onTabSwitch(index)
      }
    }
  }

</script>

<style lang="scss" scoped>
  @function toRem($px) {
    @return 64px * $px / 75px / 32px * 1rem;
  }
  .m-tabs {
    height: toRem(80px);
    display: flex;
    width: 100%;
    justify-content: space-around;
    box-sizing: border-box;
    font-size: toRem(26px);
    background: #fff;
    z-index: 9999;
    border-bottom: 1px solid #F8F8F8;
    .item {
      text-align:center;
      line-height: toRem(80px);
      border-bottom: 1px solid transparent;
      transition: .2s;
      display:block;
      margin: 0 toRem(25px)
    }
    .active {
      color: #ff397e;
      border-bottom-color: #ff397e;
    }
  }
</style>