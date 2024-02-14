import axios from '@/http/api'
const version = '/api/v2'

// 企业声母列表查询
export const companyPinyin = () => {
  return axios({
    url: `${version}/fc/acount/company_pinyin`,
    method: 'get'
  })
}

// 企业搜索
export const companySearch = (params) => {
  return axios({
    url: `${version}/fc/acount/company_search`,
    method: 'get',
    params
  })
}

// 下载记录查询
export const getDownloadRecords = (params) => {
  return axios({
    url: `${version}/fc/acount/downloadlogs`,
    method: 'get',
    params
  })
}
