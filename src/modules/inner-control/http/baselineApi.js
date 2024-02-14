import axios from '@/http/api'

export const version = '/api/v2'

// 获取底稿管理表格数据
export const getBaselineTable = data => {
  console.log(data)
  return axios({
    // url: `${version}/fc/evaluation/get_draft_manage/${data.companyId}`,
    url: `${version}/fc/evaluation/get_draft_manage/1011`,
    method: 'get',
    params: data
  })
}

// 获取工程管理
export const getProjectManList = data => {
  return axios({
    url: `${version}/fc/evaluation/get_paper_info/4396`,
    method: 'get',
    params: data
  })
}
