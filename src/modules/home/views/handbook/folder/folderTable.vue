<template>
    <div class="folder-table-wrapper">
        <div class="filter-folder-table">
            <el-select @change="search" v-model="selectTab" placeholder="请选择导航类型">
                <el-option
                    v-for="item in selectTabList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <div class="search-wrapper">
                <el-input
                    suffix-icon="el-icon-search"
                    v-model="searchText"
                    placeholder="请输入名称关键词"
                    clearable
                    class="search-input"
                >
                </el-input>
                <el-button @click="search" class="search-button" type="primary">
                    检索
                </el-button>
            </div>
        </div>
        <el-table
            v-loading="loading" 
            :data="tableData"
            border
            style="width: 100%;"
            class="folder-table-content"
            header-row-class-name="folder-table-header"
            empty-text="暂无数据"
        >
            <el-table-column align="center" prop="name" label="内容名称">
                <template slot-scope="{row}">
                    <div class="table-column-name" @click="editTable(row)">
                        {{ row.page_name }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="intitle_name" label="目录位置"></el-table-column>
            <el-table-column align="center" prop="source" label="来源">
              <template>
                系统内部    
              </template>
            </el-table-column>
            <el-table-column align="center" prop="img_type" label="类型"></el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="{row}">
                    <el-button type="text" size="small" @click="editTable(row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            class="folder-pagination"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="current"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="size"
            layout="slot, sizes, prev, pager, next, jumper"
            :total="total">
            <div class="page-desc">共{{ total }}条记录，第{{ current }}/{{ Math.ceil(total / size) || 1 }}页</div>
        </el-pagination>
    </div>
</template>

<script>
import msgMixin from '../msgMixin'
export default {
  mixins: [msgMixin],
  data () {
    return {
      loading: false,
      manualId: '',
      tableData: [],
      searchText: '',
      current: 1,
      size: 10,
      total: 0,
      selectTab: 1,
      selectTabList: [
        {
          id: 1,
          name: '全部内容'
        },
        {
          id: 2,
          name: '流程图'
        },
        {
          id: 3,
          name: '风险控制矩阵'
        }
      ]
    }
  },
  methods: {
    editTable (row) {
      if (!row.flow_id) {
        this.message.warn('暂无流程图可查看')
        return
      }
      let url = this.$router.resolve({
        name: 'fc-flowfile-edit',
        params: {
          flowfileId: row.flow_id
        }
      })
      window.open(url.href, '_blank')
    },
    search () {
      this.getTableData()
    },
    handleSizeChange (size) {
      this.size = size
      this.current = 1
      this.getTableData()
    },
    handleCurrentChange (current) {
      this.current = current
      this.getTableData()
    },
    getTableData () {
      this.tableData = []
      this.total = 0
      this.loading = true
      this.$api.getHandbookTableData({
        navigation: this.selectTab,
        keywords: this.searchText,
        page: this.current,
        page_size: this.size,
        manual_id: this.manualId
      }).then(res => {
        const { code, data, total = 0 } = res
        if (code === 0) {
          this.tableData = data
          this.total = total
        }
      }).catch((err) => {
        this.message.warn(err.msg || '暂无数据')
      }).finally(() => {
        this.loading = false
      })
    }
  },
  created () {
    if (this.$route.query.manual_id) {
      this.manualId = this.$route.query.manual_id
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.folder-table-wrapper {
    padding: 16px;
    padding-left: 0;
    width: 100%;
    overflow-x: auto;
    box-sizing: border-box;
    text-align: left;

    .search-wrapper {
        margin-bottom: 12px;
        float: right;
        .search-input {
            width: 240px;
            margin-right: 8px;
        }
    }

    .folder-table-content {
        margin-bottom: 12px;
    }
    /deep/ .folder-table-header {
        th,
        .cell {
            background-color: #eee;
        }
    }

    .table-column-name:hover {
        cursor: pointer;
        color: #1890ff;
    }

    .folder-pagination {
        text-align: right;

        .page-desc {
            height: 28px;
            line-height: 28px;
            float: left;
            color: #606266;
            font-size: 13px;
            font-weight: normal;
        }
    }
}
</style>
