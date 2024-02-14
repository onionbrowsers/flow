import axios from '@/http/api'

export const version = '/api/v2'

// 新建手册
export const createHandBook = data => {
  return axios({
    url: `${version}/fc/flow/post_save_catalog_name`,
    method: 'post',
    data
  })
}

export const editHandbook = data => {
  return axios({
    url: `${version}/fc/flow/edit_documentfile_department_or_level`,
    method: 'post',
    data
  })
}

// 根据手册id获取当前手册目录已有内容
export const getHandBookContentById = data => {
  return axios({
    url: `${version}/fc/flow/post_get_catalog`,
    method: 'post',
    data
  })  
}

// 添加一条新标题（只是标题，没有内容）
export const addHandbookTitle = data => {
  return axios({
    url: `${version}/fc/flow/post_edit_catalog_title`,
    method: 'post',
    data
  })  
}

// 重置目录
export const resetHandbook = data => {
  return axios({
    url: `${version}/fc/flow/reset_catalog`,
    method: 'post',
    data
  }) 
}

// 获取目录关联图的表格数据
export const getHandbookTableData = data => {
  const { manual_id } = data
  return axios({
    url: `${version}/fc/flow/get_manual_page_imgs/${manual_id}`,
    method: 'post',
    data
  }) 
}

// 展示编辑手册目录内容弹窗（当前所在位置，当前已包含内容)
export const getHandbookCatalogContent = data => {
  return axios({
    url: `${version}/fc/flow/show_catalog_title_content`,
    method: 'post',
    data
  }) 
}

// 删除关联目录
export const deleteHandbookTitle = data => {
  const { title_id } = data
  return axios({
    url: `${version}/fc/flow/delete_catalog_title/${title_id}`,
    method: 'post',
    data
  })
}

// 检索流程图和矩阵
export const getVisioByCatalogId = data => {
  return axios({
    url: `${version}/fc/flow/search_pages`,
    method: 'post',
    data
  })
}

// 导入图片
export const uploadImgByHandbook = data => {
  return axios({
    url: `${version}/fc/flow/post_import_flowimg`,
    method: 'post',
    headers: {
      'content-type': 'multipart/form-data'
    },
    data
  })
}

// 导入手册
export const uploadHandbook = data => {
  return axios({
    url: `${version}/fc/flow/import_manual`,
    method: 'post',
    headers: {
      'content-type': 'multipart/form-data'
    },
    data
  })
}

// 生成手册文档
export const createHandbookDoc = data => {
  return axios({
    url: `${version}/fc/flow/modify_manual_docxfile`,
    method: 'post',
    data
  })
}

// 流程图转img
export const xmlToImgApi = data => {
  return axios({
    url: `${version}/fc/flow/post_preview_2_img`,
    method: 'post',
    data
  })
}

// 矩阵图转图片
export const matrixToImgApi = data => {
  return axios({
    url: `${version}/fc/flow/get_matrix2excel`,
    method: 'post',
    data
  })
}

// 根据手册文件id回显所属部门和所属级别
export const showHandbookByManualId = data => {
  return axios({
    url: `${version}/fc/flow/show_documentfile_department`,
    method: 'post',
    data
  })
}

export const editManualCatalog = data => {
  return axios({
    url: `${version}/fc/flow/modify_catalog`,
    method: 'post',
    data
  })
}

// 下载手册
export const customDownloadHandbook = params => {
  const { id } = params
  return axios({
    url: `${version}/fc/flow/download_manual_file/${id}`,
    method: 'get',
    params
  })
}

// 根据docfile_id换manual_id
export const customEditHandbook = data => {
  return axios({
    url: `${version}/fc/flow/post_get_internal_manual_id`,
    method: 'post',
    data
  })
}

// 删除manual_id手册
export const deleteManualHandbook = params => {
  const { id } = params
  return axios({
    url: `${version}/fc/flow/delete_manual_file/${id}`,
    method: 'get',
    params
  })
} 
