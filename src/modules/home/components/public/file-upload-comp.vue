<template>
  <div id="file-upload-comp" v-loading.fullscreen.lock="loading">
    <el-upload
      class="custom-upload"
      ref="upload"
      drag
      :action="``"
      :headers="headers"
      :data="params"
      :on-change="onChange"
      :on-success="handleSuccess"
      :on-error="handleError"
      :before-upload="beforeUpload"
      :before-remove="beforeRemove"
      :show-file-list="true"
      :multiple="true"
      :auto-upload="false"
      :limit="200"
      :accept="accept||acceptFormats"
      >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">- 支持文件格式包括: <span class="fw600" style="color:green">{{accept?accept:'.pdf, .rar, .tar, .zip'}}</span></div>
      <!-- <div class="el-upload__tip" slot="tip">- 支持文件格式包括: {{accept?accept:'pdf'}}</div> -->
      <div class="el-upload__tip" slot="tip">- 文件大小限不超过200MB</div>
    </el-upload>
  </div>
</template>

<script>
export default {
  props: ['accept'],
  data () {
    return {
      fileArray: [],
      headers: {},
      loading: false,
      acceptFormats: '.pdf, .rar, .tar, .zip',
      // acceptFormats: ' .doc, .docx,  .pdf,',
      typeList: [],
      params: {}
    }
  },

  mounted () {
    this.configTypeList()
  },
  methods: {
    configTypeList () {
      this.typeList.push('text/plain')
      this.typeList.push('application/msword')
      this.typeList.push('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      this.typeList.push('application/vnd.ms-excel')
      this.typeList.push('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
      this.typeList.push('application/pdf')
      this.typeList.push('application/zip')
      this.typeList.push('application/x-rar-compressed')
    },
    submitUpload (type) {
      if (!this.fileArray.length) {

      }
    },
    clearFiles () {
      this.$refs.upload.clearFiles()
      this.fileArray = []
    },

    handleSuccess (res, file, fileList) {
      this.loading = false
      if (res.code !== 0) {
        // this.$msgMnger.httpError(res)
        this.handleError(res)
        return
      }
      this.clearFiles()
      this.$emit('uploadSuccess', res.data.upload_id)
    },
    handleError (err, file, fileList) {
      this.loading = false
      let _err = err || { message: 'Network Error' }
      // this.clearFiles()
      if (_err.error_data && _err.error_data.length) {
        let htmlStr = _err.error_data.join('<br>')
        htmlStr = `<div style="height: 200px; overflow: scroll;">${htmlStr}</div>`
        this.$alert(htmlStr, '上传失败', {
          // type: 'error',
          dangerouslyUseHTMLString: true
        })
      } else {
        this.$msgMnger.httpError(_err)
      }
    },
    checkType (file) {
      return true
      // return this.typeList.indexOf(file.raw.type) > -1 // 如果使用组件的自带的submit，通过file.type读取类型
    },
    beforeUpload (file, fileList) {
      if (fileList.length > 0) {
        let repeatLength = 0
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i].name == file.name) {
            repeatLength++
          }
        }
        if (repeatLength >= 2) {
          this.$msgMnger.warn('不能上传同名的文件!')
          return false
        }
      }
      let filesize = 0
      fileList.forEach(ele => {
        filesize += ele.size
      })
      const isLt200M = filesize / 1024 / 1024 <= 200
      // console.log(111, fileList)
      if (!this.checkType(file)) {
        this.$msgMnger.warn('不允许的文件类型!')
        return false
      }
      if (!isLt200M) {
        this.$msgMnger.warn('上传文件大小不能超过 200MB!')
        return false
      }
      // this.loading = true
      return true
    },
    beforeRemove (file, fileList) {
      this.fileArray.forEach((el, index) => {
        if (el.uid === file.uid) {
          this.fileArray.splice(index, 1)
        }
      })
    },
    onChange (file, fileList) {
      // console.log('file', file)
      if (!this.beforeUpload(file, fileList)) {
        this.customRemoveFile(file, fileList)
        return
      }
      this.fileArray = []
      fileList.forEach(item => {
        this.fileArray.push(item)
      })
    },
    customRemoveFile (file, fileList) {
      fileList.forEach((el, index) => {
        if (el.uid === file.uid) {
          fileList.splice(index, 1)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.fw600{
  font-weight:600;
}
#file-upload-comp{
  padding: 0 20px;
  text-align: left;
  .custom-upload{
    text-align: center;
    .popover-des{
      margin-left: 30px;
    }
  }
  .el-upload__tip{
    color: #999;
    font-weight: normal;
    margin-bottom:10px;
    font-family: 'PingFangSC-light';
  }
}
</style>
<style lang="scss" scoped>

#file-upload-comp{
  .custom-upload{
    .el-button{
      padding: 5px 10px;
    }
  }
}
</style>
