<template>
  <div class="content-wrapper">
    <!-- <Breadcrumb :config="config"/> -->
    <div class="information">
      <title-comp txt="组织信息"></title-comp>
      <Toolbar >
        <template slot="content">
          <SearchItem title="名称">
            <el-input
              v-model="toolbar.name"
              placeholder="请输入组织名称"
              size="small"
              clearable
            ></el-input>
          </SearchItem>
          <SearchItem title="上级组织">
            <el-select v-model="toolbar.pid" clearable
              @change="handleSearch"
              placeholder="请选择上级组织">
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
              placeholder="请选择组织状态">
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
      <TableList title="组织列表">
        <template slot="header">
          <el-button type="primary" size="small" class="w90btn" @click="handleNew" :disabled="disabled">新建</el-button>
          <el-button size="small" class="w90btn" @click="handlePatchDelete" :disabled="disabled">批量删除</el-button>
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
              label="组织名称"
              min-width="180">
            </el-table-column>
            <el-table-column
              prop="description"
              min-width="180"
              show-overflow-tooltip
              label="组织描述">
            </el-table-column>
            <el-table-column
              prop="usercount"
              width="140"
              align="center"
              label="组织人数">
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
                  :inactive-value="2"
                  :active-value="1"
                  :disabled="disabled"
                  @change="handleChangeStatus(scope.row)"
                  v-model="scope.row.status">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column
              prop="pid_name"
              min-width="180"
              show-overflow-tooltip
              label="所属上级组织">
            </el-table-column>
            <el-table-column
              prop="create_time"
              width="180"
              align="center"
              label="创建时间">
            </el-table-column>
            <el-table-column 
              align="center" label="操作" width="140">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="handleEdit(scope.row)">{{ disabled ? '查看' : '编辑'}}</el-button>
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
import { isDef } from '@/utils/utils'
import CustomPaginator from '@/components/public/Pagination.vue'
import titleComp from '@/components/title-comp'
import Toolbar from '@/components/public/Toolbar.vue'
import TableList from '@/components/public/TableList.vue'
import SearchItem from '@/components/public/SearchItem.vue'
import { STATUS } from '../constant/index'
export default {
  name: 'orgList',
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
        updateMethod: 'updateOrg',
        key: 'org_list', 
        deleteMethod: 'deleteOrg'
      },
      tableData: [],
      toolbar: {
        name: '',
        pid: '',
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
      location.href = `/company/org/staff-manage?select_org_id=${row.id}&flag=1`
    },
    doRefresh () {
      this.getAllParentOrgList()
    },
    formatItemInfo (row) {
      const { id, description = '', orgfinal, status, level, pid, name, owner_id, leader_id, leader_phone } = row
      return {
        id,
        description,
        uppid: isDef(pid) ? pid : -1,
        orgfinal,
        user_id: owner_id,
        leader_id,
        leader_phone,
        status,
        level,
        name
      }
    },
    handleEdit (row) {
      this.$router.push({
        name: 'org-detail',
        query: this.getQuery({ ...this.formatItemInfo(row), disabled: this.disabled ? 1 : '' })
      })
    },
    handleNew () {
      this.$router.push({
        name: 'org-detail'
      })
    },
    async getList () {
      this.loading = true
      const res = await this.$api.getOrgList(this.getParams({
        ...this.pageInfo,
        ...this.toolbar
      }))
      this.loading = false
      if (res.code !== 0) return
      this.tableData = res.data.data || []
      this.pageInfo.total = res.data.total || 0
      this.tableData.forEach((item) => {
        item.usercount = item.usercount || 0
      })
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
