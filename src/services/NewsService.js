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
      console.error('getNews error:', error)
      throw new Error('Không thể tải danh sách tin tức')
    }
  },

  // Lấy hot news
  async getHotNews() {
    try {
      const response = await apiClient.get('/api/hotNews')
      return response.data
    } catch (error) {
      console.error('getHotNews error:', error)
      // Return empty array instead of throwing to avoid UI crash
      return []
    }
  },

  // Lấy chi tiết tin tức
  async getNewsDetail(newsId) {
    try {
      const response = await apiClient.get(`/api/news/detail/${newsId}`)
      return response.data
    } catch (error) {
      console.error('getNewsDetail error:', error)
      throw new Error('Không thể tải chi tiết tin tức')
    }
  },

  // Lấy tin tức theo categoryId (Integer)
  async getNewsByCategory(categoryId, page = 0, size = 5) {
    try {
      const response = await apiClient.get(`/api/news/category/${categoryId}`, {
        params: { page, size }
      })
      return response.data
    } catch (error) {
      console.error('getNewsByCategory error:', error)
      throw new Error('Không thể tải tin tức theo danh mục')
    }
  }
}