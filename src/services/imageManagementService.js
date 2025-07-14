import api from './api'

export default {
  /**
   * Xóa ảnh từ Cloudinary
   * @param {string} publicId - Public ID của ảnh
   * @returns {Promise<boolean>} - Kết quả xóa
   */
  async deleteImage(publicId) {
    try {
      const response = await api.delete(`/api/images/delete?publicId=${publicId}`)
      return response.status === 200
    } catch (error) {
      console.error('Error deleting image:', error)
      return false
    }
  },

  /**
   * Xóa nhiều ảnh cùng lúc
   * @param {string[]} publicIds - Danh sách public IDs
   * @returns {Promise<number>} - Số lượng ảnh đã xóa
   */
  async deleteMultipleImages(publicIds) {
    try {
      const response = await api.delete('/api/images/delete-multiple', {
        data: publicIds
      })
      return response.status === 200
    } catch (error) {
      console.error('Error deleting multiple images:', error)
      return false
    }
  },

  /**
   * Trích xuất public ID từ Cloudinary URL
   * @param {string} imageUrl - URL của ảnh
   * @returns {Promise<string|null>} - Public ID hoặc null
   */
  async extractPublicId(imageUrl) {
    try {
      const response = await api.get(`/api/images/extract-public-id?imageUrl=${encodeURIComponent(imageUrl)}`)
      return response.data
    } catch (error) {
      console.error('Error extracting public ID:', error)
      return null
    }
  },

  /**
   * Kiểm tra xem URL có phải từ Cloudinary không
   * @param {string} imageUrl - URL của ảnh
   * @returns {Promise<boolean>} - true nếu là URL Cloudinary
   */
  async isCloudinaryUrl(imageUrl) {
    try {
      const response = await api.get(`/api/images/is-cloudinary?imageUrl=${encodeURIComponent(imageUrl)}`)
      return response.data
    } catch (error) {
      console.error('Error checking Cloudinary URL:', error)
      return false
    }
  },

  /**
   * Xóa ảnh từ URL (tự động trích xuất public ID)
   * @param {string} imageUrl - URL của ảnh
   * @returns {Promise<boolean>} - Kết quả xóa
   */
  async deleteImageByUrl(imageUrl) {
    try {
      const publicId = await this.extractPublicId(imageUrl)
      if (publicId) {
        return await this.deleteImage(publicId)
      }
      return false
    } catch (error) {
      console.error('Error deleting image by URL:', error)
      return false
    }
  }
} 