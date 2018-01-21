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
  created() {
    this.showTip()
  },
  methods: {
    showTip () {
      this.isTipShow = true
      setTimeout(() => {
        this.isTipShow = false
      }, 2000)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
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
      padding:0 10px;
      background:rgba(0, 0, 0, 0.6);
      border-radius:5px;
      line-height:35px;
      text-align:center;
      color:#fff;
      font-size:1rem
    }
  }
</style>
