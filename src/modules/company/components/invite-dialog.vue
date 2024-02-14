<template>
  <flow-file-dialog
    class="invite-dialog__dialog"
    ref="flowFileDialog"
    width="760px"
    :title="dlgConfigs.title"
    :showClose="true"
    :destroyOnClose="true"
    @clickBtn1="handleClickBtn1"
    @clickBtn2="handleClickBtn2"
  >
    <div class="invite-container" slot="one">
      <el-row class="invite__form">
        <el-col :span="19">
          <el-input
            v-model="phoneNumber"
            placeholder="输入手机号，直接添加成员进入企业"
            @change="handleInviteClick"
          ></el-input>
        </el-col>
        <el-col :offset="1" :span="4">
          <el-button
            type="primary"
            :disabled="buttonDisabledComputed"
            @click="handleInviteClick"
          >邀 请</el-button>
        </el-col>
      </el-row>
      <div class="invite__invited-list">
        <el-scrollbar style="height: 300px;">
          <usr-item
            v-for="item in inviteeList"
            :key="item.phone"
            :usr-info="{ name: item.invitee_name, phone: item.phone, image: '', gender: -1 }"
          >
            <span class="invited-list__info" style="margin-right: 10px;">已发出邀请</span>
          </usr-item>
        </el-scrollbar>
      </div>
      <div class="invite__system-info">
        <svg class="icon system-info__icon" aria-hidden="true">
          <use xlink:href="#iconzhuyi"></use>
        </svg>
        <span class="system-info__info">已接受/已拒绝邀请的用户不在该列表展示</span>
      </div>
    </div>
  </flow-file-dialog>
</template>

<script>
/**
 * 注意:
 */
import FlowFileDialog from '../../flowchart/components/public/flowfile-dialog'
import UsrItem from '@/components/public/usr-item'
import validate from '../../../utils/validate'
import { mapGetters } from 'vuex'
export default {
  name: 'invite-dialog',
  components: {
    FlowFileDialog,
    UsrItem
  },
  data () {
    return {
      dlgConfigs: {
        title: '邀请成员'
      },
      phoneNumber: '',
      // 受邀人列表
      inviteeList: []
    }
  },
  computed: {
    buttonDisabledComputed () {
      return !validate.validatePhone(this.phoneNumber)
    },
    ...mapGetters(['allDataSpaceGetter'])
  },
  mounted () {
    this.getSentInvitation()
  },
  methods: {
    handleShow (companyId) {
      this.companyId = companyId
      this.$refs.flowFileDialog.updateVisible(true)
      this.getSentInvitation()
    },
    handleClickBtn1 () {},
    handleClickBtn2 () {},
    /**
     * 邀请按钮点击时的逻辑
     */
    handleInviteClick () {
      if (!validate.validatePhone(this.phoneNumber)) {
        this.$msgMnger.error('请输入正确的手机号!')
        return
      }
      const _companyName = this.allDataSpaceGetter.find(item => item.id === Number(this.getCompanyId())).name
      this.addInvitation({ companyName: _companyName, companyId: this.getCompanyId(), phone: this.phoneNumber })
    },

    getCompanyId () {
      return this.companyId || this.$route.query.id
    },
    /**
     * 获取已邀请用户列表
     */
    async getSentInvitation () {
      try {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
        const res = await this.$api.getSentInvitation({ companyId: this.getCompanyId() })
        // 赋值
        this.inviteeList = res.data
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
      } catch (err) {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'end' })
        console.log(err)
        this.$msgMnger.httpError(err)
      }
    },
    /**
     * 发送邀请
     * @param companyName 企业名字
     * @param companyId 企业 id
     * @param phone 被邀请人电话
     * @returns {Promise<void>}
     */
    async addInvitation ({ companyName, companyId, phone }) {
      if (this.inviteeList.find(item => item.phone === phone)) {
        this.$msgMnger.error('您已邀请过此用户!')
        return
      }
      try {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
        // 发邀请
        const res = await this.$api.addInvitation({ companyName, companyId, phone })
        // 显示响应信息
        this.$msgMnger.success(res.msg)
        // 刷新列表
        await this.getSentInvitation()
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
@import "@/styles/index.scss";
.invite-container {
  padding: 20px 50px;
  .invite__form {
    margin-bottom: 30px;
    .el-input {
      width: 100% !important;
    }
    .el-button {
      width: 100% !important;
    }
  }
  .invite__invited-list {
    margin-bottom: 25px;
  }
  .invite__system-info {
    .system-info__icon {
      margin-right: 3px;
    }
    .system-info__info {
      color: $base-text-color-lighter;
    }
  }
}
</style>
