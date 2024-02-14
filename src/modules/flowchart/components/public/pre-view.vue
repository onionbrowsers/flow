<template>
  <div id="preview">
    <img :src="src" alt="">
  </div>
</template>

<script>
export default {
  props: {
    src: String
  }
}
</script>

<style lang='scss' scoped>

</style>
