<template>
  <div class="template-item">
    <!-- 头部 -->
    <div class="title">
      <el-tooltip popper-class="custom-tooltip" effect="light" :content="template.name" placement="top-start" :offset="0" :enterable="false">
        <span>{{template.name}}<i class="iconfont icon-ba-dit edit" @click.stop="editTmp"></i></span>
      </el-tooltip>
      <span v-if="!template.name">--</span>
      <!-- <span class="state" :class="getStatusClass">
        <i class="iconfont" :class="getStatusIcon"></i>
        <span>{{getTrainSatus}}</span>
      </span> -->
      <template-train-status :status="template.status"></template-train-status>
    </div>
    <!-- 作者 -->
    <p class="author">作者：{{template.author_name}}</p>
    <!-- tags -->
    <div class="tags">
      <span class="tags-wrap">
        <el-tag size="mini" v-for="(tag,index) in template.tags" :key="index">{{tag}}</el-tag>
      </span>
      <span v-if="!template.tags.length">--</span>
    </div>
    <!-- 操作 -->
    <div class="handle clearfloat">
      <span>操作：</span>
      <span @click.stop="preView(template.status)"
        :class="{'disabled-style': template.status !== 2}"
      ><i class="iconfont icon-ba-view"></i>预览</span>
      <span @click.stop="download(template.status)"
        :class="{'disabled-style': template.status !== 2}"
      ><i class="iconfont icon-ba-download"></i>下载</span>
      <span @click.stop="deleteTmp(template.status)"
        :class="{'disabled-style': template.status === 1}"
      ><i class="iconfont icon-ba-delete"></i>删除</span>
    </div>
    <!-- 时间 -->
    <div class="time">
      <span class="with-icon">
        <i class="iconfont icon-ba-time"></i>
        <span>{{template.create_at || '--'}}</span>
      </span>
      <span class="create-tmp" @click.stop="createFromTemplate(template.status)"
        :class="{'disabled-style': template.status !== 2}">
        <i class="iconfont icon-ba-plus"></i>
        <span>创建流程图</span>
      </span>
    </div>
  </div>
</template>

<script>
import TemplateTrainStatus from '../public/template-train-status'
export default {
  props: {
    template: Object
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
    getTrainSatus () {
      let _state = ['未训练过', '训练中', '训练成功', '训练失败']
      return _state[this.trainStatus]
    },
    getStatusClass () {
      let _classes = ['', 'train-success', 'train-success', 'train-failed']
      return _classes[this.trainStatus]
    },
    getStatusIcon () {
      let _classes = ['icon-ba-minus', 'icon-ba-refresh rotate-anime', 'icon-ba-circle-check-outline', 'icon-ba-circle-close-outline']
      return _classes[this.trainStatus]
    }
  },
  methods: {
    preView (status) {
      if (status !== 2) {
        this.$msgMnger.warn('非训练成功的模板不能预览')
        return
      }
      this.$emit('preview', this.template.preview)
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
      this.$emit('editTmp', this.template)
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/index.scss';
.template-item{
  box-sizing: border-box;
  display: inline-block;
  width: $tmp-list-width;
  // margin: 15px 20px;
  padding: 10px 20px;
  // border-radius: 10px;
  font-size: $tmp-list-font-size;
  text-align: left;
  // box-shadow: 1px 1px 5px 2px $tertiary-bg-color !important;
  cursor: pointer;
  color: $tmp-list-color;
  // &:hover{
  //   background: #f9f9f9;
  //   box-shadow: 1px 1px 5px 2px $tmp-list-hover-border !important;
  // }
  .iconfont{
    margin-right: 3px;
  }
  .title{
    text-align: left;
    padding-right: 70px;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
    color: $sedondary-text-color;
    font-weight: bold;
    .template-train-status{
        i, span{
          float: right !important;
        }
      }
    .edit{
      margin-left: 10px;
      cursor: pointer;
    }
    .state{
      position: absolute;
      right: 0px;
      top: 0px;
      color: $--color-info;
      // overflow: hidden;
      &.train-failed{
        color: $--color-danger;
      }
      &.train-success{
        color: $--color-success;
      }
      i, span{
        float: left;
      }
      i{
        font-size: 20px;
      }
    }
    .rotate-anime{
      -webkit-animation: spin 1s linear 1s 5 alternate;
      animation: spin 1s linear infinite;
    }
  }
  .tags{
    overflow: hidden;
    line-height: 30px;
    .el-tag{
      margin-right: 5px;
    }
  }
  .disabled-style{
    color: #ccc !important;
  }
  .handle{
    line-height: 30px;
    span{
      float: left;
      cursor: pointer;
      margin-right: 10px;
    }
    i{
      font-size: 12px !important;
      margin-right: 5px;
    }
  }
  .time{
    display: block;
    line-height: 30px;
    overflow: hidden;
    color: $sedondary-text-color;
    .with-icon{
      float: left;
      i, span{
        float: left;
      }
      i{
        font-size: 16px
      }
    }
    .create-tmp{
      float: right;
      margin-right: 0;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
  }
}
</style>
<style lang="scss">
@import '@/styles/index.scss';
.edit-template-item-dialog-class{
  .part{
    padding: 5px 20px;
    text-align: center;
    font-size: 12px;
    &.train-model-sub-text{
      color: $sedondary-text-color;
    }
  }
  .part4{
    text-align: left;
    .top{
      .template-title-input{
        width: 400px;
        margin-left: 10px;
        .el-input__inner{
          border: none !important;
          border-bottom: 1px solid $seprator-line-color !important;
          border-radius: 0 !important;
          padding: 0 !important;
        }
      }
    }
    .bottom{
      margin-top: 20px;
      overflow: hidden;
      >span{
        float: left;
      }
      .template-checkbox{
        width: 450px; // 实际剩余宽度为460
      }
    }
  }
}
.template-item{
  .tags{
    .tags-wrap .el-tag{
      // margin-left: 5px !important;
      line-height: 17px !important;
      &:first-child{
        margin-left: 0 !important;
      }
    }
  }
  .template-train-status{
    position: absolute;
    right: 0;
  }
}
</style>
