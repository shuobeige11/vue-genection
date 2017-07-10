
<template>

</template>
<script>
   export default {
     props: {
       show: {
         type: Boolean,
         default: true
       }
     },

     watch: {
        show() {
           if (document.getElementById('title_refresher')) {
                let titleRefresher = document.getElementById('title_refresher')
                titleRefresher.src = '//st.haiziwang.com/static/passport/0.1.1/favicon.ico?refresh=no'
            }
        }
    }
 }
</script>