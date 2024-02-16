<template>
  <el-dialog
    title="选择样本"
    :visible="visible"
    :close-on-click-modal="false"
    :before-close="cancel"
    width="810px"
  >
    <div class="searh-content">
      <el-input v-model="nameTest" placeholder="请输入样本名称" />
      <div class="btn-list">
        <el-button type="primary" @click="getLists">查询</el-button>
        <el-button type="primary" @click="clearSearch">重置</el-button>
      </div>
    </div>

    <div class="table-content">
      <el-table :data="tableData">
        <el-table-column
          prop="table-name"
          label="样本名称"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="modify-time"
          label="样本编号"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="modify-person"
          label="样本唯一性标识"
          align="center"
          header-align="center"
        />
      </el-table>
    </div>

    <span slot="footer">
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
  font-size: 16px;
  font-weight: bold;
}

.table-content {
  margin-top: 20px;
}
</style>
