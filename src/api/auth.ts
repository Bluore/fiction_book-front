import request from './request'
import type { ApiResponse } from './request'

// 登录接口
export const loginApi = (data: any) => {
  return request.post<ApiResponse>('/auth/login', data)
}

// 注册接口
export const registerApi = (data: any) => {
  return request.post<ApiResponse>('/users', data)
}

// 获取当前用户信息接口
export const getUserInfoApi = () => {
  return request.get<ApiResponse>('/users/info')
}

// 更新用户信息接口
export const updateUserInfoApi = (data: { username?: string; description?: string; age?: number }) => {
  return request.put<ApiResponse>('/users/information', data)
}

/**
 * 根据用户ID获取指定用户信息 (如作者信息)
 */
export const getUserByIdApi = (id: string) => {
  return request.get<ApiResponse>('/users/' + id)
}

// 获取邮箱验证码接口
export const sendEmailVerifyApi = (email: string) => {
  return request.post<ApiResponse>('/auth/email/verify', { email })
}
