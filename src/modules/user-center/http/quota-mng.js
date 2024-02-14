import axios from '@/http/api'
const version = '/api/v2'

// 额度充值
export const acountCharge = (data) => {
  return axios({
    url: `${version}/fc/acount/charge`,
    method: 'post',
    data
  })
}
// 查询额度充值记录
// 针对额度管理人员
export const getAcountCharges = (params) => {
  return axios({
    url: `${version}/fc/acount/charges`,
    method: 'get',
    params
  })
}
// 额度管理查询
// 针对企业人员
export const getChargeTotal = (params) => {
  return axios({
    url: `${version}/fc/acount/charge_total`,
    method: 'get',
    params
  })
}
// 企业管理查询
export const getCompanyCharges = (params) => {
  return axios({
    url: `${version}/fc/acount/company_charges`,
    method: 'get',
    params
  })
}
// 修改可用状态
export const putCompanyCharges = (data) => {
  return axios({
    url: `${version}/fc/acount/company_charge`,
    method: 'post',
    data
  })
}
