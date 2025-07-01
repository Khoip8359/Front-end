import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

export function useAuth() {
  const store = useAuthStore()
  
  // Destructure reactive state
  const { user, isAuthenticated, isLoggedIn, currentUser, userProfile, userRoles, displayName, userEmail, userPoints } = storeToRefs(store)
  
  // Destructure actions
  const { login, register, logout, restoreAuth, updateUser, updatePoints, checkPermission, hasRole, isAdmin, isCensor, isReporter } = store
  
  return {
    // State
    user,
    isAuthenticated,
    isLoggedIn,
    currentUser,
    userProfile,
    userRoles,
    displayName,
    userEmail,
    userPoints,
    
    // Actions
    login,
    register,
    logout,
    restoreAuth,
    updateUser,
    updatePoints,
    checkPermission,
    hasRole,
    isAdmin,
    isCensor,
    isReporter
  }
} 