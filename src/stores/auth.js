import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    token: null,
    rememberMe: false
  }),

  getters: {
    // Kiểm tra xem user có đăng nhập không
    isLoggedIn: (state) => state.isAuthenticated && state.user !== null,
    
    // Lấy thông tin user
    currentUser: (state) => state.user,
    
    // Lấy account info
    accountInfo: (state) => state.user ? {
      accountId: state.user.accountId,
      username: state.user.username,
      point: state.user.point
    } : null,
    
    // Lấy user profile
    userProfile: (state) => state.user?.user || null,
    
    // Lấy roles của user
    userRoles: (state) => state.user?.roles || [],
    
    // Kiểm tra user có role cụ thể không
    hasRole: (state) => (roleName) => {
      return state.user?.roles?.some(role => role.roleName === roleName) || false
    },
    
    // Kiểm tra user có phải admin không
    isAdmin: (state) => {
      return state.user?.roles?.some(role => role.roleName === 'admin') || false
    },
    
    // Kiểm tra user có phải censor không
    isCensor: (state) => {
      return state.user?.roles?.some(role => role.roleName === 'censor') || false
    },
    
    // Kiểm tra user có phải reporter không
    isReporter: (state) => {
      return state.user?.roles?.some(role => role.roleName === 'reporter') || false
    },
    
    // Lấy tên hiển thị của user
    displayName: (state) => {
      return state.user?.user?.name || state.user?.username || 'User'
    },
    
    // Lấy email của user
    userEmail: (state) => {
      return state.user?.user?.email || ''
    },
    
    // Lấy số điểm của user
    userPoints: (state) => {
      return state.user?.point || 0
    }
  },

  actions: {
    // Đăng nhập
    async login(loginData) {
      try {
        // Gọi API login
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: loginData.username,
            password: loginData.password
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Đăng nhập thất bại')
        }

        const userData = await response.json()
        
        // Lưu thông tin user
        this.user = userData
        this.isAuthenticated = true
        this.rememberMe = loginData.rememberMe || false
        
        // Lưu vào localStorage nếu chọn "Ghi nhớ"
        if (this.rememberMe) {
          localStorage.setItem('auth_user', JSON.stringify(userData))
          localStorage.setItem('auth_remember', 'true')
        } else {
          sessionStorage.setItem('auth_user', JSON.stringify(userData))
          sessionStorage.setItem('auth_remember', 'false')
        }
        
        return userData
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },

    // Đăng ký
    async register(registerData) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registerData)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Đăng ký thất bại')
        }

        const result = await response.json()
        return result
      } catch (error) {
        console.error('Register error:', error)
        throw error
      }
    },

    // Đăng xuất
    logout() {
      this.user = null
      this.isAuthenticated = false
      this.token = null
      this.rememberMe = false
      
      // Xóa dữ liệu khỏi storage
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_remember')
      sessionStorage.removeItem('auth_user')
      sessionStorage.removeItem('auth_remember')
    },

    // Khôi phục trạng thái từ storage
    restoreAuth() {
      try {
        // Kiểm tra localStorage trước
        const storedUser = localStorage.getItem('auth_user')
        const storedRemember = localStorage.getItem('auth_remember')
        
        if (storedUser && storedRemember === 'true') {
          this.user = JSON.parse(storedUser)
          this.isAuthenticated = true
          this.rememberMe = true
          return true
        }
        
        // Kiểm tra sessionStorage
        const sessionUser = sessionStorage.getItem('auth_user')
        const sessionRemember = sessionStorage.getItem('auth_remember')
        
        if (sessionUser && sessionRemember === 'false') {
          this.user = JSON.parse(sessionUser)
          this.isAuthenticated = true
          this.rememberMe = false
          return true
        }
        
        return false
      } catch (error) {
        console.error('Error restoring auth state:', error)
        this.logout()
        return false
      }
    },

    // Cập nhật thông tin user
    updateUser(userData) {
      this.user = { ...this.user, ...userData }
      
      // Cập nhật storage
      if (this.rememberMe) {
        localStorage.setItem('auth_user', JSON.stringify(this.user))
      } else {
        sessionStorage.setItem('auth_user', JSON.stringify(this.user))
      }
    },

    // Cập nhật điểm
    updatePoints(newPoints) {
      if (this.user) {
        this.user.point = newPoints
        this.updateUser(this.user)
      }
    },

    // Kiểm tra quyền truy cập
    checkPermission(requiredRole) {
      if (!this.isLoggedIn) return false
      
      if (requiredRole === 'admin') {
        return this.isAdmin
      } else if (requiredRole === 'censor') {
        return this.isCensor || this.isAdmin
      } else if (requiredRole === 'reporter') {
        return this.isReporter || this.isCensor || this.isAdmin
      }
      
      return true // User thường có thể truy cập
    },

    // Lấy token (nếu có)
    getToken() {
      return this.token
    },

    // Set token
    setToken(token) {
      this.token = token
    }
  },

  // Persist state
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'auth',
        storage: localStorage,
        paths: ['user', 'isAuthenticated', 'rememberMe']
      }
    ]
  }
}) 