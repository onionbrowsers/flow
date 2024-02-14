
import * as login from './login'

function mount () {
  // 流程文件列表
  this.$api['oauthPath'] = login.oauthPath
  this.$api['bcLogin'] = login.bcLogin
  this.$api['getUserInfo'] = login.getUserInfo
  this.$api['checkUserName'] = login.checkUserName
  this.$api['bcRegister'] = login.bcRegister
  this.$api['getVerifyCode'] = login.getVerifyCode
  this.$api['resetPwd'] = login.resetPwd
  this.$api['checkCode'] = login.checkCode
  this.$api['getReceivedList'] = login.getReceivedList
}

export default {
  mount
}
