<template>
    <div class="news-container">
      <!-- Loading State -->
      <div v-if="loading" class="loading-wrapper">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p class="loading-text">Đang tải tin tức...</p>
        </div>
      </div>
  
      <!-- Error State -->
      <div v-if="error" class="error-alert">
        <div class="error-icon">⚠️</div>
        <div class="error-message">{{ error }}</div>
      </div>

      <div v-if="!loading && !error && newsList.length !== 0" class="d-flex">
        <button class="btn btn-primary btn-lg my-2 ms-auto" @click="$router.push('/reporter/write')">
          <i class="bi bi-plus-circle me-2"></i>Viết bài mới
        </button>
      </div>
  
      <div v-if="currentPage === 1 && pagedNews.length" class="featured-article">
        <RouterLink :to="`/detail/${pagedNews[0].newsId}`" class="featured-link">
          <div class="featured-card">
            <div class="featured-image">
              <img :src="getImageUrl(pagedNews[0].thumbnail)" alt="thumbnail" />
              <div class="featured-overlay">
                <div class="featured-badge">{{ pagedNews[0].category.categoryName }}</div>
              </div>
            </div>
            <div class="featured-content">
              <h1 class="featured-title">{{ pagedNews[0].title }}</h1>
              <h2 class="featured-subtitle">{{ pagedNews[0].subtitle }}</h2>
              <div class="featured-meta">
                <div class="meta-item">
                  <span class="meta-icon">👤</span>
                  <span>{{ pagedNews[0].author.name }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">👁️</span>
                  <span>{{ pagedNews[0].views }} lượt xem</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">📅</span>
                  <span>{{ formatDate(pagedNews[0].createdDate) }}</span>
                </div>
              </div>
              <p class="featured-description">{{ pagedNews[0].newsDetails[0].detail }}</p>
            </div>
          </div>
        </RouterLink>
      </div>
  
      <!-- News Grid -->
      <div class="news-grid" v-if="pagedNews.length > (currentPage === 1 ? 1 : 0)">
        <template v-for="(item, idx) in (currentPage === 1 ? pagedNews.slice(1) : pagedNews)" :key="item.newsId">
          <RouterLink :to="`/detail/${item.newsId}`" class="news-link">
            <article class="news-card">
              <div class="news-image">
                <img :src="getImageUrl(item.thumbnail)" alt="thumbnail" />
                <div class="news-badge">{{ item.category.categoryName }}</div>
              </div>
              <div class="news-content">
                <h3 class="news-title">{{ item.title }}</h3>
                <h4 class="news-subtitle">{{ item.subtitle }}</h4>
                <div class="news-meta">
                  <div class="meta-row">
                    <span class="author">{{ item.author.name }}</span>
                    <span class="date">{{ formatDate(item.createdDate) }}</span>
                  </div>
                  <div class="views">
                    <span class="views-icon">👁️</span>
                    <span>{{ item.views }}</span>
                  </div>
                </div>
                <p class="news-description">{{ item.newsDetails[0].detail }}</p>
              </div>
            </article>
          </RouterLink>
        </template>
      </div>
  
      <!-- Pagination -->
      <nav v-if="totalPages > 1" class="pagination-wrapper">
        <div class="pagination">
          <button 
            class="page-btn prev-btn" 
            :class="{ disabled: currentPage === 1 }"
            @click="goToPage(currentPage - 1)"
          >
            <span class="btn-icon">←</span>
            <span class="btn-text">Trước</span>
          </button>
          
          <div class="page-numbers">
            <button 
              v-for="page in totalPages" 
              :key="page" 
              class="page-number"
              :class="{ active: currentPage === page }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            class="page-btn next-btn" 
            :class="{ disabled: currentPage === totalPages }"
            @click="goToPage(currentPage + 1)"
          >
            <span class="btn-text">Sau</span>
            <span class="btn-icon">→</span>
          </button>
        </div>
      </nav>

      <div v-if="!loading && !error && newsList.length === 0" class="text-center py-5">
        <i class="bi bi-journal-x display-3 text-muted mb-3"></i>
        <h4 class="mb-3">Không có bài viết nào</h4>
        <button class="btn btn-primary btn-lg" @click="$router.push('/reporter/write')">
          <i class="bi bi-plus-circle me-2"></i>Viết bài mới
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref, computed } from 'vue'
  import { newsService } from '@/services'
  import { useAuthStore } from '@/stores/auth'
  import { RouterLink } from 'vue-router'
  import { getImageUrl } from '@/services/api'
  
  const newsList = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentPage = ref(1)
  
  const authStore = useAuthStore()
  const userId = computed(() => authStore.user?.user?.userId)
  
  onMounted(async () => {
    loading.value = true
    error.value = null
    try {
      const data = await newsService.getNewsByUser(userId.value)
      newsList.value = Array.isArray(data) ? data : []
    } catch (err) {
      error.value = err.message || 'Lỗi tải dữ liệu'
    } finally {
      loading.value = false
    }
  })
  
  const pageSize = computed(() => currentPage.value === 1 ? 4 : 6)

  const totalPages = computed(() => {
    if (newsList.value.length <= 4) return 1
    return 1 + Math.ceil((newsList.value.length - 4) / 6)
  })

  const pagedNews = computed(() => {
    const start = (currentPage.value === 1) ? 0 : 4 + (currentPage.value - 2) * 6
    const size = pageSize.value
    return newsList.value.slice(start, start + size)
  })
  
  function formatDate(dateStr) {
    const d = new Date(dateStr)
    return d.toLocaleDateString('vi-VN')
  }
  
  function goToPage(page) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }
  </script>
  
  <style scoped>
  .news-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  
  /* Loading States */
  .loading-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
  }
  
  .loading-spinner {
    text-align: center;
  }
  
  .spinner {
    width: 60px;
    height: 60px;
    border: 4px solid #f3f4f6;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .loading-text {
    color: #6b7280;
    font-size: 1.1rem;
    margin: 0;
  }
  
  /* Error State */
  .error-alert {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    border: 1px solid #fca5a5;
    border-radius: 12px;
    margin-bottom: 2rem;
  }
  
  .error-icon {
    font-size: 1.5rem;
  }
  
  .error-message {
    color: #dc2626;
    font-weight: 500;
  }
  
  /* Featured Article */
  .featured-article {
    margin-bottom: 3rem;
  }
  
  .featured-link {
    text-decoration: none;
    color: inherit;
  }
  
  .featured-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    display: flex;
    gap: 2rem;
    align-items: center;
    padding: 2rem;
  }
  
  .featured-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  }
  
  .featured-image {
    position: relative;
    flex-shrink: 0;
    width: 400px;
    height: 250px;
    border-radius: 16px;
    overflow: hidden;
  }
  
  .featured-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .featured-card:hover .featured-image img {
    transform: scale(1.05);
  }
  
  .featured-overlay {
    position: absolute;
    top: 1rem;
    left: 1rem;
  }
  
  .featured-badge {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }
  
  .featured-content {
    flex: 1;
  }
  
  .featured-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;
    line-height: 1.3;
  }
  
  .featured-subtitle {
    font-size: 1.25rem;
    color: #6b7280;
    margin-bottom: 1rem;
    font-weight: 400;
  }
  
  .featured-meta {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #6b7280;
    font-size: 0.9rem;
  }
  
  .meta-icon {
    font-size: 1rem;
  }
  
  .featured-description {
    color: #4b5563;
    font-size: 1rem;
    line-height: 1.6;
    margin: 0;
  }
  
  /* News Grid */
  .news-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-bottom: 3rem;
  }
  
  .news-link {
    text-decoration: none;
    color: inherit;
  }
  
  .news-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .news-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
  
  .news-image {
    position: relative;
    height: 200px;
    overflow: hidden;
  }
  
  .news-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .news-card:hover .news-image img {
    transform: scale(1.1);
  }
  
  .news-badge {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    padding: 0.4rem 0.8rem;
    border-radius: 16px;
    font-size: 0.8rem;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
  }
  
  .news-content {
    padding: 1.5rem;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .news-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }
  
  .news-subtitle {
    font-size: 1rem;
    color: #6b7280;
    margin-bottom: 1rem;
    font-weight: 400;
  }
  
  .news-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    font-size: 0.85rem;
  }
  
  .meta-row {
    display: flex;
    gap: 1rem;
  }
  
  .author {
    color: #3b82f6;
    font-weight: 500;
  }
  
  .date {
    color: #6b7280;
  }
  
  .views {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #6b7280;
  }
  
  .views-icon {
    font-size: 0.9rem;
  }
  
  .news-description {
    color: #4b5563;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0;
    flex: 1;
  }
  
  /* Pagination */
  .pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 3rem;
  }
  
  .pagination {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: white;
    padding: 1rem;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  .page-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border: none;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
  }
  
  .page-btn:hover:not(.disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    transform: translateY(-1px);
  }
  
  .page-btn.disabled {
    background: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
  }
  
  .page-numbers {
    display: flex;
    gap: 0.5rem;
  }
  
  .page-number {
    width: 40px;
    height: 40px;
    border: none;
    background: transparent;
    color: #6b7280;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
  }
  
  .page-number:hover {
    background: #f3f4f6;
    color: #1f2937;
  }
  
  .page-number.active {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .news-container {
      padding: 1rem;
    }
    
    .featured-card {
      flex-direction: column;
      text-align: center;
    }
    
    .featured-image {
      width: 100%;
      height: 200px;
    }
    
    .featured-title {
      font-size: 1.5rem;
    }
    
    .featured-meta {
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .news-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .pagination {
      flex-direction: column;
      gap: 1rem;
    }
    
    .page-numbers {
      order: -1;
    }
  }
  
  @media (max-width: 480px) {
    .featured-card {
      padding: 1rem;
    }
    
    .news-content {
      padding: 1rem;
    }
    
    .page-btn .btn-text {
      display: none;
    }
  }
  </style>