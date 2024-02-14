<!--  -->
<template>
  <div class="page-header">
    <div class="page-header-back">
      <span @click="back">
        <i class="iconfont iconfanhui"></i>
        训练模板
      </span>
    </div>
    <el-row class="fileMsg" :gutter="20">
      <el-col :span="6">
        <el-tooltip
          popper-class="custom-tooltip"
          effect="light"
          :content="details.name"
          placement="top-start"
          :offset="0"
          :enterable="false"
          :disabled="getNameTooltipDisable()">
          <div class="fileName text-ellipsis">{{details.name}}</div>
        </el-tooltip>
        <span class="el-icon-edit" @click="modifyInfo"></span>
      </el-col>
      <el-col :span="statusTips ? 16 : 10">
        <el-popover
          placement="bottom"
          width="200"
          trigger="hover"
          v-if="statusTips"
          :disabled="statusTips.length < 30"
          :content="statusTips">
          <div slot="reference" class="train-status-reason">
            {{statusTips}}
          </div>
        </el-popover>
      </el-col>
      <el-col :span="statusTips ? 2 : 8" class="page-header-actions" v-if="details.status === 2">
        <!-- <span>操作:</span> -->
        <span v-for="(item, index) in actions" :key="index" class="cursor page-header-actions-item" @click="operationClick(item)">
          <span :class="item.icon"></span>
          {{item.k}}
        </span>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="grey">
      <el-col :span="6">
        <div class="fileMsg-author text-ellipsis">创建人：{{details.author_name || '--'}}</div>
      </el-col>
      <el-col :span="18">创建时间：{{details.create_at}}</el-col>
    </el-row>
    <el-row :gutter="20" class="grey">
      <el-col :span="24">
        <div class="page-header-tags-div text-ellipsis">
          标签：
          <span class="page-header-tags" v-if="details.tags && details.tags.length > 0">
            <el-tag size="mini" v-for="(tag, index) in details.tags" :key="index">{{tag}}</el-tag>
          </span>
          <span v-if="!details.tags || !details.tags.length">--</span>
        </div>
      </el-col>
    </el-row>
    <el-popover
      placement="bottom-end"
      width="200"
      trigger="hover"
      :disabled="!templateStatusData.reason"
      :content="templateStatusData.reason">
      <div slot="reference" class="train-status">
        <div class="grey">状态</div>
        <template-train-status :status="templateStatusData.status || details.status || 0"/>
      </div>
    </el-popover>
    <flowfile-dialog
      ref="flowFileItemDialog"
      width="320px"
      :title="dlgConfigs.title"
      :btn1="dlgConfigs.btn1"
      :btn2="dlgConfigs.btn2"
      :showClose="true"
      @clickBtn2="btn2Handle"
    >
      <update-file
        slot="one"
        ref="showTag"
        @addTags="addTags"
        :inputRT="dlgConfigs.inputRT"
        :tagList="tmpTags"
      />
    </flowfile-dialog>
    <!-- 新建流程弹框 -->
    <flowfile-creat ref="flowfile-creat" :templateId="details.id"/>
    <template-preview ref="templatePreview"/>
  </div>
</template>

<script>
import TemplateTrainStatus from '../public/template-train-status'
import FlowfileDialog from '../../components/public/flowfile-dialog'
import UpdateFile from '../../components/flowfile-list/update-file'
import FlowfileCreat from '../public/flowfile-creat'
import TemplatePreview from './template-preview'
import { mapGetters, mapActions } from 'vuex'
export default {
  components: {
    TemplateTrainStatus,
    FlowfileDialog,
    UpdateFile,
    FlowfileCreat,
    TemplatePreview
  },
  props: {
    details: {
      default: () => {}
    },
    status: Number
  },
  data () {
    return {
      hasModify: true,
      actions: [
        { k: '预览', icon: 'el-icon-view', event: this.preview },
        { k: '下载', icon: 'el-icon-download', event: this.download },
        { k: '创建流程图', icon: 'el-icon-folder-add', event: this.creat }
      ],
      trainBtn: ['训练模板', '训练模板', '重新训练'],
      dlgConfigs: {
        title: '编辑模板',
        btn1: { title: '取 消' },
        btn2: { title: '保 存' },
        checkedTags: [],
        inputRT: ''
      },
      timeInterval: null,
      templateStatusData: {},
      showTips: false,
      isTraining: false
    }
  },
  methods: {
    ...mapActions({
      getTags: 'UPDATE_FLOWTEMP_TAGS'
    }),
    getNameTooltipDisable () {
      if (!this.details.name) {
        return true
      }
      return Boolean(this.details.name.length <= 15)
    },
    back () { // 返回
      this.$router.push({ name: 'fc-template-list' })
    },
    modifyInfo () { // 修改文件名称
      this.$refs.flowFileItemDialog.updateVisible(true).useFooter()
      this.$nextTick(() => {
        this.$refs.showTag.$refs.titleTags && this.$refs.showTag.$refs.titleTags.$refs.tagsBar.updateTags(this.details.tags)
      })
    },
    btn2Handle () {
      this.$emit('changeLoadingStatus', true, '修改中...')
      this.$emit('')
      const name = this.$refs.showTag.$refs.titleTags.inputD
      const tags = this.$refs.showTag.$refs.titleTags.$refs.tagsBar.dynamicTags.join(',')
      this.$api.editTmp(this.details.id, name, tags).then(res => {
        this.$refs.flowFileItemDialog.dialogVisible = false
        this.$emit('changeLoadingStatus')
        this.$emit('getTemplateDetail')
        this.$msgMnger.success('修改成功')
        // 清空回填的状态
        // this.$refs.showTag && this.$refs.showTag.$refs.titleTags.$refs.tagsBar.updateTags([])
        // this.$refs.showTag.$refs.titleTags.inputD = ''
      }).catch(err => {
        this.$emit('changeLoadingStatus')
        this.$msgMnger.httpError(err)
      })
    },
    operationClick (item) {
      item.event()
    },
    preview () {
      this.$refs.templatePreview.updateTemplatePreview(this.details.id)
    },
    download () {
      window.open(`/api/v2/fc/template/down/${this.details.id}?_token=${this.token}`)
    },
    creat () {
      this.$refs['flowfile-creat'].$refs['flowFileItemDialog'].updateVisible(true)
    },
    addTags (item) {
      if (this.$refs.showTag.$refs.titleTags.$refs.tagsBar.dynamicTags.indexOf(item) > -1) {
        this.$msgMnger.warn('标签不允许重复')
        return
      }
      if (this.$refs.showTag.$refs.titleTags.$refs.tagsBar.dynamicTags.length > 4) {
        this.$msgMnger.warn('最多可添加5个标签')
        return
      }
      this.$refs.showTag.$refs.titleTags.$refs.tagsBar.dynamicTags.push(item)
    },
    updateTraining (bool) {
      this.isTraining = bool
    },
    getTemplateStatus (timerSwitch) {
      let { templateId } = this.$route.params
      if (timerSwitch) { // 开启定时器
        if (this.timeInterval) {
          this.updateTraining(false)
          return
        }
        this.timeInterval = setInterval(() => {
          this.$api.getTemplateStatus(this.details.id || templateId).then(data => {
            this.templateStatusData = data.data
            this.$emit('changeTemplateStatus', data.data)
            if (data.data.status !== 1) { // 如果不是进行中，则停止定时器
              this.getTemplateStatus(false)
              if (this.isTraining && data.data.status === 2) {
                this.preview()
                this.updateTraining(false)
              }
            }
          }).catch(err => {
            this.$msgMnger.httpError(err)
            this.updateTraining(false)
          })
        }, 2000)
      } else {
        this.timeInterval && clearInterval(this.timeInterval)
        this.timeInterval = null
      }
    },
    changeShowTips (showTips) {
      if (!showTips) {
        this.templateStatusData = {}
      }
      this.showTips = showTips
    }
  },
  mounted () {
    // this.$store.dispatch('UPDATE_TMP_TAGS', { context: this })
    this.getTags({ context: this })
    this.getTemplateStatus(true)
  },
  beforeDestroy () {
    this.getTemplateStatus(false)
  },
  computed: {
    ...mapGetters({
      tmpTags: 'flowtempTags',
      token: 'token'
    }),
    statusTips () {
      let { reason } = this.templateStatusData
      console.log(this.templateStatusData)
      return reason || this.details.reason
    }
  },
  watch: {
    details: {
      handler (details) {
        this.dlgConfigs.checkedTags = details.tags
        this.dlgConfigs.inputRT = details.name
      },
      deep: true
    }
  }
}
</script>

<style lang='scss'>
@import '@/styles/index.scss';
.page-header{
  text-align: left;
  background: #fff;
  padding: 20px;
  position: relative;
  .page-header-back{
    cursor: pointer;
    font-size: 16px;
    &:hover{
      color: $primary-color;
    }
    .iconfanhui{
      font-size: 16px!important;
    }
  }
  .train-status{
    position: absolute;
    right: 20px;
    top: 100px;
    >div{
      text-align: right;
    }
  }
  .fileMsg{
    margin-bottom: 10px;
    margin-top: 20px;
    .el-col{
      &::after{
        content: "";
        display: inline-block;
      }
    }
    .fileName{
      max-width: 90%;
      font-size: 16px;
    }
    .fileMsg-author {
      max-width: 100%;
    }
    .el-icon-edit{
      cursor: pointer;
      margin: 0px 0 2px 10px;
      overflow: hidden;
      &:hover{
        color: #2ABBD4;
      }
    }
    .modify-input{
      width: 100px;
    }
    .train-status-reason{
      overflow: hidden;
      display: inline-block;
      width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #f56c6c;
    }
  }
  .page-header-tags-div{
    max-width: 93%;
    overflow: hidden;
    .page-header-tags .el-tag{
      margin: 0 5px 0 0;
    }
  }
  .page-header-actions{
    text-align: right;
    font-size: 12px;
    padding: 10px 0 0 0;
    .page-header-actions-item{
      border: 1px solid #D9D9D9;
      border-radius: 3px;
      padding: 5px 10px;
      &:last-child{
        background: $primary-color;
        border: none;
        color: #fff;
      }
    }
  }
}
.grey{
  color: $tertiary-text-color;
}
</style>
