<template>
  <div v-bind:class="!isTipShow || !msg ? 'dialog-container hide' : 'dialog-container show'" >
    <div class="dialog-tip">
      <span v-text="msg"></span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    msg: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isTipShow: false
    }
  },
  watch: {
    msg() {
      if (this.msg) this.showTip()
    }
  },
  methods: {
    showTip () {
      this.isTipShow = true
      setTimeout(() => {
        this.isTipShow = false
        this.$store.dispatch('msgClear')
      }, 2000)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  @import '../assets/css/rem';
  .hide {
    display:none
  }
  .show {
    display:block
  }
  .dialog-tip {
    position:fixed;
    left:0;
    width:100%;
    bottom:0;
    margin-bottom:25px;
    display: -webkit-box;
    -webkit-box-pack:center;
    z-index:11000;
    span {
      padding:rem(10) rem(20);
      background:rgba(0, 0, 0, 0.6);
      border-radius:5px;
      height: rem(35);
      line-height:rem(35);
      text-align:center;
      color:#fff;
      font-size:rem(38)
    }
  }
</style>
