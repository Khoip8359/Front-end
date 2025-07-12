import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
})

export function getImageUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  if (url.startsWith('/uploads/')) return import.meta.env.VITE_API_BASE_URL + url
  return import.meta.env.VITE_API_BASE_URL + '/uploads/' + url
}

export default api