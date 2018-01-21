<template>
  <div class="items">
    <ul>
        <li v-for="(item, index) in data">
            <div class="item-lab">
                {{item.nickName || '姓名未知'}}
            </div>
            <div class="item-detail">
                {{(item.birthDay||'生日未知')+'/'+(item.sex||'性别未知')+'/'+(item.babyAge||'年龄未知')}}
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
    margin: 0 toRem(10px);
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .items {
    li {
        padding: toRem(15px) toRem(15px);
    }
  }
  .item-lab {
    color: #666;
    flex: 1;
  }
  .item-detail {
    flex: 1.2;
    text-align: right
  }
</style>