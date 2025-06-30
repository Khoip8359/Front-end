import apiClient from './api.js'

class LoginService {
  /**
   * Đăng nhập người dùng
   * @param {Object} credentials - Thông tin đăng nhập
   * @param {string} credentials.username - Tên đăng nhập
   * @param {string} credentials.password - Mật khẩu
   * @returns {Promise} Promise chứa thông tin đăng nhập
   */
  async login(credentials) {
    try {
      const response = await apiClient.post('/api/auth/login', {
        username: credentials.username,
        password: credentials.password
      })
      
      // Lưu token và thông tin user
      if (response.data.token) {
        this.saveToken(response.data.token)
      }
      if (response.data.user) {
        this.saveUser(response.data.user)
      }
      
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Đăng ký tài khoản mới
   * @param {Object} userData - Thông tin đăng ký
   * @param {string} userData.username - Tên đăng nhập
   * @param {string} userData.password - Mật khẩu
   * @param {string} userData.confirmPassword - Xác nhận mật khẩu
   * @param {string} userData.name - Họ và tên
   * @param {string} userData.email - Email
   * @param {string} userData.phone - Số điện thoại
   * @returns {Promise} Promise chứa thông tin đăng ký
   */
  async register(userData) {
    try {
      const response = await apiClient.post('/api/auth/register', {
        username: userData.username,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        name: userData.name,
        email: userData.email,
        phone: userData.phone
      })
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Gửi email đặt lại mật khẩu
   * @param {string} email - Email cần đặt lại mật khẩu
   * @returns {Promise} Promise chứa thông tin gửi email
   */
  async forgotPassword(email) {
    try {
      const response = await apiClient.post('/api/auth/forgot-password', {
        email: email
      })
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Đặt lại mật khẩu với token
   * @param {Object} resetData - Thông tin đặt lại mật khẩu
   * @param {string} resetData.token - Token đặt lại mật khẩu
   * @param {string} resetData.newPassword - Mật khẩu mới
   * @returns {Promise} Promise chứa thông tin đặt lại mật khẩu
   */
  async resetPassword(resetData) {
    try {
      const response = await apiClient.post('/api/auth/reset-password', {
        token: resetData.token,
        newPassword: resetData.newPassword
      })
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Đăng xuất người dùng
   * @returns {Promise} Promise chứa thông tin đăng xuất
   */
  async logout() {
    try {
      const response = await apiClient.post('/api/auth/logout')
      
      // Xóa token và thông tin user
      this.removeToken()
      this.removeUser()
      
      return response.data
    } catch (error) {
      // Vẫn xóa token và user ngay cả khi API call thất bại
      this.removeToken()
      this.removeUser()
      throw error
    }
  }

  /**
   * Kiểm tra trạng thái đăng nhập
   * @returns {Promise} Promise chứa thông tin người dùng hiện tại
   */
  async checkAuthStatus() {
    try {
      const response = await apiClient.get('/api/auth/me')
      return response.data
    } catch (error) {
      throw error
    }
  }

  /**
   * Lưu token vào localStorage
   * @param {string} token - JWT token
   */
  saveToken(token) {
    localStorage.setItem('token', token)
    localStorage.setItem('authToken', token) // Để tương thích ngược
  }

  /**
   * Lấy token từ localStorage
   * @returns {string|null} JWT token hoặc null
   */
  getToken() {
    return localStorage.getItem('token') || localStorage.getItem('authToken')
  }

  /**
   * Xóa token khỏi localStorage
   */
  removeToken() {
    localStorage.removeItem('token')
    localStorage.removeItem('authToken')
  }

  /**
   * Lưu thông tin user vào localStorage
   * @param {Object} userData - Thông tin user
   */
  saveUser(userData) {
    localStorage.setItem('user', JSON.stringify(userData))
  }

  /**
   * Lấy thông tin user từ localStorage
   * @returns {Object|null} Thông tin user hoặc null
   */
  getUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }

  /**
   * Xóa thông tin user khỏi localStorage
   */
  removeUser() {
    localStorage.removeItem('user')
  }

  /**
   * Lưu thông tin người dùng đã nhớ
   * @param {string} username - Tên đăng nhập
   */
  saveRememberedUser(username) {
    localStorage.setItem('rememberedUser', username)
  }

  /**
   * Lấy thông tin người dùng đã nhớ
   * @returns {string|null} Tên đăng nhập hoặc null
   */
  getRememberedUser() {
    return localStorage.getItem('rememberedUser')
  }

  /**
   * Xóa thông tin người dùng đã nhớ
   */
  removeRememberedUser() {
    localStorage.removeItem('rememberedUser')
  }

  /**
   * Kiểm tra xem người dùng đã đăng nhập hay chưa
   * @returns {boolean} true nếu đã đăng nhập
   */
  isLoggedIn() {
    const token = this.getToken()
    const user = this.getUser()
    return !!(token && user && user.username)
  }
}

export default new LoginService() 