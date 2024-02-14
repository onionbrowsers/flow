import axios from '@/http/api'

export const version = '/api/v2'

// 接口名称: 获取模板详情
// 请求地址: /api/v2/fc/template/<template_id>
// 请求方式: get
// 参数：
// <template_id> | int | 必选 | 模板id `13`

export const getTemplateDetail = (id) => {
  return axios({
    url: `${version}/fc/template/${id}`,
    method: 'get'
  })
}

// 接口名称: 模板上传Visio文件
// 请求地址: /api/v2/fc/template/upload_visio/<template_id>
// 请求方式: post
// 参数：
// <template_id> | int | 必选 | 模板id `1`
// visio | str | 必选 | visio文件内容drawio格式
// file_name | str | 必选 | 文件名
export const uploadVisioXml = (id, data) => {
  return axios({
    url: `${version}/fc/template/upload_visio/${id}`,
    method: 'post',
    data
  })
}

// 接口名称: 模板删除Visio文件
// 请求地址: /api/v2/fc/template/<template_id>/<visio_id>
// 请求方式: delete
// 参数：
// <template_id> | int | 必选 | 模板id `1`
// <visio_id> | int | 必选 | visio文件id `1`
export const deleteVisio = (tid, vid) => {
  return axios({
    url: `${version}/fc/template/${tid}/${vid}`,
    method: 'delete'
  })
}

// 接口名称: 模板选择Visio文件对应的page进行训练
// 请求地址: /api/v2/fc/template/train/<template_id>
// 请求方式: post
// 参数：
// <template_id> | int | 必选 | 模板id `1`
// visio | str | 可选| visio文件选择的page `[{"id":1,"check_page":["page1","page2"]},{"id":2,"check_page":["page1"]}]`
export const templateTrain = (id, data) => {
  return axios({
    url: `${version}/fc/template/train/${id}`,
    method: 'post',
    data
  })
}

// 接口名称: 模板训练结果
// 请求地址: /api/v2/fc/template/status/<template_id>
// 请求方式: get
// 参数：
// <template_id> | int | 必选 | 模板id `1`
export const getTemplateStatus = (id) => {
  return axios({
    url: `${version}/fc/template/status/${id}`,
    method: 'get'
  })
}

// 接口名称: 获取模板预览信息
// 请求地址: /api/v2/fc/template/preview/<template_id>
// 请求方式: get
// 参数：
// <template_id> | int | 必选 | 模板id `1`
export const getTemplatePreview = (id) => {
  return axios({
    url: `${version}/fc/template/preview/${id}`,
    method: 'get'
  })
}
