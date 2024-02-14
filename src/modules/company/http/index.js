import * as company from './company'
function mount () {
  this.$api['updateEnterpriseInformation'] = company.updateEnterpriseInformation
  this.$api['memberMngList'] = company.memberMngList
  this.$api['memberLibList'] = company.memberLibList // 获取各库对应成员列表
  this.$api['editMemberAuth'] = company.editMemberAuth
  this.$api['getSentInvitation'] = company.getSentInvitation // 发送邀请列表接口
  this.$api['addInvitation'] = company.addInvitation // 邀请接口
}

export default {
  mount
}
