import axios from '@/http/api'

export const version = '/api/v2'

export const getFlowfileTags = () => {
  return axios({
    url: `${version}/fc/flow/tags`,
    method: 'get'
  })
}

export const getFlowtempTags = () => {
  return axios({
    url: `${version}/fc/template/tags`,
    method: 'get'
  })
}

export const createTag = (tagName) => {
  return axios({
    url: `${version}/tag`,
    method: 'post',
    data: { name: tagName }
  })
}

export const deleteTag = (tagId) => {
  return axios({
    url: `${version}/tag/${tagId}/delete`,
    method: 'get'
  })
}

export const updateTag = (tagId, tagName) => {
  return axios({
    url: `${version}/tag/${tagId}/update`,
    method: 'post',
    data: { name: tagName }
  })
}
