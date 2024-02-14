<template>
    <div>
      <div class="wrapper">
            <div>
                选择要上传到的现有文件夹：
                <el-select  class="flodselect" clearable  v-model="flodId" placeholder="请选择所属部门">
                    <el-option v-for="it in flodList" :key="it.id" :label="it.name" :value="it.id"></el-option>
                </el-select>
            </div>

            <div class="directoryup ">
                <i class="el-icon-plus dircicon"></i>
                <div class="">请选择所属部门</div>
                <input type="file" class="direcinput" mutiple accept="" @change="getFiles" directory
                mozdirectory webkitdirectory>
            </div>
            <div class="mb10">
                <el-button type="primary" @click="showdirecClick()">文件夹上传</el-button>
            </div>

            <div class="listShow">
                <div class="uldiv" v-for="it in filedircList" :key="it.name">
                    <span>{{it.name}}</span>
                    <i class="el-icon-delete" @click="deleteFiles(it)"></i>
                </div>
            </div>

            <div class="uploads">
                <el-upload action="#" drag :auto-upload="false" accept=".vsdx"
                :on-change="changeLoad" multiple :show-file-list="false"
                :file-list="fileList"
                >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
            </div>
            <div class="listShow">
                <div class="uldiv" v-for="it in fileList" :key="it.name">
                    <span>{{it.name}}</span>
                    <i class="el-icon-delete" @click="deleteFile(it)"></i>
                </div>
            </div>
            <div class="mb10">
                <el-button type="primary" @click="showClick" :disabled="isDirectory">确定单文件上传</el-button>
            </div>
      </div>
        <flowfile-edit-container
        class="flowfile-edit-container"
        ref="flowfileEditContainer"
        iframeName="iframe2"
         @fileData="handleSaveXmlOrImgFromDrawio"
        @receiveXml="receiveXml"
        @drawioState="handleDrawioState"
        ></flowfile-edit-container>
    </div>
</template>

<script>
import FlowfileEditContainer from '@/modules/flowchart/components/flowfile-edit/flowfile-edit-container'
import { mapGetters } from 'vuex'
export default {
  components: {
    FlowfileEditContainer
  },
  computed: {
    ...mapGetters(['currentDataSpaceIdGetter', 'currentDataSpaceGetter', 'columnPropsGetter'])
  },
  data () {
    return {
      flodId: '',
      flodList: [],
      fileList: [],
      filedircList: [],
      drawIOFlag: 1,
      currentFileName: '',
      drawIOState: false, // 当前页面的 drawIO 加载状态
      isDirectory: false,
      currentFileId: ''// 流程图Id
    }
  },
  mounted () {
    this.getFlodS()
  },
  methods: {
    // 获取流程文件夹
    getFlodS () {
      this.$api.getUserFolder({ companyId: this.currentDataSpaceIdGetter }).then(res => {
        this.flodList = res.data
      }).catch(err => {
        this.$msgMnger.httpError(err)
      })
    },
    // 单个文件上传
    changeLoad (file, fileList) {
      let arrs = this.fileList.length ? this.fileList.find(v => v.name == file.name || v.uid == file.uid) : ''
      if (!arrs) {
        this.fileList.push(file.raw)
      }
    },
    // 删除单个文件
    deleteFile (row) {
      this.fileList = this.fileList.filter(v => v.uid != row.uid)
    },
    // 确定上传文件
    showClick () {
      if (!this.flodId) {
        this.$msgMnger.warn('请先选择要到的文件夹')
        return
      }
      if (this.isDirectory) {
        return
      }
      console.log(this.fileList, 1)
      if (this.fileList.length > 0) {
        this.isDirectory = false
        this.addFile(this.fileList[this.fileList.length - 1])
      }
      // for(let i = 0;i<this.fileList.length;i++){
      // }
    },
    addFile (file) {
      // 若此时 drawIO 没有加载完成
      // if (!this.drawIOState) {
      //     this.$msgMnger.warn('加载中, 请等待')
      //     return
      // }
      let arr = file.name.split('.')
      let showname = arr.filter(v => v != 'vsdx').join('')
      let params = {
        name: showname,
        folder_id: this.flodId,
        company_id: this.currentDataSpaceIdGetter
      }
      this.$api.createFlowFile(params).then((res) => {
        if (res.code == 0) {
          this.currentFileId = res.flow_id
          this.currentFileName = file.name
          let _file = {
            format: 'vsdx',
            data: file,
            filename: file.name
          }
          this.$refs['flowfileEditContainer'].importFileData(_file)
        }
      }).catch((err) => {
        this.$msgMnger.httpError(err)
      })
    },
    receiveXml ({ xml }) {
      // 触发事件, 告诉 flowfile-edit 当前从哪处导入
      this.$emit('import-from-event', { from: 'local' })
      this.xml = xml
      // this.changeLoadingStatus(true, '正在上传，请稍后...')
      let { flowfileId } = this.$route.params
      // this.$api.manyFileupload(18,)
      this.$api.manyFileupload(this.currentFileId, { visio: xml, file_name: this.currentFileName }).then(data => {
        // this.$api.flowUploadVisio(flowfileId, { visio: xml, file_name: this.currentFileName }).then(data => {
        // this.loading = false
        if (data.data.success.length === 0 && data.data.fail.length === 0) {
          this.$msgMnger.error('无数据!请检查您上传的Visio文件!')
          return false
        }
        data.data.success.forEach(v => {
          this.$api.saveDraverio(this.currentFileId,
            { hint: JSON.stringify([{ label: v.page_info.name || v.name, warn: [], page: v.page_info.id }]),
              drawio_id: data.drawio_id,
              style_config: JSON.stringify({ graphSize: {
                diamond: [100, 60]
              } }) })
          // this.$api.manyFilePageDat(this.currentFileId, v.page_info.id).then(res=>{
          //     if(res.code == 0){
          //         this.$api.savePageNExcelData(this.currentFileId, {
          //             flow_id: this.currentFileId,
          //             page_id: v.page_info.id,
          //             name: v.page_info.name||v.name,
          //             data: JSON.stringify(res.data),
          //             title_type: 'initKPMGCrossFunctionFlow',
          //             save: 'save'
          //         })
          //     }
          // })
        })

        this.$msgMnger.success('上传成功！')
        this.reloadIframe()
        this.drawIOState = true
        if (this.isDirectory) {
          this.filedircList = this.filedircList.filter(v => v.name != this.currentFileName)
          if (this.filedircList.length > 0) {
            this.isDirectory = true
            this.currentFileName = ''
            this.currentFileId = ''
            this.addFile(this.filedircList[this.filedircList.length - 1])
          } else {
            this.isDirectory = false
          }
        } else {
          this.fileList = this.fileList.filter(v => v.name != this.currentFileName)
          if (this.fileList.length > 0) {
            this.currentFileName = ''
            this.currentFileId = ''
            this.addFile(this.fileList[this.fileList.length - 1])
          }
        }
      }).catch(e => {
        this.reloadIframe() // 刷新iframe，目的是重置sheets
        // this.loading = false
        this.$msgMnger.httpError(e)
      })
    },
    handleSaveXmlOrImgFromDrawio (params) {
      // 接收到从drawIO传回的消息，params格式为{ format: String, filename: String, data: String }
      // 保存xml和png
      // let _params = {}
      // _params.drawio = params.data
      // _params.hint = params.data
      // _params.style_config = params.data
      // _params.format = 'xml'
      // this.$api.saveDraverio(this.currentFileId,_params)

    },
    handleDrawioState () {
      // 监听到 drawIO 加载状态改变
      // 1. 改变状态
      // this.drawIOState = true
      // this.fileList = this.fileList.filter(v=> v.name!=this.currentFileName)
      // if(this.fileList.length>0){
      //     this.currentFileName = ''
      //     this.addFile(this.fileList[this.fileList.length-1])
      // }

    },
    reloadIframe () {
      this.drawIOFlag = 0
      this.drawIOState = false // 重置 drawIO 加载状态
      this.$nextTick(() => {
        this.drawIOFlag = 1
      })
    },
    // 上传文件夹
    getFiles (e) {
      let arrs = e.target.files
      this.filedircList = this.filedircList.concat([...arrs])
    },
    // 删除
    deleteFiles (row) {
      this.filedircList = this.filedircList.filter(v => v.webkitRelativePath != row.webkitRelativePath)
    },
    // 确定上传文件夹
    showdirecClick () {
      if (!this.flodId) {
        this.$msgMnger.warn('请先选择要到的文件夹')
        return
      }
      if (this.filedircList.length > 0) {
        this.isDirectory = true
        this.addFile(this.filedircList[this.filedircList.length - 1])
      } else {
        this.isDirectory = false
      }
      console.log(this.filedircList, 2)
    }
  }
}
</script>

<style lang="scss" scoped>
.mb10{
    margin-bottom:10px;
}
.wrapper{
    padding-top:20px;
}
.dircicon{
    margin-top:20px;
}
.flowfile-edit-container{
    visibility: hidden;
}
.listShow{
    width:500px;
    max-height:500px;
    overflow: auto;
    margin:0 auto;
    .uldiv{
        margin:10px;
        font-size: 18px;
        i{
            display: inline-block;
            margin-left:10px;
            color:red;
            cursor:pointer;
        }
    }
}
.directoryup{
    position:relative;
    margin:20px auto;
    width:100px;
    height:100px;
    border:1px solid #ccc;
    .direcinput{
        width:100%;
        height:100%;
        opacity:0;
        position: absolute;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%)
    }
    .addicon{
        font-size: 20px;
        position: absolute;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%)
    }
}
.uploads{
    width:500px;
    margin:0 auto;
}
</style>
