import user from '@/api/user'
// import { login, logout, getInfo, queryList } from '@/api/user'
import { getToken, setToken, removeToken, setAdmin, removeAdmin, getAdmin } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      user.login({ userName: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        // commit('SET_ROLES', [data.role])
        setToken(data.token)
        setAdmin(data.role.toString())
        // setToken([data.role])
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    // 获取用户信息和权限
    // roles 不可缺少
    return new Promise((resolve, reject) => {
      const rolesArr = []
      if (getAdmin()) {
        rolesArr.push(getAdmin())
        commit('SET_ROLES', rolesArr || 'admin')
      }
      const data = {
        roles: state.roles || rolesArr,
        introduction: 'admin',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: state.roles.toString()
      }
      const { roles, name, avatar, introduction } = data
      commit('SET_ROLES', roles)
      commit('SET_NAME', name)
      commit('SET_AVATAR', avatar)
      commit('SET_INTRODUCTION', introduction)
      resolve(data)
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()
      removeAdmin()
      resolve()
      // user.logout(state.token).then(() => {
      //   commit('SET_TOKEN', '')
      //   commit('SET_ROLES', [])
      //   removeToken()
      //   resetRouter()
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })@click="onSubmit('form')"
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },

  queryList({ commit }, data) {
    return new Promise((resolve, reject) => {
      user.queryList(data).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  adminLogin({ commit }, data) {
    commit('SET_TOKEN', data.token)
    setToken(data.token)
    return new Promise((resolve, reject) => {
      resolve()
    })
  },

  // 删除单个
  Delete({ commit }, data) {
    return new Promise((resolve, reject) => {
      user.Delete(data)
        .then((res) => resolve(res))
        .catch(error => reject(error))
    })
  },

  // 删除多个
  batchDelete({ commit }, data) {
    return new Promise((resolve, reject) => {
      user.batchDelete(data)
        .then((res) => resolve(res))
        .catch(error => reject(error))
    })
  },

  // 通用请求
  userPost({ commit }, data) {
    return new Promise((resolve, reject) => {
      user.userPost(data)
        .then((res) => resolve(res))
        .catch(error => reject(error))
    })
  },
  // 导出 excelExport
  userGet({ commit }, data) {
    return new Promise((resolve, reject) => {
      user.userGet(data)
        .then((res) => resolve(res))
        .catch(error => reject(error))
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
