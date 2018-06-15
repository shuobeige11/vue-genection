<template>
  <el-dialog
    title="错误提示"
    :visible.sync="dialogVisible" 
    width="45%"
    :before-close="onClick">
    <span class="content">{{msg}}</span>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onClick">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      msg: {
        type: String,
        default: ''
      }
    },
    watch: {
      msg() {
        this.dialogVisible = this.msg ? true : false
      }
    },
    data() {
      return {
        dialogVisible: false
      }
    },
    methods: {
      onClick() {
        this.$store.dispatch('msgClear')
      }
    }
  }
</script>
<style scoped>
  .content {
    display: block;
    text-align: center
  }
</style>