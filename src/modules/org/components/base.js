import { mapGetters } from 'vuex'
import { STATUS } from '../constant/index'
import { isDef } from '@/utils/utils'

const baseWatch = {
  currentDataSpaceIdGetter () {
    this.init()
  }
}

const baseComputed = {
  ...mapGetters({
    currentDataSpaceIdGetter: 'currentDataSpaceIdGetter'
  })
}

const baseMethod = {
  async getAllParentOrgList () {
    const res = await this.$api.getSimpleOrgList(this.getParams({
      level: -1
    }))
    if (res.code !== 0) return
    this.parentAllOrgList = res.data
  },
  async getFinalOrganization () {
    const res = await this.$api.getFinalOrgList(this.getParams({}))
    if (res.code !== 0) return
    this.parentAllOrgList = res.data
  },
  getParams (params) {
    const id = this.currentDataSpaceIdGetter

    return Object.assign({
      ...params,
      company_id: id
    })
  },
}

export const List = {
  data: {
    statusList: STATUS,
    loading: false,
    pageInfo: {
      page: 1,
      page_size: 10,
      total: 0
    },
    parentAllOrgList: [],
    userType: 3,
    multipleSelection: []
  },
  computed: {
    ...baseComputed,
    disabled () {
      return this.userType === 3
    }
  },
  watch: {
    ...baseWatch
  },
  methods: {
    ...baseMethod,
    getQuery (params = {}) {
      return Object.assign({}, this.$route.query, { detail: JSON.stringify(params) })
    },
    async getParentOrgList () {
      const res = await this.$api.getSimpleOrgList(this.getParams({
        level: -1
      }))
      if (res.code !== 0) return
      this.orgList = res.data
    },
    handleReset () {
      for (const i in this.toolbar) {
        this.toolbar[i] = ''
      }
      this.handleSearch()
    },
    handleSearch () {
      this.pageInfo.pageNum = 1
      this.getList()
    },
    handlePreDelete ({ id }, params = {}) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDelete([id], params)
      })
    },
    handleDelete (ids) {
      const { key, deleteMethod } = this.operation
      this.$api[deleteMethod](this.getParams({
        [key]: JSON.stringify(ids)
      })).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功'
        }) 
        this.getList()
        this.doRefresh && this.doRefresh()
      }).catch(({ msg }) => {
        this.$message({
          type: 'error',
          message: msg
        })
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    getPermission () {
      this.$api.getUserPermission({ company_id: this.currentDataSpaceIdGetter, check_type: 1 }).then(res => {
        // 赋值
        this.userType = res.data
      })
    },
    handleChangeStatus (row) {
      this.$api[this.operation.updateMethod](this.getParams(this.formatItemInfo(row))).then((res) => {
        this.$message({
          type: 'success',
          message: '状态更新成功'
        })
        this.getList()
      }).catch((res) => {
        this.$message.error(res.msg)
      })
    },
    async handlePatchDelete () {
      if (!this.multipleSelection.length) {
        this.$message.error(`请选择要删除的${this.$route.query.type || '组织'}`)
        return
      }
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection.map(item => item.id)
        this.handleDelete(ids)
      })
    },
    handlePageChange (pageInfo) {
      const { pageNum, pageSize } = pageInfo
      this.pageInfo.page_size = pageSize
      this.pageInfo.page = pageNum
      this.getList()
    },
  }
}

export const Detail = {
  data: {
    parentAllOrgList: []
  },
  computed: {
    disabled () {
      return !!this.params.disabled
    },
    ...baseComputed,
    isNew () {
      return !this.params.id
    },
    params () {
      try {
        return JSON.parse(this.$route.query.detail || '')
      } catch (e) {
        return {}
      }
    }
  },
  watch: {
    ...baseWatch
  },
  methods: {
    ...baseMethod,
    handleValidate () {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return
        this.handleSave()
      })
    },
    getSaveText () {
      return this.isNew ? '新建成功' : '更新成功'
    },
    formatQuery () {
      const keys = this.formatKeys 
      const params = this.params
      for (const i in params) {
        if (keys.includes(i) && isDef(params[i])) {
          params[i] = Number(params[i])
        }
      }
      return params
    },
    async getDetail (cb) {
      const params = this.formatQuery()
      cb && cb(params)
      Object.assign(this.ruleForm, params)
    },

    handleSaveComplete () {
      this.$message({
        type: 'success',
        message: this.getSaveText()
      })
      
      setTimeout(() => {
        this.$router.back()
      }, 1000)
    }
  }
}
