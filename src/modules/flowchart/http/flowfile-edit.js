import axios from '@/http/api'

export const version = '/api/v2'

export const createFlowFile = (params) => {
  return axios({
    url: `${version}/fc/flow`,
    method: 'post',
    data: params
  })
}

export const uploadExcel = (id, data) => {
  return axios({
    url: `${version}/fc/flow/upload_excel/${id}`,
    method: 'post',
    data: data
  })
}

export const analysisSheet = (params) => {
  return axios({
    url: `${version}/fc/flow/add_page/${params.id}`,
    method: 'post',
    data: params
  })
}

export const deleteExcel = (params) => {
  return axios({
    url: `${version}/fc/file/more`,
    method: 'delete',
    params: params
  })
}

export const selectStyle = () => {
  return axios({
    url: `${version}/fc/layout/all`,
    method: 'get'
  })
}

export const useStyle = (params) => {
  return axios({
    url: `${version}/fc/flow/edit_layout/${params.id}/${params.layout_id}`,
    method: 'post'
  })
}

export const getImgUrl = (fileId, key) => {
  return `${version}/fc/file/${fileId}/${key}`
}

export const getFlowfile = (fileId, key) => {
  return axios({
    url: `${version}/fc/file/${fileId}/${key}`,
    method: 'get'
  })
}

export const getFlowfileDetail = (flowfileId) => {
  return axios({
    url: `${version}/fc/flow/${flowfileId}`,
    method: 'get'
  })
}
// 获取风险控制矩阵信息
export const getRiskJuzInfo = (pageId) => {
  return axios({
    url: `${version}/fc/flow/search_control_matrix/${pageId}`,
    method: 'get'
  })
}
// 修改风险控制矩阵信息
export const changeRiskJuzInfo = (pageId, data) => {
  return axios({
    url: `${version}/fc/flow/save_control_matrix/${pageId}`,
    method: 'post',
    data
  })
}
// 获取风险点信息
export const getRiskdotInfo = (params) => {
  return axios({
    url: `${version}/fc/flow/search_risk_points`,
    method: 'get',
    params
  })
}
// 获取控制目标文件
export const getctrlSystemName = (data) => {
  return axios({
    url: `${version}/fc/flow/fileinfo/pdf`,
    method: 'get',
    params: data
  })
}
// 下载流程全部文件
export const lcAlldownmatrix = (data) => {
  return axios({
    url: `${version}/fc/flow/downmatrix`,
    method: 'get',
    params: data
  })
}
// 获取二级风险列表
export const gettwoRisklist = (id, data) => {
  return axios({
    url: `${version}/fc/file/select_id_risk/${id}`,
    method: 'get',
    params: data
  })
}
// 修改风险点信息
export const changeRiskdotInfo = (data) => {
  return axios({
    url: `${version}/fc/flow/update_risk_points`,
    method: 'post',
    data
  })
}
// 获取控制点信息
export const getContdotInfo = (params) => {
  return axios({
    url: `${version}/fc/flow/search_control_points`,
    method: 'get',
    params
  })
}
// 修改控制点信息
export const changeContdotInfo = (data) => {
  return axios({
    url: `${version}/fc/flow/update_control_points`,
    method: 'post',
    data
  })
}
export const saveFlowfile = (flowfileId, params) => {
  return axios({
    url: `${version}/fc/flow/save/${flowfileId}`,
    method: 'post',
    data: params
  })
}

// 保存历史版本第一个接口
export const saveHistoryfirst = (params) => {
  return axios({
    url: `${version}/fc/flow/history_version`,
    method: 'post',
    data: params
  })
}
// 保存历史版本第二个接口(有几张图就调用几次, flow_id是第一个接口返回的)
export const saveHistorySecond = (flow_id, params) => {
  return axios({
    url: `${version}/fc/flow/page_data/${flow_id}`,
    method: 'post',
    data: params
  })
}
// 保存历史版本第三个接口(调用一次)
export const saveHistorythird = (flow_id, params) => {
  return axios({
    url: `${version}/fc/flow/save/${flow_id}`,
    method: 'post',
    data: params
  })
}
export const selectTemplate = (params) => {
  return axios({
    url: `${version}/fc/flow/adt/${params.flowId}`,
    method: 'post',
    data: params
  })
}

export const getHeader = (params) => {
  return axios({
    url: `${version}/fc/layout/page`,
    method: 'get',
    params
  })
}

export const deleteHeader = (layoutId) => {
  return axios({
    url: `${version}/fc/layout/delete/${layoutId}`,
    method: 'delete'
  })
}

export const addHeader = (params) => {
  return axios({
    url: `${version}/fc/layout/create`,
    method: 'post',
    data: params
  })
}

// name: page name, data: table data json
export const saveAsTemplate = ({ name, data }) => {
  return axios({
    url: `${version}/fc/template/page_data`,
    method: 'post',
    data: { name, data }
  })
}

// 参数：
// <flow_id> | int | 必选(固定) | 流程图id `177`
// file_name | str | 必选 | 流程图名称 `流程图.vsdx`
// visio | str | 必选 | drawio解析的visio内容 `<xml></xml>`
export const flowUploadVisio = (id, data) => {
  return axios({
    url: `${version}/fc/flow/upload_visio/${id}`,
    method: 'post',
    data
  })
}

// 接口名称: 流程图应用上传visio
// 请求地址: /api/v2/fc/flow/use_visio/<flow_id>/<file_id>
// 请求方式: post
// 参数：
// <flow_id> | int | 必选(固定) | 流程图id `177`
// <file_id> | str | 必选 | 添加visio返回的文件id `1799`
// check_page | str | 必选 | 选择的页码名称用','拼接 `page1,page2`
export const confirmImportInterface = (flowId, fileId, data) => {
  return axios({
    url: `${version}/fc/flow/use_visio/${flowId}/${fileId}`,
    method: 'post',
    data
  })
}

// 接口名称: 流程图添加已有流程图
// 请求地址: /api/v2/fc/flow/page_by_flow/<use_flow>
// 请求方式: post
// 参数：
// <use_flow> | str | 必选 | 选择导入的流程图id `171`
export const importFlowchartExisted = useFlow => {
  return axios({
    url: `${version}/fc/flow/page_by_flow/${useFlow}`,
    method: 'get'
  })
}
// export const importFlowchartExisted = (useFlow, data) => {
//   return axios({
//     url: `${version}/fc/flow/page_by_flow/${useFlow}`,
//     method: 'post',
//     data
//   })
// }

// 图片数组保存为word, 接口功能为生成word
export const saveImagesAsWord = ({ flowId, previews, mimeType = 'docx', fileName }) => {
  return axios({
    url: `${version}/fc/file/save/flow_docx/${flowId}`,
    method: 'post',
    data: {
      previews,
      mimetype: mimeType,
      file_name: fileName
    }
  })
}

/**
 * 添加下载日志接口
 * @param flowId 流程图 id
 * @param flowName
 * @param mark 备注, 如后缀名 .docx, .vsdx
 * @returns {Promise | Promise<unknown>}
 */
export const addDownLog = ({ flowId, flowName, mark }) => {
  return axios({
    url: `${version}/fc/permission/add_downlog`,
    method: 'post',
    data: {
      flow_id: flowId,
      flow_name: flowName,
      mark
    }
  })
}

/**
 * 获取流程图信息, 主要是为了获取实时的流程图编辑状态, data.status 1: 空闲 2: 占用
 * @param flowId
 * @returns {Promise | Promise<unknown>}
 */
export const getFlowInfo = ({ flowId }) => {
  return axios({
    url: `${version}/fc/permission/get_flow_info`,
    method: 'get',
    params: {
      file_id: flowId
    }
  })
}

// 下载上个接口生成的word
// export const downloadWordURL = (flowId, _token) => `${version}/fc/file/down/flow_docx/${flowId}?_token=${_token}`
export const downloadWordURL = ({ flowId, mimeType = 'docx', _token }) => `${version}/fc/file/down/flow_docx/${flowId}?mimetype=${mimeType}&_token=${_token}`

export const xmlToData = ({ xmlStr }) => {
  return axios({
    url: `${version}/fc/flow/xml_to_data`,
    method: 'post',
    data: {
      xml_str: xmlStr
    }
  })
}

// tab收费信息查询
export const accountBilling = (params) => {
  return axios({
    url: `${version}/fc/acount/billing`,
    method: 'get',
    params
  })
}
// 下载风险库 制度库 表单库，计费次数
export const accountdownlibrary = (params) => {
  return axios({
    url: `${version}/fc/acount/downloadlibrary`,
    method: 'post',
    data: params
  })
}

// 计费下载
export const accountDownload = (params) => {
  return axios({
    url: `${version}/fc/acount/download`,
    method: 'post',
    data: params
  })
}
