import axios from '@/http/api'

export const version = '/api/v2'

// 获取Visio图
export const getVisioFile = (params) => {
  return axios({
    url: `${version}/fc/permission/get_file`,
    method: 'get',
    params
  })
}

// 编辑页面：获取所有文件夹
export const getUserFolderById = params => {
  const { company_id } = params
  return axios({
    url: `${version}/fc/permission/get_final_organizatie/${company_id}`,
    method: 'get',
    params
  })
}

// 创建评价手册（获取目录）
export const getJudgeHandbookDirectory = data => {
  return axios({
    url: `${version}/fc/manual/add_eval_directory`,
    method: 'post',
    data
  })
}

// 生成评价手册
export const createJudgeHandbook = data => {
  return axios({
    url: `${version}/fc/manual/create_eval_manual`,
    method: 'post',
    data
  })
}

// 获取编辑页面信息
export const getJudgeHandbook = data => {
  return axios({
    url: `${version}/fc/manual/eval_manual_edit`,
    method: 'post',
    data
  }) 
}

// 获取评价手册目录
export const getJudgeHandbookCatalog = params => {
  return axios({
    url: `${version}/fc/manual/get_manual_catalog`,
    method: 'get',
    params
  })
}

// 获取目录中所有子图(控制矩阵)
export const getJudgeHandbookTableData = params => {
  return axios({
    url: `${version}/fc/manual/get_manual_matrix`,
    method: 'get',
    params
  })
}

// 控制矩阵接口 查看
export const getTableDataToUrl = params => {
  const { excel_id } = params
  return axios({
    url: `${version}/fc/flow/create_matrix/${excel_id}`,
    method: 'get',
    params
  })
}
