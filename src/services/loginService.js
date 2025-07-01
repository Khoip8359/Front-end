import apiClient from './api.js'

export const loginService = {
  async login(username, password) {
    try {
      const response = await apiClient.post('/api/auth/login', { username, password })
      return response.data
    } catch (error) {
      console.error('login error:', error)
      throw new Error('Đăng nhập thất bại!')
    }
  },

  async register(userData) {
    try {
      const response = await apiClient.post('/api/auth/register', userData)
      return response.data
    } catch (error) {
      console.error('register error:', error)
      throw new Error('Đăng ký thất bại!')
    }
  },

  async changePassword(passwordData) {
    try {
      const response = await apiClient.post('/api/auth/changePassword', passwordData)
      return response.data
    } catch (error) {
      console.error('change password error:', error)
      throw new Error(error.response?.data || 'Đổi mật khẩu thất bại!')
    }
  }
}