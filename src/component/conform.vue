<template>
  <div class="modal-cover" :style="'display:'+(show ? 'block':'none')">
    <div class="modal-content" >
        <div class="modal-con">
            <div class="s-con">
                <div class="title">请输入昵称（最多6个字）</div><input type="text" class="prompt" maxlength="6" :value='name' >
            </div>
        </div>
        <div class="modal-btn">
            <a href="javascript:void(0)" class="sure" @click="onSures">确定</a>
            <a href="javascript:void(0)" class="cancel" @click="onCancels">取消</a>
        </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      name: {
        type: String,
        default: ''
      },
      phone: {
        type: String,
        default: ''  
      },
      babyList: {
        type: Array,
        default() {
          return []
        }
      },
      show: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      onSures() {
          console.log(this.phone)
        let vals = document.querySelector('.prompt').value || this.name;
        if (Object.prototype.toString.call(this.babyList) == '[object Array]' && this.babyList.length > 0) {
            let birthdays = this.babyList.map(function(data) { return +new Date(data.birthDay) })
            vals += this.format(Math.max.apply(null, birthdays))
        }
        location.href = '?cmd=addAddressPhone&name=' + vals + '&phone=' + this.phone; 
        this.$emit('onSure')
      },
      onCancels() {
        this.$emit('onCancel')  
      },
      format: function(val) {
            val = new Date(val)
            return val.getFullYear() +'-'+ (val.getMonth() + 1 > 9 ? val.getMonth() + 1 : '0' + (val.getMonth() + 1)) +'-'+ (val.getDate() > 9 ? val.getDate() : '0' + (val.getDate()))
      }
    } 
  }
</script>

<style lang="scss" scoped>
@function turnToRem($px) {
    @return 64px * $px / 75px / 32px * 1rem;
}

.modal-cover {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .7);
    top: 0;
    right: 0;
}

.modal-content {
    position: fixed;
    z-index: 14000;
    width: turnToRem(660px);
    left: 50%;
    margin-left: turnToRem(-330px);
    background: #fff;
    top: 20%;
    .modal-con {
        .s-con {
            line-height: turnToRem(42px);
            padding: turnToRem(40px);
            text-align: left;
            font-size: turnToRem(28px);
        }
        input.prompt {
            margin: 0 3%;
            width: 94%;
            box-sizing: border-box;
            height: 2.4rem;
            line-height: 2.4rem;
            border: 1px solid #eff2f7;
            color: #999;
            background: #fff;
            display: block;
            font-size: .85333rem;
            text-indent: 10px;
        }
        .title {
            height: 2.66667rem;
            line-height: 2.66667rem;
            color: #444;
            text-align: center;
            font-size: .8rem;
        }
    }
    .modal-btn {
        border-top: 1px solid #ff397e;
        a {
            margin: turnToRem(15px) 0;
            line-height: turnToRem(70px);
            font-size: turnToRem(32px);
            float: left;
            text-align: center;
        }
        a.sure {
            width: turnToRem(328px);
            color: #ff397e;
            border-right: 1px solid #e5e5e5
        }
        a.cancel {
            width: turnToRem(328px);
            color: #666;
        }
        a.alert-sure {
            float: none;
            display: block;
            text-align: center;
            width: 100%;
            color: #ff397e;
        }
    }
}

</style>