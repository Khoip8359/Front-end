<template>
  <div class="login-container">
    <!-- Background Animation -->
    <div class="background-animation">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
      </div>
    </div>

    <!-- Main Login Card -->
    <div class="login-card">
      <!-- Header -->
      <div class="login-header">
        <div class="logo-container">
          <div class="logo-icon">
            <i class="bi bi-newspaper"></i>
          </div>
          <h1 class="logo-text">GaNews</h1>
        </div>
        <p class="welcome-text">Chào mừng bạn trở lại!</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="login-form">
        <!-- Username Field -->
        <div class="form-group">
          <div class="input-wrapper">
            <div class="input-icon">
              <i class="bi bi-person"></i>
            </div>
            <input
              type="text"
              v-model="loginForm.username"
              class="form-input"
              :class="{ 'error': loginErrors.username }"
              placeholder="Tên đăng nhập"
              required
            />
            <div class="input-line"></div>
          </div>
          <div v-if="loginErrors.username" class="error-message">
            <i class="bi bi-exclamation-circle"></i>
            {{ loginErrors.username }}
          </div>
        </div>

        <!-- Password Field -->
        <div class="form-group">
          <div class="input-wrapper">
            <div class="input-icon">
              <i class="bi bi-lock"></i>
            </div>
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="loginForm.password"
              class="form-input"
              :class="{ 'error': loginErrors.password }"
              placeholder="Mật khẩu"
              required
            />
            <button
              type="button"
              class="password-toggle"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
            <div class="input-line"></div>
          </div>
          <div v-if="loginErrors.password" class="error-message">
            <i class="bi bi-exclamation-circle"></i>
            {{ loginErrors.password }}
          </div>
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="form-options">
          <label class="checkbox-wrapper">
            <input
              type="checkbox"
              v-model="loginForm.rememberMe"
              class="checkbox-input"
            />
            <span class="checkbox-custom"></span>
            <span class="checkbox-label">Ghi nhớ đăng nhập</span>
          </label>
          <button type="button" class="forgot-link" @click="showForgotModal = true">
            Quên mật khẩu?
          </button>
        </div>

        <!-- Login Button -->
        <button type="submit" class="login-button" :disabled="userStore.isLoading">
          <div class="button-content">
            <div v-if="userStore.isLoading" class="loading-spinner"></div>
            <span>{{ userStore.isLoading ? 'Đang đăng nhập...' : 'Đăng nhập' }}</span>
          </div>
        </button>

        <!-- Divider -->
        <div class="divider">
          <span>hoặc</span>
        </div>

        <!-- Social Login -->
        <div class="social-login">
          <button type="button" class="social-button google">
            <i class="bi bi-google"></i>
            <span>Google</span>
          </button>
          <button type="button" class="social-button facebook">
            <i class="bi bi-facebook"></i>
            <span>Facebook</span>
          </button>
        </div>

        <!-- Register Link -->
        <div class="register-link">
          <span>Chưa có tài khoản?</span>
          <button type="button" class="register-button" @click="showRegisterModal = true">
            Đăng ký ngay
          </button>
        </div>
      </form>
    </div>

    <!-- Success/Error Messages -->
    <div v-if="message" class="message-toast" :class="messageType">
      <i :class="messageType === 'success' ? 'bi bi-check-circle' : 'bi bi-exclamation-circle'"></i>
      <span>{{ message }}</span>
    </div>

    <!-- Forgot Password Modal -->
    <div v-if="showForgotModal" class="modal-overlay" @click="showForgotModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Quên mật khẩu</h3>
          <button class="modal-close" @click="showForgotModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>Nhập email của bạn để nhận link đặt lại mật khẩu</p>
          <input
            type="email"
            v-model="forgotEmail"
            class="form-input"
            placeholder="Nhập email"
          />
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showForgotModal = false">Hủy</button>
          <button class="btn-primary" @click="handleForgotPassword">Gửi</button>
        </div>
      </div>
    </div>

    <!-- Register Modal -->
    <div v-if="showRegisterModal" class="modal-overlay" @click="showRegisterModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Đăng ký tài khoản</h3>
          <button class="modal-close" @click="showRegisterModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <input
              type="text"
              v-model="registerForm.username"
              class="form-input"
              placeholder="Tên đăng nhập"
            />
          </div>
          <div class="form-group">
            <input
              type="text"
              v-model="registerForm.name"
              class="form-input"
              placeholder="Họ và tên"
            />
          </div>
          <div class="form-group">
            <input
              type="email"
              v-model="registerForm.email"
              class="form-input"
              placeholder="Email"
            />
          </div>
          <div class="form-group">
            <input
              type="tel"
              v-model="registerForm.phone"
              class="form-input"
              placeholder="Số điện thoại"
            />
          </div>
          <div class="form-group">
            <input
              type="password"
              v-model="registerForm.password"
              class="form-input"
              placeholder="Mật khẩu"
            />
          </div>
          <div class="form-group">
            <input
              type="password"
              v-model="registerForm.confirmPassword"
              class="form-input"
              placeholder="Xác nhận mật khẩu"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showRegisterModal = false">Hủy</button>
          <button class="btn-primary" @click="handleRegister" :disabled="!isRegisterFormValid || userStore.isLoading">
            {{ userStore.isLoading ? 'Đang đăng ký...' : 'Đăng ký' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user.js'

export default {
  name: 'LoginPage',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        rememberMe: false
      },
      registerForm: {
        username: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      },
      registerErrors: {},
      loginErrors: {},
      showPassword: false,
      isLoading: false,
      message: '',
      messageType: 'success',
      showForgotModal: false,
      showRegisterModal: false,
      forgotEmail: ''
    }
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    isRegisterFormValid() {
      return this.registerForm.username && 
             this.registerForm.name && 
             this.registerForm.email && 
             this.registerForm.phone && 
             this.registerForm.password && 
             this.registerForm.confirmPassword &&
             this.registerForm.password === this.registerForm.confirmPassword &&
             this.registerForm.username.length >= 3 &&
             this.registerForm.password.length >= 6
    }
  },
  methods: {
    async handleLogin() {
      this.clearErrors();
      
      // Validate
      if (!this.loginForm.username) {
        this.loginErrors.username = 'Vui lòng nhập tên đăng nhập';
        return;
      }
      if (!this.loginForm.password) {
        this.loginErrors.password = 'Vui lòng nhập mật khẩu';
        return;
      }

      try {
        const userStore = useUserStore();
        
        await userStore.login({
          username: this.loginForm.username,
          password: this.loginForm.password
        }, this.loginForm.rememberMe);

        this.showMessage('Đăng nhập thành công! Vui lòng chờ chuyển hướng trang...', 'success');
        
        setTimeout(() => {
          this.$router.push('/');
        }, 2000);
        
      } catch (error) {
        console.error('Login error:', error);
        
        // Xử lý lỗi từ API
        if (error.response) {
          const errorMessage = error.response.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng';
          this.showMessage(errorMessage, 'error');
        } else {
          this.showMessage('Có lỗi xảy ra, vui lòng thử lại', 'error');
        }
      }
    },

    async handleRegister() {
      // Kiểm tra các trường bắt buộc
      if (!this.registerForm.username || !this.registerForm.name || !this.registerForm.email || 
          !this.registerForm.phone || !this.registerForm.password || !this.registerForm.confirmPassword) {
        this.showMessage('Vui lòng điền đầy đủ thông tin', 'error');
        return;
      }

      // Kiểm tra độ dài username
      if (this.registerForm.username.length < 3) {
        this.showMessage('Tên đăng nhập phải có ít nhất 3 ký tự', 'error');
        return;
      }

      // Kiểm tra định dạng email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.registerForm.email)) {
        this.showMessage('Email không hợp lệ', 'error');
        return;
      }

      // Kiểm tra định dạng số điện thoại
      const phoneRegex = /^[0-9]{10,11}$/
      if (!phoneRegex.test(this.registerForm.phone)) {
        this.showMessage('Số điện thoại không hợp lệ (10-11 số)', 'error');
        return;
      }

      // Kiểm tra độ dài mật khẩu
      if (this.registerForm.password.length < 6) {
        this.showMessage('Mật khẩu phải có ít nhất 6 ký tự', 'error');
        return;
      }

      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        this.showMessage('Mật khẩu xác nhận không khớp', 'error');
        return;
      }

      try {
        const userStore = useUserStore();
        
        // Gọi API đăng ký thông qua Pinia store
        await userStore.register({
          username: this.registerForm.username,
          password: this.registerForm.password,
          confirmPassword: this.registerForm.confirmPassword,
          name: this.registerForm.name,
          email: this.registerForm.email,
          phone: this.registerForm.phone
        });
        
        this.showMessage('Đăng ký thành công!', 'success');
        this.showRegisterModal = false;
        this.clearRegisterForm();
      } catch (error) {
        console.error('Register error:', error);
        
        if (error.response) {
          const errorMessage = error.response.data?.message || 'Có lỗi xảy ra khi đăng ký';
          this.showMessage(errorMessage, 'error');
        } else {
          this.showMessage('Có lỗi xảy ra, vui lòng thử lại', 'error');
        }
      }
    },

    async handleForgotPassword() {
      if (!this.forgotEmail) {
        this.showMessage('Vui lòng nhập email', 'error');
        return;
      }

      try {
        const userStore = useUserStore();
        
        // Gọi API quên mật khẩu thông qua Pinia store
        await userStore.forgotPassword(this.forgotEmail);
        
        this.showMessage(`Link đặt lại mật khẩu đã được gửi đến ${this.forgotEmail}`, 'success');
        this.showForgotModal = false;
        this.forgotEmail = '';
      } catch (error) {
        console.error('Forgot password error:', error);
        
        if (error.response) {
          const errorMessage = error.response.data?.message || 'Có lỗi xảy ra khi gửi email';
          this.showMessage(errorMessage, 'error');
        } else {
          this.showMessage('Có lỗi xảy ra, vui lòng thử lại', 'error');
        }
      }
    },

    clearErrors() {
      this.loginErrors = {};
      this.registerErrors = {};
    },

    clearRegisterForm() {
      this.registerForm = { username: '', name: '', email: '', phone: '', password: '', confirmPassword: '' };
      this.registerErrors = {};
    },

    showMessage(text, type = 'success') {
      this.message = text;
      this.messageType = type;
      setTimeout(() => {
        this.message = '';
      }, 5000);
    }
  },

  async mounted() {
    const userStore = useUserStore();
    
    // Khôi phục dữ liệu từ localStorage và kiểm tra token
    const isAuthenticated = await userStore.restoreFromStorage();
    
    // Nếu đã đăng nhập và có thông tin remember me, điền vào form
    if (isAuthenticated && userStore.rememberMe && userStore.getUsername) {
      this.loginForm.username = userStore.getUsername;
      this.loginForm.rememberMe = true;
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

/* Background Animation */
.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.floating-shapes {
  position: relative;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 10%;
  animation-delay: 2s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  top: 80%;
  left: 20%;
  animation-delay: 4s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  top: 10%;
  right: 30%;
  animation-delay: 1s;
}

.shape-5 {
  width: 40px;
  height: 40px;
  top: 40%;
  left: 60%;
  animation-delay: 3s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* Login Card */
.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;
}

/* Header */
.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}

.logo-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.logo-icon i {
  color: white;
  font-size: 24px;
}

.logo-text {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.welcome-text {
  color: #666;
  font-size: 16px;
  margin: 0;
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  position: relative;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 15px;
  color: #999;
  z-index: 2;
}

.form-input {
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: none;
  background: #f8f9fa;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  outline: none;
}

.form-input:focus {
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error {
  background: #fff5f5;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.password-toggle {
  position: absolute;
  right: 15px;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  z-index: 2;
}

.input-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.form-input:focus + .input-line {
  width: 100%;
}

.error-message {
  color: #ef4444;
  font-size: 14px;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin-right: 8px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-input:checked + .checkbox-custom {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
}

.checkbox-label {
  color: #666;
}

.forgot-link {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
}

.forgot-link:hover {
  text-decoration: underline;
}

/* Login Button */
.login-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 15px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Divider */
.divider {
  text-align: center;
  position: relative;
  margin: 20px 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #ddd;
}

.divider span {
  background: white;
  padding: 0 15px;
  color: #666;
  font-size: 14px;
}

/* Social Login */
.social-login {
  display: flex;
  gap: 10px;
}

.social-button {
  flex: 1;
  padding: 12px;
  border: 2px solid #f1f3f4;
  border-radius: 12px;
  background: white;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.social-button:hover {
  border-color: #667eea;
  color: #667eea;
}

.social-button.google:hover {
  border-color: #ea4335;
  color: #ea4335;
}

.social-button.facebook:hover {
  border-color: #1877f2;
  color: #1877f2;
}

/* Register Link */
.register-link {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.register-button {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-weight: 600;
  margin-left: 5px;
}

.register-button:hover {
  text-decoration: underline;
}

/* Message Toast */
.message-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 10px;
  color: white;
  font-weight: 500;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideIn 0.3s ease;
}

.message-toast.success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.message-toast.error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 15px;
  width: 90%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 20px;
  color: #999;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-primary, .btn-secondary {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-secondary {
  background: #f1f3f4;
  color: #666;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.btn-secondary:hover {
  background: #e8eaed;
}

/* Responsive */
@media (max-width: 480px) {
  .login-card {
    margin: 20px;
    padding: 30px 20px;
  }
  
  .social-login {
    flex-direction: column;
  }
  
  .form-options {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}
</style>