<template>
  <div class="sidebar-container">
    <!-- Nút mở Offcanvas cho mobile -->
    <button
      class="btn btn-primary d-lg-none sidebar-toggle-btn"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#censorSidebarOffcanvas"
      aria-controls="censorSidebarOffcanvas"
    >
      <i class="bi bi-list"></i>
    </button>
    <!-- Sidebar Offcanvas cho mobile/tablet -->
    <div
      class="offcanvas offcanvas-start d-lg-none"
      tabindex="-1"
      id="censorSidebarOffcanvas"
      aria-labelledby="censorSidebarOffcanvasLabel"
    >
      <div class="offcanvas-header">
        <div class="d-flex align-items-center">
          <i class="bi bi-shield-check me-2"></i>
          <h5 class="offcanvas-title mb-0 fw-bold" id="censorSidebarOffcanvasLabel">Khu vực kiểm duyệt</h5>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
      </div>
      <div class="offcanvas-body p-0">
        <!-- Sidebar Content -->
        <nav class="sidebar-nav">
          <ul class="nav flex-column">
            <li class="nav-item">
              <RouterLink 
                to="/censor/dashboard" 
                class="nav-link sidebar-link"
                :class="{ 'active': $route.path === '/censor/dashboard' }"
                data-bs-dismiss="offcanvas"
              >
                <i class="bi bi-house-door me-3"></i>
                <span>Trang chủ</span>
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink 
                to="/censor/pending-articles" 
                class="nav-link sidebar-link"
                :class="{ 'active': $route.path.includes('/pending-articles') }"
                data-bs-dismiss="offcanvas"
              >
                <i class="bi bi-hourglass-split me-3"></i>
                <span>Bài viết chờ duyệt</span>
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink 
                to="/censor/approved-articles" 
                class="nav-link sidebar-link"
                :class="{ 'active': $route.path.includes('/approved-articles') }"
                data-bs-dismiss="offcanvas"
              >
                <i class="bi bi-check2-circle me-3"></i>
                <span>Bài viết đã duyệt</span>
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink 
                to="/censor/rejected-articles" 
                class="nav-link sidebar-link"
                :class="{ 'active': $route.path.includes('/rejected-articles') }"
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
                <div class="user-name">Test 1</div>
                <div class="user-role">Kiểm duyệt viên</div>
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
          <i class="bi bi-shield-check me-2"></i>
          <h5 class="mb-0 text-white fw-bold">Khu vực kiểm duyệt</h5>
        </div>
      </div>
      <nav class="sidebar-nav">
        <ul class="nav flex-column">
          <li class="nav-item">
            <RouterLink 
              to="/censor/dashboard" 
              class="nav-link sidebar-link"
              :class="{ 'active': $route.path === '/censor/dashboard' }"
            >
              <i class="bi bi-house-door me-3"></i>
              <span>Trang chủ</span>
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink 
              to="/censor/pending-articles" 
              class="nav-link sidebar-link"
              :class="{ 'active': $route.path.includes('/pending-articles') }"
            >
              <i class="bi bi-hourglass-split me-3"></i>
              <span>Bài viết chờ duyệt</span>
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink 
              to="/censor/approved-articles" 
              class="nav-link sidebar-link"
              :class="{ 'active': $route.path.includes('/approved-articles') }"
            >
              <i class="bi bi-check2-circle me-3"></i>
              <span>Bài viết đã duyệt</span>
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink 
              to="/censor/rejected-articles" 
              class="nav-link sidebar-link"
              :class="{ 'active': $route.path.includes('/rejected-articles') }"
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
              <div class="user-name">Test 1</div>
              <div class="user-role">Kiểm duyệt viên</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar-container {
  position: relative;
}

.sidebar-toggle-btn {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  margin: 16px 0 0 16px;
}

.sidebar-toggle-btn:hover {
  transform: scale(1.05);
}

.sidebar-toggle-btn.active {
  background-color: #dc3545;
  border-color: #dc3545;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100%;
  background: linear-gradient(135deg, #ff9966 0%, #ff5e62 100%);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 1040;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
}

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

.sidebar-divider {
  margin: 1rem;
  border-color: rgba(255, 255, 255, 0.2);
  opacity: 1;
}

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
</style>
