import request from '@/utils/request'

export function login(data) {
  console.log(data)
  return userPost({ url: '/user/login', data })
  // return request({
  //   url: '/user/login',
  //   method: 'post',
  //   data
  // })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function queryList(data) {
  return request.$post('/stockInfo/queryList', data)
}

export function Delete(data) {
  return request.$post('/stockInfo/delete', data)
}

export function batchDelete(data) {
  return request.$post('/stockInfo/batchDelete', data)
}
export function userPost(data) {
  return request.$post(data.url, data.data)
}
export function userGet(data) {
  return request({
    url: data.url,
    method: 'get',
    params: data.data
  })
}

export default { userGet, userPost, login, getInfo, logout, queryList, Delete, batchDelete }
