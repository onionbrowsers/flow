import axios from '@/http/api'

export const version = '/api/v2'

// 获取结果管理表格数据
export const getResultTable = data => {
    console.log(data)
    return axios({
        // url: `${version}/fc/evaluation/get_draft_manage/${data.companyId}`,
        url: `${version}/fc/evaluation/show_endings`,
        method: 'post',
        data
    })
}

// 上传汇总表接口
export const uploadResult = data => {
    return axios({
        url: `${version}/fc/evaluation/import_summary_table`,
        method: 'post',
        headers: {
            'content-type': 'multipart/form-data'
        },
        data
    })
}

// 下载汇总表接口
export const downloadResult = data => {
    return axios({
        url: `${version}/fc/evaluation/download_ending/${data.id}`,
        method: 'get',
        data
    })
}
