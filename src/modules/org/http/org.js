import axios from '@/http/api'
const version = '/api/v2'
// oauth path

// 组织树
export const getOrgTree = (params) => {
  const { company_id } = params
  return axios({
    url: `${version}/fc/permission/get_tissue_tree/${company_id}`,
    method: 'get',
    params
  })
}

// 获取末级组织 
export const getFinalOrgList = (params) => {
  const { company_id } = params
  return axios({
    url: `${version}/fc/permission/get_final_organizatie/${company_id}`,
    method: 'get',
    params
  })
}
// 组织列表（下拉）
export const getSimpleOrgList = (params) => {
  const { company_id } = params
  return axios({
    url: `${version}/fc/permission/get_folder_upper/${company_id}`,
    method: 'get',
    params
  })
}

// 组织列表
export const getOrgList = (params) => {
  const { company_id } = params
  return axios({
    url: `${version}/fc/permission/get_organizatie_info/${company_id}`,
    method: 'get',
    params
  })
}

// 创建组织
export const createOrg = (data) => {
  const { company_id } = data
  return axios({
    url: `${version}/fc/permission/post_create_organizatie/${company_id}`,
    method: 'post',
    data
  })
}

// 更新组织
export const updateOrg = (data) => {
  const { id } = data
  return axios({
    url: `${version}/fc/permission/post_organizatie_edit/${id}`,
    method: 'post',
    data
  })
}

// 删除组织
export const deleteOrg = (data) => {
  return axios({
    url: `${version}/fc/permission/del_organizatie`,
    method: 'post',
    data
  })
}

// 员工列表
export const getSimpleStaffList = (params) => {
  const { company_id } = params
  return axios({
    url: `${version}/fc/permission/get_company_staff/${company_id}`,
    method: 'get',
    params
  })
}

// 员工列表
export const getStaffList = (params) => {
  const { company_id } = params
  return axios({
    url: `${version}/fc/permission/get_staff_info/${company_id}`,
    method: 'get',
    params
  })
}

// 创建员工
export const createStaff = (data) => {
  const { company_id } = data
  return axios({
    url: `${version}/fc/permission/post_create_staff/${company_id}`,
    method: 'post',
    data
  })
}

// 更新员工
export const updateStaff = (data) => {
  const { id, company_id } = data
  return axios({
    url: `${version}/fc/permission/post_staff_edit/${company_id}/${id}`,
    method: 'post',
    data
  })
}

// 删除员工
export const deleteStaff = (data) => {
  return axios({
    url: `${version}/fc/permission/del_staff`,
    method: 'post',
    data,
    // headers: {
    //   'content-type': 'application/json'
    // }
  })
}

// 岗位列表
export const getSimpleJobList = (params) => {
  const { company_id, org_id = '' } = params
  params.folder_id = org_id
  return axios({
    url: `${version}/fc/permission/get_job_all/${company_id}`,
    method: 'get',
    params
  })
}

// 岗位列表
export const getJobList = (params) => {
  const { company_id } = params
  return axios({
    url: `${version}/fc/permission/get_job_info/${company_id}`,
    method: 'get',
    params
  })
}

// 创建岗位
export const createJob = (data) => {
  const { company_id } = data
  return axios({
    url: `${version}/fc/permission/post_create_job/${company_id}`,
    method: 'post',
    data
  })
}

// 更新岗位
export const updateJob = (data) => {
  const { id } = data
  return axios({
    url: `${version}/fc/permission/post_job_edit/${id}`,
    method: 'post',
    data
  })
}

// 删除岗位
export const deleteJob = (data) => {
  return axios({
    url: `${version}/fc/permission/del_job`,
    method: 'post',
    data
  })
}
