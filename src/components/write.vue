<template>
  <div class="container-fluid py-4" style="position: relative; z-index: 1;">
    <div class="row justify-content-center">
      <div class="col-xl-10 col-lg-12">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h2 mb-1 text-primary fw-bold">
              <i class="bi bi-pencil-square me-2"></i>
              Viết Tin Tức Mới
            </h1>
            <p class="text-muted mb-0">Tạo bài viết mới cho trang tin tức</p>
          </div>
          <div class="d-flex gap-2">
            <button 
              @click="saveDraft" 
              class="btn btn-outline-secondary"
              :disabled="isSubmitting"
            >
              <i class="bi bi-save me-2"></i>
              Lưu nháp
            </button>
            <button 
              @click="publishNews" 
              class="btn btn-primary"
              :disabled="isSubmitting || !isFormValid"
            >
              <i class="bi bi-send me-2"></i>
              Gửi để kiểm duyệt
            </button>
          </div>
        </div>

        <!-- Form -->
        <div class="card shadow-lg border-0 rounded-4">
          <div class="card-body p-5">
            <form @submit.prevent="publishNews">
              <!-- Basic Information -->
              <div class="row g-4 mb-5">
                <div class="col-md-8">
                  <div class="mb-4">
                    <label class="form-label fw-bold text-dark">
                      <i class="bi bi-type-h1 me-2 text-primary"></i>
                      Tiêu đề bài viết *
                    </label>
                    <input
                      v-model="form.title"
                      type="text"
                      class="form-control form-control-lg"
                      placeholder="Nhập tiêu đề bài viết..."
                      required
                    />
                  </div>
                  
                  <div class="mb-4">
                    <label class="form-label fw-bold text-dark">
                      <i class="bi bi-type me-2 text-primary"></i>
                      Phụ đề
                    </label>
                    <input
                      v-model="form.subtitle"
                      type="text"
                      class="form-control"
                      placeholder="Nhập phụ đề (tùy chọn)..."
                    />
                  </div>
                </div>
                
                <div class="col-md-4">
                  <!-- Chọn thumbnail -->
                  <div class="mb-4">
                    <label class="form-label fw-bold text-dark">
                      <i class="bi bi-image me-2 text-primary"></i>
                      Ảnh thumbnail
                    </label>
                    <input
                      type="file"
                      class="form-control"
                      accept="image/*"
                      @change="handleFileChange"
                    />
                    <div v-if="form.thumbnail" class="mt-2">
                      <img :src="getImageUrl(form.thumbnail)" alt="Ảnh đại diện" style="max-width: 200px; max-height: 120px; border-radius: 8px; border: 1px solid #eee;" />
                    </div>
                    <small class="text-muted">Chọn ảnh từ máy tính, ảnh sẽ được upload lên server.</small>
                  </div>
                </div>
              </div>

              <!-- Category and Status -->
              <div class="row g-4 mb-5">
                <div class="col-md-6">
                  <label class="form-label fw-bold text-dark">
                    <i class="bi bi-tags me-2 text-primary"></i>
                    Danh mục *
                  </label>
                  <select 
                    v-model="form.categoryId" 
                    class="form-select form-select-lg"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    <option 
                      v-for="category in categories" 
                      :key="category.categoryId" 
                      :value="category.categoryId"
                    >
                      {{ category.categoryName }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Point Section -->
              <div class="row g-4 mb-5">
                <div class="col-md-6">
                  <label class="form-label fw-bold text-dark">
                    <i class="bi bi-coin me-2 text-primary"></i>
                    Point thưởng cho bài viết (tùy chọn)
                  </label>
                  <div class="input-group">
                    <input
                      v-model.number="form.paidPoint"
                      type="number"
                      class="form-control"
                      placeholder="0"
                      min="0"
                      max="1000"
                    />
                    <span class="input-group-text">point</span>
                  </div>
                  <small class="text-muted">
                    <i class="bi bi-info-circle me-1"></i>
                    Đặt point để khuyến khích người đọc. Point sẽ được trừ từ tài khoản của bạn.
                  </small>
                </div>
                
                <div class="col-md-6">
                  <div class="card bg-light border-0">
                    <div class="card-body">
                      <h6 class="card-title text-primary mb-2">
                        <i class="bi bi-wallet me-2"></i>
                        Thông tin Point
                      </h6>
                      <div class="d-flex justify-content-between align-items-center">
                        <span class="text-muted">Point hiện tại:</span>
                        <span class="fw-bold text-success">{{ auth.userProfile?.point || 0 }} point</span>
                      </div>
                      <div class="d-flex justify-content-between align-items-center mt-2">
                        <span class="text-muted">Point sẽ trừ:</span>
                        <span class="fw-bold" :class="form.paidPoint > 0 ? 'text-warning' : 'text-muted'">
                          {{ form.paidPoint }} point
                        </span>
                      </div>
                      <div v-if="form.paidPoint > (auth.userProfile?.point || 0)" class="alert alert-warning mt-2 mb-0 py-2">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        <small>Point không đủ! Vui lòng nạp thêm point.</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Content Editor -->
              <div class="mb-5">
                <label class="form-label fw-bold text-dark">
                  <i class="bi bi-file-text me-2 text-primary"></i>
                  Nội dung bài viết *
                </label>
                
                <!-- Content Sections -->
                <div class="content-sections">
                  <div 
                    v-for="(section, index) in form.details" 
                    :key="index"
                    class="content-section mb-4"
                  >
                    <div class="d-flex align-items-center mb-3">
                      <span class="badge bg-primary me-3">Phần {{ index + 1 }}</span>
                      <button 
                        type="button"
                        @click="removeSection(index)"
                        class="btn btn-sm btn-outline-danger"
                        :disabled="form.details.length === 1"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                      <button 
                        type="button"
                        @click="() => handleSectionImageUpload(index)"
                        class="btn btn-sm btn-outline-secondary ms-2"
                      >
                        <i class="bi bi-image"></i> Chèn ảnh
                      </button>
                      <input 
                        type="file" 
                        accept="image/*" 
                        :ref="el => sectionImageInputs[index] = el" 
                        style="display: none" 
                        @change="event => handleSectionImageChange(event, index)"
                      />
                    </div>
                    <div v-if="isImageSection(section)" class="mb-2">
                      <img :src="section" alt="Ảnh nội dung" style="max-width: 100%; max-height: 300px; border-radius: 8px; border: 1px solid #eee;" />
                      <button type="button" class="btn btn-sm btn-outline-warning mt-2" @click="clearSectionImage(index)"><i class="bi bi-x"></i> Xóa ảnh</button>
                    </div>
                    <div v-else>
                      <textarea
                        v-model="form.details[index]"
                        class="form-control"
                        rows="6"
                        :placeholder="`Nhập nội dung phần ${index + 1}...`"
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                <!-- Add Section Button -->
                <button 
                  type="button"
                  @click="addSection"
                  class="btn btn-outline-primary"
                >
                  <i class="bi bi-plus-circle me-2"></i>
                  Thêm phần nội dung
                </button>
              </div>

              <!-- Preview Section -->
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import newsCreateService from '../services/NewsCreateService'
import uploadService from '@/services/uploadService'
import { getImageUrl } from '@/services/api'

const router = useRouter()
const auth = useAuthStore()

// Reactive data
const form = ref({
  title: '',
  subtitle: '',
  thumbnail: '',
  categoryId: '',
  status: 'draft',
  details: [''], // Start with one empty section
  paidPoint: 0
})

const categories = ref([])
const isSubmitting = ref(false)
const sectionImageInputs = ref([])

function isImageSection(section) {
  return typeof section === 'string' && /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(section)
}

function handleSectionImageUpload(index) {
  if (sectionImageInputs.value[index]) {
    sectionImageInputs.value[index].value = '' // reset input
    sectionImageInputs.value[index].click()
  }
}

async function handleSectionImageChange(event, index) {
  const file = event.target.files[0]
  if (!file) return
  try {
    const imageUrl = await uploadService.uploadImage(file)
    form.value.details[index] = imageUrl
  } catch (err) {
    alert('Upload ảnh thất bại!')
  }
}

function clearSectionImage(index) {
  form.value.details[index] = ''
}

// Computed properties
const isFormValid = computed(() => {
  return form.value.title.trim() && 
         form.value.categoryId && 
         form.value.details.some(detail => detail.trim())
})

const selectedCategory = computed(() => {
  return categories.value.find(cat => cat.categoryId === form.value.categoryId)
})

// Methods
const loadCategories = async () => {
  try {
    const response = await newsCreateService.getCategories()
    categories.value = response.data
  } catch (error) {
    console.error('Error loading categories:', error)
  }
}

const addSection = () => {
  form.value.details.push('')
}

const removeSection = (index) => {
  if (form.value.details.length > 1) {
    form.value.details.splice(index, 1)
  }
}

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const imageUrl = await uploadService.uploadImage(file);
    console.log('Ảnh upload trả về:', imageUrl);
    form.value.thumbnail = imageUrl;
  } catch (err) {
    alert('Upload ảnh thất bại!');
  }
};

const saveDraft = async () => {
  if (!isFormValid.value) {
    alert('Vui lòng điền đầy đủ thông tin bắt buộc')
    return
  }
  
  isSubmitting.value = true
  try {
    form.value.status = 'draft'
    const response = await newsCreateService.createNews({
      ...form.value,
      authorId: auth.currentUser?.user?.userId
    })
    
    alert('Đã lưu nháp thành công!')
  } catch (error) {
    console.error('Error saving draft:', error)
    alert('Có lỗi xảy ra khi lưu nháp: ' + (error.response?.data || error.message))
  } finally {
    isSubmitting.value = false
  }
}

const publishNews = async () => {
  if (!isFormValid.value) {
    alert('Vui lòng điền đầy đủ thông tin bắt buộc')
    return
  }
  if (form.value.paidPoint > (auth.userProfile?.point || 0)) {
    alert('Point không đủ! Vui lòng nạp thêm point hoặc giảm số point thưởng.')
    return
  }
  isSubmitting.value = true
  try {
    form.value.status = 'pending'
    console.log('Dữ liệu gửi lên:', form.value)
    const response = await newsCreateService.createNews({
      ...form.value,
      authorId: auth.currentUser?.user?.userId
    })
    alert('Gửi bài thành công! Bài viết đang chờ kiểm duyệt.')
  } catch (error) {
    console.error('Error publishing news:', error)
    alert('Có lỗi xảy ra khi gửi bài: ' + (error.response?.data || error.message))
  } finally {
    isSubmitting.value = false
  }
}

const viewNews = () => {
  if (createdNewsId.value) {
    router.push(`/detail/${createdNewsId.value}`)
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'draft': return 'Nháp'
    case 'pending': return 'Chờ kiểm duyệt'
    case 'published': return 'Công khai'
    default: return 'Nháp'
  }
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'draft': return 'bg-secondary'
    case 'pending': return 'bg-warning'
    case 'published': return 'bg-success'
    default: return 'bg-secondary'
  }
}

// Thay getImageUrl cục bộ bằng import từ service

// Lifecycle
onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.content-section {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  background-color: #f8f9fa;
}

.content-section:hover {
  border-color: #0d6efd;
  background-color: #f0f8ff;
}

.form-control:focus,
.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.btn {
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.content-sections {
  max-height: 600px;
  overflow-y: auto;
}

/* Custom scrollbar */
.content-sections::-webkit-scrollbar {
  width: 8px;
}

.content-sections::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.content-sections::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.content-sections::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>