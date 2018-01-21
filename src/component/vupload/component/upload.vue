<template>
  <section ref="uploader">
    <div class="upload" >
      <input type="file" :multiple="defaults.multiple"  @change="uploadChange" style="position:absolute;height: 100%;opacity:0;"/>
    </div>
  </section>
</template>

<script>
import uploader from '../util/uploader'

export default {
  data () {
    return {
      flag: true,
      canvas: null,
      defaults: {}
    }
  },
  created () {
    let number = 0
    Object.assign(this.defaults, {
      server: this.$parent.server,
      multiple: this.$parent.multiple,
      max: this.$parent.max,
      quality: this.$parent.quality,
      compress: this.$parent.compress,
      
      start: canvas => {
        this.$parent.start && this.$parent.start(canvas)
      },
      success: (jsons, index) => {
        this.$parent.success && this.$parent.success(jsons)
      },
      progress: percent => {
        this.$parent.progress && this.$parent.progress(percent)
      },
      error: (e, index) => {
        this.$parent.types.errCode = index
        this.$parent.error && this.$parent.error(e)
      }
    })
    if (this.defaults.max && number >= this.defaults.max ) {
      this.flag = false
      return
    }
  },
  methods: {
   uploadChange () {
      const ev = window.event || event
      let el = ev.target
      let fileList = el.files
      let file
      if (fileList.length > this.defaults.max ) {
        let obj = {
          status: 9998,
          obj: "图片上传数量超过"+ this.defaults.max + '张'
        }
        this.defaults.error && this.defaults.error(obj)
        return
      }

      let el_input = this.$refs['uploader']
      let prev = el_input.previousSibling
      while (prev.nodeName !== 'UL') {
        prev = prev.previousSibling
      }
      let li = prev.querySelectorAll('.item-list')
      let li_cache = prev.querySelectorAll('.item-cache')
      if (fileList.length + li.length > this.defaults.max ) {
        let obj = {
          status: 9998,
          obj: "图片上传数量超过"+ this.defaults.max + '张'
        }
        this.defaults.error && this.defaults.error(obj)
        return
      }

      if (this.defaults.max && li.length >= this.defaults.max) {
        let obj = {
          status: 9998,
          obj: "图片上传数量超过"+ this.defaults.max + '张'
        }
        this.defaults.error && this.defaults.error(obj)
        return
      }
      for (let key of Object.keys(fileList)) {
        file = fileList[key]
        if (file.type && !(/^(image\/jpeg|image\/png)$/i.test(file.type))) {
          let obj = {
            status: 9997,
            obj: "图片上传格式不正确"
          }
          this.defaults.error && this.defaults.error(obj)
          return
        }
      }
      const success = this.defaults.success
      this.defaults.file = fileList
      let arrs = []
      uploader(this.defaults, this.canvas, el, arrs, num => {
        this.$parent.types.failed = num + li_cache.length
      }).then(index => {
        this.defaults.file = []
        arrs = []
        el.value = ''
      }).catch(index => {
        console.log(index)
      })
    }
  }
}
</script>
