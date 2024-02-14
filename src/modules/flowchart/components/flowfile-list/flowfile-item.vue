<!-- 列表组件 -->
<template>
  <el-row
    id="flowfile-item"
    :fullscreen="false"
    element-loading-spinner="el-icon-loading"
    element-loading-text="文件加载中"
    >
    <div class="item-click-shade" @click="showFile"></div>
    <el-col :span="2" class="thumbnail">
      <div v-if="flowfile.img" class="thumbnail-block has-thumbnail" @click="showPreview">
        <img :src="previewSrc" alt=""/>
      </div>
      <div v-else class="thumbnail-block">
        <img src="../../assets/without-img.svg">
        <span class="without-img-txt">暂无图片</span>
      </div>
    </el-col>
    <el-col :span="4" class="file overflow-hidden">
      <div class="title overflow-hidden" :title="flowfile.title ? flowfile.title : ''">
        <span v-if="flowfile.title.trim()">{{flowfile.title}}</span>
        <span v-else>--</span>
      </div>
    </el-col>
    <el-col :span="3" class="author">
      <div class="title">{{flowfile.author}}</div>
    </el-col>
    <el-col :span="6" class="tags">
      <el-scrollbar>
        <div class="tags-container">
          <el-tag size="mini" v-for="(tag, index) in flowfile.tags" :key="index">{{tag}}</el-tag>
          <span v-if="!flowfile.tags">--</span>
        </div>
      </el-scrollbar>
    </el-col>
    <el-col :span="4" class="time">
      <span>
        <!-- <i class="el-icon-time"></i> -->
        <span v-if="flowfile.time">{{flowfile.time}}</span>
        <span v-if="!flowfile.time">--</span>
      </span>
    </el-col>
    <el-col :span="5" class="actions">
      <span class="action" v-for="(item, index) in actions" :key="index" @click="clickEvent(item)">
        <i class="iconfont" :class="item.icon"></i>
        <span>{{item.t}}</span>
      </span>
    </el-col>
    <flowFile-dialog
      ref="flowFileItemDialog"
      width="30%"
      :title="dlgConfig.title"
      :btn1="dlgConfig.btn1"
      :btn2="dlgConfig.btn2"
      :btn3="dlgConfig.btn3"
      :showClose="true"
      @clickBtn1="handleClickBtn1"
      @clickBtn2="handleClickBtn2"
      @clickBtn3="handleClickBtn3"
      @beforeClose="closeDialog"
      >
      <!-- 修改文件dialog -->
      <update-file
        slot="one"
        ref="showTag"
        @addTags="addTags"
        :inputRT="this.flowfile.title"
        :tagList="tagList"
        v-if="this.currentEvent === 'update'">
      </update-file>
      <!-- 下载文件dialog -->
      <download-file
        slot="two"
        :title="flowfile.title"
        @chooseType='chooseType'
        v-if="this.currentEvent === 'download'">
      </download-file>
      <!-- 删除文件dialog -->
      <delete-file
        slot="three"
        :inputRT="this.flowfile.title"
        v-if="this.currentEvent === 'delete'">
      </delete-file>
      <!-- 预览文件dialog -->
      <preview-img
        slot="four"
        :preview="flowfile.img"
        v-if="showImg">
      </preview-img>
    </flowFile-dialog>
  </el-row>
</template>

<script>
import FlowFileDialog from '../public/flowfile-dialog'
import UpdateFile from './update-file'
import DownloadFile from './download-file'
import DeleteFile from './delete-file'
import PreviewImg from './preview-img'

export default {
  props: ['flowfile', 'tagList'],
  components: {
    FlowFileDialog,
    UpdateFile,
    DownloadFile,
    DeleteFile,
    PreviewImg
  },
  computed: {
    previewSrc () {
      return `/api/v2/fc/file/${this.flowfile.img.id}/${this.flowfile.img.key}`
    }
  },
  data () {
    return {
      currentEvent: '',
      inputRT: '',
      checkedTagsV: [], // 要缓存，否则dialog关闭后通过ref获取不到checked内容
      inputValue: '',
      fileTag: [],
      dlgConfig: {},
      dlgConfigs: {
        'update': {
          title: '文件信息',
          btn1: { title: '取 消' },
          btn2: { title: '保 存' },
          btn3: null,
          checkedTags: []
        },
        'download': {
          title: '下载',
          btn1: { title: '取 消' },
          btn2: { title: '下 载' },
          btn3: null
        },
        'delete': {
          title: '删除',
          btn1: { title: '取 消' },
          btn2: null,
          btn3: { title: '删 除' }
        },
        'preview': {
          title: '预览',
          btn1: null,
          btn2: null,
          btn3: null
        }
      },
      actions: [
        { key: 'update', t: '修改文件信息', icon: 'iconbianji' },
        // { key: 'download', t: '下载', icon: 'iconxiazai' },
        { key: 'delete', t: '删除', icon: 'iconshanchu' }
      ],
      tipTag: '',
      showImg: false,
      type: ''
    }
  },
  watch: {
  },
  mounted () {
    this.tipTag = this.flowfile.tags.join(',')
  },
  methods: {
    getPreviewImg () {
      return this.flowfile.img || require('../../assets/preview-img-default.png')
    },
    showFile () { // 点击文件打开
      this.$router.push({
        name: 'fc-flowfile-edit',
        params: {
          flowfileId: this.flowfile.id
        }
      })
    },
    clickEvent (item) {
      this.currentEvent = item.key
      this.dlgConfig = JSON.parse(JSON.stringify(this.dlgConfigs[item.key]))
      if (item.key === 'update') {
        this.checkedTagsV = [...this.flowfile.tags]
        this.$nextTick(() => {
          this.$refs.showTag.$refs.titleTags.$refs.tagsBar.updateTags(this.checkedTagsV)
        })
        this.$refs.flowFileItemDialog.updateVisible(true, { event: item.key })
      } else if (item.key === 'download') {
        this.$refs.flowFileItemDialog.updateVisible(true, { event: item.key })
      } else {
        this.$refs.flowFileItemDialog.updateVisible(true, { event: item.key })
      }
    },
    handleClickBtn1 () {
      if (this.currentEvent === 'update') {
        this.$refs.showTag.$refs.titleTags && this.$refs.showTag.$refs.titleTags.$refs.tagsBar.updateTags([])
        this.$refs.showTag.$refs.titleTags.inputD = this.flowfile.title
      }
    },
    handleClickBtn2 (data) {
      if (data.event === 'download') {
        this.toDownload()
      } else if (data.event === 'update') {
        if (!this.$refs.showTag.$refs.titleTags.inputD) {
          this.$msgMnger.warn('报告名称不能为空')
          return
        }
        if (!this.$refs.showTag.$refs.titleTags.inputD.trim()) {
          this.$msgMnger.warn('报告名称不能全部由空格组成')
          return
        }
        this.inputRT = this.$refs.showTag.$refs.titleTags.inputD
        this.checkedTagsV = this.$refs.showTag.$refs.titleTags.$refs.tagsBar.dynamicTags
        this.$nextTick(() => {
          this.updateFile()
        })
      }
    },
    handleClickBtn3 (data) { // 删除按钮
      if (data.event === 'delete') {
        this.delFile()
      }
    },
    delFile () { // 删除文件接口
      let id = this.flowfile.id
      this.$api.deleteFlowList(id).then(res => {
        this.$msgMnger.success('删除成功')
        this.$emit('newList')
      }).catch(err => {
        this.$msgMnger.httpError(err)
      })
    },
    chooseType (type) {
      this.type = type
    },
    toDownload () { // 下载文件接口,还未对接
      let id = this.flowfile.id
      let type = this.type
      this.$api.downloadFile(id, type).then(res => {
        if (res.code === 0 || res.code === -1) {
          this.$msgMnger.warn('系统出错')
        }
        if (res.code === 113) {
          this.$msgMnger.warn('暂未生成可下载内容')
        }
        if (res.code === 110) {
          this.$msgMnger.warn('流程不存在')
        }

        if (!res.code) {
          window.open(`/api/v2/fc/flow/${id}/${type}`)
        }
      }).catch(err => {
        this.$msgMnger.warn(err.msg)
      })
    },
    updateFile () { // 修改文件接口
      let id = this.flowfile.id
      // if (this.checkedTagsV.length > 5) {
      //   this.$msgMnger.warn('最多添加5个标签')
      //   return
      // }
      let params = {
        name: this.inputRT,
        tags: this.checkedTagsV.join(',')
      }
      if (params.name.length > 40) {
        this.$msgMnger.warn('文件标题字数超出限制')
        return
      }
      this.$api.updateFile(id, params).then(res => {
        this.$refs.flowFileItemDialog.dialogVisible = false
        this.$emit('newList')
        this.$msgMnger.success('更新成功')
      }).catch(err => {
        this.$msgMnger.httpError(err)
      })
    },
    addTags (item) { // 点击添加常用tag
      if (this.$refs.showTag.$refs.titleTags.$refs.tagsBar.dynamicTags.indexOf(item) > -1) {
        this.$msgMnger.warn('标签不允许重复')
        return
      }
      if (this.$refs.showTag.$refs.titleTags.$refs.tagsBar.dynamicTags.length > 5 - 1) {
        this.$msgMnger.warn('最多可添加5个标签')
        return
      }
      this.$refs.showTag.$refs.titleTags.$refs.tagsBar.dynamicTags.push(item)
    },
    showPreview () {
      this.dlgConfig = JSON.parse(JSON.stringify(this.dlgConfigs['preview']))
      this.$refs.flowFileItemDialog.updateVisible(true)
      this.showImg = true
      this.currentEvent = ''
    },
    closeDialog () {
      this.showImg = false
    }
  }
}
</script>

<style lang='scss' scoped>
@import '@/styles/index.scss';
#flowfile-item{
  height: 60px;
  font-size: 14px;
  border-bottom: 1px solid #dee2e8;
  color: $tmp-list-icon-color;
  position: relative;
  .item-click-shade{
    position: absolute;
    height: 100%;
    width: 70.83%;
    top: 0;
    left: 8.33%;
    cursor: pointer;
  }
  .el-col{
    height: 100%;
    line-height: 60px;
  }
  .thumbnail{
    line-height: normal;
    .thumbnail-block{
      width: 60px;
      height: 50px;
      border-radius: 4px;
      background: $tertiary-bg-color;
      margin: 5px;
      padding: 5px;
      box-sizing: border-box;
      cursor: pointer;
      &:hover{
        opacity: 0.7;
      }
      img{
        width: 30px;
        height: 30px;
      }
      .without-img-txt{
        display: block;
        font-size: 12px;
        margin-top: -8px;
      }
      &.has-thumbnail{
        padding: 5px;
        img{
          width: auto;
          height: auto;
          max-width: 40px;
          max-height: 40px;
        }
      }
    }
  }
  .file{
    text-align: left;
    display: flex;
    align-items: center;
    .title{
      /*display: table-cell;*/
      /*vertical-align: middle;*/
      line-height: 20px;
    }
  }
  .author{
    .title{
      top: 50px;
      left: 0;
    }
  }
  .tags{
    overflow: hidden;
    .el-tag{
      margin: 0 5px;
    }
  }
  .time{
  }
  .actions{
    .action{
      cursor: pointer;
      height: 14px;
      &:not(:first-child){
        margin-left: 10px;
        border-left: 2px solid $seprator-line-color;
        padding-left: 10px;
      }
      &:hover{
        opacity: 0.7;
        color: $primary-color;
      }
      i{
        margin-right: 5px;
      }
    }
  }
}
</style>
<style lang="scss">
#flowfile-item{
  .tags{
    .el-scrollbar{
      height: 100%;
      text-align: center;
      .el-scrollbar__wrap .el-scrollbar__view{
        height: 100%;
        width: 100%;
        display: table;
        .tags-container{
          display: table-cell;
          vertical-align: middle;
          line-height: 24px;
          .el-tag{
          }
        }
      }
    }
  }
  .overflow-hidden {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.el-dialog{
  text-align: left;
}
// .el-tag + .el-tag {
//   margin-left: 10px;
// }
.el-dialog .el-dialog__body {
  text-align: center;
}
.el-form-item__content {
  text-align: center;
}
.el-form-item__content {
  text-align: left;
}
.input-new-tag .el-autocomplete-suggestion__wrap .el-scrollbar__wrap {
  margin-bottom: 0 !important;
  padding: 5px 0 !important;
}
</style>
