<!--  -->
<template>
  <div class="template-train-filelist">
    <div class="content-title">
      <span class="title-name"><i class="iconfont iconwenjianliebiao"></i>文件列表</span>
      <el-button class="train-btn" size="mini" icon="el-icon-refresh" type="primary" :disabled="!trainBtnEnabled" @click="templateTrainClick">训练模板</el-button>
    </div>
    <el-scrollbar slot="first" class="list-scrollbar"
      v-loading="listLoading"
      element-loading-text="训练中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.5)"
    >
      <!-- 文件列表 -->
      <base-filelist
        :dataList="fileList"
        @deleteVisio="deleteVisio"
        @changeCheckedVisioSheets="changeCheckedVisioSheets"/>
    </el-scrollbar>
  </div>
</template>

<script>
import BaseFilelist from './base-filelist'
export default {
  props: {
    fileList: {
      default: () => []
    },
    templateDetail: {
      default: () => {}
    },
    listLoading: {
      default: false
    }
  },
  components: {
    BaseFilelist
  },
  data () {
    return {
      checkedVisioSheets: [],
      hasCheckedSheet: false
    }
  },
  methods: {
    deleteVisio (vid) {
      this.$emit('changeLoadingStatus', true, '正在删除...')
      let { id } = this.templateDetail
      this.$api.deleteVisio(id, vid).then(data => {
        if (data.code === 0) {
          this.$emit('deleteVisio', vid)
        }
        this.$emit('changeLoadingStatus')
      })
    },
    templateTrainClick () {
      if (!this.hasCheckedSheet) {
        this.$msgMnger.warn('请先选择页签')
        return
      }
      this.$emit('getTemplateStatus', false) // 关闭定时器
      this.$emit('changeShowTips', false) // 关闭提示并清空提示信息
      let { id } = this.templateDetail
      this.$api.templateTrain(id, { visio: JSON.stringify(this.checkedVisioSheets) }).then(data => {
        this.$emit('getTemplateDetail')
        this.$emit('getTemplateStatus', true)
        this.$emit('changeShowTips', true)
      }).catch(e => {
        this.$emit('getTemplateDetail')
        this.$emit('getTemplateStatus', true)
      })
    },
    changeCheckedVisioSheets (s, hasChecked) {
      this.checkedVisioSheets = s
      this.hasCheckedSheet = hasChecked
    }
  },
  computed: {
    trainBtnEnabled () {
      let { status } = this.templateDetail
      return this.fileList.length > 0 && this.hasCheckedSheet && (status !== 1)
    }
  }
}
</script>

<style lang='scss'>
.template-train-filelist{
  height: 100%;
  .content-title{
    border-bottom: 1px solid #dcdcdc;
    padding: 20px;
    text-align: left;
    .title-name{
      >i{
        margin-right: 5px;
        color: #D06302;
      }
    }
    .train-btn{
      float: right;
      margin: -5px 0 0 0;
    }
  }
  .list-scrollbar{
    height: calc(100% - 60px);
  }
}
</style>
