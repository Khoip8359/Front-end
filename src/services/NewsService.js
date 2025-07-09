import apiClient from './api.js'

export const newsService = {
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

  async getHotNews() {
    try {
      const response = await apiClient.get('/api/hotNews')
      return response.data || []
    } catch (error) {
      console.error('getHotNews error:', error)
      return []
    }
  },

  async getNewsDetail(newsId) {
    try {
      const response = await apiClient.get(`/api/news/detail/${newsId}`)
      return response.data
    } catch (error) {
      console.error('getNewsDetail error:', error)
      throw new Error('Không thể tải chi tiết tin tức')
    }
  },

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
  },

  async getSuggestNews() {
    try {
      const response = await apiClient.get('/api/suggestNews')
      return response.data || []
    } catch (error) {
      console.error('getSuggestNews error:', error)
      return []
    }
  },
  
  async searchNews(keyword, page = 0, size = 5) {
    try {
      const response = await apiClient.get('/api/news/search', {
       params: { keyword, page, size }
      })
      return response.data
    } catch (error) {
      console.error('searchNews error:', error)
      throw new Error('Không thể tìm kiếm tin tức')
    }
  },

  async getCategories() {
    try {
      const response = await apiClient.get('/api/categories')
      return response.data
    } catch (error) {
      console.error('getCategories error:', error)
      throw new Error('Không thể tải danh mục')
    }
  },

  async getNewsByDate(date, page = 0, size = 5) {
    try {
      const response = await apiClient.get('/api/news/by-date', {
        params: { date, page, size }
      })
      return response.data
    } catch (error) {
      console.error('getNewsByDate error:', error)
      throw new Error('Không thể tải tin tức theo ngày')
    }
  },

  async getNewsByUser(userId){
    try{
      const response = await apiClient.get(`/api/news/${userId}`)
      return response.data
    } catch (error) {
      console.error('getNewsByCategory error:', error)
      throw new Error('Không thể tải tin tức theo danh mục')
    }
  }
}