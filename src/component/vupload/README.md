// vupload 组件
   基于swiper 组件制作查看大图，可滑动查看全图
   解决 前端图片压缩，图片颠倒问题，
   图片压缩: {
      宽高压缩： 以手机屏幕宽度为值，等比例压缩高度
      质量宽度： canvas 压缩质量参数压缩
   }


简化了使用配置，优化了删除功能，修复安卓下上传不了

优化了上传异步请求队列
增加了上传失败提示，超时
摈弃了对swiper的依赖

// 引入上传组件
import {
  upload,
  uploadList,
  uploadFile
} from 'vupload'

export default {
  components: {
    upload,
    uploadList,
    uploadFile
  }
}
```


### 上传组件使用方法
<template>
  <div class="ins-btn">
    <upload class="base remark-img" 
        :list="option"
        :server="'/'"
        :start="onStart"
        :success="onSuccess"
        :error="onError">
      <upload-list 
        :list="option.imgList"
        :thunb="option.imgCache"
        :onDel="onDel"
        class="list"
      />
      <upload-file class="uploader" />
    </upload>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        option: {
           imgList: [],
           imgCache: []
        }
      }
    },
    methods: {
      onStart(canvas) {
         this.option.imgCache.push(canvas)//上传前回调
       },
       onSuccess(jsons) {
         this.option.imgList.push(jsons.content.downloadUrl)//上传成功回调
       },
       onError(e) {
         console.log(e)//发生异常
       },
       onDel(index) {
         this.option.imgList = this.option.imgList.filter((data, num) => num != index )
         this.option.imgCache = this.option.imgCache.filter((data, num) => num != index )
         //删除图片(可选)
       },
       onProgress(num) {
         console.log(num)//进度条事件(可选)
       }
    }
  }
</script>
<style>
@function turnToRem($px) {
  @return 64px * $px / 75px / 32px * 1rem;
}


.ins-btn {
  position: relative;
  min-height: turnToRem(45px);
  overflow: hidden;
}

.uploader {
  float: left;
  width: turnToRem(200px);
  height: turnToRem(200px);
}

.upload {
  width: 100%;
  height: 100%;
  background: url('../../assets/upload.png') no-repeat;
  background-size: 100% auto;
  position: relative;
  overflow:hidden;
}
.list {
  .item {
     float: left;
     width: turnToRem(198px);
     height: turnToRem(198px);
     border: 1px solid #ddd;
     margin-right: 2%;
     position: relative;
     margin-bottom: 2%;
     overflow: hidden;
     img {
       width: 100%;
        height: 100%;
     }
     
     .loadImg {
       width: 100%;
       height: 100%;
       position: absolute;
       background:rgba(239,239,239,.6);
       top: 0;
       left: 0;
       display: flex;
       align-items: center;
       .loading {
         margin: 0 auto;
         width: turnToRem(66px);
         height: turnToRem(6px);
         background:url('../../assets/loading.gif');
         background-size: turnToRem(66px) auto;
       }
       //新增fail样式
       .failure {
         margin: 0 auto;
         width: turnToRem(88px);
         height: turnToRem(88px);
         background:url('../../assets/img_fail.png');
         background-size: turnToRem(88px) auto;
       
     }
     .failImg {
       background: #eee
     }
     .del {
       position: absolute;
       top: 0;
       right: 0;
       width: turnToRem(40px);
       height: turnToRem(40px);
       background: url('../../assets/del.png');
       background-size: turnToRem(40px) auto
    }
  }
}
</style>