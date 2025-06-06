<template>
  <div class="row gx-2 flex-grow-1" style="min-height: 0;">
    <!-- Left Sidebar -->
    <div class="col-2 d-flex justify-content-center align-items-start sticky-top pt-3 bg-white">
      <img src="/src/assets/img/qc1.jpg" class="img-fluid rounded shadow-sm" alt="QC" />
    </div>

    <!-- Main Content -->
    <div class="col-7 bg-light overflow-auto py-4 px-3">
      <h4 class="mb-4 text-center fw-bold">📰 Tin tức mới nhất</h4>

      <RouterLink
        v-for="news in newsList"
        :key="news.newsId"
        :to="`/detail/${news.newsId}`"
        style="text-decoration: none;"
      >
        <div class="row g-0 border my-1">
          <div class="col-md-4">
            <img
              :src="news.thumbnail ? `src/assets/img/${news.thumbnail}` : 'https://placehold.co/400x250'"
              class="img-fluid h-100 object-fit-cover"
              alt="Ảnh bài viết"
            />
          </div>
          <div class="col-md-8 p-3 d-flex flex-column justify-content-between">
            <div>
              <h5 class="fw-bold mb-2">{{ news.title }}</h5>
              <p class="mb-2 text-secondary small">{{ news.subtitle }}</p>
            </div>
            <div class="text">
              <small class="text-muted">-- {{ news.author.name }} --</small>
            </div>
            <div class="text-end">
              <small class="text-muted">📅 Ngày đăng: {{ formatDate(news.createdDate) }}</small>
            </div>
          </div>
        </div>
      </RouterLink>

      <!-- Pagination -->
      <nav aria-label="Page navigation example" v-if="totalPages > 1">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 0 }">
            <button class="page-link" @click="goToPage(0)" :disabled="currentPage === 0">&laquo;&laquo;</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === 0 }">
            <button class="page-link" @click="goToPage(currentPage - 1)" :disabled="currentPage === 0">&laquo;</button>
          </li>

          <li
            v-for="page in pageNumbers"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === (page - 1) }"
          >
            <button class="page-link" @click="goToPage(page - 1)">{{ page }}</button>
          </li>

          <li class="page-item" :class="{ disabled: currentPage === totalPages - 1 }">
            <button class="page-link" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages - 1">&raquo;</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages - 1 }">
            <button class="page-link" @click="goToPage(totalPages - 1)" :disabled="currentPage === totalPages - 1">&raquo;&raquo;</button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Right Sidebar -->
    <div class="col-3 d-flex flex-column gap-3 text-center p-3">
      <div>
        <h6 class="mb-2">🔥 Hot News</h6>
        <ul class="list-unstyled small mb-0">
          <li v-for="news in hotNews" :key="news.newsId" class="mb-2">
            <div class="d-flex align-items-center border">
              <img :src="news.thumbnail ? `src/assets/img/${news.thumbnail}` : 'https://placehold.co/400x250'" alt="thumbnail" class="me-2 rounded" style="width: 60px; height: 60px; object-fit: cover;">
              <span>{{ news.title }}</span>
            </div>
          </li>
        </ul>
      </div>

      <div class="bg-success text-white py-3 rounded shadow-sm fw-semibold">💡 RECOMMEND NEWS</div>
      <div class="bg-primary text-white py-3 rounded shadow-sm fw-semibold chat-box">💬</div>
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
        error.value = err.message
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
    
    const goToPage = (page) => {
      if (page >= 0 && page < totalPages.value) {
        fetchNews(page)
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      const d = new Date(dateString)
      return d.toLocaleDateString('vi-VN')
    }

    const pageNumbers = computed(() => {
      return Array.from({ length: totalPages.value }, (_, i) => i + 1)
    })

    onMounted(() => {
      fetchNews()
      fetchHotNews()
    })

    return {
      newsList,
      hotNews,
      isLoading,
      error,
      currentPage,
      totalPages,
      goToPage,
      formatDate,
      pageNumbers
    }
  }
}
</script>

<style scoped>
.object-fit-cover {
  object-fit: cover;
}

.row.flex-grow-1 {
  flex-grow: 1;
  min-height: 0;
}

.chat-box {
  position: fixed;
  bottom: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  cursor: pointer;
  z-index: 1050;
  user-select: none;
  color: white;
  font-size: 1.2rem;
}
</style>
