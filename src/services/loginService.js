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
      return response.data
    } catch (error) {
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
    localStorage.setItem('authToken', token)
  }

  /**
   * Lấy token từ localStorage
   * @returns {string|null} JWT token hoặc null
   */
  getToken() {
    return localStorage.getItem('authToken')
  }

  /**
   * Xóa token khỏi localStorage
   */
  removeToken() {
    localStorage.removeItem('authToken')
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
    return !!this.getToken()
  }
}

export default new LoginService() 