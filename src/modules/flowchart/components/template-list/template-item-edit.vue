<template>
  <div class="template-item" :class="{not_allowed: isBatchHandle && template.status !== 2}">
    <div class="item-top">
      <template-train-status :status="template.status"></template-train-status>
    </div>
    <div class="item-middle">
      <div class="top-info clearfloat">
        <img :src="src" alt="">
        <div>
          <el-tooltip popper-class="custom-tooltip" effect="light" :content="template.name" placement="top-start" :offset="0" :enterable="false">
            <h4>{{template.name || '--'}}</h4>
          </el-tooltip>
          <p>
            <span><i class="iconfont iconyonghu"></i>{{template.author_name}}</span>
            <span class="time">创建于：{{template.create_at ? template.create_at.slice(0, -3) : '--'}}</span>
          </p>
        </div>
      </div>
      <div class="tags">
        <span class="tags-wrap">
          <el-tag size="mini" v-for="(tag,index) in template.tags" :key="index">{{tag}}</el-tag>
        </span>
        <span v-if="!template.tags.length">暂无标签</span>
      </div>
    </div>
    <div class="item-bottom clearfloat">
      <div class="buttons" @click="editTmp">
        <span
          :class="{'disabled-style': isDisableAboutIng}"
        ><i class="iconfont iconbianji"></i></span>
      </div>
      <i class="split"></i>
      <div class="buttons" @click.stop="preView(template.status)">
        <span
          :class="{'disabled-style': isDisableAboutSuccess}"
        ><i class="iconfont iconyulan"></i></span>
      </div>
      <i class="split"></i>
      <div class="buttons" @click.stop="download(template.status)">
        <span
          :class="{'disabled-style': isDisableAboutSuccess}"
        ><i class="iconfont iconxiazai"></i></span>
      </div>
      <i class="split"></i>
      <div class="buttons" @click.stop="deleteTmp(template.status)">
        <span
          :class="{'disabled-style': isDisableAboutIng}"
        ><i class="iconfont iconshanchu"></i></span>
      </div>
      <i class="split"></i>
      <div class="buttons" @click.stop="createFromTemplate(template.status)">
        <span class="create-tmp"
          :class="{'disabled-style': isDisableAboutSuccess}">
          <i class="iconfont icontianjia"></i>
      </span>
      </div>
    </div>
  </div>
</template>

<script>
import TemplateTrainStatus from '../public/template-train-status'
export default {
  props: {
    template: Object,
    isBatchHandle: Boolean
  },
  components: {
    TemplateTrainStatus
  },
  data () {
    return {
      trainStatus: this.template.status
    }
  },
  computed: {
    src () {
      return require(`../../assets/template/${this.template.src}`)
    },
    isDisableAboutSuccess () {
      return this.template.status !== 2
    },
    isDisableAboutIng () {
      return this.template.status === 1 || this.isBatchHandle
    }
  },
  methods: {
    preView (status) {
      if (status !== 2) {
        this.$msgMnger.warn('非训练成功的模板不能预览')
        return
      }
      this.$emit('preview', this.template.id)
    },
    download (status) {
      if (status !== 2) {
        this.$msgMnger.warn('非训练成功的模板不能下载')
        return
      }
      this.$emit('download', this.template.id)
    },
    deleteTmp (status) {
      if (status === 1) {
        this.$msgMnger.warn('训练中的模板不能删除')
        return
      }
      this.$emit('deleteTmp', this.template)
    },
    createFromTemplate (status) {
      if (status !== 2) {
        this.$msgMnger.warn('非训练成功的模板不能创建')
        return
      }
      this.$emit('createFlowFile', this.template)
    },
    editTmp () {
      if (status === 1) {
        this.$msgMnger.warn('训练中的模板不能编辑')
        return
      }
      this.$emit('editTmp', this.template)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
  .template-item{
    width: 384px;
    box-sizing: border-box;
    cursor: pointer;
    color: #5F5F5F;
    border: 1px solid #e8e8e8;
    background: #fff;
    position: relative;
    .item-top{
      width: 382px;
      // margin-left: 1px;
      box-sizing: border-box;
      // box-sizing: border-box;
      // border-left: 1px solid #ccc;
      // border-right: 1px solid #ccc;
      height: 24px;
      line-height: 24px;
      padding-left: 20px;
      background: #f7f9fa;
      font-size: 12px;
    }
    .item-middle{
      padding: 24px;
      font-size: 14px;
      min-height: 180px;
      box-sizing: border-box;
      h4,p{
        padding: 0;
        margin: 0;
      }
      .iconyonghu{
        color: #1890FF;
        margin-right: 5px;
      }
      .top-info{
        text-align: left;
        img{
          width: 48px;
          height: 48px;
          border-radius: 50%;
          float: left;
          margin-right: 20px;
        }
        >div{
          float: left;
          width: 265px;
          h4{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          >p{
            margin-top: 6px;
            span:first-child{
              color: #1890FF;
            }
          }
          .time{
            // display: block;
            margin-left: 20px;
            font-size: 12px;
          }
        }
      }
      .tags{
        text-align: left;
        overflow: hidden;
        line-height: 30px;
        margin-top: 20px;
        height: 78px;
        .el-tag{
          margin-right: 5px;
        }
      }
    }
    .item-bottom{
      width: 382px;
      box-sizing: border-box;
      // margin-left: 1px;
      height: 40px;
      line-height: 40px;
      background: #f7f9fa;
      padding-bottom: 2px;
      padding-top: 2px;
      position: absolute;
      bottom: 0;
      right: 0;
      .split{
        float: left;
        height: 15px;
        width: 1px;
        background: #ccc;
        margin-top: 15px;
      }
      .buttons{
        width: 75px;
        float: left;
        cursor: pointer;
        // cursor: not-allowed;
        font-size: 14px;
        .iconfont{
          font-size: 16px !important;
        }
        .disabled-style{
          color: #D9D9D9;
          cursor: not-allowed;
        }
      }
    }
  }
  .not_allowed{
    cursor: not-allowed !important;
  }
</style>

<style lang="scss">
  .template-item{
    .el-tag{
      background: #f5f5f5;
      color: rgba(0,0,0,0.65);
      border: 1px solid #D9D9D9;
    }
  }
</style>
