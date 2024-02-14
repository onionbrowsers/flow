<!--  -->
<template>
  <el-scrollbar id="preview-img">
    <div class="img-container">
      <img :src="previewSrc">
    </div>
  </el-scrollbar>
</template>

<script>

export default {
  props: ['preview'],
  data () {
    return {
    }
  },
  computed: {
    previewSrc () {
      return `/api/v2/fc/file/${this.preview.id}/${this.preview.key}`
    }
  },
  methods: {}
}
</script>

<style type="text/scss" lang="scss">
#preview-img {
  height: 600px;
  margin: 0 0 -20px -40px;
  .img-container{
    width: 500px;
    margin: 0 auto;
    img{
      width: 100%;
    }
  }
}
</style>
