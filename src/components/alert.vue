<template>
  <div></div>
</template>

<script>
import { MessageBox } from 'mint-ui'
import 'mint-ui/lib/message-box/style.css'
export default {
  props: {
    msg: {
      type: String,
      default: ''
    }
  },
  watch: {
    async msg () {
      if (this.msg) {
        await MessageBox.alert(this.msg)
        this.$store.dispatch('msgClear')
      }
    }
  }
}
</script>