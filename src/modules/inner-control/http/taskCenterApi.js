import axios from '@/http/api'

export const version = '/api/v2'

// 获取任务中心表格数据
export const getTaskCenterTable = data => {
    console.log(data)
    return axios({
        url: `${version}/fc/evaluation/show_eval_tasks`,
        method: 'post',
        data
    })
}

// 执行任务接口
export const executeTask = data => {
    return axios({
        url: `${version}/fc/evaluation/task_to_draft`,
        method: 'post',
        data
    })
}

// 签收任务
export const signGetTask = data => {
    return axios({
        url: `${version}/fc/evaluation/sign_for_evaltask`,
        method: 'post',
        data
    })
}

