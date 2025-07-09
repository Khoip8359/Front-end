<template>
  <div class="sidebar-container">
    <!-- Nếu có top-bar/menu, nó sẽ nằm phía trên đây -->
    <!-- Nút mở Offcanvas ngay dưới menu -->
    <button
      class="btn btn-primary d-lg-none sidebar-toggle-btn"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#sidebarOffcanvas"
      aria-controls="sidebarOffcanvas"
    >
      <i class="bi bi-list"></i>
    </button>
    <!-- Sidebar Offcanvas cho mobile/tablet -->
    <div
      class="offcanvas offcanvas-start d-lg-none"
      tabindex="-1"
      id="sidebarOffcanvas"
      aria-labelledby="sidebarOffcanvasLabel"
    >
      <div class="offcanvas-header">
        <div class="d-flex align-items-center">
          <i class="bi bi-newspaper me-2"></i>
          <h5 class="offcanvas-title mb-0 fw-bold" id="sidebarOffcanvasLabel">Quản lý bài viết</h5>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
      </div>
      <div class="offcanvas-body p-0">
        <!-- Sidebar Content -->
        <nav class="sidebar-nav">
          <ul class="nav flex-column">
            <li class="nav-item">
              <RouterLink 
                to="/reporter/dashboard" 
                class="nav-link sidebar-link"
                :class="{ 'active': $route.path === '/reporter/dashboard' }"
                data-bs-dismiss="offcanvas"
              >
                <i class="bi bi-speedometer2 me-3"></i>
                <span>Tổng quan</span>
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink 
                to="/reporter/write" 
                class="nav-link sidebar-link"
                :class="{ 'active': $route.path.includes('/write') }"
                data-bs-dismiss="offcanvas"
              >
                <i class="bi bi-pencil-square me-3"></i>
                <span>Viết bài viết mới</span>
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink 
                to="/reporter/published" 
                class="nav-link sidebar-link"
                :class="{ 'active': $route.path.includes('/published') }"
                data-bs-dismiss="offcanvas"
              >
                <i class="bi bi-check-circle me-3"></i>
                <span>Bài viết đã xuất bản</span>
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink 
                to="/reporter/pending" 
                class="nav-link sidebar-link"
                :class="{ 'active': $route.path.includes('/pending') }"
                data-bs-dismiss="offcanvas"
              >
                <i class="bi bi-clock me-3"></i>
                <span>Bài viết chờ duyệt</span>
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink 
                to="/reporter/rejected" 
                class="nav-link sidebar-link"
                :class="{ 'active': $route.path.includes('/rejected') }"
                data-bs-dismiss="offcanvas"
              >
                <i class="bi bi-x-circle me-3"></i>
                <span>Bài viết bị từ chối</span>
              </RouterLink>
            </li>
            <li class="nav-item">
              <hr class="sidebar-divider">
            </li>
            <li class="nav-item">
              <RouterLink 
                to="/reporter/stats" 
                class="nav-link sidebar-link"
                :class="{ 'active': $route.path.includes('/stats') }"
                data-bs-dismiss="offcanvas"
              >
                <i class="bi bi-graph-up me-3"></i>
                <span>Thống kê</span>
              </RouterLink>
            </li>
          </ul>
        </nav>
        <div class="sidebar-footer">
          <div class="user-info">
            <div class="d-flex align-items-center">
              <div class="user-avatar me-3">
                <i class="bi bi-person-circle"></i>
              </div>
              <div class="user-details">
                <div class="user-name">{{ authStore.displayName }}</div>
                <div class="user-role">Phóng viên</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Sidebar cố định cho desktop -->
    <div class="sidebar d-none d-lg-flex flex-column">
      <div class="sidebar-header">
        <div class="d-flex align-items-center">
          <i class="bi bi-newspaper me-2"></i>
          <h5 class="mb-0 text-white fw-bold">Quản lý bài viết</h5>
        </div>
      </div>
      <nav class="sidebar-nav">
        <ul class="nav flex-column">
          <li class="nav-item">
            <RouterLink 
              to="/reporter/dashboard" 
              class="nav-link sidebar-link"
              :class="{ 'active': $route.path === '/reporter/dashboard' }"
            >
              <i class="bi bi-speedometer2 me-3"></i>
              <span>Tổng quan</span>
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink 
              to="/reporter/write" 
              class="nav-link sidebar-link"
              :class="{ 'active': $route.path.includes('/write') }"
            >
              <i class="bi bi-pencil-square me-3"></i>
              <span>Viết bài viết mới</span>
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink 
              to="/reporter/published" 
              class="nav-link sidebar-link"
              :class="{ 'active': $route.path.includes('/published') }"
            >
              <i class="bi bi-check-circle me-3"></i>
              <span>Bài viết đã xuất bản</span>
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink 
              to="/reporter/pending" 
              class="nav-link sidebar-link"
              :class="{ 'active': $route.path.includes('/pending') }"
            >
              <i class="bi bi-clock me-3"></i>
              <span>Bài viết chờ duyệt</span>
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink 
              to="/reporter/rejected" 
              class="nav-link sidebar-link"
              :class="{ 'active': $route.path.includes('/rejected') }"
            >
              <i class="bi bi-x-circle me-3"></i>
              <span>Bài viết bị từ chối</span>
            </RouterLink>
          </li>
          <li class="nav-item">
            <hr class="sidebar-divider">
          </li>
          <li class="nav-item">
            <RouterLink 
              to="/reporter/stats" 
              class="nav-link sidebar-link"
              :class="{ 'active': $route.path.includes('/stats') }"
            >
              <i class="bi bi-graph-up me-3"></i>
              <span>Thống kê</span>
            </RouterLink>
          </li>
        </ul>
      </nav>
      <div class="sidebar-footer">
        <div class="user-info">
          <div class="d-flex align-items-center">
            <div class="user-avatar me-3">
              <i class="bi bi-person-circle"></i>
            </div>
            <div class="user-details">
              <div class="user-name">{{ authStore.displayName }}</div>
              <div class="user-role">Phóng viên</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
</script>

<style scoped>
.sidebar-container {
  position: relative;
}

/* Sidebar Toggle Button */
.sidebar-toggle-btn {
  /* Bỏ position: fixed, top, left để nút nằm theo luồng bình thường */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  margin: 16px 0 0 16px; /* Cách menu phía trên và lề trái một chút */
}

.sidebar-toggle-btn:hover {
  transform: scale(1.05);
}

.sidebar-toggle-btn.active {
  background-color: #dc3545;
  border-color: #dc3545;
}

/* Main Sidebar (desktop) */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  /* height: 100vh; */
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 1040;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

/* Sidebar Header */
.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
}

.sidebar-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

/* Sidebar Navigation */
.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.sidebar-nav .nav-item {
  margin: 0.25rem 1rem;
}

.sidebar-link {
  color: rgba(255, 255, 255, 0.8) !important;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.sidebar-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s;
}

.sidebar-link:hover::before {
  left: 100%;
}

.sidebar-link:hover {
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.sidebar-link.active {
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.sidebar-link.active::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background: #ffffff;
  border-radius: 2px 0 0 2px;
}

.sidebar-link i {
  font-size: 1.1rem;
  min-width: 20px;
  text-align: center;
}

/* Sidebar Divider */
.sidebar-divider {
  margin: 1rem;
  border-color: rgba(255, 255, 255, 0.2);
  opacity: 1;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
}

.user-info {
  color: rgba(255, 255, 255, 0.9);
}

.user-avatar {
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.8);
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.user-role {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Responsive Design */
@media (min-width: 992px) {
  .sidebar-container {
    position: static !important;
    width: 100%;
    height: 100%;
  }
  .sidebar {
    position: static !important;
    width: 100%;
    height: 100%;
    box-shadow: none;
  }
  .sidebar-toggle-btn {
    display: none;
  }
}

@media (max-width: 991.98px) {
  .sidebar {
    display: none !important;
  }
}

/* Custom Scrollbar */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Animation for nav items */
.sidebar-nav .nav-item {
  animation: slideInLeft 0.3s ease forwards;
  opacity: 0;
  transform: translateX(-20px);
}

.sidebar-nav .nav-item:nth-child(1) { animation-delay: 0.1s; }
.sidebar-nav .nav-item:nth-child(2) { animation-delay: 0.2s; }
.sidebar-nav .nav-item:nth-child(3) { animation-delay: 0.3s; }
.sidebar-nav .nav-item:nth-child(4) { animation-delay: 0.4s; }
.sidebar-nav .nav-item:nth-child(5) { animation-delay: 0.5s; }
.sidebar-nav .nav-item:nth-child(6) { animation-delay: 0.6s; }
.sidebar-nav .nav-item:nth-child(7) { animation-delay: 0.7s; }
.sidebar-nav .nav-item:nth-child(8) { animation-delay: 0.8s; }
.sidebar-nav .nav-item:nth-child(9) { animation-delay: 0.9s; }
.sidebar-nav .nav-item:nth-child(10) { animation-delay: 1.0s; }

@keyframes slideInLeft {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
