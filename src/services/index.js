// Export tất cả services
export { default as apiClient } from './api.js'
export { default as loginService } from './loginService.js'
export { newsService } from './NewsService.js'
export { userProfileService } from './UserProfileService.js'

// Export default cho backward compatibility
export default {
  apiClient: await import('./api.js').then(m => m.default),
  loginService: await import('./loginService.js').then(m => m.default),
  newsService: await import('./NewsService.js').then(m => m.newsService),
  userProfileService: await import('./UserProfileService.js').then(m => m.userProfileService)
} 