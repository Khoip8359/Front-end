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
  apiClient,
  loginService,
  newsService,
  userProfileService,
  commentService,
  newsLetterService,
  ReactService
} 