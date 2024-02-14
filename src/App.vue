<template>
  <div id="app">
    <component :is="layout">
      <router-view/>
    </component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
const defaultLayout = 'fullPage'
export default {
  name: 'App',
  data () {
    return {
      doneShowInvitedDialog: false
    }
  },
  computed: {
    layout () {
      return (this.$route.meta.layout || defaultLayout) + '-layout'
    },
    ...mapGetters(['receivedList'])
  },
  watch: {
    '$route': {
      handler (to) {
        // this.statsToCNZZ()
      },
      deep: true
    },
    receivedList: {
      handler (newList) {
        if (this.doneShowInvitedDialog) { // 若已展示过
          return
        }
        if (newList.length === 0) { // 若列表为空
          return
        }
        const _newInvite = newList[0]
        console.log('_newInvite is: ', _newInvite)
        this.$confirm(`
          <div style="padding-left: 20px;">
            <span>${_newInvite.inviter_name}邀请您加入<i style="font-style: normal; color: #1890FF;">【${_newInvite.company_name}】</i></span>
          </div>
        `, '您有新的邀请', {
          dangerouslyUseHTMLString: true,
          distinguishCancelAndClose: true,
          confirmButtonText: '接受邀请',
          cancelButtonText: '拒绝邀请'
        }).then(async () => {
          await this.updateInvitation({ row: _newInvite, status: 3 })
          // this.$message({
          //   type: 'info',
          //   message: '保存修改'
          // })
          this.doneShowInvitedDialog = true
        })
          .catch(async action => {
            if (action === 'cancel') {
              // this.$message({
              //   message: '拒绝'
              // })
              await this.updateInvitation({ row: _newInvite, status: 4 })
              this.doneShowInvitedDialog = true
            } else if (action === 'close') {
              this.doneShowInvitedDialog = true
            }
          })
      },
      deep: true
    }
  },
  created () {
    this.$msgMnger.bindContext(this)
    let _search = window.location.search
    let _tmpTokens = _search.split('?t=')
    if (_tmpTokens.length > 1) {
      let _token = _tmpTokens[1]
      this.$store.dispatch('AUTH_TOKEN', _token)
      window.location.href = '/'
    }
  },
  mounted () {
    // this.initCNZZ() 需要在cnzz上新建应用
    // this.getUserInfo()
    // this.getUserCompany()
    // 用于页面刷新时, 重新获取公司数据
    if (this.$store.getters.isAuthenticated) {
      this.getUserCompany()
      this.$store.dispatch('GET_USER_INFO', this)
      this.$store.dispatch('GET_RECEIVED_LIST', this)
    }
  },
  methods: {
    initCNZZ () {
      const script = document.createElement('script')
      script.src = 'https://s95.cnzz.com/z_stat.php?id=1277610437&web_id=1277610437'
      script.language = 'JavaScript'
      document.body.appendChild(script)
    },
    statsToCNZZ () {
      if (window._czc) {
        let location = window.location
        let contentUrl = location.pathname + location.hash
        let refererUrl = '/'
        window._czc.push(['_trackPageview', contentUrl, refererUrl])
      }
    },
    getUserInfo () {
      this.$api.getUserInfo().then(res => {
        this.$store.dispatch('USER_INFO', res.data)
      }).catch(err => {
        this.$msgMnger.httpError(err)
      })
    },
    /**
     * 获取用户加入的企业
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
    },
    /**
     * 更新邀请状态
     * @param row 表行数据
     * @param status 变更状态 3: 接受 4 拒绝
     */
    async updateInvitation ({ row, status }) {
      try {
        this.$store.commit('MUTATE_LOADING_STACK', { flag: 'start' })
        // 1. 更新邀请状态
        const res = await this.$api.updateInvitation({ inviterId: row.inviter_id, companyId: row.company_id, status })
        // 2. 给出提醒
        this.$msgMnger.success(res.msg)
        // 3. 获取新的列表
        // await this.getReceivedInvitation()
        // 4. 如果更新为接受状态, 则重新获取全部数据空间
        await this.$store.dispatch('GET_RECEIVED_LIST', this)
        if (status === 3) {
          await this.$store.dispatch('GET_COMPANIES_ACTION', this)
        }
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

<style lang="scss">
@import './assets/css/font/font.css';
@import './assets/css/font1/font1.css';
@import '@/styles/index.scss';
#app {
  font-family: 'PingFangSC-light', 'Microsoft YaHei', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $default-text-color;
  .el-tooltip{
    outline: none !important;
  }
}
</style>
