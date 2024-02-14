<template>
  <div class="content-wrapper" >
    <!-- <Breadcrumb :config="config"/> -->
    <div class="information">
      <title-comp txt="员工管理"></title-comp>
      <Toolbar >
        <template slot="content">
          <SearchItem title="姓名">
            <el-input
              v-model="toolbar.username"
              placeholder="请输入员工姓名"
              size="small"
              clearable
            ></el-input>
          </SearchItem>
          <SearchItem title="所属组织">
            <el-select v-model="toolbar.org_id" clearable
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
          <SearchItem title="岗位名称">
            <!-- <el-input
              v-model="toolbar.staff_name"
              placeholder="请输入岗位名称"
              size="small"
              clearable
            ></el-input> -->
            <el-select v-model="toolbar.job_id" clearable
              @change="handleSearch"
              placeholder="请选择岗位">
              <el-option
                v-for="item in jobList"
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
      <TableList title="员工列表">
        <template slot="header">
          <el-button type="primary" icon="el-icon-user" size="small" :disabled="disabled" @click="handleInvite">邀请成员</el-button>
          <el-button type="primary" size="small" class="w90btn" :disabled="disabled" @click="handleNew">新建</el-button>
          <el-button size="small" class="w90btn" :disabled="disabled" @click="handlePatchDelete">批量删除</el-button>
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
              prop="username"
              show-overflow-tooltip
              label="员工姓名"
              min-width="180">
            </el-table-column>
            <el-table-column
              prop="showPhone"
              min-width="160"
              align="center"
              show-overflow-tooltip
              label="手机号">
            </el-table-column>
            <el-table-column
              prop="job_name"
              width="140"
              label="岗位">
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
              prop="type"
              min-width="160"
              show-overflow-tooltip
              column-key="type"
              :formatter="formatter"
              label="权限">
            </el-table-column>
            <el-table-column
              prop="create_time"
              width="180"
              align="center"
              label="添加时间">
            </el-table-column>
            <el-table-column 
              label="操作" width="140" 
              align="center">
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
      <invite-dialog ref="inviteDialog" :userType="userType"></invite-dialog>
    </div>
  </div>
</template>

<script>
import { List } from './base'
import { translatePhone } from '@/utils/utils'
import { mapGetters } from 'vuex'
import InviteDialog from '@/modules/company/components/invite-dialog'
import CustomPaginator from '@/components/public/Pagination.vue'
import titleComp from '@/components/title-comp'
import Toolbar from '@/components/public/Toolbar.vue'
import TableList from '@/components/public/TableList.vue'
// import Breadcrumb from '@/components/public/Breadcrumb.vue'
import SearchItem from '@/components/public/SearchItem.vue'
import { AUTH } from '../constant/index'
export default {
  name: 'orgList',
  components: {
    // Breadcrumb,
    InviteDialog,
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
        updateMethod: 'updateStaff',
        key: 'staff_list', 
        deleteMethod: 'deleteStaff'
      },
      jobList: [],
      tableData: [],
      toolbar: {
        job_id: '',
        org_id: '',
        username: '',
        status: ''
      },
      ...List.data
    }
  },
  computed: {
    ...List.computed
  },
  watch: {
    ...List.watch,
    'toolbar.org_id' () {
      this.getJobList()
    }
  },
  created () {

  },
  mounted () {
    let hash = this.$route.hash
    console.log(this.$route.hash.slice())
    const id = this.$route.query.select_org_id
    this.toolbar.org_id = id ? Number(id) : ''
    if (hash) {
      hash = hash.slice(1)
      const data = hash.split('=')
      if (data.length) {
        if (data[0] === 'select_org_id') {
          this.toolbar.org_id = Number(data[1])
        }
        if (data[0] === 'select_job_id') {
          this.toolbar.job_id = Number(data[1])
        }
      }
      location.hash = ''
    }
    this.init()
  },
  activated () {

  },
  beforeDestroy () {

  },
  methods: {
    async getJobList () {
      const res = await this.$api.getSimpleJobList(this.getParams({
        org_id: this.toolbar.org_id
      }))
      if (res.code !== 0) return
      this.jobList = res.data || []
    },
    formatter (row, { property }) {
      const val = row[property]
      const item = AUTH.filter(item => item.value === val)
      return item.length ? item[0].label : ''
    },
    formatItemInfo (row) {
      const { id, introduce = '', org_id, status, username, phone, type, job_id } = row
      return {
        id,
        introduce,
        phone,
        org_id,
        job_id,
        status,
        username,
        type
      }
    },
    init () {
      if (this.currentDataSpaceIdGetter < 0) return
      this.getAllParentOrgList()
      this.getJobList()
      this.getList()
      this.getPermission()
    },
    handleInvite () {
      // 1. 判断当前用户的角色, 只有 超级管理员 / 管理员才可以邀请
      // 2. 打开邀请对话框
      const companyId = this.currentDataSpaceIdGetter
      this.$refs.inviteDialog.handleShow(companyId)
    },
    handleEdit (row) {
      this.$router.push({
        name: 'staff-detail',
        query: this.getQuery({ ...this.formatItemInfo(row), disabled: this.disabled ? 1 : '' })
      })
    },
    handleNew () {
      this.$router.push({
        name: 'staff-detail'
      })
    },
    async getList () {
      this.loading = true
      const res = await this.$api.getStaffList(this.getParams({
        ...this.pageInfo,
        ...this.toolbar,
        ...this.$route.query
      }))
      this.loading = false
      if (res.code === -1) return
      const data = res.data.data || []
      data.forEach((item) => {
        item.showPhone = translatePhone(item.phone)
      })
      this.tableData = data || []
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
