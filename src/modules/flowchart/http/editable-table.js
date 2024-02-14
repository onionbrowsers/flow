// 可编辑表格接口
import axios from '@/http/api'

export const version = '/api/v2'

// 流程页获取 page, excel 内容
// return
// {
//   'code': 0, // -1 未知异常 110 流程不存在
//   'data': [{}, {}], // 行数据
//   'msg': '未知异常',
//   'page': {} // 页信息
// }
export const getPageNExcelData = (flowId, pageId) => {
  return axios({
    url: `${version}/fc/flow/page_data/${flowId}/${pageId}`,
    method: 'GET'
  })
}

// 流程页在线编辑 excel 内容保存接
// let params = {
//   flow_id: int,
//   page_id: int,
//   name: str, // page name
//   data: str,
//   title: str // excel title
// }
export const savePageNExcelData = (flowId, params) => {
  return axios({
    url: `${version}/fc/flow/page_data/${flowId}`,
    method: 'post',
    data: params
  })
}
