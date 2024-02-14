import axios from '@/http/api'
const version = '/api/v2'
// oauth path
export const userPhoneReset = (data) => {
  return axios({
    url: `${version}/fc/user/reset_phone`,
    method: 'post',
    data: data
  })
}

export const userRestPwd = (data) => {
  return axios({
    url: `${version}/fc/user/reset_pwd`,
    method: 'post',
    data: data
  })
}

export const changeUserInfo = (data) => {
  return axios({
    url: `${version}/fc/user/update_user_info`,
    method: 'post',
    data: data,
    headers: {
      'content-type': 'multipart/form-data'
    }
  })
}

/**
 * 获取用户受到邀请列表
 */
export const getReceivedInvitation = () => {
  return axios({
    url: `${version}/fc/permission/get_received_invitation`,
    method: 'get'
  })
}

/**
 * 变更邀请状态接口
 * @param inviterId 邀请人 id
 * @param companyId 企业 id
 * @param status 状态: 3: 接受 4: 拒绝
 */
export const updateInvitation = ({ inviterId, companyId, status }) => {
  return axios({
    url: `${version}/fc/permission/update_invitation`,
    method: 'post',
    data: {
      inviter_id: inviterId,
      company_id: companyId,
      status
    }
  })
}
