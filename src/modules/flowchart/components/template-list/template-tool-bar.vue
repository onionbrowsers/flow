<template>
  <div id="template-tool-bar">
    <div class="top-block">
      <custom-input :interfaceName="interfaceName" ref="searchInput" class="search" title="" placeholder="请输入名称查询模板" @inputConfirm="handleInputConfirm"/>
    </div>
    <div class="tags">
      <slot name="tags"></slot>
    </div>
  </div>
</template>

<script>
import CustomInput from '@/components/public/CustomInput.vue'
export default {
  props: {
    interfaceName: String
  },
  components: {
    CustomInput
  },
  data () {
    return {
    }
  },
  methods: {
    handleInputConfirm (inputS) {
      let obj = {
        name: this.$route.name,
        params: {
        },
        query: {
          ps: this.$route.query.ps,
          p: 1
        }
      }
      if (this.$route.query.tags) {
        obj.query.tags = this.$route.query.tags
      }
      if (inputS) {
        obj.query.k = inputS
      }
      this.$router.push(obj)
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/index.scss';
#template-tool-bar{
  float: left;
  overflow: hidden;
  .top-block{
    // padding-bottom: 15px;
    // border-bottom: 1px solid $seprator-line-color;
  }
  .tags{
    margin-right: 100px;
    margin-bottom: 20px;
  }
}
</style>
