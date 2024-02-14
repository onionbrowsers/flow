import axios from '@/http/api'

export const version = '/api/v2'

// 获取文件
export const getFlowfileListFC = (params) => {
  return axios({
    url: `${version}/fc/flow/page`,
    method: 'get',
    params
  })
}

// 删除文件
export const deleteFlowList = (id) => {
  return axios({
    url: `${version}/fc/flow/${id}`,
    method: 'delete'
  })
}

// 更新文件
export const updateFile = (id, params) => {
  return axios({
    url: `${version}/fc/flow/${id}`,
    method: 'put',
    data: params
  })
}

// 下载文件
export const downloadFile = (id, type) => {
  return axios({
    url: `${version}/fc/flow/${id}/${type}`,
    method: 'get'
  })
}
