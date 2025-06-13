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
          <RouterLink to="/" class="d-flex justify-content-center align-items-center text-decoration-none">
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
        <div class="col-lg-2 col-md-3 d-none d-md-block">
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
        </div>

        <!-- Search Section -->
        <div class="col-lg-6 col-md-4 col-sm-6 px-3">
          <div class="input-group shadow-sm">
            <input 
              type="text" 
              class="form-control form-control-lg border-end-0 rounded-start-pill ps-4" 
              placeholder="Tìm kiếm bài viết, tin tức..." 
              style="border-color: #dee2e6;"
            />
            <button class="btn btn-primary rounded-end-pill px-4 shadow-sm">
              🔍
            </button>
          </div>
        </div>

        <!-- Auth Section -->
        <div class="col-lg-2 col-md-2 col-sm-2 px-3">
          <div class="d-flex justify-content-center">
            <RouterLink 
              to="/login" 
              class="btn btn-outline-primary rounded-pill px-4 py-2 fw-semibold shadow-sm"
            >
              <i class="bi bi-person-circle me-1"></i>
              <span class="d-none d-lg-inline">Đăng nhập</span>
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
            <RouterLink class="nav-link text-white fw-semibold px-3 py-2 rounded-pill mx-1" to="/">
              <i class="bi bi-house-door me-1"></i>
              Trang chủ
            </RouterLink>
          </li>
          
          <!-- Dynamic Categories -->
          <li v-for="category in categories" :key="category.categoryId" class="nav-item">
            <RouterLink 
              class="nav-link text-white fw-semibold px-3 py-2 rounded-pill mx-1" 
              :to="`/category/${category.categoryId}`"
            >
              {{ category.categoryName }}
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- Additional Action Buttons -->
      <div class="d-none d-lg-flex">
        <button class="btn btn-outline-light btn-sm rounded-pill me-2">
          <i class="bi bi-bell"></i>
        </button>
        <button class="btn btn-outline-light btn-sm rounded-pill">
          <i class="bi bi-gear"></i>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

// Categories data
const categories = ref([])

// Date and time
const currentDate = ref('')
const currentTime = ref('')
let timeInterval = null

// Fetch categories
onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/categories')
    categories.value = res.data
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
</style>