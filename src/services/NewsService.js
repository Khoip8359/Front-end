import apiClient from './api.js'

export const newsService = {
  // Lấy danh sách tin tức với pagination
  async getNews(page = 0, size = 5) {
    try {
      const response = await apiClient.get('/api/home/list', {
        params: { page, size }
      })
      return response.data
    } catch (error) {
      throw new Error('Không thể tải danh sách tin tức')
    }
  },

  // Lấy hot news
  async getHotNews() {
    try {
      const response = await apiClient.get('/api/hotNews')
      return response.data
    } catch (error) {
      throw new Error('Không thể tải hot news')
    }
  },

  // Lấy chi tiết tin tức
  async getNewsDetail(newsId) {
    try {
      const response = await apiClient.get(`/api/news/detail/${newsId}`)
      return response.data
    } catch (error) {
      throw new Error('Không thể tải chi tiết tin tức')
    }
  }
}