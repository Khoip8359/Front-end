<template>
  <!-- Banner Carousel-->
  <div id="bannerCarousel" class="carousel slide top-layer-banner" data-bs-ride="carousel">
    <div class="carousel-inner">
      <div class="carousel-item active">
        <img src="/img/banner1.jpg" class="d-block w-100" alt="Banner 1">
      </div>
      <div class="carousel-item">
        <img src="/img/banner2.jpg" class="d-block w-100" alt="Banner 2">
      </div>
      <div class="carousel-item">
        <img src="/img/banner3.jpg" class="d-block w-100" alt="Banner 3">
      </div>
    </div>

    <button class="carousel-control-prev" type="button" data-bs-target="#bannerCarousel" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#bannerCarousel" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>

  <!-- Top Bar - Sticky-->
  <div class="sticky-top-bar">
    <div class="container-fluid bg-white shadow-sm border-bottom">
      <div class="row g-0 align-items-center py-3">
        
        <!-- Logo Section -->
        <div class="col-lg-2 col-md-3 col-sm-4">
          <RouterLink to="/" class="d-flex justify-content-center align-items-center text-decoration-none" @click="scrollToTop">
            <div class="position-relative">
              <img 
                class="rounded-circle shadow-sm border border-3 border-primary" 
                src="/img/logo.png" 
                alt="Logo"
                style="width: 55px; height: 55px; object-fit: cover; transition: transform 0.3s ease;"
                @mouseover="$event.target.style.transform = 'scale(1.1)'"
                @mouseleave="$event.target.style.transform = 'scale(1)'"
              />
            </div>
          </RouterLink>
        </div>

        <!-- Date Time Section -->
        <RouterLink to="/time" @click="scrollToTop" class="col-lg-2 col-md-3">
          <div class="text-center">
            <div class="badge bg-light text-dark fs-6 px-3 py-2 shadow-sm mb-1">
              <i class="bi bi-calendar3 me-1"></i>
              <span class="fw-semibold">{{ currentDate }}</span>
            </div>
            <div class="badge bg-light text-muted fs-6 px-3 py-1 shadow-sm">
              <i class="bi bi-clock me-1"></i>
              <span>{{ currentTime }}</span>
            </div>
          </div>
        </RouterLink>

        <!-- Search Section -->
        <div class="col-lg-6 col-md-4 col-sm-6 px-3">
          <div class="input-group shadow-sm">
            <input 
              v-model="searchQuery"
              @keyup.enter="onSearch"
              type="text" 
              class="form-control form-control-lg border-end-0 rounded-start-pill ps-4" 
              placeholder="Tìm kiếm bài viết, tin tức..." 
              style="border-color: #dee2e6;"
            />
            <button @click="onSearch" class="btn btn-primary rounded-end-pill px-4 shadow-sm">
              🔍
            </button>
          </div>
        </div>

        <div class="col-lg-2 col-md-2 col-sm-2 px-3">
          <div class="d-flex justify-content-center">
            <div v-if="authStore.isLoggedIn" class="dropdown user-menu">
              <button 
                class="btn btn-outline-primary dropdown-toggle rounded-pill px-4 py-2 fw-semibold shadow-sm"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="bi bi-person-circle me-1"></i>
                {{ authStore.displayName }}
              </button>
              <ul class="dropdown-menu">
                <li>
                  <div class="dropdown-item-text">
                    <div class="fw-bold">{{ authStore.displayName }}</div>
                    <div class="text-muted">{{ authStore.userEmail }}</div>
                  </div>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <RouterLink class="dropdown-item" :to="`/profile/${authStore.currentUser.username}`">
                    <i class="bi bi-person me-2"></i>Hồ sơ cá nhân
                  </RouterLink>
                </li>
                <li>
                  <RouterLink class="dropdown-item" :to="`/payment`">
                    <i class="bi bi-person me-2"></i>Nạp thêm point
                  </RouterLink>
                </li>
                <li>
                  <RouterLink class="dropdown-item" to="/changePassword">
                    <i class="bi bi-key me-2"></i>Đổi mật khẩu
                  </RouterLink>
                </li>
                <li v-if="authStore.isReporter">
                  <RouterLink class="dropdown-item" to="/reporter">
                    <i class="bi bi-pencil-square me-2"></i>Quản lý bài viết
                  </RouterLink>
                </li>
                <li v-if="authStore.isCensor">
                  <RouterLink class="dropdown-item" to="/censor">
                    <i class="bi bi-shield-check me-2"></i>Kiểm duyệt
                  </RouterLink>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <button class="dropdown-item text-danger" @click="handleLogout">
                    <i class="bi bi-box-arrow-right me-2"></i>Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
            
            <RouterLink 
              v-else
              to="/login" 
              class="btn btn-outline-primary rounded-pill px-4 py-2 fw-semibold shadow-sm"
              @click="scrollToTop"
            >
              <i class="bi bi-person-circle me-1"></i>Đăng nhập
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Category Bar -->
  <nav class="navbar navbar-expand-lg navbar-light custom-bg-lightblue shadow-sm">
    <div class="container-fluid">
      <a class="navbar-brand fw-bold text-white" href="#">
        <i class="bi bi-newspaper me-2"></i>
        Tin Tức
      </a>
      
      <button
        class="navbar-toggler border-0"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#categoryNav"
        aria-controls="categoryNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse justify-content-center" id="categoryNav">
        <ul class="navbar-nav mb-2 mb-lg-0">
          <!-- Home Link -->
          <li class="nav-item">
            <RouterLink class="nav-link text-white fw-semibold px-3 py-2 rounded-pill mx-1" to="/" @click="scrollToTop">
              Trang chủ
            </RouterLink>
          </li>
          
          <!-- Dynamic Categories -->
          <li v-for="category in categories" :key="category.categoryId" class="nav-item">
            <RouterLink 
              class="nav-link text-white fw-semibold px-3 py-2 rounded-pill mx-1" 
              :to="`/category/${category.categoryId}`"
              @click="scrollToTop"
            >
              {{ category.categoryName }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { newsService } from '@/services/NewsService.js'

// Router & tìm kiếm
const router = useRouter()
const authStore = useAuthStore()
const searchQuery = ref('')
// Categories data
const categories = ref([])

// Date and time
const currentDate = ref('')
const currentTime = ref('')
let timeInterval = null

// Gửi truy vấn tìm kiếm
const onSearch = () => {
  const keyword = searchQuery.value.trim()
  if (keyword !== '') {
    router.push({ path: '/category/0', query: { keyword } })
  }
}

// Scroll to top function
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Fetch categories
onMounted(async () => {
  try {
    categories.value = await newsService.getCategories()
  } catch (error) {
    console.error('Lấy danh mục thất bại:', error)
  }

  // Setup time update
  updateDateTime()
  timeInterval = setInterval(updateDateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

// Update date time function
const updateDateTime = () => {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('vi-VN')
  currentTime.value = now.toLocaleTimeString('vi-VN')
}

// Handle logout
const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.top-layer-banner {
  position: relative;
  z-index: 8888;
}

.sticky-top-bar {
  position: sticky;
  top: 0;
  z-index: 9999;
  width: 100%;
  background: white;
}

.custom-bg-lightblue {
  background: linear-gradient(135deg, #85c1e9 0%, #5dade2 100%) !important;
}

/* Hover effects for nav links */
.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2) !important;
  transform: translateY(-1px);
  transition: all 0.3s ease;
}

/* Button hover effects */
.btn:hover {
  transform: translateY(-1px);
  transition: all 0.3s ease;
}

/* Search input focus */
.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .navbar-brand {
    font-size: 1rem;
  }
  
  .form-control-lg {
    font-size: 0.9rem;
  }
  
  .col-sm-4 img {
    width: 45px;
    height: 45px;
  }
}

/* Active nav link */
.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.3) !important;
  font-weight: bold;
}

/* Custom navbar toggler */
.navbar-toggler:focus {
  box-shadow: none;
}

/* Badge animations */
.badge {
  transition: all 0.3s ease;
}

.badge:hover {
  transform: scale(1.05);
}

/* Đảm bảo dropdown menus hiển thị đúng */
.dropdown-menu {
  z-index: 10000;
}

/* Smooth animations */
.sticky-top-bar {
  transition: all 0.3s ease;
}

/* Optional: Add backdrop blur effect cho top bar */
.sticky-top-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(10px);
  z-index: -1;
}

/* User menu styles */
.user-menu {
  position: relative;
}

.user-menu .dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
  justify-content: center;
}

.user-menu .dropdown-toggle::after {
  margin-left: 8px;
}

.user-menu .dropdown-menu {
  min-width: 200px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  margin-top: 8px;
}

.user-menu .dropdown-item {
  padding: 10px 16px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.user-menu .dropdown-item:hover {
  background-color: #f8f9fa;
  transform: translateX(4px);
}

.user-menu .dropdown-item.text-danger:hover {
  background-color: #f8d7da;
}

.user-menu .dropdown-item-text {
  padding: 10px 16px;
}

.user-menu .dropdown-item-text .fw-bold {
  font-size: 14px;
  color: #333;
}

.user-menu .dropdown-item-text .text-muted {
  font-size: 12px;
}

.user-menu .dropdown-divider {
  margin: 8px 0;
  border-color: #e9ecef;
}

/* Responsive user menu */
@media (max-width: 768px) {
  .user-menu .dropdown-toggle {
    min-width: 100px;
    font-size: 14px;
    padding: 8px 12px;
  }
  
  .user-menu .dropdown-menu {
    min-width: 180px;
  }
}
</style>