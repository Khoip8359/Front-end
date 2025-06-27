<template>
  <div class="container-fluid">
    <div class="row gx-4 py-4" style="min-height: calc(100vh - 200px);">
      
      <!-- Left Sidebar -->
      <div class="col-lg-2 col-md-3 d-none d-md-block">
        <div class="sticky-top" style="top: 100px;">
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-body p-0">
              <img src="/img/qc1.jpg" class="img-fluid rounded" alt="Advertisement" />
            </div>
          </div>
          
          <div class="card border-0 shadow-sm">
            <div class="card-body text-center">
              <h6 class="card-title mb-3">📢 Quảng cáo</h6>
              <div class="bg-light rounded p-4">
                <i class="bi bi-megaphone display-6 text-muted mb-2"></i>
                <p class="text-muted small mb-0">Không gian quảng cáo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="col-lg-7 col-md-9">
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-header bg-primary text-white text-center py-3">
            <h4 class="mb-0 fw-bold">
              <i class="bi bi-newspaper me-2"></i>
              Tin tức mới nhất
            </h4>
          </div>
          
          <div class="card-body p-0">
            <!-- Loading State -->
            <div v-if="isLoading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-3 text-muted">Đang tải tin tức...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="alert alert-danger m-3">
              <i class="bi bi-exclamation-triangle me-2"></i>
              {{ error }}
            </div>

            <!-- News List -->
            <div v-else>
              <RouterLink
                v-for="(news, index) in newsList"
                :key="news.newsId"
                :to="`/detail/${news.newsId}`"
                class="text-decoration-none text-dark"
              >
                <article class="card border-0 border-bottom rounded-0 news-item">
                  <div class="card-body p-4">
                    <div class="row g-3">
                      <div class="col-md-4">
                        <div class="position-relative overflow-hidden rounded">
                          <img
                            :src="news.thumbnail ? `./img/${news.thumbnail}` : 'https://placehold.co/400x250'"
                            class="img-fluid w-100 news-thumbnail"
                            :alt="news.title"
                            style="height: 180px; object-fit: cover;"
                          />
                          <div class="position-absolute top-0 start-0 p-2">
                            <span class="badge bg-primary">{{ index + 1 }}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div class="col-md-8">
                        <div class="d-flex flex-column h-100">
                          <div class="flex-grow-1">
                            <h5 class="card-title fw-bold mb-3 text-primary news-title">
                              {{ news.title }}
                            </h5>
                            <p class="card-text text-muted mb-3 news-subtitle">
                              {{ news.subtitle }}
                            </p>
                          </div>
                          
                          <div class="mt-auto">
                            <div class="d-flex justify-content-between align-items-center">
                              <div class="d-flex align-items-center">
                                <i class="bi bi-person-circle me-2 text-muted"></i>
                                <small class="text-muted fw-semibold">{{ news.author?.name || 'Ẩn danh' }}</small>
                              </div>
                              <div class="d-flex align-items-center">
                                <i class="bi bi-calendar3 me-2 text-muted"></i>
                                <small class="text-muted">{{ formatDate(news.createdDate) }}</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <nav v-if="totalPages > 1" aria-label="News pagination">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 0 }">
              <button class="page-link" @click="goToPage(0)" :disabled="currentPage === 0">
                <<
              </button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === 0 }">
              <button class="page-link" @click="goToPage(currentPage - 1)" :disabled="currentPage === 0">
                <
              </button>
            </li>

            <li
              v-for="page in visiblePages"
              :key="page"
              class="page-item"
              :class="{ active: currentPage === (page - 1) }"
            >
              <button class="page-link" @click="goToPage(page - 1)">{{ page }}</button>
            </li>

            <li class="page-item" :class="{ disabled: currentPage === totalPages - 1 }">
              <button class="page-link" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages - 1">
                >
              </button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages - 1 }">
              <button class="page-link" @click="goToPage(totalPages - 1)" :disabled="currentPage === totalPages - 1">
                >>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Right Sidebar -->
      <div class="col-lg-3 d-none d-lg-block">
        <div class="sticky-top" style="top: 100px;">
          
          <!-- Hot News Section -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-danger text-white py-3">
              <h6 class="mb-0 fw-bold">
                <i class="bi bi-fire me-2"></i>
                Tin nóng
              </h6>
            </div>
            <div class="card-body p-0">
              <div v-if="hotNews.length === 0" class="text-center py-4">
                <i class="bi bi-newspaper display-4 text-muted"></i>
                <p class="text-muted mt-2">Chưa có tin nóng</p>
              </div>
              <div v-else>
                <RouterLink
                  v-for="(news, index) in hotNews.slice(0, 5)"
                  :key="news.newsId"
                  :to="`/detail/${news.newsId}`"
                  class="text-decoration-none"
                >
                  <div class="d-flex align-items-center p-3 border-bottom hot-news-item">
                    <div class="flex-shrink-0 me-3">
                      <img 
                        :src="news.thumbnail ? `./img/${news.thumbnail}` : 'https://placehold.co/60x60'" 
                        alt="thumbnail" 
                        class="rounded"
                        style="width: 60px; height: 60px; object-fit: cover;"
                      >
                      <div class="position-absolute top-0 start-0 translate-middle">
                        <span class="badge bg-danger rounded-pill">{{ index + 1 }}</span>
                      </div>
                    </div>
                    <div class="flex-grow-1 position-relative">
                      <h6 class="mb-1 fw-semibold text-dark hot-news-title">{{ news.title }}</h6>
                      <small class="text-muted">
                        <i class="bi bi-clock me-1"></i>
                        {{ formatDate(news.createdDate) }}
                      </small>
                    </div>
                  </div>
                </RouterLink>
              </div>
            </div>
          </div>

          <!-- Suggest Section -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-success text-white py-3">
              <h6 class="mb-0 fw-bold">
                Gợi ý cho bạn
              </h6>
            </div>
            <div class="card-body p-0">
              <div v-if="hotNews.length === 0" class="text-center py-4">
                <i class="bi bi-newspaper display-4 text-muted"></i>
                <p class="text-muted mt-2">Chưa có gợi ý cho bạn</p>
              </div>
              <div v-else>
                <RouterLink
                  v-for="(news, index) in suggestNews.slice(0, 5)"
                  :key="news.newsId"
                  :to="`/detail/${news.newsId}`"
                  class="text-decoration-none"
                >
                  <div class="d-flex align-items-center p-3 border-bottom hot-news-item">
                    <div class="flex-shrink-0 me-3">
                      <img 
                        :src="news.thumbnail ? `./img/${news.thumbnail}` : 'https://placehold.co/60x60'" 
                        alt="thumbnail" 
                        class="rounded"
                        style="width: 60px; height: 60px; object-fit: cover;"
                      >
                      <div class="position-absolute top-0 start-0 translate-middle">
                        <span class="badge bg-danger rounded-pill">{{ index + 1 }}</span>
                      </div>
                    </div>
                    <div class="flex-grow-1 position-relative">
                      <h6 class="mb-1 fw-semibold text-dark hot-news-title">{{ news.title }}</h6>
                      <small class="text-muted">
                        <i class="bi bi-clock me-1"></i>
                        {{ formatDate(news.createdDate) }}
                      </small>
                    </div>
                  </div>
                </RouterLink>
              </div>
            </div>
          </div>

          <!-- Weather Widget -->
          <div class="card border-0 shadow-sm">
            <div class="card-body text-center">
              <h6 class="card-title mb-3">
                <i class="bi bi-cloud-sun me-2"></i>
                Thời tiết
              </h6>
              <div class="bg-info text-white rounded p-3">
                <i class="bi bi-sun display-4 mb-2"></i>
                <h5 class="mb-1">28°C</h5>
                <small>Hôm nay, Sunny</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Chat Button -->
    <div class="position-fixed bottom-0 end-0 p-4" style="z-index: 1050;">
      <button class="btn btn-primary rounded-circle shadow-lg chat-btn" data-bs-toggle="tooltip" data-bs-placement="left" title="Trò chuyện">
        <i class="fa-solid fa-comment"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { newsService } from '../services/NewsService.js'

export default {
  setup() {
    const newsList = ref([])
    const hotNews = ref([])
    const suggestNews = ref([])
    const isLoading = ref(false)
    const error = ref(null)
    const currentPage = ref(0)
    const totalPages = ref(1)

    const fetchNews = async (page = 0) => {
      isLoading.value = true
      error.value = null
      
      try {
        const data = await newsService.getNews(page)
        newsList.value = data.content
        totalPages.value = data.totalPages
        currentPage.value = data.number
      } catch (err) {
        error.value = 'Không thể tải tin tức. Vui lòng thử lại sau.'
        console.error('Error fetching news:', err)
      } finally {
        isLoading.value = false
      }
    }

    const fetchHotNews = async () => {
      try {
        const data = await newsService.getHotNews()
        hotNews.value = data
      } catch (err) {
        console.error('Error fetching hot news:', err)
      }
    }

    const fetchSuggestNews = async () => {
      try {
        const data = await newsService.getSuggestNews()
        suggestNews.value = data
      } catch (err) {
        console.error('Error fetching hot news:', err)
      }
    }
    
    const goToPage = (page) => {
      if (page >= 0 && page < totalPages.value) {
        fetchNews(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      const d = new Date(dateString)
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }

    const visiblePages = computed(() => {
      const pages = []
      const start = Math.max(1, currentPage.value - 1)
      const end = Math.min(totalPages.value, currentPage.value + 3)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    })

    onMounted(() => {
      fetchNews()
      fetchHotNews()
      fetchSuggestNews()
    })

    return {
      newsList,
      hotNews,
      suggestNews,
      isLoading,
      error,
      currentPage,
      totalPages,
      goToPage,
      formatDate,
      visiblePages
    }
  }
}
</script>

<style scoped>
/* News item hover effects */
.news-item {
  transition: all 0.3s ease;
}

.news-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.news-item:hover .news-thumbnail {
  transform: scale(1.05);
}

.news-thumbnail {
  transition: transform 0.3s ease;
}

.news-title {
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-subtitle {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.hot-news-item {
  transition: all 0.3s ease;
  cursor: pointer;
}

.hot-news-item:hover {
  background-color: #f8f9fa;
  transform: translateX(5px);
}

.hot-news-title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
}

/* Chat button */
.chat-btn {
  width: 60px;
  height: 60px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(13, 110, 253, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(13, 110, 253, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(13, 110, 253, 0);
  }
}

/* Card hover effects */
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
}

/* Pagination */
.pagination .page-link {
  border-radius: 50%;
  margin: 0 2px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination .page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .news-title {
    font-size: 1.1rem;
  }
  
  .news-subtitle {
    font-size: 0.9rem;
  }
  
  .card-body {
    padding: 1rem !important;
  }
  
  .news-thumbnail {
    height: 150px !important;
  }
  
  .chat-btn {
    width: 50px;
    height: 50px;
  }
}

@media (max-width: 576px) {
  .news-title {
    font-size: 1rem;
  }
  
  .card-body {
    padding: 0.75rem !important;
  }
  
  .news-thumbnail {
    height: 120px !important;
  }
}

/* Loading animation */
.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* Sticky positioning adjustment */
.sticky-top {
  position: sticky !important;
}
</style>