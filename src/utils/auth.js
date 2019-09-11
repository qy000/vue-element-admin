import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
export function setAdmin(admin) {
  return Cookies.set('role', admin)
}
export function removeAdmin(admin) {
  return Cookies.remove('role')
}
export function getAdmin() {
  return Cookies.get('role')
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}
