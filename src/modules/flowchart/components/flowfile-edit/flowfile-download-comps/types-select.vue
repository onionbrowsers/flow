<template>
  <div id="types-select">
    <span class="left">格式选择：</span>
    <el-select popper-class="download-type-select" v-model="downloadType" @change="handleChange" placeholder="请选择" size="mini">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  data () {
    return {
      options: [
        // {
        //   value: 'vsdx',
        //   label: 'Visio绘图(*.vsdx)'
        // },
        {
          value: 'pdf',
          label: 'PDF文件(*.pdf)'
        },
        {
          value: 'docx',
          label: 'Word文档(*.docx)'
        }
      ],
      downloadType: 'pdf'
    }
  },
  methods: {
    handleChange (val) {
      this.$emit('typeChanged', val)
    }
  }
}
</script>

<style lang="scss" scoped>
#types-select{
  margin: 15px 0;
}
</style>
<style lang="scss">
.download-type-select {
  .el-select-dropdown__wrap {
    margin-bottom: 0px !important ;
  }
  .el-select-dropdown__list{
    padding-bottom: 5px !important;
    .el-select-dropdown__item {
      padding: 0 20px !important ;
      height: 30px !important;
      line-height: 30px !important;
    }
  }
}
</style>
