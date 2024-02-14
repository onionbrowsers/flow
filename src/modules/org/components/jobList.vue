<template>
  <div class="content-wrapper">
    <!-- <Breadcrumb :config="config"/> -->
    <div class="information">
      <title-comp txt="岗位管理"></title-comp>
      <Toolbar >
        <template slot="content">
          <SearchItem title="岗位名称">
            <el-input
              v-model="toolbar.name"
              placeholder="请输入岗位名称"
              size="small"
              clearable
            ></el-input>
          </SearchItem>
          <SearchItem title="所属组织">
            <el-select v-model="toolbar.folder_id" clearable
              @change="handleSearch"
              placeholder="请选择所属组织">
              <el-option
                v-for="item in parentAllOrgList"
                :key="item.value"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </SearchItem>
          <SearchItem title="状态">
            <el-select v-model="toolbar.status" clearable
              @change="handleSearch"
              placeholder="请选择岗位状态">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </SearchItem>
        </template>
        <template slot="aside">
          <el-button type="primary" class="w90btn" @click="handleSearch">查询</el-button>
          <el-button class="w90btn" @click="handleReset">重置</el-button>
        </template>
      </Toolbar>
      <TableList title="岗位列表">
        <template slot="header">
          <el-button type="primary" size="small" class="w90btn" :disabled="disabled" @click="handleNew">新建</el-button>
          <el-button size="small" class="w90btn"  :disabled="disabled" @click="handlePatchDelete">批量删除</el-button>
        </template>
        <div>
          <el-table
            v-loading="loading"
            @selection-change="handleSelectionChange"
            :data="tableData"
            style="width: 100%">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="name"
              show-overflow-tooltip
              label="岗位名称"
              min-width="180">
            </el-table-column>
            <el-table-column
              prop="description"
              min-width="180"
              show-overflow-tooltip
              label="岗位描述">
            </el-table-column>
            <el-table-column
              prop="usercount"
              width="140"
              align="center"
              label="岗位人数">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="handleLoadToStaff(scope.row)">{{scope.row.usercount}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              width="140"
              align="center"
              label="状态">
              <template slot-scope="scope">
                <el-switch
                  :disabled="disabled" 
                  :inactive-value="2"
                  :active-value="1"
                  @change="handleChangeStatus(scope.row)"
                  v-model="scope.row.status">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column
              prop="org_name"
              min-width="180"
              show-overflow-tooltip
              label="所属组织">
            </el-table-column>
            <el-table-column
              prop="create_time"
              width="160"
              align="center"
              label="创建时间">
            </el-table-column>
            <el-table-column 
              align="center"
              label="操作" 
              width="140">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="handleEdit(scope.row)">{{disabled ? '查看' : '编辑'}}</el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button
                  size="mini"
                  type="text"
                  :disabled="disabled" 
                  @click="handlePreDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <custom-paginator
            v-bind="{...pageInfo}"
            @change="handlePageChange"/>
        </div>
      </TableList>
    </div>
  </div>
</template>

<script>
import { List } from './base'
import CustomPaginator from '@/components/public/Pagination.vue'
import titleComp from '@/components/title-comp'
import Toolbar from '@/components/public/Toolbar.vue'
import TableList from '@/components/public/TableList.vue'
import SearchItem from '@/components/public/SearchItem.vue'
import { STATUS } from '../constant/index'
export default {
  name: 'jobList',
  components: {
    CustomPaginator,
    titleComp,
    Toolbar,
    SearchItem,
    TableList
  },
  filters: {

  },
  props: {

  },
  data () {
    return {
      operation: {
        updateMethod: 'updateJob',
        key: 'job_list', 
        deleteMethod: 'deleteJob'
      },
      tableData: [],
      toolbar: {
        name: '',
        folder_id: '',
        status: ''
      },
      ...List.data
    }
  },
  computed: {
    ...List.computed
  },
  watch: {
    ...List.watch
  },
  created () {

  },
  mounted () {
    this.init()
  },
  activated () {

  },
  beforeDestroy () {

  },
  methods: {
    init () {
      if (this.currentDataSpaceIdGetter < 0) return
      this.getAllParentOrgList()
      this.getList()
      this.getPermission()
    },
    handleLoadToStaff (row) {
      location.href = '/company/org/staff-manage#select_job_id=' + row.id
    },
    handleEdit (row) {
      this.$router.push({
        name: 'job-detail',
        query: this.getQuery({ ...this.formatItemInfo(row), disabled: this.disabled ? 1 : '' })
      })
    },
    formatItemInfo (row) {
      const { id, description = '', name, status, folder_id } = row
      return {
        id,
        description,
        folder_id,
        status,
        name
      }
    },
    handleNew () {
      this.$router.push({
        name: 'job-detail'
      })
    },
    async getList () {
      this.loading = true
      const res = await this.$api.getJobList(this.getParams({
        ...this.pageInfo,
        ...this.toolbar
      }))
      this.loading = false
      if (res.code !== 0) return
      this.tableData = res.data.data || []
      this.pageInfo.total = res.data.total || 0
    },
    ...List.methods
  }
}
</script>

<style lang="scss" scoped>
.content-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>

<style lang="scss">
</style>
