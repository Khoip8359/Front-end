import axios from 'axios'

// Use relative URL to avoid mixed content issues
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Interceptor để debug request nếu cần
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