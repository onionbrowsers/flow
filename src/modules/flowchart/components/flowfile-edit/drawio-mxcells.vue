<template>
  <div class="drawio-mxcells">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="drawio当前页面中的所有mxcell" name="1">
        <div class="drawio-mxcells-item" v-for="(item, index) in mxCells.header" :key="index">
          <span class="drawio-mxcells-item-close" @click="delMxCellHeader(item)">
            <i class="el-icon-circle-close"></i>
          </span>
          <div><span class="title">id：</span>{{item.id}}</div>
          <div><span class="title">value：</span>{{item.value}}</div>
        </div>
        <p>-----割一刀-----</p>
        <div class="drawio-mxcells-item" v-for="(item, index) in mxCells.content" :key="`${index}-x`">
          <span class="drawio-mxcells-item-close" @click="delMxCellContent(item)">
            <i class="el-icon-circle-close"></i>
          </span>
          <div><span class="title">id：</span>{{item.id}}</div>
          <div><span class="title">value：</span>{{item.value}}</div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  props: {
    mxCells: {
      default: () => {}
    }
  },
  data () {
    return {
      activeNames: ['1']
    }
  },
  methods: {
    delMxCellHeader (e) {
      this.$emit('delMxCell', e)
      this.mxCells.header.forEach((el, index) => {
        if (e.id === el.id) {
          this.mxCells.header.splice(index, 1)
        }
      })
    },
    delMxCellContent (e) {
      this.$emit('delMxCell', e)
      this.mxCells.content.forEach((el, index) => {
        if (e.id === el.id) {
          this.mxCells.content.splice(index, 1)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.drawio-mxcells{
  position: absolute;
  left: 100px;
  top: 100px;
  width: 200px;
  max-height: 500px;
  text-align: left;
  overflow-y: auto;
  padding: 0 10px;
  background: #fff;
  .el-collapse{
    margin: 20px 0 0 0;
  }
  .drawio-mxcells-item{
    padding: 10px 5px;
    border-bottom: 1px solid #ddd;
    position: relative;
    .drawio-mxcells-item-close{
      position: absolute;
      right: 10px;
      top: 20px;
      cursor: pointer;
    }
    .title{
      font-weight: bold;
      color: rgb(86, 96, 240);
    }
  }
}
</style>
