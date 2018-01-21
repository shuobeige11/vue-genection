<template>
    <div class="swiper-list">
        <img :src="value"/>
    </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: String,
        default: ''
      }  
    }
  }
</script>
