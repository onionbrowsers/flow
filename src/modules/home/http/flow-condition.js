import axios from '@/http/api'

export const version = '/api/v2'

// 保存流程关系信息
export const saveFlowConditionData = data => {
  return axios({
    url: `${version}/fc/permission/save_flow_relation`,
    method: 'post',
    data
  })
}

// 查询流程关系信息
export const showFlowConditionTable = params => {
  return axios({
    url: `${version}/fc/permission/search_flow_relation`,
    method: 'get',
    params
  }) 
}

// 修改流程关系信息
export const editFlowConditionData = data => {
  return axios({
    url: `${version}/fc/permission/update_flow_relation/${data.relation_id}`,
    method: 'post',
    data
  })
}

// 删除流程关系信息
export const deleteFlowConditionTable = data => {
  return axios({
    url: `${version}/fc/permission/delete_flow_relation/${data.relation_id}`,
    method: 'post',
    data
  })
}

export const showFlowConditionData = data => {
  return axios({
    url: `${version}/fc/permission/edit_flow_relation/${data.relation_id}`,
    method: 'get'
  })  
}
