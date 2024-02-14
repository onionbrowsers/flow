import axios from '@/http/api'

export const version = '/api/v2'

// 获取风险信息
// space_id 企业。空间id
export const getMyRiskCtrl = (data) => {
  return axios({
    url: `${version}/fc/file/get_all_risk`,
    method: 'get',
    params: data
  })
}
// 获取上级风险列表
// 传参 company_id
export const getMyRiskLevelinfo = (level, data) => {
  return axios({
    url: `${version}/fc/file/get_risk_info/${level}`,
    method: 'get',
    params: data
  })
}
// 获取矩阵风险列表
// 传参 company_id
export const getformLevelriskinfo = (riskpranet, data) => {
  return axios({
    url: `${version}/fc/file/risk_level_info/${riskpranet}`,
    method: 'get',
    params: data
  })
}

// 新增风险库
export const addNewMyRisk = data => {
  return axios({
    url: `${version}/fc/file/create_risk_info`,
    method: 'post',
    data: data
  })
  // return axios({
  //   url: `${version}/fc/file/add_risk`,
  //   method: 'post',
  //   data: data
  // })
}
// 更新风险库
export const updateMyRiskInfo = data => {
  return axios({
    url: `${version}/fc/file/update_risk_info`,
    method: 'post',
    data: data
  })
}
/**
 * 删除风险库
 * @param risk_id
 */
export const deleteMyRiskInfo = id => {
  return axios({
    url: `${version}/fc/file/delete_risk_info/${id}`,
    method: 'post'
  })
}
