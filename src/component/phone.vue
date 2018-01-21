<template>
  <div class="cover" :style="'display:'+(!flag ? 'none' : 'block')">
    <div :class="'phone-modal '+(!flag ? 'phone-hide' : 'phone-show')">
        <div class="contents">
            <a :href="'//rkhy.haiziwang.com/member/sendPhone.html?mobile='+phone1+'&referr='+reffer+ '&types=1'" class="phone1">
                免费电话
            </a>
             <a :href="phone2 ? 'tel:'+phone2 : 'javascript:void(0)'" class="phone2">本地电话</a>
           </a>
        </div>
        <div class="modal-bot" @click="closed">
         关 闭
        </div>
    </div>
  </div>
</template>

<script>
   export default {
     props: {
       flag: {
         type: Boolean,
         default: false
       },
       phone1: {
         type: String,
         default: ''
       },
       phone2: {
         type: String,
         default: ''
       }
     },
     data() {
       return {
         reffer: location.href
       }
     },
     methods: {
       closed() {
         this.$emit('closed')
      }
    }
   }
</script>

<style lang="scss" scoped>
@function turnToRem($px) {
    @return 64px * $px / 75px / 32px * 1rem;
}
.cover{
    position:fixed;
    display:none;
    left:0;
    top:0;
    width:100%;
    height:100%;
    background:rgba(0,0,0,.7);
}
.phone-modal{
    display:none;
    position:fixed;
    z-index:10000;
    width:100%;
    left:0;
    .contents{
        background:#fff;
        margin-bottom:turnToRem(25px);
        a{
            display:block;
            text-align:center;
            border-bottom:1px solid #efefef;
            line-height:turnToRem(80px);
            font-size:turnToRem(32px);
        }
        .phone2{
            border:0
        }
    }
}
.modal-bot{
    padding:turnToRem(25px) 0;
    font-size:turnToRem(32px);
    text-align:center;
    position:relative;
    background:#fff;
}

.phone-show{
    display:block;
    animation: show 0.1s;
    -webkit-animation: show 0.1s;
    bottom:0;
}
.phone-hide{
    display:none;
    animation: hide 0.1s;
    -webkit-animation: hide 0.1s;
    bottom:turnToRem(-3000px);
}

</style>

