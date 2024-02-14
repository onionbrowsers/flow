<!--  -->
<template>
  <el-form :model="form" slot="one">
    <el-form-item label="文件:" label-position=right label-width="150px">
      {{title}}
    </el-form-item>
    <el-form-item label="格式选择:" label-position=right label-width="150px">
      <el-select v-model="form.type" style="width:200px" @change="downloadType">
        <el-option label="Visio绘图 (*.vsdx)" value="vsdx"></el-option>
        <el-option label="Excel表格 (*.excel)" value="pdf"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>

export default {
  props: ['title'],
  data () {
    return {
      form: {
        type: ''
      }
    }
  },
  methods: {
    downloadType (type) {
      this.$emit('chooseType', type)
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
