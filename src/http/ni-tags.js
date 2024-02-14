import axios from './api'

export const version = '/api/v1'

export const getTags = (type) => {
  return axios({
    url: `${version}/tag?type=${type}`,
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
