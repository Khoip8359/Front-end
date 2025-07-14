<template>
  <!-- Banner Carousel with Gradient Overlay -->
  <div id="bannerCarousel" class="carousel slide top-layer-banner" data-bs-ride="carousel">
    <div class="carousel-inner">
      <div class="carousel-item active">
        <div class="banner-container">
          <img src="https://res.cloudinary.com/ddqlu7sc3/image/upload/v1752454760/banner1_rqsb8c.jpg" class="d-block w-100" alt="Banner 1">
          <div class="gradient-overlay"></div>
        </div>
      </div>
      <div class="carousel-item">
        <div class="banner-container">
          <img src="https://res.cloudinary.com/ddqlu7sc3/image/upload/v1752454760/banner2_p7jmqy.jpg" class="d-block w-100" alt="Banner 2">
          <div class="gradient-overlay"></div>
        </div>
      </div>
      <div class="carousel-item">
        <div class="banner-container">
          <img src="https://res.cloudinary.com/ddqlu7sc3/image/upload/v1752454761/banner3_nxvi5j.jpg" class="d-block w-100" alt="Banner 3">
          <div class="gradient-overlay"></div>
        </div>
      </div>
    </div>

    <button class="carousel-control-prev custom-carousel-control" type="button" data-bs-target="#bannerCarousel" data-bs-slide="prev">
      <div class="carousel-control-icon">
        <i class="bi bi-chevron-left"></i>
      </div>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next custom-carousel-control" type="button" data-bs-target="#bannerCarousel" data-bs-slide="next">
      <div class="carousel-control-icon">
        <i class="bi bi-chevron-right"></i>
      </div>
      <span class="visually-hidden">Next</span>
    </button>

    <!-- Carousel Indicators -->
    <div class="carousel-indicators custom-indicators">
      <button type="button" data-bs-target="#bannerCarousel" data-bs-slide-to="0" class="active"></button>
      <button type="button" data-bs-target="#bannerCarousel" data-bs-slide-to="1"></button>
      <button type="button" data-bs-target="#bannerCarousel" data-bs-slide-to="2"></button>
    </div>
  </div>

  <!-- Main Header - Sticky with Glassmorphism -->
  <div class="sticky-top-bar">
    <div class="container-fluid glassmorphism-header">
      <div class="row g-0 align-items-center py-3">
        
        <!-- Logo Section with Animation -->
        <div class="col-lg-2 col-md-3 col-sm-4">
          <RouterLink to="/" class="d-flex justify-content-center align-items-center text-decoration-none logo-container" @click="scrollToTop">
            <div class="logo-wrapper">
              <img 
                class="logo-image" 
                src="https://res.cloudinary.com/ddqlu7sc3/image/upload/v1752454760/logo_xf1o3w.png" 
                alt="Logo"
              />
              <div class="logo-glow"></div>
            </div>
          </RouterLink>
        </div>

        <!-- Enhanced Date Time Section -->
        <RouterLink to="/time" @click="scrollToTop" class="col-lg-2 col-md-3 datetime-section">
          <div class="text-center">
            <div class="datetime-card date-card">
              <i class="bi bi-calendar-heart me-2"></i>
              <span class="fw-bold">{{ currentDate }}</span>
            </div>
            <div class="datetime-card time-card">
              <i class="bi bi-clock-history me-2"></i>
              <span>{{ currentTime }}</span>
            </div>
          </div>
        </RouterLink>

        <!-- Modern Search Section -->
        <div class="col-lg-6 col-md-4 col-sm-6 px-3">
          <div class="search-container">
            <div class="search-input-wrapper">
              <i class="bi bi-search search-icon"></i>
              <input 
                v-model="searchQuery"
                @keyup.enter="onSearch"
                type="text" 
                class="search-input" 
                placeholder="Tìm kiếm tin tức, bài viết..." 
              />
              <button @click="onSearch" class="search-button">
                <i class="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- User Menu Section -->
        <div class="col-lg-2 col-md-2 col-sm-2 px-3">
          <div class="d-flex justify-content-center">
            <div v-if="authStore.isLoggedIn" class="dropdown modern-user-menu">
              <button 
                class="btn user-menu-btn"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div class="user-avatar">
                  <i class="bi bi-person-circle"></i>
                </div>
                <span class="user-name">{{ authStore.displayName }}</span>
                <i class="bi bi-chevron-down dropdown-arrow"></i>
              </button>
              
              <ul class="dropdown-menu modern-dropdown">
                <li class="dropdown-header">
                  <div class="user-info">
                    <div class="user-avatar-large">
                      <i class="bi bi-person-circle"></i>
                    </div>
                    <div class="user-details">
                      <div class="user-name-large">{{ authStore.displayName }}</div>
                      <div class="user-email">{{ authStore.userEmail }}</div>
                    </div>
                  </div>
                </li>
                
                <li><hr class="dropdown-divider"></li>
                
                <li>
                  <RouterLink class="dropdown-item modern-dropdown-item" :to="`/profile/${authStore.currentUser.username}`">
                    <i class="bi bi-person-badge me-3"></i>
                    <span>Hồ sơ cá nhân</span>
                  </RouterLink>
                </li>
                <li>
                  <RouterLink class="dropdown-item modern-dropdown-item" :to="`/payment`">
                    <i class="bi bi-wallet2 me-3"></i>
                    <span>Nạp thêm point</span>
                  </RouterLink>
                </li>
                <li>
                  <RouterLink class="dropdown-item modern-dropdown-item" to="/changePassword">
                    <i class="bi bi-shield-lock me-3"></i>
                    <span>Đổi mật khẩu</span>
                  </RouterLink>
                </li>
                
                <li v-if="authStore.isReporter">
                  <RouterLink class="dropdown-item modern-dropdown-item" to="/reporter/dashboard">
                    <i class="bi bi-pencil-square me-3"></i>
                    <span>Quản lý bài viết</span>
                  </RouterLink>
                </li>
                
                <li v-if="authStore.isCensor">
                  <RouterLink class="dropdown-item modern-dropdown-item" to="/censor">
                    <i class="bi bi-shield-check me-3"></i>
                    <span>Kiểm duyệt</span>
                  </RouterLink>
                </li>
                
                <li><hr class="dropdown-divider"></li>
                
                <li>
                  <button class="dropdown-item modern-dropdown-item logout-item" @click="handleLogout">
                    <i class="bi bi-box-arrow-right me-3"></i>
                    <span>Đăng xuất</span>
                  </button>
                </li>
              </ul>
            </div>
            
            <RouterLink 
              v-else
              to="/login" 
              class="btn login-btn"
              @click="scrollToTop"
            >
              <i class="bi bi-person-plus me-2"></i>
              <span>Đăng nhập</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Enhanced Category Navigation -->
  <nav class="navbar navbar-expand-lg modern-category-nav">
    <div class="container-fluid">
      <div class="navbar-brand-wrapper">
        <a class="navbar-brand" href="#">
          <i class="bi bi-newspaper me-2"></i>
          <span>Tin Tức</span>
        </a>
      </div>
      
      <button
        class="navbar-toggler"
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
        <ul class="navbar-nav category-nav-list">
          <!-- Home Link -->
          <li class="nav-item">
            <RouterLink class="nav-link category-link" to="/" @click="scrollToTop">
              <i class="bi bi-house-door me-1"></i>
              <span>Trang chủ</span>
            </RouterLink>
          </li>
          
          <!-- Dynamic Categories -->
          <li v-for="category in categories" :key="category.categoryId" class="nav-item">
            <RouterLink 
              class="nav-link category-link" 
              :to="`/category/${category.categoryId}`"
              @click="scrollToTop"
            >
              <span>{{ category.categoryName }}</span>
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
  router.push('/login')
}
</script>

<style scoped>
/* Banner Section */
.top-layer-banner {
  position: relative;
  z-index: 999;
  overflow: hidden;
}

.banner-container {
  position: relative;
  height: 280px;
  overflow: hidden;
}

.banner-container img {
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.banner-container:hover img {
  transform: scale(1.05);
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(13, 110, 253, 0.3) 0%,
    rgba(108, 117, 125, 0.2) 50%,
    rgba(13, 110, 253, 0.3) 100%
  );
  pointer-events: none;
}

/* Custom Carousel Controls */
.custom-carousel-control {
  width: 60px;
  height: 60px;
  margin: auto 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  backdrop-filter: blur(10px);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.custom-carousel-control:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.carousel-control-icon {
  font-size: 24px;
  color: #0d6efd;
}

.custom-indicators {
  bottom: 20px;
}

.custom-indicators button {
  width: 60px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.6);
  border: none;
  margin: 0 5px;
  transition: all 0.3s ease;
}

.custom-indicators button.active {
  background: #fff;
  transform: scale(1.2);
}

/* Header Section */
.sticky-top-bar {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
}

.glassmorphism-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Logo Section */
.logo-container {
  position: relative;
}

.logo-wrapper {
  position: relative;
  width: 65px;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-image {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #0d6efd;
  transition: all 0.4s ease;
  position: relative;
  z-index: 2;
}

.logo-glow {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  background: conic-gradient(from 0deg, #0d6efd, #6f42c1, #0d6efd);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 1;
}

.logo-container:hover .logo-image {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 10px 30px rgba(13, 110, 253, 0.3);
}

.logo-container:hover .logo-glow {
  opacity: 1;
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* DateTime Section */
.datetime-section {
  text-decoration: none;
  color: inherit;
}

.datetime-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 25px;
  margin: 4px 0;
  display: inline-flex;
  align-items: center;
  font-size: 0.9rem;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  min-width: 140px;
  justify-content: center;
}

.datetime-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.time-card {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3);
}

.time-card:hover {
  box-shadow: 0 8px 25px rgba(240, 147, 251, 0.4);
}

/* Search Section */
.search-container {
  position: relative;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #f6f9fc 0%, #e9ecef 100%);
  border-radius: 50px;
  padding: 2px;
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.1),
    0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.search-input-wrapper:hover {
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.1),
    0 8px 25px rgba(13, 110, 253, 0.2);
}

.search-icon {
  position: absolute;
  left: 20px;
  color: #6c757d;
  font-size: 16px;
  z-index: 2;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 12px 20px 12px 50px;
  font-size: 16px;
  color: #495057;
  outline: none;
  border-radius: 50px;
}

.search-input::placeholder {
  color: #6c757d;
}

.search-button {
  background: linear-gradient(135deg, #0d6efd 0%, #6f42c1 100%);
  border: none;
  color: white;
  padding: 12px 20px;
  border-radius: 50px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
}

.search-button:hover {
  transform: translateX(2px);
  box-shadow: 0 4px 15px rgba(13, 110, 253, 0.4);
}

/* User Menu */
.modern-user-menu {
  position: relative;
}

.user-menu-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.user-menu-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  color: white;
}

.user-avatar {
  font-size: 20px;
}

.user-name {
  font-size: 14px;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-arrow {
  font-size: 12px;
  transition: transform 0.3s ease;
}

.user-menu-btn[aria-expanded="true"] .dropdown-arrow {
  transform: rotate(180deg);
}

.modern-dropdown {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: none;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 10px 0;
  margin-top: 10px;
  min-width: 280px;
}

.dropdown-header {
  padding: 0;
  border: none;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  gap: 15px;
}

.user-avatar-large {
  font-size: 40px;
  color: #0d6efd;
}

.user-details {
  flex: 1;
}

.user-name-large {
  font-weight: 600;
  color: #212529;
  font-size: 16px;
}

.user-email {
  color: #6c757d;
  font-size: 14px;
}

.modern-dropdown-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #495057;
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 10px;
  margin: 2px 10px;
}

.modern-dropdown-item:hover {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  color: #0d6efd;
  transform: translateX(5px);
}

.modern-dropdown-item i {
  font-size: 16px;
  width: 20px;
}

.logout-item:hover {
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  color: #dc3545;
}

/* Login Button */
.login-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 50px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
  color: white;
}

/* Category Navigation */
.modern-category-nav {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  padding: 0;
}

.navbar-brand-wrapper {
  display: flex;
  align-items: center;
}

.navbar-brand {
  color: white !important;
  font-weight: 700;
  font-size: 1.5rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
}

.navbar-brand:hover {
  color: #f8f9fa !important;
}

.navbar-toggler {
  border: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 8px;
}

.navbar-toggler:focus {
  box-shadow: none;
}

.category-nav-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 10px 0;
}

.category-link {
  color: white !important;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  position: relative;
  overflow: hidden;
}

.category-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.category-link:hover::before {
  left: 100%;
}

.category-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.category-link.router-link-active {
  background: rgba(255, 255, 255, 0.3);
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 768px) {
  .banner-container {
    height: 200px;
  }
  
  .logo-image {
    width: 50px;
    height: 50px;
  }
  
  .datetime-card {
    font-size: 0.8rem;
    padding: 6px 12px;
    min-width: 120px;
  }
  
  .search-input {
    font-size: 14px;
    padding: 10px 15px 10px 40px;
  }
  
  .search-icon {
    left: 15px;
  }
  
  .user-menu-btn {
    padding: 8px 15px;
    font-size: 13px;
  }
  
  .user-name {
    max-width: 80px;
  }
  
  .modern-dropdown {
    min-width: 250px;
  }
  
  .navbar-brand {
    font-size: 1.2rem;
  }
  
  .category-nav-list {
    flex-direction: column;
    gap: 2px;
  }
  
  .category-link {
    padding: 8px 15px;
  }
}

@media (max-width: 576px) {
  .banner-container {
    height: 160px;
  }
  
  .datetime-card {
    font-size: 0.7rem;
    padding: 5px 10px;
    min-width: 100px;
  }
  
  .search-input {
    font-size: 13px;
    padding: 8px 12px 8px 35px;
  }
  
  .search-button {
    padding: 8px 15px;
    min-width: 40px;
  }
  
  .user-menu-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .user-name {
    display: none;
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.glassmorphism-header {
  animation: fadeInUp 0.5s ease-out;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}
</style>