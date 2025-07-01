<template>
  <div class="change-password-container">
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-6 col-md-8">
          <div class="card shadow-lg">
            <div class="card-header bg-primary text-white text-center">
              <h4 class="mb-0">
                <i class="bi bi-shield-lock me-2"></i>
                Đổi Mật Khẩu
              </h4>
            </div>
            
            <div class="card-body p-4">
              <!-- Loading State -->
              <div v-if="loading" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Đang xử lý...</span>
                </div>
                <p class="mt-3 text-muted">Đang xử lý yêu cầu...</p>
              </div>

              <!-- Error Message -->
              <div v-if="error" class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                {{ error }}
              </div>

              <!-- Success Message -->
              <div v-if="success" class="alert alert-success border-0 shadow-sm" role="alert">
                <div class="d-flex align-items-center">
                  <div class="flex-shrink-0">
                    <i class="bi bi-check-circle-fill text-success fs-4"></i>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <h6 class="alert-heading mb-1">Thành công!</h6>
                    <p class="mb-0">{{ success }}</p>
                  </div>
                </div>
              </div>

              <!-- Change Password Form -->
              <form v-if="!loading && !success" @submit.prevent="handleChangePassword" class="change-password-form">
                <!-- Current Password -->
                <div class="form-group mb-3">
                  <label class="form-label fw-bold">
                    <i class="bi bi-lock me-2"></i>
                    Mật khẩu hiện tại
                  </label>
                  <div class="input-group">
                    <input
                      :type="showCurrentPassword ? 'text' : 'password'"
                      v-model="form.currentPassword"
                      class="form-control"
                      :class="{ 'is-invalid': errors.currentPassword }"
                      placeholder="Nhập mật khẩu hiện tại"
                      required
                    />
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="showCurrentPassword = !showCurrentPassword"
                    >
                      <i :class="showCurrentPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <div v-if="errors.currentPassword" class="invalid-feedback d-block">
                    {{ errors.currentPassword }}
                  </div>
                </div>

                <!-- New Password -->
                <div class="form-group mb-3">
                  <label class="form-label fw-bold">
                    <i class="bi bi-key me-2"></i>
                    Mật khẩu mới
                  </label>
                  <div class="input-group">
                    <input
                      :type="showNewPassword ? 'text' : 'password'"
                      v-model="form.newPassword"
                      class="form-control"
                      :class="{ 'is-invalid': errors.newPassword }"
                      placeholder="Nhập mật khẩu mới"
                      required
                    />
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="showNewPassword = !showNewPassword"
                    >
                      <i :class="showNewPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <div v-if="errors.newPassword" class="invalid-feedback d-block">
                    {{ errors.newPassword }}
                  </div>
                  
                  <!-- Password Strength Indicator -->
                  <div v-if="form.newPassword" class="password-strength mt-2">
                    <div class="strength-bar">
                      <div 
                        class="strength-fill" 
                        :class="passwordStrengthClass"
                        :style="{ width: passwordStrength + '%' }"
                      ></div>
                    </div>
                    <small class="text-muted">
                      Độ mạnh: {{ passwordStrengthText }}
                    </small>
                    
                    <!-- Password Requirements -->
                    <div class="password-requirements mt-2">
                      <small class="d-block" :class="{ 'text-success': hasUppercase, 'text-muted': !hasUppercase }">
                        <i :class="hasUppercase ? 'bi bi-check-circle' : 'bi bi-circle'"></i>
                        Ít nhất 1 chữ hoa
                      </small>
                      <small class="d-block" :class="{ 'text-success': hasLowercase, 'text-muted': !hasLowercase }">
                        <i :class="hasLowercase ? 'bi bi-check-circle' : 'bi bi-circle'"></i>
                        Ít nhất 1 chữ thường
                      </small>
                      <small class="d-block" :class="{ 'text-success': hasNumber, 'text-muted': !hasNumber }">
                        <i :class="hasNumber ? 'bi bi-check-circle' : 'bi bi-circle'"></i>
                        Ít nhất 1 số
                      </small>
                      <small class="d-block" :class="{ 'text-success': hasSpecialChar, 'text-muted': !hasSpecialChar }">
                        <i :class="hasSpecialChar ? 'bi bi-check-circle' : 'bi bi-circle'"></i>
                        Ít nhất 1 ký tự đặc biệt
                      </small>
                      <small class="d-block" :class="{ 'text-success': form.newPassword.length >= 6, 'text-muted': form.newPassword.length < 6 }">
                        <i :class="form.newPassword.length >= 6 ? 'bi bi-check-circle' : 'bi bi-circle'"></i>
                        Ít nhất 6 ký tự
                      </small>
                    </div>
                  </div>
                </div>

                <!-- Confirm New Password -->
                <div class="form-group mb-4">
                  <label class="form-label fw-bold">
                    <i class="bi bi-check-circle me-2"></i>
                    Xác nhận mật khẩu mới
                  </label>
                  <div class="input-group">
                    <input
                      :type="showConfirmPassword ? 'text' : 'password'"
                      v-model="form.confirmPassword"
                      class="form-control"
                      :class="{ 'is-invalid': errors.confirmPassword }"
                      placeholder="Nhập lại mật khẩu mới"
                      required
                    />
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="showConfirmPassword = !showConfirmPassword"
                    >
                      <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                  <div v-if="errors.confirmPassword" class="invalid-feedback d-block">
                    {{ errors.confirmPassword }}
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="d-grid gap-2">
                  <button 
                    type="submit" 
                    class="btn btn-primary btn-lg"
                    :disabled="isSubmitting || !isFormValid"
                  >
                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-shield-check me-2"></i>
                    {{ isSubmitting ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu' }}
                  </button>
                  
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary"
                    @click="resetForm"
                    :disabled="isSubmitting"
                  >
                    <i class="bi bi-arrow-clockwise me-2"></i>
                    Làm mới
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { loginService } from '@/services/loginService'

const router = useRouter()
const authStore = useAuthStore()

// Form data
const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// State
const errors = reactive({})
const loading = ref(false)
const isSubmitting = ref(false)
const error = ref('')
const success = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Check authentication on mount
onMounted(() => {
  if (!authStore.isLoggedIn) {
    router.push('/login')
  }
})

// Computed properties
const passwordStrength = computed(() => {
  if (!form.newPassword) return 0
  
  let strength = 0
  if (form.newPassword.length >= 6) strength += 20
  if (hasUppercase.value) strength += 20
  if (hasLowercase.value) strength += 20
  if (hasNumber.value) strength += 20
  if (hasSpecialChar.value) strength += 20
  
  return strength
})

const passwordStrengthClass = computed(() => {
  if (passwordStrength.value <= 40) return 'strength-weak'
  if (passwordStrength.value <= 80) return 'strength-medium'
  return 'strength-strong'
})

const passwordStrengthText = computed(() => {
  if (passwordStrength.value <= 40) return 'Yếu'
  if (passwordStrength.value <= 80) return 'Trung bình'
  return 'Mạnh'
})

const hasUppercase = computed(() => /[A-Z]/.test(form.newPassword))
const hasLowercase = computed(() => /[a-z]/.test(form.newPassword))
const hasNumber = computed(() => /[0-9]/.test(form.newPassword))
const hasSpecialChar = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(form.newPassword))

const isFormValid = computed(() => {
  return form.currentPassword && 
         form.newPassword && 
         form.confirmPassword &&
         form.newPassword === form.confirmPassword &&
         form.newPassword.length >= 6
})

// Methods
const validateForm = () => {
  const newErrors = {}
  
  // Current password validation
  if (!form.currentPassword) {
    newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại'
  }
  
  // New password validation
  if (!form.newPassword) {
    newErrors.newPassword = 'Vui lòng nhập mật khẩu mới'
  } else if (form.newPassword.length < 6) {
    newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự'
  }
  
  // Confirm password validation
  if (!form.confirmPassword) {
    newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới'
  } else if (form.newPassword !== form.confirmPassword) {
    newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
  }
  
  // Check if new password is same as current
  if (form.currentPassword && form.newPassword && 
      form.currentPassword === form.newPassword) {
    newErrors.newPassword = 'Mật khẩu mới không được trùng với mật khẩu hiện tại'
  }
  
  Object.assign(errors, newErrors)
  return Object.keys(newErrors).length === 0
}

const clearErrors = () => {
  Object.keys(errors).forEach(key => delete errors[key])
  error.value = ''
}

const resetForm = () => {
  form.currentPassword = ''
  form.newPassword = ''
  form.confirmPassword = ''
  clearErrors()
  success.value = ''
  showCurrentPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
}

const handleChangePassword = async () => {
  clearErrors()
  isSubmitting.value = true
  error.value = ''
  
  try {
    // Validate form
    if (!validateForm()) {
      return
    }
    
    // Call API to change password
    const response = await loginService.changePassword({
      username: authStore.currentUser.username,
      oldPassword: form.currentPassword,
      newPassword: form.newPassword,
      confirmPassword: form.confirmPassword
    })
    
    alert('Đổi mật khẩu thành công! Mật khẩu mới đã được cập nhật và lưu vào hệ thống.')
    
    // Update user data in store if needed
    if (response && response.user) {
      authStore.updateUser(response.user)
    }
    
    resetForm()
    
    setTimeout(() => {
      router.push('/')
    }, 1000)
    
  } catch (err) {
    console.error('Change password error:', err)
    error.value = err.message || 'Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.change-password-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 0;
}

.card {
  border: none;
  border-radius: 15px;
  overflow: hidden;
}

.card-header {
  border-bottom: none;
  padding: 1.5rem;
}

.card-body {
  padding: 2rem;
}

.form-label {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.input-group .btn {
  border-left: none;
}

.input-group .form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

/* Password Strength Bar */
.password-strength {
  margin-top: 0.5rem;
}

.strength-bar {
  height: 4px;
  background-color: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.strength-weak {
  background-color: #dc3545;
}

.strength-medium {
  background-color: #ffc107;
}

.strength-strong {
  background-color: #198754;
}

/* Password Requirements */
.password-requirements {
  font-size: 0.8rem;
}

.password-requirements small {
  margin-bottom: 0.25rem;
}

.password-requirements i {
  margin-right: 0.25rem;
}

/* Success Message Animation */
.alert-success {
  animation: slideInDown 0.5s ease-out;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .card-body {
    padding: 1.5rem;
  }
}
</style>