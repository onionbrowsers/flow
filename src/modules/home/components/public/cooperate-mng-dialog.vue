<template>
  <flow-file-dialog
    class="cooperate-mng-dialog"
    ref="flowFileDialog"
    width="760px"
    :title="dlgConfigs.title"
    :btn1="dlgConfigs.btn1"
    :btn2="dlgConfigs.btn2"
    :showClose="true"
    :destroyOnClose="true"
    @clickBtn1="handleClickBtn1"
    @clickBtn2="handleClickBtn2"
  >
    <cooperate-mng
      ref="cooperateMng"
      :user-role="currentUserRole"
      :flag="flag"
      slot="one"
    ></cooperate-mng>
  </flow-file-dialog>
</template>

<script>
import FlowFileDialog from '../../../flowchart/components/public/flowfile-dialog'
import CooperateMng from './cooperate-mng'

import { mapGetters } from 'vuex'
export default {
  name: 'cooperate-mng-dialog',
  components: {
    FlowFileDialog,
    CooperateMng
  },
  data () {
    return {
      dlgConfigs: {
        title: '协作成员',
        btn1: { title: '取 消' },
        btn2: { title: '确 定' }
      },
      flag: 'file', // 当前为 文件夹协作成员管理 还是 文件 协作成员管理
      currentId: -1, // 当前 文件 或 文件夹 的 id
      // 当前 文件 或 文件夹 的详情, f stands for folder or file
      currentF: {},
      // 暂存接口数据, 留用
      responseData: {},
      // 干净的 staffData
      staffData: {
        staff_infolder: [],
        staff_outfolder: []
      },
      // 当前用户在企业中的角色
      currentUserRole: -1
    }
  },
  computed: {
    ...mapGetters(['currentDataSpaceIdGetter'])
  },
  methods: {
    handleClickBtn1 () {},
    /**
     * 更新协作成员
     * 1. 获取到 staff_infolder 数据
     * 2. 调用接口
     */
    handleClickBtn2 () {
      // 修改之前数据
      const _old = this.staffData.staff_infolder.filter(item => !item.hasOwnProperty('role_type')) // 去除 管理员/超管
      // 修改之后数据
      const _new = this.$refs.cooperateMng.getStaffData().staff_infolder.filter(item => !item.hasOwnProperty('role_type'))
      // 分开
      let _add = []
      let _modify = []
      let _del = []
      // 聚合, 发送接口
      let _staffInfolder = {}

      // 计算
      _add = _new.filter(item => _old.findIndex(innerItem => item.user_id === innerItem.user_id) === -1)
        .map(item => ({ user_id: item.user_id, type: item.type }))
      _del = _old.filter(item => _new.findIndex(innerItem => item.user_id === innerItem.user_id) === -1)
        .map(item => ({ user_id: item.user_id, deleted: 1 }))
      // 找到都有的, 进行比对得出修改的
      // 1. 第一个filter 找到共同的
      // 2. 地热个filter 找到共同的中, type 不一样的
      // 3. 转成发送接口的格式
      _modify = _new.filter(item => _old.findIndex(innerItem => item.user_id === innerItem.user_id) !== -1)
        .filter(item => _old.find(innerItem => innerItem.user_id === item.user_id).type !== item.type)
        .map(item => ({ user_id: item.user_id, type: item.type }))
      _staffInfolder = {
        add: _add,
        modify: _modify,
        del: _del
      }
      this.updateFolderUser(_staffInfolder)
    },
    /**
     * 设置协作成员管理的类型, ref 调用
     * @param flag 文件? 文件夹?
     * @param data 文件夹id
     */
    setCooperateType ({ flag, data }) {
      this.flag = flag
      this.currentId = data.id
      this.currentF = data
      this.getCooperateMembers()
    },
    /**
     * 获取协作成员列表, 根据 flag 区分
     */
    getCooperateMembers () {
      this.flag === 'file' ? this.getFileUser() : this.getFolderUser()
    },
    /**
     * 获取 文件夹 协作成员列表
     */
    async getFolderUser () {
      try {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
        const res = await this.$api.getFolderUser({ fileId: '', folderId: this.currentId, companyId: this.currentDataSpaceIdGetter })
        this.responseData = res.data
        // 处理数据, 区分出 staff_infolder 和 staff_outfolder
        const _staffData = this.dataProcess(res.data)
        this.staffData = JSON.parse(JSON.stringify(_staffData))
        // 获取当前用户在企业中的权限
        await this.getUserPermission()
        // 设置到组件中
        this.$refs.cooperateMng.setStaffData(_staffData)
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      } catch (err) {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        console.log(err)
        this.$msgMnger.httpError(err)
      }
    },
    /**
     * 获取文件协作成员列表
     */
    async getFileUser () {
      try {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
        const res = await this.$api.getFolderUser({ fileId: this.currentId, folderId: '', companyId: this.currentDataSpaceIdGetter })
        console.log(res)
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      } catch (err) {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        console.log(err)
        this.$msgMnger.httpError(err)
      }
    },
    /**
     * 处理数据, 返回 staff_data 区分 staff_infolder 和 staff_outfolder
     * @param data
     * @returns {{}}
     */
    dataProcess (data) {
      // 三种类型: 1. 当前的 超管/管理 2. staff_infolder 非管理 超管的成员 3. 曾经当过管理员的用户
      // 另外三个变量: 1. 当前对于文件夹的权限 2. 拥有者id 3. 当前用户在企业的角色
      // const _manager = data.managers.filter(item => item.manager_type !== 1) // 1. 超管/管理
      // debugger
      const _manager = data.managers.filter(item => item.type !== 3) // 1. 超管/管理
      // const _inFolder = data.staff_infolder.filter(item => data.managers.findIndex(innerItem => innerItem.id === item.id) === -1)
      const _inFolder = data.staff_infolder
      // const _everManager = data.managers.filter(item => item.manager_type === 1)
      let _outFolder = data.staff_outfolder
      // 1. 管理员加入到 inFolder 中
      // _inFolder.push(..._manager.map(item => {
      //   this.$set(item, 'role_type', item.type) // 设置企业角色信息
      //   item.type = 1 // 设置 文件夹/文件的 管理者权限
      //   return item
      // }))
      _inFolder.forEach(item => {
        const _managerItem = _manager.find(innerItem => innerItem.id === item.id)
        if (_managerItem) {
          this.$set(item, 'role_type', _managerItem.type)
        }
      })
      // 2. 曾经做过管理员的用户 加入到 infolder 中
      // 2.1. 过滤掉 _inFolder 中重复的
      // const _filteredEverManager = _everManager.filter(item => _inFolder.findIndex(innerItem => innerItem.id === item.id) === -1)
      // // 2.2 加入到 _inFolder 中
      // _inFolder.push(..._filteredEverManager.map(item => {
      //   item.type = 1
      //   return item
      // }))
      // 至此, inFolder 是 干净的, 且带 role_type 信息
      // 3. 过滤掉 _outFolder 中重复的(拿到 _outFolder 中 _inFolder 中没有的)
      _outFolder = _outFolder.filter(item => _inFolder.findIndex(innerItem => innerItem.id === item.id) === -1)
      return {
        staff_infolder: _inFolder,
        staff_outfolder: _outFolder
      }
    },
    /**
     * 获取用户在当前企业中的角色, 用以判断禁用关系
     * @returns {Promise<void>}
     */
    async getUserPermission () {
      try {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
        const res = await this.$api.getUserPermission({ company_id: this.currentDataSpaceIdGetter, check_type: 1 })
        this.currentUserRole = res.data
        // this.currentUserRole = 3
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      } catch (err) {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        console.log(err)
        this.$msgMnger.httpError(err)
      }
    },
    /**
     * 更新协作成员列表
     * @param staffInFolder
     * @returns {Promise<void>}
     */
    async updateFolderUser (staffInFolder) {
      try {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
        const res = await this.$api.updateFolderUser({
          company_id: this.currentDataSpaceIdGetter,
          folder_id: this.currentId,
          staff_infolder: JSON.stringify(staffInFolder)
        })
        this.$msgMnger.success(res.msg)
        // 重新请求列表
        // await this.getFolderUser()
        // 成功，关闭对话框
        this.$refs.flowFileDialog.updateVisible(false)
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      } catch (err) {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        console.log(err)
        this.$msgMnger.httpError(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cooperate-mng-dialog {}
</style>
