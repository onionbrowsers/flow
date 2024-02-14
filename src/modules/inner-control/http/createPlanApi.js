import axios from '@/http/api'

export const version = '/api/v2'

// 获取审批人列表
export const getMemberList = data => {
  return axios({
    url: `${version}/fc/permission/get_company_staff/${data.companyId}`,
    method: 'get'
  })
}
