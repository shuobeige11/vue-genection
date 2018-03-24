<template>
  <section @click="onClick">
    1231
  </section>
</template>

<script>

  export default {
    created() {
      console.log(13232)
    },
    methods: {
      onClick() {
        this.$store.dispatch('getMessage')
      }
    }
  }
</script>