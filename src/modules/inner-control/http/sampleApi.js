import axios from '@/http/api'

export const version = '/api/v2'

// 获取样本管理表格数据
export const getSampleTable = data => {
    return axios({
        url: `${version}/fc/evaluation/show_samples`,
        method: 'post',
        data
    })
}

// 上传样本接口
export const uploadSample = data => {
    return axios({
        url: `${version}/fc/evaluation/upload_sample`,
        method: 'post',
        headers: {
            'content-type': 'multipart/form-data'
        },
        data
    })
}

// 修改样本信息接口
export const updateSample = data => {
    return axios({
        url: `${version}/fc/evaluation/update_sample`,
        method: 'post',
        data
    })
}

// 删除样本信息接口
export const deleteSample = data => {
    return axios({
        url: `${version}/fc/evaluation/del_sample/${data.id}`,
        method: 'get'
    })
}

// 下载样本信息接口
export const downloadSample = data => {
    return axios({
        url: `${version}/fc/evaluation/down_sample/${data.id}`,
        method: 'get'
    })
}

// 展示样本信息接口
export const showSample = data => {
    return axios({
        url: `${version}/fc/evaluation/get_sample/${data.id}`,
        method: 'get'
    })
}
