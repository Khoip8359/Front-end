import { defineStore } from 'pinia'
import loginService from '@/services/loginService.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    // Thông tin người dùng
    user: {
      username: '',
      password: '', // Lưu tạm thời, KHÔNG khuyến khích cho production!
      name: '',
      email: '',
      phone: '',
      role: '',
      avatar: ''
    },
    // Trạng thái đăng nhập
    isAuthenticated: false,
    // Remember me
    rememberMe: false,
    // Loading state
    isLoading: false
  }),

  getters: {
    // Kiểm tra đã đăng nhập chưa
    isLoggedIn: (state) => !!state.user.username && !!state.user.password,
    
    // Lấy thông tin user
    getUserInfo: (state) => state.user,
    
    // Lấy username
    getUsername: (state) => state.user.username,
    
    // Lấy tên đầy đủ
    getFullName: (state) => state.user.name,
    
    // Lấy email
    getEmail: (state) => state.user.email,
    
    // Lấy role
    getUserRole: (state) => state.user.role,
    
    // Kiểm tra có phải admin không
    isAdmin: (state) => state.user.role === 'admin',
    
    // Kiểm tra có phải user thường không
    isUser: (state) => state.user.role === 'user'
  },

  actions: {
    /**
     * Đăng nhập người dùng
     * @param {Object} credentials - Thông tin đăng nhập
     * @param {string} credentials.username - Tên đăng nhập
     * @param {string} credentials.password - Mật khẩu
     * @param {boolean} rememberMe - Có nhớ đăng nhập không
     */
    async login({ username, password }, rememberMe = false) {
      this.isLoading = true;
      
      try {
        // Gọi API xác thực ở đây, nếu thành công:
        this.user.username = username;
        this.user.password = password;
        this.isAuthenticated = true;
        this.rememberMe = rememberMe;
        if (rememberMe) {
          localStorage.setItem('rememberedUser', username);
          localStorage.setItem('rememberedPassword', password);
        } else {
          localStorage.removeItem('rememberedUser');
          localStorage.removeItem('rememberedPassword');
        }
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Đăng ký tài khoản mới
     * @param {Object} userData - Thông tin đăng ký
     */
    async register(userData) {
      this.isLoading = true;
      
      try {
        const response = await loginService.register(userData);
        return response;
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Gửi email đặt lại mật khẩu
     * @param {string} email - Email cần đặt lại mật khẩu
     */
    async forgotPassword(email) {
      this.isLoading = true;
      
      try {
        const response = await loginService.forgotPassword(email);
        return response;
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Đăng xuất người dùng
     */
    logout() {
      this.user = { username: '', password: '', name: '', email: '', phone: '', role: '', avatar: '' };
      this.isAuthenticated = false;
      this.rememberMe = false;
      localStorage.removeItem('rememberedUser');
      localStorage.removeItem('rememberedPassword');
    },

    /**
     * Kiểm tra trạng thái đăng nhập
     */
    async checkAuthStatus() {
      try {
        const response = await loginService.checkAuthStatus();
        
        if (response.user) {
          this.user = {
            username: response.user.username || '',
            password: '',
            name: response.user.name || response.user.fullName || '',
            email: response.user.email || '',
            phone: response.user.phone || '',
            role: response.user.role || 'user',
            avatar: response.user.avatar || ''
          };
          this.isAuthenticated = true;
        }
        
        return response;
      } catch (error) {
        // Nếu không đăng nhập, xóa dữ liệu
        this.clearUserData();
        throw error;
      }
    },

    /**
     * Cập nhật thông tin người dùng
     * @param {Object} userData - Thông tin mới
     */
    updateUserInfo(userData) {
      this.user = { ...this.user, ...userData };
    },

    /**
     * Cập nhật avatar
     * @param {string} avatarUrl - URL avatar mới
     */
    updateAvatar(avatarUrl) {
      this.user.avatar = avatarUrl;
    },

    /**
     * Xóa toàn bộ dữ liệu người dùng
     */
    clearUserData() {
      this.user = {
        username: '',
        password: '',
        name: '',
        email: '',
        phone: '',
        role: '',
        avatar: ''
      };
      this.isAuthenticated = false;
      this.rememberMe = false;
      
      // Xóa dữ liệu khỏi localStorage
      localStorage.removeItem('rememberedUser');
      localStorage.removeItem('rememberedPassword');
    },

    /**
     * Khôi phục dữ liệu từ localStorage và kiểm tra token hợp lệ
     */
    restoreFromStorage() {
      const username = localStorage.getItem('rememberedUser');
      const password = localStorage.getItem('rememberedPassword');
      if (username && password) {
        this.user.username = username;
        this.user.password = password;
        this.isAuthenticated = true;
        this.rememberMe = true;
      }
    },

    /**
     * Kiểm tra trạng thái đăng nhập đơn giản từ localStorage
     */
    checkLoginStatus() {
      const username = localStorage.getItem('rememberedUser');
      const password = localStorage.getItem('rememberedPassword');
      
      if (username && password) {
        this.user.username = username;
        this.user.password = password;
        this.isAuthenticated = true;
        this.rememberMe = true;
        
        return true;
      }
      
      return false;
    },

    /**
     * Lưu token mới
     * @param {string} token - Token mới
     */
    setToken(token) {
      this.token = token;
      this.isAuthenticated = true;
      loginService.saveToken(token);
      
      // Nếu chưa có thông tin user, tạo thông tin cơ bản
      if (!this.user.username) {
        const rememberedUser = localStorage.getItem('rememberedUser');
        if (rememberedUser) {
          this.user.username = rememberedUser;
        }
      }
    }
  },

  // Persist state to localStorage
  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['user', 'isAuthenticated', 'rememberMe']
  }
}) 