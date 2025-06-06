import axios from 'axios'

// Lấy base URL từ environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Tạo axios instance với config mặc định
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.log('API Request:', config)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.error('API Error:', error)
    }
    return Promise.reject(error)
  }
)

export default apiClient