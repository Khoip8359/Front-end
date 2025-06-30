import apiClient from './api.js'

export const userProfileService = {
  /**
   * Lấy thông tin profile của user
   * @param {string} username - Username từ URL path hoặc localStorage
   * @returns {Promise} - Promise với thông tin profile
   */
  async getUserProfile(username = null) {
    try {
      if (!username) {
        const pathSegments = window.location.pathname.split('/')
        username = pathSegments[pathSegments.length - 1]
        
        // Nếu không có trong URL path, thử lấy từ localStorage
        if (!username || username === 'profile') {
          const user = JSON.parse(localStorage.getItem('user') || '{}')
          username = user.username
        }
      }

      if (!username) {
        throw new Error('Username không tồn tại trong URL path hoặc localStorage')
      }

      const response = await apiClient.get(`/api/users/profile/${username}`)
      return response.data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      throw new Error('Không thể tải thông tin profile')
    }
  },

  async updateUserProfile(profileData) {
    try {
      const response = await apiClient.put(`/api/users/profile/update`, profileData)
      return response.data
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw new Error('Không thể cập nhật thông tin profile')
    }
  }
}

export default userProfileService 