<!-- 工具栏 -->
<template>
  <div>
    <div>
      <custom-input ref="searchInput" class="search" title="" placeholder="请输入文件名、作者" @inputConfirm="inputConfirm"/>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import CustomInput from '@/components/public/CustomInput.vue'

export default {
  data () {
    return {
    }
  },
  components: {
    CustomInput
  },
  methods: {
    inputConfirm (value) {
      this.$emit('selectFile', value)
    }
  }
}

</script>

<style lang='scss' scoped>
</style>
