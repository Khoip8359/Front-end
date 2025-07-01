<template>
  <div class="auth-container">
    <div class="auth-card">
      <!-- Header -->
      <div class="auth-header text-center mb-4">
        <img src="/img/logo.png" alt="Logo" class="auth-logo mb-3" />
        <h2 class="auth-title">Chào mừng bạn</h2>
        <p class="auth-subtitle">Đăng nhập hoặc tạo tài khoản mới</p>
      </div>

      <!-- Tab Navigation -->
      <div class="auth-tabs mb-4">
        <button 
          class="auth-tab" 
          :class="{ active: isLogin }" 
          @click="switchToLogin"
        >
          <i class="bi bi-box-arrow-in-right me-2"></i>
          Đăng nhập
        </button>
        <button 
          class="auth-tab" 
          :class="{ active: !isLogin }" 
          @click="switchToRegister"
        >
          <i class="bi bi-person-plus me-2"></i>
          Đăng ký
        </button>
      </div>

      <!-- Login Form -->
      <div v-if="isLogin" class="auth-form">
        <form @submit.prevent="handleLogin">
          <div class="form-group mb-3">
            <label for="login-username" class="form-label">
              <i class="bi bi-person me-2"></i>Tên đăng nhập
            </label>
            <input 
              type="text" 
              class="form-control" 
              id="login-username" 
              v-model="loginForm.username" 
              :class="{ 'is-invalid': loginErrors.username }"
              placeholder="Nhập tên đăng nhập"
              required 
            />
            <div v-if="loginErrors.username" class="invalid-feedback">
              {{ loginErrors.username }}
            </div>
          </div>

          <div class="form-group mb-3">
            <label for="login-password" class="form-label">
              <i class="bi bi-lock me-2"></i>Mật khẩu
            </label>
            <div class="password-input-group">
              <input 
                :type="showLoginPassword ? 'text' : 'password'" 
                class="form-control" 
                id="login-password" 
                v-model="loginForm.password" 
                :class="{ 'is-invalid': loginErrors.password }"
                placeholder="Nhập mật khẩu"
                required 
              />
              <button 
                type="button" 
                class="password-toggle"
                @click="showLoginPassword = !showLoginPassword"
              >
                <i :class="showLoginPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
            <div v-if="loginErrors.password" class="invalid-feedback">
              {{ loginErrors.password }}
            </div>
          </div>

          <div class="form-check mb-3">
            <input type="checkbox" class="form-check-input" id="rememberMe" v-model="loginForm.rememberMe" />
            <label class="form-check-label" for="rememberMe">
              Ghi nhớ đăng nhập
            </label>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary w-100 auth-btn" 
            :disabled="isLoginLoading"
          >
            <span v-if="isLoginLoading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-box-arrow-in-right me-2"></i>
            {{ isLoginLoading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
          </button>
        </form>
      </div>

      <!-- Register Form -->
      <div v-else class="auth-form">
        <form @submit.prevent="handleRegister">
          <div class="form-group mb-3">
            <label for="register-fullname" class="form-label">
              <i class="bi bi-person-badge me-2"></i>Họ và tên
            </label>
            <input 
              type="text" 
              class="form-control" 
              id="register-fullname" 
              v-model="registerForm.fullname" 
              :class="{ 'is-invalid': registerErrors.fullname }"
              placeholder="Nhập họ và tên đầy đủ"
              required 
            />
            <div v-if="registerErrors.fullname" class="invalid-feedback">
              {{ registerErrors.fullname }}
            </div>
          </div>

          <div class="form-group mb-3">
            <label for="register-username" class="form-label">
              <i class="bi bi-person me-2"></i>Tên đăng nhập
            </label>
            <input 
              type="text" 
              class="form-control" 
              id="register-username" 
              v-model="registerForm.username" 
              :class="{ 'is-invalid': registerErrors.username }"
              placeholder="Nhập tên đăng nhập"
              required 
            />
            <div v-if="registerErrors.username" class="invalid-feedback">
              {{ registerErrors.username }}
            </div>
          </div>

          <div class="form-group mb-3">
            <label for="register-email" class="form-label">
              <i class="bi bi-envelope me-2"></i>Email
            </label>
            <input 
              type="email" 
              class="form-control" 
              id="register-email" 
              v-model="registerForm.email" 
              :class="{ 'is-invalid': registerErrors.email }"
              placeholder="Nhập email"
              required 
            />
            <div v-if="registerErrors.email" class="invalid-feedback">
              {{ registerErrors.email }}
            </div>
          </div>

          <div class="form-group mb-3">
            <label for="register-phone" class="form-label">
              <i class="bi bi-telephone me-2"></i>Số điện thoại
            </label>
            <input 
              type="tel" 
              class="form-control" 
              id="register-phone" 
              v-model="registerForm.phone" 
              :class="{ 'is-invalid': registerErrors.phone }"
              placeholder="Nhập số điện thoại"
              required 
            />
            <div v-if="registerErrors.phone" class="invalid-feedback">
              {{ registerErrors.phone }}
            </div>
          </div>

          <div class="form-group mb-3">
            <label for="register-password" class="form-label">
              <i class="bi bi-lock me-2"></i>Mật khẩu
            </label>
            <div class="password-input-group">
              <input 
                :type="showRegisterPassword ? 'text' : 'password'" 
                class="form-control" 
                id="register-password" 
                v-model="registerForm.password" 
                :class="{ 'is-invalid': registerErrors.password }"
                placeholder="Nhập mật khẩu"
                required 
              />
              <button 
                type="button" 
                class="password-toggle"
                @click="showRegisterPassword = !showRegisterPassword"
              >
                <i :class="showRegisterPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
            <div v-if="registerErrors.password" class="invalid-feedback">
              {{ registerErrors.password }}
            </div>
          </div>

          <div class="form-group mb-3">
            <label for="register-confirmPassword" class="form-label">
              <i class="bi bi-lock-fill me-2"></i>Xác nhận mật khẩu
            </label>
            <div class="password-input-group">
              <input 
                :type="showConfirmPassword ? 'text' : 'password'" 
                class="form-control" 
                id="register-confirmPassword" 
                v-model="registerForm.confirmPassword" 
                :class="{ 'is-invalid': registerErrors.confirmPassword }"
                placeholder="Nhập lại mật khẩu"
                required 
              />
              <button 
                type="button" 
                class="password-toggle"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
            <div v-if="registerErrors.confirmPassword" class="invalid-feedback">
              {{ registerErrors.confirmPassword }}
            </div>
          </div>

          <div class="form-check mb-3">
            <input 
              type="checkbox" 
              class="form-check-input" 
              id="agreeTerms" 
              v-model="registerForm.agreeTerms"
              :class="{ 'is-invalid': registerErrors.agreeTerms }"
            />
            <label class="form-check-label" for="agreeTerms">
              Tôi đồng ý với <a href="#" class="text-primary">Điều khoản sử dụng</a> và <a href="#" class="text-primary">Chính sách bảo mật</a>
            </label>
            <div v-if="registerErrors.agreeTerms" class="invalid-feedback">
              {{ registerErrors.agreeTerms }}
            </div>
          </div>

          <button 
            type="submit" 
            class="btn btn-success w-100 auth-btn" 
            :disabled="isRegisterLoading"
          >
            <span v-if="isRegisterLoading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-person-plus me-2"></i>
            {{ isRegisterLoading ? 'Đang đăng ký...' : 'Đăng ký' }}
          </button>
        </form>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="message" class="alert mt-3" :class="messageType === 'success' ? 'alert-success' : 'alert-danger'">
        <i :class="messageType === 'success' ? 'bi bi-check-circle me-2' : 'bi bi-exclamation-triangle me-2'"></i>
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const isLogin = ref(true)

// Form data
const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false
})

const registerForm = reactive({
  fullname: '',
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

// Loading states
const isLoginLoading = ref(false)
const isRegisterLoading = ref(false)

// Password visibility
const showLoginPassword = ref(false)
const showRegisterPassword = ref(false)
const showConfirmPassword = ref(false)

// Error states
const loginErrors = reactive({
  username: '',
  password: ''
})

const registerErrors = reactive({
  fullname: '',
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreeTerms: ''
})

// Message state
const message = ref('')
const messageType = ref('')

// Validation functions
const validateLoginForm = () => {
  let isValid = true
  loginErrors.username = ''
  loginErrors.password = ''

  if (!loginForm.username.trim()) {
    loginErrors.username = 'Tên đăng nhập không được để trống'
    isValid = false
  } else if (loginForm.username.length < 3) {
    loginErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự'
    isValid = false
  }

  if (!loginForm.password) {
    loginErrors.password = 'Mật khẩu không được để trống'
    isValid = false
  } else if (loginForm.password.length < 6) {
    loginErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    isValid = false
  }

  return isValid
}

const validateRegisterForm = () => {
  let isValid = true
  registerErrors.fullname = ''
  registerErrors.username = ''
  registerErrors.email = ''
  registerErrors.phone = ''
  registerErrors.password = ''
  registerErrors.confirmPassword = ''
  registerErrors.agreeTerms = ''

  // Fullname validation
  if (!registerForm.fullname.trim()) {
    registerErrors.fullname = 'Họ và tên không được để trống'
    isValid = false
  } else if (registerForm.fullname.trim().length < 2) {
    registerErrors.fullname = 'Họ và tên phải có ít nhất 2 ký tự'
    isValid = false
  } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(registerForm.fullname.trim())) {
    registerErrors.fullname = 'Họ và tên chỉ được chứa chữ cái và khoảng trắng'
    isValid = false
  }

  // Username validation
  if (!registerForm.username.trim()) {
    registerErrors.username = 'Tên đăng nhập không được để trống'
    isValid = false
  } else if (registerForm.username.length < 3) {
    registerErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự'
    isValid = false
  } else if (!/^[a-zA-Z0-9_]+$/.test(registerForm.username)) {
    registerErrors.username = 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới'
    isValid = false
  }

  // Email validation
  if (!registerForm.email) {
    registerErrors.email = 'Email không được để trống'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
    registerErrors.email = 'Email không hợp lệ'
    isValid = false
  }

  // Phone validation
  if (!registerForm.phone) {
    registerErrors.phone = 'Số điện thoại không được để trống'
    isValid = false
  } else if (!/^[0-9]{10,11}$/.test(registerForm.phone.replace(/\s/g, ''))) {
    registerErrors.phone = 'Số điện thoại không hợp lệ'
    isValid = false
  }

  // Password validation
  if (!registerForm.password) {
    registerErrors.password = 'Mật khẩu không được để trống'
    isValid = false
  } else if (registerForm.password.length < 6) {
    registerErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    isValid = false
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(registerForm.password)) {
    registerErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'
    isValid = false
  }

  // Confirm password validation
  if (!registerForm.confirmPassword) {
    registerErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
    isValid = false
  } else if (registerForm.password !== registerForm.confirmPassword) {
    registerErrors.confirmPassword = 'Mật khẩu không khớp'
    isValid = false
  }

  // Terms agreement validation
  if (!registerForm.agreeTerms) {
    registerErrors.agreeTerms = 'Bạn phải đồng ý với điều khoản sử dụng'
    isValid = false
  }

  return isValid
}

// Show message function
const showMessage = (text, type = 'error') => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
    messageType.value = ''
  }, 5000)
}

// Switch between login and register
const switchToLogin = () => {
  isLogin.value = true
  message.value = ''
  // Clear form data
  Object.keys(loginForm).forEach(key => {
    if (typeof loginForm[key] === 'boolean') {
      loginForm[key] = false
    } else {
      loginForm[key] = ''
    }
  })
  Object.keys(loginErrors).forEach(key => {
    loginErrors[key] = ''
  })
}

const switchToRegister = () => {
  isLogin.value = false
  message.value = ''
  // Clear form data
  Object.keys(registerForm).forEach(key => {
    if (typeof registerForm[key] === 'boolean') {
      registerForm[key] = false
    } else {
      registerForm[key] = ''
    }
  })
  Object.keys(registerErrors).forEach(key => {
    registerErrors[key] = ''
  })
}

// Handle login
async function handleLogin() {
  if (!validateLoginForm()) {
    return
  }

  isLoginLoading.value = true
  try {
    const loginData = {
      username: loginForm.username,
      password: loginForm.password,
      rememberMe: loginForm.rememberMe
    }
    
    const response = await authStore.login(loginData)
    console.log('Login successful:', response)
    showMessage('Đăng nhập thành công!', 'success')
    
    // Redirect to home page after a short delay
    setTimeout(() => {
      router.push('/')
    }, 1500)
  } catch (error) {
    console.error('Login error:', error)
    showMessage('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.')
  } finally {
    isLoginLoading.value = false
  }
}

// Handle register
async function handleRegister() {
  if (!validateRegisterForm()) {
    return
  }

  isRegisterLoading.value = true
  try {
    const userData = {
      name: registerForm.fullname,
      username: registerForm.username,
      email: registerForm.email,
      phone: registerForm.phone,
      password: registerForm.password,
      confirmPassword: registerForm.confirmPassword
    }
    
    const response = await authStore.register(userData)
    console.log('Register successful:', response)
    showMessage('Đăng ký thành công! Vui lòng đăng nhập.', 'success')
    
    // Switch to login form
    setTimeout(() => {
      switchToLogin()
    }, 2000)
  } catch (error) {
    console.error('Register error:', error)
    showMessage('Đăng ký thất bại. Vui lòng thử lại.')
  } finally {
    isRegisterLoading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 450px;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-header {
  margin-bottom: 30px;
}

.auth-logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e9ecef;
}

.auth-title {
  color: #333;
  font-weight: 700;
  margin-bottom: 8px;
}

.auth-subtitle {
  color: #6c757d;
  font-size: 0.95rem;
  margin: 0;
}

.auth-tabs {
  display: flex;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 30px;
}

.auth-tab {
  flex: 1;
  padding: 12px 20px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-weight: 600;
  color: #6c757d;
  transition: all 0.3s ease;
  cursor: pointer;
}

.auth-tab.active {
  background: white;
  color: #0d6efd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.auth-tab:hover:not(.active) {
  color: #495057;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.form-control {
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15);
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.password-input-group {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #495057;
}

.form-check {
  margin-bottom: 20px;
}

.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.form-check-label {
  font-size: 0.9rem;
  color: #6c757d;
}

.form-check-label a {
  text-decoration: none;
}

.auth-btn {
  padding: 12px 24px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
  height: 48px;
}

.auth-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.auth-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.alert {
  border-radius: 10px;
  border: none;
  padding: 12px 16px;
  font-size: 0.9rem;
}

.alert-success {
  background-color: #d1e7dd;
  color: #0f5132;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
}

.invalid-feedback {
  display: block;
  font-size: 0.85rem;
  margin-top: 4px;
}

/* Responsive design */
@media (max-width: 576px) {
  .auth-card {
    padding: 30px 20px;
    margin: 10px;
  }
  
  .auth-tabs {
    flex-direction: column;
    gap: 4px;
  }
  
  .auth-tab {
    border-radius: 6px;
  }
}

/* Loading animation */
.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

/* Smooth transitions */
.auth-form {
  transition: all 0.3s ease;
}

/* Focus styles for accessibility */
.auth-tab:focus,
.form-control:focus,
.password-toggle:focus,
.auth-btn:focus {
  outline: 2px solid #0d6efd;
  outline-offset: 2px;
}
</style> 