<template>
  <div
    class="flowchart-item"
    @click="selectFlowchart(flowchartItem.id)"
    :class="currentFlowchartId === flowchartItem.id ? 'current-flowchart' : ''"
    :style="styleObj['flowchart-item']"
  >
    <div class="preview" :style="styleObj['preview']">
      <div v-if="flowchartItem.preview" class="thumbnail-block has-thumbnail">
        <img :src="'/' + flowchartItem.preview" alt=""/>
      </div>
      <div v-else class="thumbnail-block">
        <img src="../../assets/without-img.svg">
<!--        <span class="without-img-txt">暂无图片</span>-->
      </div>
    </div>
    <div class="content">
      <div class="title-tags content-item" :style="styleObj['content-item']">
        <span class="title" style="margin-right: 30px;">{{ flowchartNameWithFolderComputed }}</span>
        <el-tag
          v-for="item in flowchartItem.tags"
          :key="item"
          size="mini"
        >{{ item }}</el-tag>
      </div>
      <div class="timestamp-username content-item" :style="styleObj['content-item']">
        <span class="timestamp" style="margin-right: 30px;">{{ flowchartItem.last_modified }}</span>
        <span class="username">{{ flowchartItem.username }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'flowchart-item',
  props: {
    flowchartItem: {
      type: Object,
      default: () => {}
    },
    currentFlowchartId: {
      type: Number,
      default: -1
    },
    styleObj: {
      type: Object,
      default: () => ({
        'flowchart-item': {
          height: '100px',
          padding: '10px 20px'
        },
        'preview': {
          width: '80px',
          height: '80px',
          'margin-right': '30px'
        },
        'content-item': {
          'line-height': '40px'
        }
      })
    },
    needFolder: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    flowchartNameWithFolderComputed () {
      return this.needFolder ? this.flowchartItem.folder_name + ' > ' + this.flowchartItem.name : this.flowchartItem.name
    }
  },
  methods: {
    selectFlowchart (flowchartId) {
      this.$emit('select-flowchart', flowchartId)
    }
  }
}
</script>

<style lang="scss" scoped>
.current-flowchart {
  background-color: #d8d8d8 !important;
}
.flowchart-item {
  display: flex;
  align-items: center;
  // height: 100px;
  // padding: 10px 20px;
  transition: all .1s;
  &:hover {
    background-color: #F8F8F8;
  }
  .preview {
    // width: 80px;
    // height: 80px;
    // margin-right: 30px;
    .thumbnail-block {
      height: 100%;
      width: 100%;
      border: 1px solid #e8e8e8;
      border-radius: 50%;
      overflow: hidden;
      img {
        height: 100%;
        width: 100%;
      }
    }
  }
  .content {
    flex: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: stretch;
    .content-item {
      // line-height: 40px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      .el-tag--mini {
        margin: 0 5px;
      }
    }
  }
}
</style>
