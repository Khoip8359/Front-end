import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Interceptor để thêm token vào header nếu có
apiClient.interceptors.request.use(
  (config) => {
    // Thêm token từ localStorage nếu có
    const token = localStorage.getItem('token') || localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.log('API Request:', config)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.error('API Error:', error)
    }

    // Xử lý lỗi 401 (unauthorized)
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token')
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      // Có thể redirect về trang login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient