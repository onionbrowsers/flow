
import axios from './api'
const version = '/api/v2'

// search
const getSearchHistory = () => {
  return axios({
    url: `${version}/fc/flow/search`,
    method: 'get'
  })
}

const deleteSearchHistroy = (searchId) => {
  return axios({
    url: `${version}/fc/search/${searchId}`,
    method: 'delete'
  })
}

/**
 * 获取用户的权限, 可单独查询企业/文件夹/文件的权限
 * @param params 可选值: folder_id, file_id; 必填 company_id, check_type(查询的类型 1 企业角色 2 文件夹 3 文件)
 * @returns {Promise<unknown>}
 */
const getUserPermission = params => {
  return axios({
    url: `${version}/fc/permission/get_user_permission`,
    method: 'get',
    params
  })
}

export const apiURL = () => `http://47.93.35.179:8022`

export default {
  getSearchHistory,
  deleteSearchHistroy,
  apiURL,
  getUserPermission
}
