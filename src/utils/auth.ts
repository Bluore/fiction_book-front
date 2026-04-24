import { ref } from 'vue'

// 模拟登录状态，实际项目中应结合 localStorage/Token 处理
export const isLoggedIn = ref(false)

export const login = () => {
  isLoggedIn.value = true
}

export const logout = () => {
  isLoggedIn.value = false
}
