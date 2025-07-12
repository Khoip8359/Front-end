import api from './api'

export default {
  async uploadImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/api/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    // Nếu backend trả về object { url: ... }
    if (typeof response.data === 'object' && response.data.url) {
      return response.data.url
    }
    // Nếu trả về chuỗi
    return response.data
  }
} 