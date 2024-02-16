<template>
  <el-dialog
    title="选择流程图"
    :visible.sync="visible"
    width="810px"
  >
    <div class="searh-content">
      <el-input v-model="nameTest" placeholder="请输入关键词查询流程图" />
      <div class="btn-list">
        <el-button type="primary" @click="getLists">查询</el-button>
        <el-button @click="clearSearch">重置</el-button>
      </div>
    </div>

    <div>
      <div class="selected-flow">当前已选择：流程图</div>
      <el-table :data="tableData">
        <el-table-column
          prop="table-name"
          label="名称"
          align="left"
          header-align="left"
        />
        <el-table-column
          prop="modify-time"
          label="修改时间"
          align="left"
          header-align="left"
        />
        <el-table-column
          prop="modify-person"
          label="修改人"
          align="left"
          header-align="left"
        />
      </el-table>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button :loading="buttonLoading" type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      nameTest: '',
      buttonLoading: false,
      tableData: [
        {
          'table-name': '1111',
          'modify-time': '3333',
          'modify-person': '444'
        }
      ]
    }
  },
  methods: {
    getLists() {

    },

    clearSearch() {

    },

    cancel() {
      this.$emit('cancel')
    },

    submit() {
      const params = {}
      this.$emit('submit', params)
    }
  }
}
</script>
<style lang="scss" scoped>
.searh-content {
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  .el-input {
    width: 300px;
  }
}

.selected-flow {
  margin: 20px 0;
  padding: 0 15px;
  font-size: 16px;
  font-weight: bold;
}
</style>
