<template>
  <div class="template-item">
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
        <!-- <span class="tags-wrap"> -->
          <el-tag size="mini" v-for="(tag,index) in template.tags" :key="index">{{tag}}</el-tag>
        <!-- </span> -->
        <span v-if="!template.tags.length">暂无标签</span>
      </div>
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
  computed: {
    src () {
      return require(`../../assets/template/${this.template.src}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';
  .template-item{
    width: 383px;
    box-sizing: border-box;
    cursor: pointer;
    color: #5F5F5F;
    border: 1px solid #e8e8e8;
    background: #fff;
    .item-top{
      height: 24px;
      line-height: 24px;
      padding-left: 20px;
      line-break: 24px;
      background: #f7f9fa;
      font-size: 12px;
    }
    .item-middle{
      padding: 24px 24px 15px 24px;
      font-size: 14px;
      // min-height: 180px;
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
        height: 60px;
        display: flex;
        flex-wrap: wrap;
        .el-tag{
          margin-right: 5px;
        }
      }
    }
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
