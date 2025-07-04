<template>
  <div class="profile-container">
    <div class="container py-4">
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="text-center mb-3">
            <i class="bi bi-person-circle me-2"></i>
            Thông Tin Cá Nhân
          </h2>
          <hr>
        </div>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
        <p class="mt-3">Đang tải thông tin profile...</p>
      </div>

      <div v-else-if="error" class="alert alert-danger" role="alert">
        <i class="bi bi-exclamation-triangle me-2"></i>
        {{ error }}
        <button @click="loadProfile" class="btn btn-outline-danger btn-sm ms-3">
          <i class="bi bi-arrow-clockwise me-1"></i>
          Thử lại
        </button>
      </div>

      <div v-else-if="userProfile" class="row">
        <div class="col-lg-8 mx-auto">
          <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">
                <i class="bi bi-person-badge me-2"></i>
                {{ isEditing ? 'Chỉnh Sửa Thông Tin' : 'Thông Tin Chi Tiết' }}
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-4 text-center mb-4">
                  <div class="avatar-container">
                    <div class="avatar-placeholder">
                      <i class="bi bi-person-fill"></i>
                    </div>
                    <div class="mt-3">
                      <h5 class="text-primary">{{ userProfile.name }}</h5>
                      <span class="badge bg-secondary">ID: {{ userProfile.userId }}</span>
                    </div>
                  </div>
                </div>

                <div class="col-md-8">
                  <form @submit.prevent="saveProfile" v-if="isEditing">
                    <div class="row g-3">
                      <div class="col-12">
                        <label class="form-label fw-bold">
                          <i class="bi bi-person me-2"></i>
                          Họ và Tên
                        </label>
                        <input 
                          v-model="editForm.name" 
                          type="text" 
                          class="form-control" 
                          required
                        >
                      </div>

                      <div class="col-md-6">
                        <label class="form-label fw-bold">
                          <i class="bi bi-gender-ambiguous me-2"></i>
                          Giới tính
                        </label>
                        <select v-model="editForm.gender" class="form-select">
                          <option value="M">Nam</option>
                          <option value="F">Nữ</option>
                          <option value="O">Khác</option>
                        </select>
                      </div>

                      <div class="col-md-6">
                        <label class="form-label fw-bold">
                          <i class="bi bi-calendar-event me-2"></i>
                          Ngày sinh
                        </label>
                        <input 
                          v-model="editForm.birthday" 
                          type="date" 
                          class="form-control"
                        >
                      </div>

                      <div class="col-md-6">
                        <label class="form-label fw-bold">
                          <i class="bi bi-telephone me-2"></i>
                          Số điện thoại
                        </label>
                        <input 
                          v-model="editForm.phone" 
                          type="tel" 
                          class="form-control"
                        >
                      </div>

                      <div class="col-md-6">
                        <label class="form-label fw-bold">
                          <i class="bi bi-envelope me-2"></i>
                          Email
                        </label>
                        <input 
                          v-model="editForm.email" 
                          type="email" 
                          class="form-control"
                        >
                      </div>

                      <div class="col-12">
                        <label class="form-label fw-bold">
                          <i class="bi bi-chat-quote me-2"></i>
                          Mô tả
                        </label>
                        <textarea 
                          v-model="editForm.description" 
                          class="form-control" 
                          rows="3"
                        ></textarea>
                      </div>
                    </div>
                  </form>

                  <div v-else class="row g-3">
                    <div class="col-12">
                      <label class="form-label fw-bold">
                        <i class="bi bi-person me-2"></i>
                        Họ và Tên
                      </label>
                      <div class="form-control-plaintext">{{ userProfile.name }}</div>
                    </div>

                    <div class="col-md-6">
                      <label class="form-label fw-bold">
                        <i class="bi bi-gender-ambiguous me-2"></i>
                        Giới tính
                      </label>
                      <div class="form-control-plaintext">
                        <span v-if="userProfile.gender === 'M'" class="badge bg-info">
                          <i class="bi bi-gender-male me-1"></i>
                          Nam
                        </span>
                        <span v-else-if="userProfile.gender === 'F'" class="badge bg-pink">
                          <i class="bi bi-gender-female me-1"></i>
                          Nữ
                        </span>
                        <span v-else class="text-muted">Khác</span>
                      </div>
                    </div>

                    <div class="col-md-6">
                      <label class="form-label fw-bold">
                        <i class="bi bi-calendar-event me-2"></i>
                        Ngày sinh
                      </label>
                      <div class="form-control-plaintext">
                        {{ formatDate(userProfile.birthday) }}
                      </div>
                    </div>

                    <div class="col-md-6">
                      <label class="form-label fw-bold">
                        <i class="bi bi-telephone me-2"></i>
                        Số điện thoại
                      </label>
                      <div class="form-control-plaintext">
                        <a :href="`tel:${userProfile.phone}`" class="text-decoration-none">
                          {{ userProfile.phone }}
                        </a>
                      </div>
                    </div>

                    <div class="col-md-6">
                      <label class="form-label fw-bold">
                        <i class="bi bi-envelope me-2"></i>
                        Email
                      </label>
                      <div class="form-control-plaintext">
                        <a :href="`mailto:${userProfile.email}`" class="text-decoration-none">
                          {{ userProfile.email }}
                        </a>
                      </div>
                    </div>

                    <div class="col-12">
                      <label class="form-label fw-bold">
                        <i class="bi bi-star me-2"></i>
                        Điểm tích lũy
                      </label>
                      <div class="form-control-plaintext">
                        <span class="badge bg-warning text-dark fs-6">
                          {{ userProfile.remainingPoint }} điểm
                        </span>
                      </div>
                    </div>

                    <div class="col-12" v-if="userProfile.description">
                      <label class="form-label fw-bold">
                        <i class="bi bi-chat-quote me-2"></i>
                        Mô tả
                      </label>
                      <div class="form-control-plaintext">
                        {{ userProfile.description }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card-footer bg-light">
              <div class="row">
                <div class="col-md-6">
                  <button @click="loadProfile" class="btn btn-outline-primary">
                    <i class="bi bi-arrow-clockwise me-2"></i>
                    Làm mới
                  </button>
                </div>
                <div class="col-md-6 text-end">
                  <div v-if="isEditing">
                    <button @click="cancelEdit" class="btn btn-outline-secondary me-2">
                      <i class="bi bi-x-circle me-2"></i>
                      Hủy
                    </button>
                    <button @click="saveProfile" class="btn btn-success" :disabled="saving">
                      <i class="bi bi-check-circle me-2"></i>
                      {{ saving ? 'Đang lưu...' : 'Lưu' }}
                    </button>
                  </div>
                  <button v-else @click="startEdit" class="btn btn-primary">
                    <i class="bi bi-pencil me-2"></i>
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <i class="bi bi-person-x display-1 text-muted"></i>
        <h4 class="mt-3">Không tìm thấy thông tin profile</h4>
        <p class="text-muted">Vui lòng đăng nhập để xem thông tin cá nhân</p>
        <router-link to="/login" class="btn btn-primary">
          <i class="bi bi-box-arrow-in-right me-2"></i>
          Đăng nhập
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { userProfileService } from '@/services/UserProfileService.js'

export default {
  name: 'Profile',
  data() {
    return {
      userProfile: null,
      loading: false,
      error: null,
      isEditing: false,
      saving: false,
      editForm: {
        name: '',
        gender: '',
        birthday: '',
        phone: '',
        email: '',
        description: ''
      }
    }
  },
  async mounted() {
    await this.loadProfile()
  },
  methods: {
    async loadProfile() {
      this.loading = true
      this.error = null
      
      try {
        const pathSegments = window.location.pathname.split('/')
        const username = pathSegments[pathSegments.length - 1]
        
        if (username && username !== 'profile') {
          this.userProfile = await userProfileService.getUserProfile(username)
        } else {
          throw new Error('Không tìm thấy username trong URL')
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        this.error = error.message || 'Không thể tải thông tin profile'
      } finally {
        this.loading = false
      }
    },

    startEdit() {
      this.isEditing = true
      this.editForm = {
        name: this.userProfile.name || '',
        gender: this.userProfile.gender || '',
        birthday: this.formatDateForInput(this.userProfile.birthday),
        phone: this.userProfile.phone || '',
        email: this.userProfile.email || '',
        description: this.userProfile.description || ''
      }
    },

    cancelEdit() {
      this.isEditing = false
      this.editForm = {
        name: '',
        gender: '',
        birthday: '',
        phone: '',
        email: '',
        description: ''
      }
    },

    async saveProfile() {
      this.saving = true
      this.error = null
      
      try {
        const pathSegments = window.location.pathname.split('/')
        let username = pathSegments[pathSegments.length - 1]
        
        if (!username || username === 'profile') {
          const user = JSON.parse(localStorage.getItem('user') || '{}')
          username = user.username
        }

        if (!username) {
          throw new Error('Không tìm thấy username')
        }

        const updateData = {
          userId: this.userProfile.userId,
          name: this.editForm.name,
          gender: this.editForm.gender,
          birthday: this.editForm.birthday,
          phone: this.editForm.phone,
          email: this.editForm.email,
          description: this.editForm.description
        }

        console.log('Sending update data:', updateData)

        const updatedProfile = await userProfileService.updateUserProfile(updateData)
        
        this.userProfile = { ...this.userProfile, ...updatedProfile }
        this.isEditing = false
        
        alert('Cập nhật thông tin thành công!')
        
      } catch (error) {
        console.error('Error updating profile:', error)
        this.error = error.message || 'Không thể cập nhật thông tin profile'
      } finally {
        this.saving = false
      }
    },

    formatDate(dateString) {
      if (!dateString) return 'Không có thông tin'
      
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      } catch (error) {
        return dateString
      }
    },

    formatDateForInput(dateString) {
      if (!dateString) return ''
      
      try {
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
      } catch (error) {
        return ''
      }
    }
  }
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 0;
}

.avatar-container {
  padding: 20px;
}

.avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: white;
  font-size: 3rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.badge.bg-pink {
  background-color: #e91e63 !important;
  color: white;
}

.form-control-plaintext {
  padding: 0.5rem 0;
  border: none;
  background: transparent;
  color: #495057;
}

.form-control-plaintext a {
  color: #0d6efd;
}

.form-control-plaintext a:hover {
  color: #0a58ca;
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

.card-footer {
  border-top: none;
  padding: 1.5rem;
}

.form-label {
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .avatar-placeholder {
    width: 100px;
    height: 100px;
    font-size: 2.5rem;
  }
  
  .card-body {
    padding: 1.5rem;
  }
}
</style> 