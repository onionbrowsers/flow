import axios from '@/http/api'

export const version = '/api/v2'

/**
 * 获取用户加入的企业列表
 */
export const getUserCompany = () => {
  return axios({
    url: `${version}/fc/permission/get_user_company`,
    method: 'get'
  })
}

/**
 * 添加企业/组织, 即用户创建企业
 * @param name
 * @param size
 * @param phone
 */
export const addCompany = ({ name, size, phone, c_type }) => {
  return axios({
    url: `${version}/fc/permission/add_company`,
    method: 'post',
    data: {
      name,
      size,
      c_type,
      phone
    }
  })
}

/**
 * 协作成员管理
 * @param data company_id 必须, staff_infolder 必须, file_id 选填, folder_id 选填
 */
export const updateFolderUser = data => {
  return axios({
    url: `${version}/fc/permission/update_folder_user`,
    method: 'post',
    data
  })
}

/**
 * 获取用户相关的文件夹接口
 * @param companyId
 */
export const getUserFolder = ({ companyId, secondary_id }) => {
  return axios({
    url: `${version}/fc/permission/get_user_folder`,
    method: 'get',
    params: {
      company_id: companyId,
      secondary_id: secondary_id
    }
  })
}

// 获取企业类型目录
export const getOrgUserFolder = ({ companyId }) => {
  return axios({
    url: `${version}/fc/permission/get_primary_organization/${companyId}`,
    method: 'get'
  })
}

// 获取子目录
export const getOrgUserSubFolder = (params) => {
  return axios({
    url: `${version}/fc/permission/get_conform_folder/${params.folderId}`,
    method: 'get',
    params
  })
}

/**
 * 用户添加文件夹
 * @param name str 名称
 * @param companyId int 企业id
 * @param type int 数据空间类型 1: 企业; 2: 个人
 */
export const addFolder = ({ name, companyId, type }) => {
  return axios({
    url: `${version}/fc/permission/add_folder`,
    method: 'post',
    data: {
      name,
      company_id: companyId,
      type
    }
  })
}

/**
 * 获取文件夹/文件协作成员
 * @param folderId
 * @param companyId
 * @param fileId
 */
export const getFolderUser = ({ folderId, companyId, fileId }) => {
  const params = {}
  params['company_id'] = companyId
  if (folderId) {
    params['folder_id'] = folderId
  }
  if (fileId) {
    params['file_id'] = fileId
  }
  return axios({
    url: `${version}/fc/permission/get_folder_user`,
    method: 'get',
    params
  })
}

export const updateFolderInfo = (data) => {
  return axios({
    url: `${version}/fc/permission/update_folder_info`,
    method: 'post',
    data
  })
}

// 查询编辑文件状态
export const searchFoldEditus = (flodId) => {
  return axios({
    url: `${version}/fc/search/editor_info/${flodId}`,
    method: 'get'
  })
}
// 复制文件
export const copyFoldFiles = (fileId, data) => {
  return axios({
    url: `${version}/fc/flow/copy/${fileId}`,
    method: 'post',
    data
  })
}

export const getFolderCatalog = ({ folderId }) => {
  return axios({
    url: `${version}/fc/permission/get_folder_catalog/${folderId}`,
    method: 'get'
  })
}

export const addUpdateCatalog = ({ catalogList }) => {
  return axios({
    url: `${version}/fc/permission/add_update_catalog`,
    method: 'post',
    data: {
      catalist: JSON.stringify(catalogList)
    }
  })
}

// 添加/修改项目自动编号配置（已完成
export const addUpdateConfig = (data) => {
  return axios({
    url: `${version}/fc/permission/add_update_config`,
    method: 'post',
    data
  })
}
