import axios from '@/http/api'

export const version = '/api/v2'

// 获取模板列表
export const getTemplates = (params) => {
  return axios({
    url: `${version}/fc/template/page`,
    method: 'get',
    params
  })
}

// 搜索历史
export const getSearchTemplateHistory = (params) => {
  return axios({
    url: `${version}/fc/template/search`,
    method: 'get',
    params
  })
}

// 常用模板
export const getTemplateHot = (params) => {
  return axios({
    url: `${version}/fc/template/hot`,
    method: 'get',
    params
  })
}

export const deleteTmp = (tmpId) => {
  return axios({
    url: `${version}/fc/template/${tmpId}`,
    method: 'delete'
  })
}

export const downloadTmp = (tmpId) => {
  return axios({
    url: `${version}/fc/template/down/${tmpId}`,
    method: 'get'
  })
}

export const batchDownloadTmp = (ids, merge) => {
  return axios({
    url: `${version}/fc/template/down`,
    method: 'get',
    params: { template_ids: ids, merge: merge }
  })
}
