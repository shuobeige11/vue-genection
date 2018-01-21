<template>
  <ul>
    <!--<li v-for="(item, index) in thunb" v-if="item" class="item item-list">
      <img :src="list[index] ? list[index] : item.img"  @click="onShow(index)" />
      <div class="del" @click="onDels(index)" v-if="onDel" :style="'display:'+(list[index] ? 'block':'none')"></div>
      <div class="loadImg" v-if="!list[index]">
        <div class="loading"></div>
      </div>
    </li>-->
    
    <li v-for="(item, index) in thunb" :class="'item ' + (list[index] ? 'item-list' : 'item-cache')">
      <img :src="list[index] ? list[index] : item.img"  @click="onShow(index)" />
      <div class="del" @click="onDels(index)" v-if="list[index] ? onDel ? true : false : false"></div>
      <div :class="'loadImg' + ($parent.types.failed == index || failure[index]?' failImg':'')" v-if="!list[index]">
        <div :class="$parent.types.failed == index || failure[index]?'failure':'loading'"></div>
      </div>
    </li>
  </ul>
</template>

<script>
  export default {
    props: {
      data: {
        type: Object,
        default() {
          return {}
        }
      },
     
      list: {
        type: Array,
        default() {
          return []
        }
      },
      thunb: {
        type: Array,
        default() {
          return []
        }
      },
      onDel: {
        type: [Object, Function],
        default: null
      }
    },
    data() {
      return {
        failure: []
      }
    },
    created() {
      for (let i = 0; i < this.$parent.types.max; i++) {
        this.failure.push('')
      }
    },
   
    updated() {
      let num = this.$parent.types.failed
      if (num == -1) return
      this.failure[num] = true
    },
    methods: {
      onShow(index) {
        if (!this.list[index]) return
        let firstImg = this.list[index],
            numImg = this.list[0]
        this.$parent.types.hide = false
        this.$parent.types.pos = index
      },
      onDels(index) {
        this.onDel && this.onDel(index)
      }
    }
  }
</script>
