import api from './api'

export default {
  /**
   * Cập nhật thumbnail cũ trong database với ảnh từ Cloudinary
   * @returns {Promise<Object>} - Kết quả cập nhật
   */
  async updateSampleThumbnails() {
    try {
      const response = await api.post('/api/database-images/update-sample-thumbnails')
      return response.data
    } catch (error) {
      console.error('Error updating sample thumbnails:', error)
      throw error
    }
  },

  /**
   * Lấy danh sách ảnh mẫu từ database
   * @returns {Promise<Array>} - Danh sách ảnh mẫu
   */
  async getSampleThumbnails() {
    try {
      const response = await api.get('/api/database-images/sample-thumbnails')
      return response.data
    } catch (error) {
      console.error('Error getting sample thumbnails:', error)
      // Fallback ảnh mẫu
      return [
        "https://res.cloudinary.com/ddqlu7sc3/image/upload/v1/esport_website/news1.jpg",
        "https://res.cloudinary.com/ddqlu7sc3/image/upload/v1/esport_website/news2.jpg",
        "https://res.cloudinary.com/ddqlu7sc3/image/upload/v1/esport_website/news3.jpg",
        "https://res.cloudinary.com/ddqlu7sc3/image/upload/v1/esport_website/news4.jpg",
        "https://res.cloudinary.com/ddqlu7sc3/image/upload/v1/esport_website/news5.jpg"
      ]
    }
  },

  /**
   * Lấy ảnh mẫu ngẫu nhiên
   * @returns {string} - URL ảnh mẫu
   */
  getRandomSampleThumbnail() {
    const sampleImages = [
      "https://res.cloudinary.com/ddqlu7sc3/image/upload/v1/esport_website/news1.jpg",
      "https://res.cloudinary.com/ddqlu7sc3/image/upload/v1/esport_website/news2.jpg",
      "https://res.cloudinary.com/ddqlu7sc3/image/upload/v1/esport_website/news3.jpg",
      "https://res.cloudinary.com/ddqlu7sc3/image/upload/v1/esport_website/news4.jpg",
      "https://res.cloudinary.com/ddqlu7sc3/image/upload/v1/esport_website/news5.jpg"
    ]
    
    const randomIndex = Math.floor(Math.random() * sampleImages.length)
    return sampleImages[randomIndex]
  }
} 