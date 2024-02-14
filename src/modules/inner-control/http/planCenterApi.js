import axios from '@/http/api'

export const version = '/api/v2'

// 获取方案中心表格数据
export const getPlanCenterTable = data => {
    console.log(data)
    return axios({
        url: `${version}/fc/evaluation/get_solution_center/${data.companyId}`,
        method: 'get',
        params: data
    })
}

// 下载方案中心的方案
export const downloadPlan = data => {
    return axios({
        url: `${version}/fc/evaluation/download_scheme/${data.schemeId}`,
        method: 'get'
    })
}

// 下载资料清单
export const downloadDetail = data => {
    return axios({
        url: `${version}/fc/evaluation/download_detailed/${data.schemeId}`,
        method: 'get'
    })
}

// 下发方案为任务
export const distributionPlan = data => {
    return axios({
        url: `${version}/fc/evaluation/add_eval_task`,
        method: 'post',
        data
    })
}

// 方案中心修改状态
export const updatePlanCenterStatus = data => {
    return axios({
        url: `${version}/fc/evaluation/update_solution_status/${data.schemeId}`,
        method: 'post',
        data
    })
}
