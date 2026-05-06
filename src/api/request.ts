import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'

// 基础响应结构
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

const instance: AxiosInstance = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器：携带 Token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器：处理业务状态码
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data
    
    // 如果业务 code 不为 0（假设 0 是成功，或者根据 swagger 可能是 200，但通常 code 代表业务逻辑）
    // 根据用户要求：状态码一般为200，错误使用响应里面的code处理
    if (res.code !== 200 && res.code !== 0) {
      // 可以在这里统一弹出错误提示，或者在业务层处理
      return Promise.reject(res)
    }
    
    return response
  },
  (error) => {
    // 处理 HTTP 错误（非 2xx 状态码）
    const errorData = error.response?.data as ApiResponse
    return Promise.reject(errorData || { message: '网络错误', code: 500 })
  }
)

export default instance
