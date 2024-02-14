import axios from '@/http/api'
const version = '/api/v2'
// oauth path

// 更新企业信息
export const updateEnterpriseInformation = (data) => {
  return axios({
    url: `${version}/fc/permission/update_company_info`,
    method: 'post',
    data: data
  })
}

// 成员管理列表
export const memberMngList = (data) => {
  return axios({
    url: `${version}/fc/permission/get_company_staff/${data}`,
    method: 'get'
  })
}

// 成员管理列表
export const editMemberAuth = (data) => {
  return axios({
    url: `${version}/fc/permission/update_company_staff`,
    method: 'post',
    data: data
  })
}

/**
 * 获取各库对应成员列表
 * @param  companyId
 * @param  secondaryId
 * @param  folderId
 */
export const memberLibList = (data) => {
  return axios({
    url: `${version}/fc/permission/get_library_user`,
    method: 'get',
    params: data
  })
}

/**
 * 获取发送邀请列表
 * @param companyId 企业 id
 */
export const getSentInvitation = ({ companyId }) => {
  return axios({
    url: `${version}/fc/permission/get_sent_invitation`,
    method: 'get',
    params: {
      company_id: companyId
    }
  })
}

/**
 * 用户发出/添加邀请
 * @param companyName 公司名字
 * @param companyId 企业 id
 * @param phone 被邀请人手机号
 */
export const addInvitation = ({ companyName, companyId, phone }) => {
  return axios({
    url: `${version}/fc/permission/add_invitation`,
    method: 'post',
    data: {
      company_name: companyName,
      company_id: companyId,
      phone
    }
  })
}
