import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
})

export function getImageUrl(url) {
  if (!url) return ''
  // Nếu là URL từ Cloudinary hoặc URL bên ngoài khác
  if (url.startsWith('http')) return url
  // Nếu là đường dẫn local uploads (fallback cho ảnh cũ)
  if (url.startsWith('/uploads/')) return import.meta.env.VITE_API_BASE_URL + url
  // Nếu chỉ là tên file (fallback cho ảnh cũ)
  return import.meta.env.VITE_API_BASE_URL + '/uploads/' + url
}

export default api