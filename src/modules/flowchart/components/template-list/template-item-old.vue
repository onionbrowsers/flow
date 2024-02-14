<template>
  <div class="template-item">
    <!-- 头部 -->
    <div class="title">
      <el-tooltip popper-class="custom-tooltip" effect="light" :content="template.name" placement="top-start" :offset="0" :enterable="false">
        <span>{{template.name}}</span>
      </el-tooltip>
      <span v-if="!template.name">--</span>
      <span class="state" :class="getStatusClass">
        <i class="iconfont" :class="getStatusIcon"></i>
        <span>{{getTrainSatus}}</span>
      </span>
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
    <!-- 时间 -->
    <div class="time">
      <span class="with-icon">
        <i class="iconfont icon-ba-time"></i>
        <span>{{template.create_at || '--'}}</span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    template: Object
  },
  data () {
    return {
      trainStatus: this.template.status
    }
  },
  /*   watch: {
    'template': {
      handler (val) {
        this.trainStatus = val.train
        this.stateMonitor()
      },
      deep: true
    }
  }, */
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
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/index.scss';
@import '../../styles/index.scss';
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
  .time{
    .with-icon{
      display: inline-block;
      line-height: 30px;
      overflow: hidden;
      color: $sedondary-text-color;
      i, span{
        float: left;
      }
      i{
        font-size: 16px
      }
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
#template-item{
  .tags{
    .tags-wrap .el-tag{
      // margin-left: 5px !important;
      line-height: 17px !important;
      &:first-child{
        margin-left: 0 !important;
      }
    }
  }
}
</style>
