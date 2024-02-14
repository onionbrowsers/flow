import axios from '@/http/api'

export const version = '/api/v2'

// 查询制度
// company_id 企业空间id
export const getMySystemInfo = data => {
  return axios({
    url: `${version}/fc/flow/show_system_manage`,
    method: 'get',
    params: data
  })
}
// 下载制度清单
// company_id 企业空间id
export const downMySystemInfo = data => {
  return axios({
    url: `${version}/fc/flow/down_system_table`,
    method: 'get',
    params: data
  })
}
// company_id 企业空间id
export const downByidSystemInfo = (id) => {
  return axios({
    url: `${version}/fc/flow/down_system_manage/${id}`,
    method: 'get'
  })
}
// 新增制度制度
export const addMySystem = data => {
  return axios({
    url: `${version}/fc/flow/flow_system_add`,
    method: 'post',
    data
  })
}
// 删除制度
export const deleMySystem = id => {
  return axios({
    url: `${version}/fc/flow/delete_system_manage/${id}`,
    method: 'post'
    // data: data
  })
}

// 获取风险数据库列表
// company_id 企业空间id
export const getriskDataStoreli = data => {
  return axios({
    url: `${version}/fc/flow/post_risk_data`,
    method: 'post',
    data: data
  })
}
// 下载风险数据库列表
// company_id 企业空间id
export const downriskDataStoreli = data => {
  return axios({
    url: `${version}/fc/flow/down_risk_table`,
    method: 'get',
    params: data
  })
}
// 获取证据清单库
// company_id 企业空间id
export const geteviInfoli = data => {
  return axios({
    url: `${version}/fc/flow/post_evidence_info`,
    method: 'post',
    data: data
  })
}
// 下载证据清单库
// company_id 企业空间id
export const downeviInfoli = data => {
  return axios({
    url: `${version}/fc/flow/down_evidence_table`,
    method: 'get',
    params: data
  })
}
// 获取所属企业列表
export const getSecondaryLi = id => {
  return axios({
    url: `${version}/fc/flow/get_secondary_company/${id}`,
    method: 'get'
  })
}
