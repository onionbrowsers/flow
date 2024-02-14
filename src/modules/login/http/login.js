import axios from '@/http/api'
const version = '/api/v2'
// oauth path
export const oauthPath = () => {
  return '/login'
}

export const bcLogin = (params) => {
  return axios({
    url: `${version}/fc/user/login`,
    method: 'post',
    data: params
  })
}

// old version
// export const getUserInfo = () => {
//   return axios({
//     url: `${version}/user_manage/manager_info`,
//     method: 'get'
//   })
// }

// new version
export const getUserInfo = () => {
  return axios({
    url: `${version}/fc/user/user_info`,
    method: 'get'
  })
}

export const bcRegister = (data) => {
  return axios({
    url: `${version}/fc/user/register`,
    method: 'post',
    data: data
  })
}

export const getVerifyCode = (phone, type) => {
  return axios({
    url: `${version}/fc/user/send_code`,
    method: 'post',
    data: {
      phone: phone,
      type: type
    }
  })
}

export const resetPwd = (data) => {
  return axios({
    url: `${version}/fc/user/reset_pwd`,
    method: 'post',
    data: data
  })
}

export const checkCode = (data) => {
  return axios({
    url: `${version}/fc/user/check_code`,
    method: 'post',
    data: data
  })
}

export const checkUserName = () => {
  return axios({
  })
}

export const getReceivedList = () => {
  return axios({
    url: `${version}/fc/permission/get_received_invitation`,
    method: 'get'
  })
}
