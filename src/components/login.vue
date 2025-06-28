<template>
  <div id="app" class="vh-100 d-flex justify-content-center align-items-center bg-gradient">
    <div class="card auth-card p-4 shadow-lg">
      <!-- Navigation Tabs -->
      <ul class="nav nav-tabs mb-4">
        <li class="nav-item">
          <button 
            class="nav-link" 
            :class="{ active: activeTab === 'login' }"
            @click="setActiveTab('login')"
            type="button"
          >
            <i class="fas fa-sign-in-alt me-2"></i>Đăng Nhập
          </button>
        </li>
        <li class="nav-item">
          <button 
            class="nav-link" 
            :class="{ active: activeTab === 'register' }"
            @click="setActiveTab('register')"
            type="button"
          >
            <i class="fas fa-user-plus me-2"></i>Đăng Ký
          </button>
        </li>
      </ul>

      <!-- Login Form -->
      <div v-if="activeTab === 'login'" class="auth-container">
        <div class="text-center mb-4">
          <div class="logo-circle mx-auto mb-3">
            <i class="fas fa-user-circle fa-3x text-primary"></i>
          </div>
          <h3 class="text-dark mb-2">Đăng Nhập</h3>
          <p class="text-muted">Chào mừng bạn trở lại!</p>
        </div>
        
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="loginEmail" class="form-label">
              <i class="fas fa-envelope me-2"></i>Email
            </label>
            <input
              type="email"
              id="loginEmail"
              v-model="loginForm.email"
              class="form-control"
              :class="{ 'is-invalid': loginErrors.email, 'is-valid': loginForm.email && !loginErrors.email }"
              placeholder="Nhập địa chỉ email của bạn"
              required
            />
            <div v-if="loginErrors.email" class="invalid-feedback">
              {{ loginErrors.email }}
            </div>
          </div>

          <div class="mb-3">
            <label for="loginPassword" class="form-label">
              <i class="fas fa-lock me-2"></i>Mật khẩu
            </label>
            <div class="input-group">
              <input
                :type="showLoginPassword ? 'text' : 'password'"
                id="loginPassword"
                v-model="loginForm.password"
                class="form-control"
                :class="{ 'is-invalid': loginErrors.password, 'is-valid': loginForm.password && !loginErrors.password }"
                placeholder="Nhập mật khẩu của bạn"
                required
              />
              <button
                type="button"
                class="btn btn-outline-secondary"
                @click="showLoginPassword = !showLoginPassword"
              >
                <i :class="showLoginPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div v-if="loginErrors.password" class="invalid-feedback">
              {{ loginErrors.password }}
            </div>
          </div>

          <div class="mb-3 form-check d-flex justify-content-between align-items-center">
            <div>
              <input
                type="checkbox"
                id="rememberMe"
                v-model="loginForm.rememberMe"
                class="form-check-input"
              />
              <label for="rememberMe" class="form-check-label">
                Ghi nhớ đăng nhập
              </label>
            </div>
            <a href="#" class="text-decoration-none" @click.prevent="showForgotPasswordModal = true">
              Quên mật khẩu?
            </a>
          </div>

          <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="loginLoading">
            <span 
              v-if="loginLoading" 
              class="spinner-border spinner-border-sm me-2" 
              role="status"
            ></span>
            <span>{{ loginLoading ? 'Đang xử lý...' : 'Đăng Nhập' }}</span>
          </button>
        </form>
      </div>

      <!-- Register Form -->
      <div v-if="activeTab === 'register'" class="auth-container">
        <div class="text-center mb-4">
          <div class="logo-circle mx-auto mb-3">
            <i class="fas fa-user-plus fa-3x text-primary"></i>
          </div>
          <h3 class="text-dark mb-2">Đăng Ký</h3>
          <p class="text-muted">Tạo tài khoản mới</p>
        </div>
        
        <form @submit.prevent="handleRegister">
          <!-- Full Name -->
          <div class="mb-3">
            <label for="fullName" class="form-label">
              <i class="fas fa-user me-2"></i>Họ và tên
            </label>
            <input
              type="text"
              id="fullName"
              v-model="registerForm.fullName"
              class="form-control"
              :class="{ 'is-invalid': registerErrors.fullName, 'is-valid': registerForm.fullName && !registerErrors.fullName }"
              placeholder="Nhập họ và tên"
              required
            />
            <div v-if="registerErrors.fullName" class="invalid-feedback">
              {{ registerErrors.fullName }}
            </div>
          </div>

          <!-- Email -->
          <div class="mb-3">
            <label for="registerEmail" class="form-label">
              <i class="fas fa-envelope me-2"></i>Email
            </label>
            <input
              type="email"
              id="registerEmail"
              v-model="registerForm.email"
              class="form-control"
              :class="{ 'is-invalid': registerErrors.email, 'is-valid': registerForm.email && !registerErrors.email }"
              placeholder="Nhập địa chỉ email"
              required
            />
            <div v-if="registerErrors.email" class="invalid-feedback">
              {{ registerErrors.email }}
            </div>
          </div>

          <!-- Phone -->
          <div class="mb-3">
            <label for="phone" class="form-label">
              <i class="fas fa-phone me-2"></i>Số điện thoại
            </label>
            <input
              type="tel"
              id="phone"
              v-model="registerForm.phone"
              class="form-control"
              :class="{ 'is-invalid': registerErrors.phone, 'is-valid': registerForm.phone && !registerErrors.phone }"
              placeholder="Nhập số điện thoại"
              required
            />
            <div v-if="registerErrors.phone" class="invalid-feedback">
              {{ registerErrors.phone }}
            </div>
          </div>

          <!-- Password -->
          <div class="mb-3">
            <label for="registerPassword" class="form-label">
              <i class="fas fa-lock me-2"></i>Mật khẩu
            </label>
            <div class="input-group">
              <input
                :type="showRegisterPassword ? 'text' : 'password'"
                id="registerPassword"
                v-model="registerForm.password"
                class="form-control"
                :class="{ 'is-invalid': registerErrors.password, 'is-valid': registerForm.password && !registerErrors.password }"
                placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                required
              />
              <button
                type="button"
                class="btn btn-outline-secondary"
                @click="showRegisterPassword = !showRegisterPassword"
              >
                <i :class="showRegisterPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div v-if="registerErrors.password" class="invalid-feedback">
              {{ registerErrors.password }}
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="mb-3">
            <label for="confirmPassword" class="form-label">
              <i class="fas fa-lock me-2"></i>Xác nhận mật khẩu
            </label>
            <div class="input-group">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirmPassword"
                v-model="registerForm.confirmPassword"
                class="form-control"
                :class="{ 'is-invalid': registerErrors.confirmPassword, 'is-valid': registerForm.confirmPassword && !registerErrors.confirmPassword }"
                placeholder="Nhập lại mật khẩu"
                required
              />
              <button
                type="button"
                class="btn btn-outline-secondary"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div v-if="registerErrors.confirmPassword" class="invalid-feedback">
              {{ registerErrors.confirmPassword }}
            </div>
          </div>

          <!-- Terms Agreement -->
          <div class="mb-3">
            <div class="form-check">
              <input
                type="checkbox"
                id="agreeTerms"
                v-model="registerForm.agreeTerms"
                class="form-check-input"
                required
              />
              <label for="agreeTerms" class="form-check-label">
                Tôi đồng ý với <a href="#" class="text-decoration-none">điều khoản sử dụng</a>
              </label>
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="registerLoading">
            <span 
              v-if="registerLoading" 
              class="spinner-border spinner-border-sm me-2" 
              role="status"
            ></span>
            <span>{{ registerLoading ? 'Đang xử lý...' : 'Đăng Ký' }}</span>
          </button>
        </form>
      </div>

      <!-- Alert Messages -->
      <div v-if="alertMessage" id="alertContainer">
        <div 
          class="alert mt-3" 
          :class="alertType === 'success' ? 'alert-success' : 'alert-danger'" 
          role="alert"
        >
          <i 
            :class="alertType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle'" 
            class="me-2"
          ></i>
          {{ alertMessage }}
        </div>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div 
      v-if="showForgotPasswordModal" 
      class="modal fade show d-block" 
      tabindex="-1" 
      style="background-color: rgba(0,0,0,0.5)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Quên Mật Khẩu</h5>
            <button 
              type="button" 
              class="btn-close" 
              @click="showForgotPasswordModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <p class="text-muted">Nhập email của bạn để nhận link đặt lại mật khẩu</p>
            <input
              type="email"
              v-model="forgotPasswordEmail"
              class="form-control"
              placeholder="Nhập địa chỉ email"
            />
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="showForgotPasswordModal = false"
            >
              Hủy
            </button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="handleForgotPassword"
            >
              Gửi Link
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user' // 🔁 sửa đúng path theo cấu trúc project của bạn

export default {
  name: 'AuthSystem',
  data() {
    return {
      activeTab: 'login',
      
      // Loading states
      loginLoading: false,
      registerLoading: false,
      
      // Password visibility
      showLoginPassword: false,
      showRegisterPassword: false,
      showConfirmPassword: false,
      
      // Login form
      loginForm: {
        email: '',
        password: '',
        rememberMe: false
      },
      
      // Register form
      registerForm: {
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      },
      
      // Validation errors
      loginErrors: {},
      registerErrors: {},
      
      // Alert system
      alertMessage: '',
      alertType: 'success',
      
      // Forgot password
      showForgotPasswordModal: false,
      forgotPasswordEmail: '',
      
      // Demo accounts
      demoAccounts: [
        { email: "admin@example.com", password: "admin123", role: "admin", name: "Administrator" },
        { email: "user@example.com", password: "123456", role: "user", name: "User Demo" },
        { email: "demo@example.com", password: "demo123", role: "demo", name: "Demo User" }
      ],
      
      // Registered users
      registeredUsers: [],
      existingEmails: ["admin@example.com", "user@example.com", "demo@example.com"]
    }
  },
  
  mounted() {
    // Initialize registered users with demo accounts
    this.registeredUsers = [...this.demoAccounts];
    
    // Load remembered email
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      this.loginForm.email = rememberedEmail;
      this.loginForm.rememberMe = true;
    }
    
    // Show demo info after a delay
    setTimeout(() => {
      if (this.activeTab === 'login') {
        this.showAlert('Demo: admin@example.com / admin123 hoặc user@example.com / 123456', 'success');
      }
    }, 1000);
  },
  
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab;
      this.clearErrors();
      this.clearAlert();
    },
    
    // Validation methods
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    
    clearErrors() {
      this.loginErrors = {};
      this.registerErrors = {};
    },
    
    // Alert methods
    showAlert(message, type = 'success') {
      this.alertMessage = message;
      this.alertType = type;
      
      setTimeout(() => {
        this.clearAlert();
      }, 5000);
    },
    
    clearAlert() {
      this.alertMessage = '';
    },
    
    // Login handler
    async handleLogin() {
      const userStore = useUserStore();
      this.clearErrors();
      this.clearAlert();
      
      let isValid = true;
      
      // Validate email
      if (!this.loginForm.email) {
        this.loginErrors.email = 'Email là bắt buộc';
        isValid = false;
      } else if (!this.validateEmail(this.loginForm.email)) {
        this.loginErrors.email = 'Email không đúng định dạng';
        isValid = false;
      }
      
      // Validate password
      if (!this.loginForm.password) {
        this.loginErrors.password = 'Mật khẩu là bắt buộc';
        isValid = false;
      }
      
      if (!isValid) return;
      
      this.loginLoading = true;
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check credentials
        const user = this.registeredUsers.find(
          account => account.email === this.loginForm.email && account.password === this.loginForm.password
        );
        
        if (user) {
           userStore.login(user.email, user.role, user.name);
          this.showAlert(`Đăng nhập thành công! Chào mừng ${user.name}`, 'success');
          
          // Save login info if remember me is checked
          if (this.loginForm.rememberMe) {
            localStorage.setItem('rememberedEmail', this.loginForm.email);
            localStorage.setItem('userRole', user.role);
          }
          
          // Redirect simulation
          setTimeout(() => {
            this.$router.push('/');
          }, 1500);
          
        } else {
          this.showAlert('Email hoặc mật khẩu không chính xác. Thử: admin@example.com / admin123', 'error');
        }
        
      } catch (error) {
        this.showAlert('Có lỗi xảy ra. Vui lòng thử lại sau.', 'error');
      } finally {
        this.loginLoading = false;
      }
    },
    
    // Register handler
    async handleRegister() {
      this.clearErrors();
      this.clearAlert();
      
      let isValid = true;
      
      // Validate full name
      if (!this.registerForm.fullName.trim()) {
        this.registerErrors.fullName = 'Họ và tên là bắt buộc';
        isValid = false;
      } else if (this.registerForm.fullName.trim().length < 2) {
        this.registerErrors.fullName = 'Họ và tên phải có ít nhất 2 ký tự';
        isValid = false;
      }
      
      // Validate email
      if (!this.registerForm.email) {
        this.registerErrors.email = 'Email là bắt buộc';
        isValid = false;
      } else if (!this.validateEmail(this.registerForm.email)) {
        this.registerErrors.email = 'Email không đúng định dạng';
        isValid = false;
      } else if (this.existingEmails.includes(this.registerForm.email)) {
        this.registerErrors.email = 'Email này đã được sử dụng';
        isValid = false;
      }
      
      // Validate phone
      if (!this.registerForm.phone) {
        this.registerErrors.phone = 'Số điện thoại là bắt buộc';
        isValid = false;
      } else if (this.registerForm.phone.length < 10) {
        this.registerErrors.phone = 'Số điện thoại không đúng định dạng';
        isValid = false;
      }
      
      // Validate password
      if (!this.registerForm.password) {
        this.registerErrors.password = 'Mật khẩu là bắt buộc';
        isValid = false;
      } else if (this.registerForm.password.length < 6) {
        this.registerErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        isValid = false;
      }
      
      // Validate confirm password
      if (!this.registerForm.confirmPassword) {
        this.registerErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
        isValid = false;
      } else if (this.registerForm.password !== this.registerForm.confirmPassword) {
        this.registerErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        isValid = false;
      }
      
      // Validate terms agreement
      if (!this.registerForm.agreeTerms) {
        this.showAlert('Vui lòng đồng ý với điều khoản sử dụng', 'error');
        isValid = false;
      }
      
      if (!isValid) return;
      
      this.registerLoading = true;
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Add to registered users
        this.registeredUsers.push({
          email: this.registerForm.email,
          password: this.registerForm.password,
          name: this.registerForm.fullName,
          phone: this.registerForm.phone,
          role: 'user'
        });
        
        this.existingEmails.push(this.registerForm.email);
        
        this.showAlert(`Đăng ký thành công! Chào mừng ${this.registerForm.fullName}`, 'success');
        
        // Clear form
        this.registerForm = {
          fullName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          agreeTerms: false
        };
        
        // Switch to login after success
        setTimeout(() => {
          this.setActiveTab('login');
          this.showAlert('Bạn có thể đăng nhập với tài khoản vừa tạo', 'success');
        }, 2000);
        
      } catch (error) {
        this.showAlert('Có lỗi xảy ra. Vui lòng thử lại sau.', 'error');
      } finally {
        this.registerLoading = false;
      }
    },
    
    // Forgot password handler
    handleForgotPassword() {
      if (!this.forgotPasswordEmail) {
        alert('Vui lòng nhập email');
        return;
      }
      
      if (!this.validateEmail(this.forgotPasswordEmail)) {
        alert('Email không đúng định dạng');
        return;
      }
      
      this.showForgotPasswordModal = false;
      this.showAlert(`Link đặt lại mật khẩu đã được gửi đến ${this.forgotPasswordEmail}`, 'success');
      this.forgotPasswordEmail = '';
    }
    
  }
}
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.auth-card {
  border: none;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  min-width: 320px;
  max-width: 400px;
  width: 100%;
}

.logo-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-control {
  border-radius: 10px;
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.alert {
  border-radius: 10px;
  border: none;
}

.form-check-input:checked {
  background-color: #667eea;
  border-color: #667eea;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.is-invalid {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.nav-tabs {
  border: none;
  justify-content: center;
  gap: 20px;
}

.nav-tabs .nav-link {
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: #667eea;
  border-radius: 25px;
  padding: 10px 25px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-tabs .nav-link:hover {
  background: rgba(255, 255, 255, 0.3);
  color: #667eea;
}

.nav-tabs .nav-link.active {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  font-weight: 600;
}

@media (max-width: 576px) {
  .auth-card {
    margin: 15px;
    min-width: auto;
  }
}
</style>