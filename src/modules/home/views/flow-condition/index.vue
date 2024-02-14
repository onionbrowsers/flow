<template>
    <div class="flow-condition-wrapper">
        <SearchForm :departmentList="departmentList" @search="handleSearchForm" />
        <div class="flow-table-wrapper">
            <el-table
                border
                :data="tableData"
                style="width:100%"
            >
                <el-table-column
                    prop="flow_name"
                    label="流程名称"
                    align="center"
                >
                    <template slot-scope={row}>
                        <div class="click-href" @click="openUrl(row)">
                            {{ row.flow_name }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="institution"
                    label="涉及制度"
                    align="center"
                >
                    <template slot-scope={row}>
                        <div class="click-href">
                            {{ row.institution }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="job_manual"
                    label="岗位手册"
                    align="center"
                >
                    <template slot-scope={row}>
                        <div class="click-href">
                            {{ row.job_manual }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="folder_manual"
                    label="部门手册"
                    align="center"
                >
                    <template slot-scope={row}>
                        <div class="click-href">
                            {{ row.folder_manual }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="company_manual"
                    label="公司手册"
                    align="center"
                >
                    <template slot-scope={row}>
                        <div class="click-href">
                            {{ row.company_manual }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="folder_name"
                    label="所属主责部门"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="c_time"
                    label="创建时间"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    prop="edit"
                    label="操作"
                    align="center"
                >
                    <template slot-scope={row}>
                        <span class="click-href" @click="editRow(row)">
                            编辑
                        </span>
                        <span class="click-href" @click="deleteRow(row)">
                            删除
                        </span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="flow-pagination"
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
    </div>
</template>

<script>
import SearchForm from './searchForm.vue'
import { mapGetters } from 'vuex'
export default {
  components: { SearchForm },
  data () {
    return {
      size: 10,
      current: 1,
      total: 0,
      searchForm: {},
      tableData: [],
      departmentList: []
    }
  },
  computed: {
    ...mapGetters(['currentDataSpaceIdGetter'])
  },
  watch: {
    currentDataSpaceIdGetter (oldValue, newValue) {
      if (oldValue !== newValue) {
        this.init()
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      if (this.currentDataSpaceIdGetter === -1) return
      this.getUserFolder()
      this.getTableData()
    },
    getUserFolder () {
      this.$api.getUserFolder({
        companyId: this.currentDataSpaceIdGetter
      }).then(res => {
        const { code, data } = res
        if (code == 0) {
          this.departmentList = data
        }
      })
    },
    openUrl (row) {
      if (!row.flow_id) {
        this.$msgMnger.warn('暂无流程图可查看')
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
    getTableData () {
      if (this.currentDataSpaceIdGetter === -1) return
      const { current, size, searchForm } = this
      const params = {
        page: current,
        page_size: size,
        ...searchForm,
        start_time: searchForm.dateRange ? searchForm.dateRange[0] : '',
        end_time: searchForm.dateRange ? searchForm.dateRange[1] : '',
        company_id: this.currentDataSpaceIdGetter
      }
      this.$api.showFlowConditionTable(params).then(res => {
        const { code, data } = res
        if (code === 0) {
          const { items, page } = data
          this.tableData = items
          this.total = page.total
        }
      }).catch(err => {
        this.$msgMnger.error(err.msg || '添加失败')
      })
    },
    handleSizeChange (size) {
      this.current = 1
      this.size = size
      this.getTableData()
    },
    handleCurrentChange (current) {
      this.current = current
      this.getTableData()
    },
    handleSearchForm (searchForm) {
      this.searchForm = searchForm
      this.current = 1
      this.getTableData()
    },
    editRow (row) {
      this.$router.push({
        name: 'edit-condition-flow',
        query: {
          id: row.id
        }
      })
    },
    deleteRow (row) {
      this.$msgbox({
        title: '删除',
        message: '请确认是否删除',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '是',
        cancelButtonText: '否',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            this.$api.deleteFlowConditionTable({
              relation_id: row.id
            }).then(res => {
              console.log(12345)
              const { code } = res
              if (code == 0) {
                this.$msgMnger.success('删除成功')
                this.getTableData()
              }
            }).catch(err => {
              this.$msgMnger.error(err.msg || '删除失败')
            })
          }
          return done()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.flow-condition-wrapper {
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: #fff;
    text-align: left;
    padding: 24px;
    box-sizing: border-box;

    .click-href {
        color: #1890FF;
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }
    }
    .flow-pagination {
        text-align: right;
        margin-top: 16px;

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
