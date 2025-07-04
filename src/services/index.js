import apiClient from './api.js'
import { loginService } from './loginService.js'
import { newsService } from './NewsService.js'
import { userProfileService } from './UserProfileService.js'
import { commentService } from './commentService.js'
import newsLetterService from './newsLetterService.js'
import { ReactService } from './React.js'

// Export named
export { apiClient }
export { loginService }
export { newsService }
export { userProfileService }
export { commentService }
export { newsLetterService }
export { ReactService }

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