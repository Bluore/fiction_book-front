import { ref } from 'vue'

export interface UserInfo {
  id: string
  username: string
  email: string
  age: number
  description: string
  profile_image: string
  cover_image: string
  created_at: string
  updated_at: string
}

// 检查本地存储是否有 Token 来初始化登录状态
export const isLoggedIn = ref(!!localStorage.getItem('auth_token'))
export const userInfo = ref<UserInfo | null>(null)

export const setToken = (token: string) => {
  localStorage.setItem('auth_token', token)
  isLoggedIn.value = true
}

export const setUserInfo = (info: UserInfo) => {
  userInfo.value = info
}

export const removeToken = () => {
  localStorage.removeItem('auth_token')
  isLoggedIn.value = false
  userInfo.value = null
}

export const login = () => {
  isLoggedIn.value = true
}

export const logout = () => {
  removeToken()
}
