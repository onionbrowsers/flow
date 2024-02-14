import axios from '@/http/api'

export const version = '/api/v2'

// 新增我的风险识别库
export const addriskidentifi = (data) => {
  return axios({
    url: `${version}/fc/flow/add_risklib`,
    method: 'post',
    data
  })
}
// 展示我的风险识别库信息
export const showriskidentifili = (data) => {
  return axios({
    url: `${version}/fc/flow/risklib_info`,
    method: 'get',
    params: data
  })
}

// 删除我的风险识别库
export const deleteriskidentifi = (id, data) => {
  return axios({
    url: `${version}/fc/flow/delete_risklib/${id}`,
    method: 'post',
    data
  })
}
// 下载我的风险识别库文件
export const downriskidentifi = (id) => {
  return axios({
    url: `${version}/fc/flow/down_risklib/${id}`,
    method: 'get'
  })
}

/// 我的表单文件库
// 新增我的表单文件库
export const addmyformfile = (data) => {
  return axios({
    url: `${version}/fc/flow/add_formfile`,
    method: 'post',
    data
  })
}
// 展示我的表单文件库信息
export const showmyformfile = (data) => {
  return axios({
    url: `${version}/fc/flow/formfile_info`,
    method: 'get',
    params: data
  })
}

// 删除我的表单文件库
export const deletemyformfile = (id, data) => {
  return axios({
    url: `${version}/fc/flow/delete_formfile/${id}`,
    method: 'post',
    data
  })
}
// 下载我的表单文件库
export const downmyformfile = (id) => {
  return axios({
    url: `${version}/fc/flow/down_formfile/${id}`,
    method: 'get'
  })
}
