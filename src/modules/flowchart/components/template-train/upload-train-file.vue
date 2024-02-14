<!--  -->
<template>
  <el-upload
    class="upload-demo"
    drag
    action=""
    accept=".vsdx"
    :show-file-list="false"
    :auto-upload="false"
    :on-change="onChange"
  >
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">请将visio文件拖到此处，或<em>点击上传</em></div>
    <div class="el-upload__tip">
      <p>提示：请上传规范的同类业务Visio文件</p>
      <p>详情请查看<span class="help-doc" @click.stop="helpDocClick">操作说明手册</span></p>
      <!-- 文件要求：请上传
      <span class="high-light">同类业务</span>
      的单个或批量Visio文件,详情参考
      <span class="help-doc" @click.stop="helpDocClick">Visio样式标准</span> -->
    </div>
  </el-upload>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    onChange (file, fileList) {
      let { name, raw } = file
      let suffix = name.substring(name.lastIndexOf('.') + 1).toLowerCase()
      if (suffix !== 'vsdx') {
        this.$msgMnger.warn('请上传后缀为vsdx的visio文件')
        return
      }
      this.$emit('addFile', raw)
    },
    helpDocClick () {
      this.$emit('showHelp')
    }
  }
}
</script>
<style lang='scss'>
@import '@/styles/index.scss';
.upload-demo{
  padding: 0 20px;
  .el-upload{
    width: 100%;
    box-sizing: border-box;
  }
  .el-upload-dragger{
    width: 100%;
    height: 150px;
    // margin-top: 105px;
    .el-icon-upload{
      margin: 10px 0;
      color: $primary-color;
    }
  }
  .el-upload__tip{
    .high-light{
      color: #F5222D;
    }
    .help-doc{
      cursor: pointer;
      color: $primary-color;
    }
    p:last-child{
      padding-top: 10px;
    }
  }
}
</style>
