<template>
  <div class="pending-articles-container">  <!-- Header -->
    <div class="header-section">
      <h1 class="page-title">
        <i class="bi bi-clock-history me-2"></i>
        Bài viết chờ duyệt
      </h1>
      <p class="subtitle">Quản lý và duyệt các bài viết đang chờ xử lý</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-wrapper">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p class="loading-text">Đang tải bài viết...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-alert alert alert-danger">
      <i class="bi bi-exclamation-triangle me-2"></i>
      {{ error }}
    </div>

    <!-- Empty State -->
    <div v-if="!loading && !error && pendingArticles.length === 0" class="empty-state">
      <div class="empty-icon">📝</div>
      <h3>Không có bài viết nào chờ duyệt</h3>
      <p>Tất cả bài viết đã được xử lý!</p>
    </div>

    <!-- Articles List -->
    <div v-if="!loading && !error && pendingArticles.length > 0" class="articles-list">
      <div class="row">
        <div v-for="article in pendingArticles" :key="article.newsId" class="col-12 mb-4">
          <div class="article-card card shadow-sm">
            <div class="card-body">
              <div class="row">
                <!-- Article Image -->
                <div class="col-md-3">
                  <div class="article-image">
                    <img 
                      :src="getImageUrl(article.thumbnail)" 
                      :alt="article.title"
                      class="img-fluid rounded"
                      @error="handleImageError"
                    />
                  </div>
                </div>

                <!-- Article Content -->
                <div class="col-md-6">
                  <div class="article-content">
                    <h5 class="article-title">{{article.title }}</h5>
                    <p class="article-subtitle text-muted">{{ article.subtitle }}</p>
                    
                    <div class="article-meta">
                      <div class="meta-item">
                        <i class="bi bi-person me-1"></i>
                        <span class="author">{{ article.author.name }}</span>
                      </div>
                      <div class="meta-item">
                        <i class="bi bi-calendar me-1"></i>
                        <span class="date">{{ formatDate(article.createdDate) }}</span>
                      </div>
                      <div class="meta-item">
                        <i class="bi bi-tag me-1"></i>
                        <span class="category">{{ article.category.categoryName }}</span>
                      </div>
                    </div>

                    <div class="article-preview">
                      <p v-if="article.newsDetails && article.newsDetails.length > 0">
                        {{ article.newsDetails[0].detail.substring(0, 200) }}...
                      </p>
                    </div>

                    <div class="article-stats">
                      <span class="badge bg-warning">
                        <i class="bi bi-clock me-1"></i>
                        Chờ duyệt
                      </span>
                      <span v-if="article.paidPoint > 0" class="badge bg-info ms-2">
                        <i class="bi bi-coin me-1"></i>
                        {{ article.paidPoint }} điểm
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="col-md-3">
                  <div class="action-buttons">
                    <button 
                      @click="viewArticle(article.newsId)"
                      class="btn btn-outline-primary btn-sm mb-2 w-100"
                    >
                      <i class="bi bi-eye me-1"></i>
                      Xem chi tiết
                    </button>
                    
                    <button 
                      @click="approveArticle(article.newsId)"
                      class="btn btn-success btn-sm mb-2 w-100"
                      :disabled="processingArticle === article.newsId"
                    >
                      <i class="bi bi-check-circle me-1"></i>
                      <span v-if="processingArticle === article.newsId">Đang xử lý...</span>
                      <span v-else>Duyệt bài</span>
                    </button>
                    
                    <button 
                      @click="rejectArticle(article.newsId)"
                      class="btn btn-danger btn-sm w-100"
                      :disabled="processingArticle === article.newsId"
                    >
                      <i class="bi bi-x-circle me-1"></i>
                      <span v-if="processingArticle === article.newsId">Đang xử lý...</span>
                      <span v-else>Từ chối</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination-wrapper">
        <nav aria-label="Pending articles pagination">
          <ul class="pagination justify-content-center">        
            <li class="page-item" :class="{ disabled: currentPage === 0 }">          
              <button class="page-link" @click="goToPage(currentPage - 1)">
                <i class="bi bi-chevron-left"></i>
              </button>
            </li>
            
            <li 
              v-for="page in visiblePages"
              :key="page" 
              class="page-item"
              :class="{ active: page === currentPage }"
            >
              <button class="page-link" @click="goToPage(page)">{{ page + 1 }}</button>
            </li>
            
            <li class="page-item" :class="{ disabled: currentPage === totalPages - 1 }">          
              <button class="page-link" @click="goToPage(currentPage + 1)">
                <i class="bi bi-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRouter } from 'vue-router'
import { newsService } from '@/services'
import { getImageUrl } from '@/services/api'

const router = useRouter()

// Reactive data
const pendingArticles = ref([])
const loading = ref(false)
const error = ref(null)
const currentPage = ref(0)
const totalPages = ref(0)
const totalElements = ref(0)
const processingArticle = ref(null)

// Computed properties
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(0, currentPage.value - 2)
  const end = Math.min(totalPages.value - 1, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Methods
const fetchPendingArticles = async (page = 0) => {
  loading.value = true
  error.value = null
  
  try {
    const response = await newsService.getPendingArticles(page, 10)
    pendingArticles.value = response.content || []
    totalPages.value = response.totalPages || 0
    totalElements.value = response.totalElements || 0
    currentPage.value = response.number || 0
  } catch (err) {
    error.value = err.message || 'Không thể tải bài viết chờ duyệt'
    console.error('Error fetching pending articles:', err)
  } finally {
    loading.value = false
  }
}

const goToPage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    fetchPendingArticles(page)
  }
}

const viewArticle = (newsId) => {
  router.push(`/checking/${newsId}`)
}

const approveArticle = async (newsId) => {
  if (!confirm('Bạn có chắc chắn muốn duyệt bài viết này?')) {
    return
  }
  
  processingArticle.value = newsId
  try {
    await newsService.updateNewsStatus(newsId, 'published')
    alert('Bài viết đã được phê duyệt!')
    // Remove from list after successful approval
    pendingArticles.value = pendingArticles.value.filter(article => article.newsId !== newsId)
  } catch (err) {
    alert('Có lỗi xảy ra khi duyệt bài: ' + err.message)
  } finally {
    processingArticle.value = null
  }
}

const rejectArticle = async (newsId) => {
  const reason = prompt('Lý do từ chối bài viết:')
  if (!reason) return
  
  processingArticle.value = newsId
  try {
    await newsService.updateNewsStatus(newsId, 'rejected')
    alert('Bài viết đã bị từ chối!')
    // Remove from list after successful rejection
    pendingArticles.value = pendingArticles.value.filter(article => article.newsId !== newsId)
  } catch (err) {
    alert('Có lỗi xảy ra khi từ chối bài: ' + err.message)
  } finally {
    processingArticle.value = null
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleImageError = (event) => {
  event.target.src = 'https://placehold.co/400x250?text=Không+có+ảnh'
}

// Lifecycle
onMounted(() => {
  fetchPendingArticles()
})
</script>

<style scoped>
.pending-articles-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.header-section {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #6c757d;
  font-size: 1.01rem;
}

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
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #6c757d;
  font-size: 1.1rem;
}

.error-alert {
  margin-bottom: 2rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6c757d;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.article-card {
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.article-image img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.article-title {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.article-subtitle {
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #6c757d;
}

.article-preview {
  margin-bottom: 1rem;
}

.article-preview p {
  color: #495057;
  font-size: 0.95rem;
  line-height: 1.05;
}

.article-stats {
  margin-bottom: 1rem;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pagination-wrapper {
  margin-top: 2rem;
}

.page-link {
  color: #3498db;
  border-color: #e9ecef;
}

.page-link:hover {
  color: #2980b9;
  background-color: #f8f9fa;
  border-color: #3498db;
}

.page-item.active .page-link {
  background-color: #3498db;
  border-color: #3498db;
}

.page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  background-color: #fff;
  border-color: #e9ecef;
}

@media (max-width: 768px) {
  .article-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .action-buttons {
    margin-top: 1rem;
  }
}
</style>