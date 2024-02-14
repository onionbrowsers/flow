<!--  -->
<template>
  <div id="preview-excel">
    <div class="table-header">
      <el-row>
        <el-col class="item" :span="getSpan(index)" v-for="(item, index) in excelData.title" :key="index">{{item}}</el-col>
      </el-row>
    </div>
    <el-scrollbar class="table-body">
      <div class="content">
        <el-row class="table-row" v-for="(rowItem, index) in excelData.data" :key="index">
          <el-col class="item haha" :span="getSpan(subIndex)" v-for="(item, subIndex) in rowItem" :key="subIndex">{{getItemContent(subIndex, rowItem)}}</el-col>
        </el-row>
        <div class="remark">{{getRemark()}}</div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>

export default {
  props: ['excelData'],
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    getSpan (index) {
      return [
        1, // 序号
        2, // 部门/领导
        1, // 岗位
        3, // 步骤
        1, // 图形
        1, // 判断
        1, // 是否风险点
        1, // 是否控制点
        1, // 编号
        1, // 图标
        4, // 下一步骤
        1, // 下一步骤编号
        2, // 节点文档框
        4 // 流程图备注
      ][index]
    },
    getRemark () {
      if (this.excelData.data) {
        return this.excelData.data[0][this.excelData.title.length - 1].replace(/<br>/g, '')
      }
    },
    getItemContent (subIndex, rowItem) {
      if (subIndex === rowItem.length - 1) { // 备注单独显示，返回空来避免撑高第一行
        return ''
      }
      return rowItem[subIndex]
    }
  }
}
</script>

<style lang='scss' scoped>
#preview-excel{
  margin: 0 auto;
  font-size: 12px;
  text-align: left;
  padding: 0 10px;
  height: 100%;
  .table-header{
    font-weight: bold;
    padding: 0 10px;
    height: 45px;
    .el-row{
      border-bottom: 1px solid #ccc;
      .item{
        padding: 5px 0px;
      }
    }
  }
  .el-scrollbar{
    overflow-x: hidden !important;
  }
  .table-body{
    width:100%;
    height: calc(100% - 45px);
    .content{
      padding: 0 10px;
      position: relative;
      .table-row{
        border-bottom: 1px solid #ccc;
        .item{
          padding: 5px 0px;
        }
      }
      .remark{
        position: absolute;
        top: 0;
        right: 0;
        padding: 0 10px 0 3px;
        width: 173px;
        height: 100%;
        background: #fff;
      }
    }
  }
}
</style>
