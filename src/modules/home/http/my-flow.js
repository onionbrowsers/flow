import axios from '@/http/api'

export const version = '/api/v2'

/**
 * 获取用户相关的文件夹接口
 * @param params
 */
export const getFile = params => {
  return axios({
    url: `${version}/fc/permission/get_file`,
    method: 'get',
    params
  })
}

/**
 * 新建流程图
 * @param data
 */
export const addFlow = data => {
  return axios({
    url: `${version}/fc/flow`,
    method: 'post',
    data
  })
}

/**
 * 删除文件
 * @param data
 */
export const updateFile = data => {
  return axios({
    url: `${version}/fc/permission/update_file_info`,
    method: 'post',
    data: data
  })
}
/**
 * 移动文件
 * @param data
 */
export const moveFile = data => {
  return axios({
    url: `${version}/fc/permission/update_folder_file`,
    method: 'post',
    data: data
  })
}
/*
 * 查询历史版本
 * @param data
 */
export const flowhistoryver = (flow_id) => {
  return axios({
    url: `${version}/fc/flow/version_info/${flow_id}`,
    method: 'post'
  })
}

// 矩阵文件查询
export const getmatrixFiles = data => {
  return axios({
    url: `${version}/fc/flow/show_customer_control_matrix`,
    method: 'get',
    params: data
  })
}

// 矩阵风险文件上传
export const uploadmatrixFile = data => {
  return axios({
    url: `${version}/fc/flow/save/customer_control_matrix_add`,
    method: 'post',
    data: data
  })
}
// 删除矩阵风险文件
export const deletematrixFile = id => {
  return axios({
    url: `${version}/fc/flow/delete_customer_control_matrix/${id}`,
    method: 'post'
  })
}
export const downloadmatrixFile = id => {
  return axios({
    url: `${version}/fc/flow/down_customer_control_matrix/${id}`,
    method: 'get'
  })
}

// 内控手册查询
export const getInterNallibs = data => {
  return axios({
    url: `${version}/fc/flow/show_internal_control_manual`,
    method: 'get',
    params: data
  })
}

// 内控手册文件上传
export const uploadInterNallibs = data => {
  return axios({
    url: `${version}/fc/flow/save/internal_control_manual_add`,
    method: 'post',
    data: data
  })
}
// 删除内控手册
export const deleteInterNallibs = id => {
  return axios({
    url: `${version}/fc/flow/delete_internal_control_manual/${id}`,
    method: 'post'
  })
}
// 下载内控手册
export const downloadInterNallibs = id => {
  return axios({
    url: `${version}/fc/flow/down_internal_control_manual/${id}`,
    method: 'get'
  })
}
// 获取内控手册文件
export const getctrlManualName = (data) => {
  return axios({
    url: `${version}/fc/flow/fileinfo/manual_pdf`,
    method: 'get',
    params: data
  })
}

// 多文件上传
export const manyFileupload = (flow_id, data) => {
  return axios({
    url: `${version}/fc/flow/upload_visio_script/${flow_id}`,
    method: 'post',
    data: data
  })
}
// 多文件上传
export const manyFilePageDat = (flow_id, pageId) => {
  return axios({
    url: `${version}/fc/flow/page_data/${flow_id}/${pageId}`,
    method: 'get'
  })
}
// 多文件上传
export const saveDraverio = (flow_id, data) => {
  return axios({
    url: `${version}/fc/flow/save_drawio_script/${flow_id}`,
    method: 'post',
    data: data
  })
}
// 获取内控文件展示pdf
export const getctrlneiCtrlName = (data) => {
  return axios({
    url: `${version}/fc/flow/fileinfo/manual_pdf`,
    method: 'get',
    params: data
  })
}

// 新增我的图库
export const addNewImglibrary = data => {
  return axios({
    url: `${version}/fc/flow/create_visio_library`,
    method: 'post',
    data: data
  })
}
// 我的图库查询
export const getImgLibrary = data => {
  return axios({
    url: `${version}/fc/flow/visio_library_info`,
    method: 'get',
    params: data
  })
}
// 删除我的图库
export const deleteImgLibrary = id => {
  return axios({
    url: `${version}/fc/flow/delete_visio/${id}`,
    method: 'post'
  })
}
// 下载我的图库
export const downloadImgLibrary = id => {
  return axios({
    url: `${version}/fc/flow/down_visio/${id}`,
    method: 'get'
  })
}

// 保存手册名称
export const saveNewCatalogName = (data) => {
  return axios({
    url: `${version}/fc/flow/post_save_catalog_name`,
    method: 'post',
    data: data
  })
}
// 重命名手册名称
export const reSaveCatalogName = (data) => {
  return axios({
    url: `${version}/fc/flow/post_rename_manual`,
    method: 'post',
    data: data
  })
}
// 根据手册Id获取目录
export const getCatalogBookLiById = (data) => {
  return axios({
    url: `${version}/fc/flow/post_get_catalog`,
    method: 'post',
    data: data
  })
}

// 编辑新增手册目录
export const editSaveCatalogBook = (data) => {
  return axios({
    url: `${version}/fc/flow/post_edit_catalog_title`,
    method: 'post',
    data: data
  })
}
// 回显手册目录名称
export const showeditCatalogBook = (data) => {
  return axios({
    url: `${version}/fc/flow/show_catalog_title_content`,
    method: 'post',
    data: data
  })
}
// 获取上级手册名称
export const getParentCatalogBook = (data) => {
  return axios({
    url: `${version}/fc/flow/get_parent_titles`,
    method: 'post',
    data: data
  })
}
// 删除目录和关联目录
export const deleteCatalogbook = (id, data) => {
  return axios({
    url: `${version}/fc/flow/delete_catalog_title/${id}`,
    method: 'post',
    data: data
  })
}
// 重置目录
export const resetCatalogbook = (data) => {
  return axios({
    url: `${version}/fc/flow/reset_catalog`,
    method: 'post',
    data: data
  })
}
// 获取手册所属所有流程图
export const getCatalogPageImg = (id, data) => {
  return axios({
    url: `${version}/fc/flow/get_manual_page_imgs/${id}`,
    method: 'post',
    data: data
  })
}
// 搜索流程图和矩阵内容
export const searchCatalogPageImg = (data) => {
  return axios({
    url: `${version}/fc/flow/search_manual_geted_pages`,
    method: 'post',
    data: data
  })
}
