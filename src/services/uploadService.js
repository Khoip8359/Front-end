import api from './api'

export default {
  async uploadImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/api/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    // Cloudinary trả về object với url, publicId, message, success
    if (response.data && response.data.url) {
      return response.data.url
    }
    // Fallback nếu response không đúng format
    return response.data
  }
} 