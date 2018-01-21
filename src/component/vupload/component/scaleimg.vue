<template>
  <div id="scale-img">
    <section ref="scaleImg" @click="HandleClick" class="scale-img" :style="'display:' + (!hide && hide !== undefined? 'block' : 'none') ">
      <div class="swiper-container">
        <swiper class="swiper-box-scale">
          <swiper-slide class="swiper-item-scale" v-for="n in ScaleImg" :key="n">
          </swiper-slide>
        </swiper>
      </div>
    </section>
  </div>
</template>

<script>
import swiper from './swiper'
import swiperSlide from './swiperSlide'

export default {
  props: {
    length: {
      type: Number,
      default: 0
    },
    ScaleImg: {
      type: Array,
      default: []
    },
    hide: {
      type: Boolean,
      default: true
    },
    pos: {
      type: Number,
      default: 0
    }
  },
 
  mounted () {
    this.init()
  },
  watch: {
    length() {
      this.init()
    },
    pos() {
      this.moves(this.pos)
    },
  },
  components: {
    swiper,
    swiperSlide
  },
  methods: {
    moves(pos) {
      let el = this.$refs['scaleImg'],
          img = el.querySelector('.swiper-wrapper'),
          move = window.innerWidth * pos
      img.style['WebkitTransform'] = `translate3d(${0 - move}px, 0px, 0)`
      img.style['WebkitTransitionDuration'] = `translate3d(${0 - move}px, 0px, 0)`
    },
    init() {
      this.$nextTick(() => {
        let el = this.$refs['scaleImg'],
            imgList = el.querySelectorAll('.swiper-item-scale')
            imgList = [].slice.call(imgList)
 
        if (!imgList.length) return
        
        imgList.map((data, index) => {
           if (data.querySelector('img')) {
             data.querySelector('img').src = this.ScaleImg[index]
             data.querySelector('img').setAttribute('class', 'scales')
             return
           }
           let image = new Image(this.ScaleImg[index])
           image.onload = function() {
             this.setAttribute('class', 'scales')
           }
           image.src = this.ScaleImg[index]
           image.width = window.innerWidth
           data.appendChild(image)
         })
      })
   },
   HandleClick () {
     this.$emit('closed')
   }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>

@keyframes mymove
{
  0% {transform: scale(0)}
  100% {transform: scale(1)}
}

@-webkit-keyframes mymove /* Safari 和 Chrome */
{
    0% {transform: scale(0)}
    100% {transform: scale(1)}
}

#scale-img {
  .scale-img {
    width:100%;
    height:100%;
    background:rgb(0,0,0);
    position: fixed;
    z-index:10000;
    top:0;
    left: 0;
    .swiper-item-scale {
      width: 100%;
      img {
        width:100%
      }
    }
    .swiper-container {
      height:100%;
      position:relative;
      overflow:hidden;
      z-index: 10000
    }
    .swiper-wrapper {
      width:100%;
      height:100%;
      position: relative;
      display: flex;
      align-items:center;
      transition-property:transform;
      box-sizing: content-box
    }
    .swiper-item-scale {
      /* Center slide text vertically */
      display: flex;
      justify-content: center;
      box-pack: center;
      justify-content: center;
      flex-shrink: 0;
      position: relative;
      align-items: center;
      img {
        width:100%;
        display:block;
        transform: scale(0)
      }
      img.scales {
        animation:mymove .2s;
        transform: scale(1)
      }
    }
  }
}
</style>
