import axios from '@/http/api'

export const version = '/api/v2'

export const createTmp = (name, tags) => {
  return axios({
    url: `${version}/fc/template`,
    method: 'post',
    data: { name: name, tags: tags }
  })
}

export const editTmp = (id, name, tags) => {
  return axios({
    url: `${version}/fc/template/${id}`,
    method: 'put',
    data: { name: name, tags: tags }
  })
}
