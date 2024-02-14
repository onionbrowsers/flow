import * as usrInfo from './usr-info'
import * as downloadRecord from './download-record'
import * as quotaMng from './quota-mng'
function mount () {
  this.$api['userPhoneReset'] = usrInfo.userPhoneReset
  this.$api['userRestPwd'] = usrInfo.userRestPwd
  this.$api['changeUserInfo'] = usrInfo.changeUserInfo
  this.$api['getReceivedInvitation'] = usrInfo.getReceivedInvitation
  this.$api['updateInvitation'] = usrInfo.updateInvitation
  this.$api['companyPinyin'] = downloadRecord.companyPinyin
  this.$api['companySearch'] = downloadRecord.companySearch
  this.$api['getDownloadRecords'] = downloadRecord.getDownloadRecords
  this.$api['acountCharge'] = quotaMng.acountCharge
  this.$api['getAcountCharges'] = quotaMng.getAcountCharges
  this.$api['getChargeTotal'] = quotaMng.getChargeTotal
  this.$api['getCompanyCharges'] = quotaMng.getCompanyCharges
  this.$api['putCompanyCharges'] = quotaMng.putCompanyCharges
}

export default {
  mount
}
