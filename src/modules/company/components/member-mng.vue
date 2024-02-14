<template>
  <div id="member-mng" v-loading="loading">
    <div class="item-con">
      <div class="item">
        <div class="img">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconSmatFlowzaixianliucheng"></use>
          </svg>
        </div>
        <div class="txt">全部成员</div>
      </div>
    </div>
    <div class="content">
      <div class="title">
        <div class="all-member">
          <span>全部成员：{{menberList.length}}</span>
        </div>
        <div class="invite-member" @click="handleInviteMemberClick" v-if="userType !== 3">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconyaoqingchengyuan"></use>
          </svg>
          <span>邀请成员</span>
        </div>
      </div>
      <div class="member-list">
        <el-scrollbar style="height:100%">
          <member-item :user-type="userType" :member-item="v" v-for="(v,i) in menberList" :class="i === order ? 'current-selected' : ''" :key="v.id" @click.stop.native="handleClick(i)">
            <template slot="drop-down" slot-scope="{ dropdownConfig }">
              <el-dropdown trigger="click" :class="{ 'member-mng__dropdown': (userType >= v.type) && (v.id !== userInfo.id) }">
                <span class="el-dropdown-link">
                  {{identity[v.type]}}
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#iconxiala"></use>
                  </svg>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <template v-for="(value, index) in dropdownConfig">
                    <el-dropdown-item :key="index" :command="value.command" :divided="value.command === -1" :disabled="v.id === userInfo.id" @click.native="editAuth(v, value.command)">{{value.label}}</el-dropdown-item>
                  </template>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </member-item>
        </el-scrollbar>
      </div>
    </div>
    <el-dialog
      title="移交企业权限"
      :visible.sync="dialogVisible"
      v-if="menberList.length"
      width="640px">
      <div class="txt">
        <div class="big-title">
          您确定要移交超级管理员权限给<span>【{{this.menberList[this.order || 0].username}}】</span>吗?
        </div>
        <div class="little-title">
          作为企业【{{currentDataSpaceGetter.name}}】的【超级管理员】，移交后您将变成企业普通成员，不能再行使管理者权限。请谨慎操作。
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="affirm" class="btn">确定移交</el-button>
        <el-button @click="dialogVisible = false" class="btn">取 消</el-button>
      </div>
    </el-dialog>
    <invite-dialog ref="inviteDialog" :userType="userType"></invite-dialog>
  </div>
</template>

<script>
import MemberItem from '../../../components/list-comp'
import InviteDialog from './invite-dialog'
import { mapGetters } from 'vuex'
export default {
  name: 'member-mng',
  components: {
    MemberItem,
    InviteDialog
  },
  filters: {

  },
  props: {

  },
  data () {
    return {
      dialogVisible: false, // dialog
      num: 18,
      order: null, // 当前点击
      identity: {
        '1': '超级管理员',
        '2': '管理员',
        '3': '企业用户'
      },
      menberList: [],
      // 当前用户在某企业中的权限
      userType: 3, // 1 超管 2 管理员 3 普通成员 -1 无权限
      params: {}, // 接口传递的参数
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo',
      currentDataSpaceGetter: 'currentDataSpaceGetter',
      currentDataSpaceIdGetter: 'currentDataSpaceIdGetter'
    })
  },
  watch: {
    currentDataSpaceIdGetter (val) {
      if (val === -1) return
      // 获取成员列表
      this.memberMngList()
      // 获取用户在当前企业的权限
      this.getUserPermission(this.$route.query.id || this.currentDataSpaceIdGetter)
      // 获取最新的企业列表
      this.getUserCompany()
    }
  },
  created () {

  },
  mounted () {
    // 获取成员列表
    this.memberMngList()
    // 获取用户在当前企业的权限
    this.getUserPermission(this.$route.query.id || this.currentDataSpaceIdGetter)
    // 获取最新的企业列表
    this.getUserCompany()
  },
  activated () {

  },
  beforeDestroy () {

  },
  methods: {
    handleClick (index) {
      this.order = index
    },
    // 获取成员管理列表
    memberMngList () {
      this.menberList = []
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      this.$api.memberMngList(this.$route.query.id || this.currentDataSpaceIdGetter).then(res => {
        this.menberList = res.data
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      }).catch(err => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        this.$msgMnger.error(err.msg)
      })
    },

    // 修改用户权限接口
    editMemberAuth (params) {
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      this.$api.editMemberAuth(params).then(res => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        this.memberMngList()
        this.getUserPermission(this.$route.query.id || this.currentDataSpaceIdGetter)
        this.$msgMnger.success(res.msg)
      }).catch(err => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        this.$msgMnger.httpError(err)
      })
    },
    // 点击弹窗的确认按钮
    affirm () {
      this.editMemberAuth(this.params)
      this.dialogVisible = false
    },
    /**
     * 邀请成员按钮点击
     */
    handleInviteMemberClick () {
      // 1. 判断当前用户的角色, 只有 超级管理员 / 管理员才可以邀请
      // 2. 打开邀请对话框
      this.$refs.inviteDialog.$refs.flowFileDialog.updateVisible(true)
    },
    /**
     * 获取用户在某企业中的权限
     * res: 1 超管 2 管理员 3 成员
     * @param id 某企业的id
     */
    getUserPermission (id) {
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      this.$api.getUserPermission({ company_id: id, check_type: 1 }).then(res => {
        // 赋值
        this.userType = res.data
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      }).catch(err => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        console.log(err)
        this.$msgMnger.httpError(err)
      })
    },
    /**
     * 修改权限
     * @param v 选中的item的数据
     * @param command 成员的身份 1 超管 2 管理员 3 普通成员
     */
    editAuth (v, command) {
      let _this = this
      if (command != 1) {
        this.$confirm(command == 2 ? '更改为管理员后，将会对企业空间内的所有文件夹内容可见，请确认！'
          : '更改为企业用户后，仅对企业空间内自己创建或被邀请进入的文件夹内容可见，请确认！', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.params = {
            staff_id: v.id,
            company_id: _this.$route.query.id || this.currentDataSpaceIdGetter
          }
          if (command !== -1) {
            _this.params.type = command
          } else {
            _this.params.deleted = 1
            _this.order = 0
          }
          if (command !== 1) {
            _this.editMemberAuth(_this.params)
          } else {
            _this.dialogVisible = true
          }
        }).catch(() => {

        })
      } else {
        this.params = {
          staff_id: v.id,
          company_id: this.$route.query.id || this.currentDataSpaceIdGetter
        }
        if (command !== -1) {
          this.params.type = command
        } else {
          this.params.deleted = 1
          this.order = 0
        }
        if (command !== 1) {
          this.editMemberAuth(this.params)
        } else {
          this.dialogVisible = true
        }
      }
    },
    /**
     * 获取用户加入的企业列表, 防止查看企业成员时, 企业成员数量与 header_bar 中展示的数量不一致的问题
     */
    getUserCompany () {
      this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
      this.$store.dispatch('GET_COMPANIES_ACTION', this).then(() => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      }).catch(err => {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        console.log(err)
        this.$msgMnger.httpError(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#member-mng{
  height: calc(100% - 16px);
  display: flex;
  margin-top: 16px;
  .item-con{
    width: 130px;
    height: 100%;
    background: white;
    border-radius:2px 0 0 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .item{
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      margin-top: 24px;
      cursor: pointer;
      .img{
        width:42px;
        height:42px;
        background:rgba(24,144,255,1);
        border-radius:4px;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .txt{
        width: 100%;
        color: #1890FF;
        font-size: 16px;
        line-height: 16px;
        margin-top: 4px;
        text-align: center;
      }
    }
  }
  .content{
    flex: 1;
    background: white;
    border-radius:2px 0 0 2px;
    border-left: 1px solid #E8E8E8;
    box-sizing: border-box;
    .title{
      height: 50px;
      border-bottom: 1px solid #e8e8e8;
      padding: 0 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .all-member{
        font-size: 16px;
        color: #252525;
        font-weight: 600;
      }
      .invite-member{
        font-size: 14px;
        color: #1890ff;
        cursor: pointer;
        .icon{
          margin-right: 4px;
        }
      }
    }
    .member-list{
      padding: 0 0 0 23px;
      box-sizing: border-box;
      height: calc(100% - 50px);
      .el-dropdown-link{
        display: flex;
        align-items: center;
        justify-content: space-between;
        color:rgba(37,37,37,1) !important;
      }
      .icon {
        width:10px;
        height:7px;
        margin-left: 8px;
        fill: #666666;
      }
    }
    .member-mng__dropdown {
      position: relative;
      .el-dropdown-link{
        color:rgba(153,153,153,1) !important;
      }
      .icon {
        fill: #E8E8E8;
      }
      &:after {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: 200;
        cursor: not-allowed;
      }
    }
  }
  .txt{
    width: 375px;
    margin: 0 auto;
    .big-title{
      font-size: 18px;
      color: #252525;
      font-weight: 600;
      margin-top: 33px;
      span{
        color: #1890FF;
      }
    }
    .little-title{
      font-size:12px;
      color:rgba(153,153,153,1);
      line-height:24px;
      margin-top: 32px;
      margin-bottom: 49px;
    }
  }
  .dialog-footer{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    .btn{
      width:160px;
      height:40px;
      border-radius:4px;
    }
    .btn:first-of-type{
      margin-right: 50px;
    }
    .btn:last-of-type{
      border: 1px solid #1890FF;
    }
  }
}
</style>

<style lang="scss">
  #member-mng{
    .el-dropdown-link {
      cursor: pointer;
      font-size:14px;
      color:rgba(37,37,37,1);
    }
    .el-icon-arrow-down {
      font-size: 12px;
    }
  }
  .el-dropdown-menu{
    padding: 0;
    left: auto;
    right: 56px;
  }
  .el-dropdown-menu__item, .el-dropdown-menu__item--divided{
    width: 150px;
    height: 36px;
  }
</style>
