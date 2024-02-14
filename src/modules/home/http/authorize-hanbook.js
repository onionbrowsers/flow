import axios from '@/http/api'

export const version = '/api/v2'

// 新建手册
export const createAuthorizeHandBook = data => {
  return axios({
    url: `${version}/fc/flow/post_create_authority_manual`,
    method: 'post',
    data
  })
}

// 修改手册
export const editAuthorizeHandbook = data => {
  return axios({
    url: `${version}/fc/flow/edit_documentfile_department_or_level`,
    method: 'post',
    data
  }) 
}

// 回显手册
export const showAuthorizeHandbook = data => {
  return axios({
    url: `${version}/fc/flow/show_documentfile_department`,
    method: 'post',
    data
  })
}

// 展示流程图
export const showAuthorizeFlowTableData = data => {
  return axios({
    url: `${version}/fc/flow/auth_manual_search_pages`,
    method: 'post',
    data
  })
}

// 根据表格数据生成文档
export const createAuthorizeExcel = data => {
  return axios({
    url: `${version}/fc/flow/post_edit_create_ins_manual`,
    method: 'post',
    data
  })
}

// 回显表格数据
export const showAuthorizeCustomTableData = data => {
  return axios({
    url: `${version}/fc/flow/post_show_table`,
    method: 'post',
    data
  })
}
