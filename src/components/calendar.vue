<template>
  <div class="calendar-bg">
    <div class="container-fluid">
      <div class="calendar-news-wrapper row">
        <!-- Calendar Column -->
        <div class="calendar-col col-md-4">
          <div class="calendar-container">
            <!-- Calendar Header -->
            <div class="calendar-header">
              <button class="nav-button" @click="previousMonth">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15,18 9,12 15,6"></polyline>
                </svg>
              </button>
              <div class="header-center">
                <h1 class="header-title">{{ currentMonthYear }}</h1>
                <div class="header-subtitle">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>Lịch tin tức</span>
                </div>
              </div>
              <button class="nav-button" @click="nextMonth">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </button>
            </div>

            <div class="calendar-body">
              <!-- Weekdays -->
              <div class="weekdays">
                <div v-for="day in weekDays" :key="day" class="weekday">
                  {{ day }}
                </div>
              </div>

              <!-- Calendar Grid -->
              <div class="calendar-grid">
                <div
                  v-for="(day, index) in calendarDays"
                  :key="index"
                  class="calendar-day"
                  :class="{
                    'other-month': !day.isCurrentMonth,
                    'current-month': day.isCurrentMonth,
                    'today': day.isToday,
                    'selected': selectedDate === day.date
                  }"
                  @click="selectDate(day)"
                >
                  <span class="day-number">{{ day.dayNumber }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- News Column -->
        <div class="news-col col-md-8">
          <div class="selected-date-info">
            <div class="info-header">
              <div class="header-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <div>
                <h2 class="date-title">{{ formatDate(selectedDate) }}</h2>
                <p class="date-subtitle">{{ totalElements }} tin tức</p>
              </div>
            </div>
            <div v-if="loading" class="loading-container">
              <div class="loading-spinner"></div>
              <span>Đang tải tin tức...</span>
            </div>
            <div v-else-if="newsByDate.length > 0" class="news-list">
              <div v-for="news in newsByDate" :key="news.newsId" class="news-item" @click="openNews(news)">
                <div class="news-thumbnail">
                  <img v-if="news.thumbnail" :src="news.thumbnail ? `./img/${news.thumbnail}` : 'https://placehold.co/400x250'" :alt="news.title" class="img-fluid" />
                  <div v-else class="thumbnail-placeholder">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21,15 16,10 5,21"></polyline>
                    </svg>
                  </div>
                </div>
                <div class="news-content">
                  <h3 class="news-title">{{ news.title }}</h3>
                  <p class="news-subtitle">{{ news.subtitle }}</p>
                  <div class="news-meta">
                    <div class="meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <span>{{ news.author?.name }}</span>
                    </div>
                    <div class="meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      <span>{{ formatViews(news.views) }} lượt xem</span>
                    </div>
                    <div class="meta-item time">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12,6 12,12 16,14"></polyline>
                      </svg>
                      <span>{{ news.publishTime }}</span>
                    </div>
                  </div>
                </div>
                <div class="news-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9,18 15,12 9,6"></polyline>
                  </svg>
                </div>
              </div>
              <!-- Pagination -->
              <div v-if="totalPages > 1" class="pagination">
                <button :disabled="page === 0" @click="goToPage(page - 1)">Trước</button>
                <span>Trang {{ page + 1 }} / {{ totalPages }}</span>
                <button :disabled="page === totalPages - 1" @click="goToPage(page + 1)">Sau</button>
              </div>
            </div>
            <div v-else class="no-news">
              <div class="no-news-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                  <line x1="8" y1="14" x2="16" y2="14"></line>
                  <line x1="8" y1="18" x2="12" y2="18"></line>
                </svg>
              </div>
              <h3>Không có tin tức nào</h3>
              <p>Chưa có tin tức nào được đăng trong ngày này</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { newsService } from '@/services/NewsService.js'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentDate = ref(new Date())
const selectedDate = ref(null)
const newsByDate = ref([])
const loading = ref(false)

const page = ref(0)
const size = ref(5)
const totalPages = ref(1)
const totalElements = ref(0)

const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

const formatDateToString = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('vi-VN', { 
    month: 'long', 
    year: 'numeric' 
  })
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  const days = []
  const today = new Date()
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    const dayNumber = date.getDate()
    const isCurrentMonth = date.getMonth() === month
    const isToday = date.toDateString() === today.toDateString()
    const dateString = formatDateToString(date)
    days.push({
      date: dateString,
      dayNumber,
      isCurrentMonth,
      isToday
    })
  }
  return days
})

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const selectDate = async (day) => {
  if (day.isCurrentMonth) {
    selectedDate.value = day.date
    await loadNewsByDate(day.date, 0)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatViews = (views) => {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'M'
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'K'
  }
  return views?.toString() || '0'
}

const loadNewsByDate = async (date, pageNum = 0) => {
  try {
    loading.value = true
    const response = await newsService.getNewsByDate(date, pageNum, size.value)
    newsByDate.value = response.content || []
    totalPages.value = response.totalPages
    totalElements.value = response.totalElements
    page.value = response.number
  } catch (error) {
    console.error('Error loading news by date:', error)
    newsByDate.value = []
    totalPages.value = 1
    totalElements.value = 0
    page.value = 0
  } finally {
    loading.value = false
  }
}

const goToPage = async (newPage) => {
  if (newPage >= 0 && newPage < totalPages.value) {
    await loadNewsByDate(selectedDate.value, newPage)
  }
}

const openNews = (news) => {
  // Chuyển hướng hoặc mở modal chi tiết news
  router.push(`/detail/${news.newsId}`)
}

onMounted(async () => {
  const today = new Date()
  selectedDate.value = formatDateToString(today)
  await loadNewsByDate(selectedDate.value, 0)
})
</script>

<style scoped>
.calendar-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.calendar-news-wrapper {
  /* Không cần width, margin, padding ngang, flex, gap, min-width, max-width, box-sizing */
}
.calendar-col, .news-col {
  padding-top: 40px;
  padding-bottom: 40px;
}
@media (max-width: 1200px) {
  .calendar-col, .news-col {
    padding-top: 20px;
    padding-bottom: 20px;
  }
}
.calendar-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 32px 24px 24px 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.header-center {
  flex: 1;
  text-align: center;
}

.header-title {
  font-size: 24px;
  font-weight: 800;
  margin: 0 0 4px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-transform: capitalize;
}

.header-subtitle {
  font-size: 14px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  font-weight: 500;
}

.nav-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  cursor: pointer;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.nav-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.calendar-body {
  margin-top: 16px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 12px;
  gap: 4px;
}

.weekday {
  text-align: center;
  font-weight: 700;
  color: #64748b;
  padding: 12px 0;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.calendar-day {
  background: #f8fafc;
  border-radius: 12px;
  min-height: 48px;
  text-align: center;
  font-size: 16px;
  color: #1e293b;
  cursor: pointer;
  padding: 8px 4px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.calendar-day:hover {
  background: #e2e8f0;
  transform: scale(1.05);
}

.calendar-day.other-month {
  color: #cbd5e1;
  background: #f1f5f9;
  cursor: default;
}

.calendar-day.other-month:hover {
  transform: none;
  background: #f1f5f9;
}

.calendar-day.today {
  border: 2px solid #3b82f6;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1d4ed8;
  font-weight: 700;
}

.calendar-day.selected {
  border: 2px solid #f59e0b;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #d97706;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}

.calendar-day.has-news .day-number {
  font-weight: 700;
}

.day-number {
  font-weight: 600;
}

.news-indicator {
  width: 6px;
  height: 6px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  margin-top: 2px;
}

.selected-date-info {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 32px 28px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.info-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f1f5f9;
}

.header-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.date-title {
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 4px 0;
  color: #1e293b;
}

.date-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.news-item {
  display: flex;
  gap: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  padding: 20px;
  align-items: flex-start;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
}

.news-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.news-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

.news-item:hover::before {
  transform: scaleX(1);
}

.news-thumbnail {
  width: 100px;
  height: 75px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.news-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-placeholder {
  color: #94a3b8;
}

.news-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.news-title {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-subtitle {
  margin: 0;
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-meta {
  display: flex;
  gap: 20px;
  align-items: center;
  font-size: 13px;
  color: #94a3b8;
  margin-top: 4px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.meta-item.time {
  margin-left: auto;
  color: #667eea;
  font-weight: 600;
}

.news-arrow {
  color: #cbd5e1;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.news-item:hover .news-arrow {
  color: #667eea;
  transform: translateX(4px);
}

.no-news {
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.no-news-icon {
  margin-bottom: 20px;
  opacity: 0.7;
}

.no-news h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #64748b;
}

.no-news p {
  font-size: 15px;
  margin: 0;
  color: #94a3b8;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #64748b;
  font-size: 16px;
  font-weight: 500;
  padding: 60px 20px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}
.pagination button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.08);
}
.pagination button:disabled {
  background: #e5e7eb;
  color: #a1a1aa;
  cursor: not-allowed;
  box-shadow: none;
}
.pagination span {
  font-size: 15px;
  color: #64748b;
  font-weight: 500;
}
</style>