// Export tất cả services
export { default as apiClient } from './api.js'
export { loginService } from './loginService.js'
export { newsService } from './NewsService.js'
export { userProfileService } from './UserProfileService.js'
export { commentService } from './commentService.js'  
export { default as newsLetterService } from './newsLetterService.js'
export { ReactService } from './React.js' 

// Export default cho backward compatibility
export default {
  apiClient: await import('./api.js').then(m => m.default),
  loginService: await import('./loginService.js').then(m => m.loginService),
  newsService: await import('./NewsService.js').then(m => m.newsService),
  userProfileService: await import('./UserProfileService.js').then(m => m.userProfileService),
  commentService: await import('./commentService.js').then(m => m.commentService),
  newsLetterService: await import('./newsLetterService.js').then(m => m.default),
  ReactService: await import('./React.js').then(m => m.ReactService)
} 