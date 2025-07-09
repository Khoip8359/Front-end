<template>
  <div class="container-fluid py-4" v-if="news && news.newsId">
    <!-- Main Content Layout -->
    <div class="row g-4">
      <!-- Left Sidebar - Reactions -->
      <div class="col-xl-1 col-lg-2 col-md-2">
        <div class="sticky-top" style="top: 20px;">
          <div class="d-flex flex-column gap-3">
            <!-- Like Button -->
            <div 
              :class="[
                'btn btn-lg d-flex flex-column align-items-center py-3 shadow-sm position-relative',
                isLiked ? 'btn-primary' : 'btn-outline-primary'
              ]"
              @click="handleLike"
              style="cursor: pointer;"
            >
              <i class="bi bi-hand-thumbs-up-fill fs-4 mb-1"></i>
              <small class="fw-bold">Thích</small>
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {{ formatCount(news.likes || 0) }}
              </span>
            </div>
            
            <!-- Share Button -->
            <div class="btn btn-info btn-lg d-flex flex-column align-items-center py-3 shadow-sm" @click="shareArticle">
              <i class="bi bi-share fs-4 mb-1"></i>
              <small class="fw-bold">Chia sẻ</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="col-xl-8 col-lg-7 col-md-7">
        <!-- Article Card -->
        <div class="card shadow-lg border-0 rounded-4 overflow-hidden mb-4">
          <div class="card-body p-5">
            <!-- Article Header -->
            <div class="mb-4">
              <h1 class="fw-bold mb-3 text-dark">{{ news.title }}</h1>
              <h5 class="text-muted mb-4 fst-italic" v-if="news.subtitle">{{ news.subtitle }}</h5>
              
              <!-- Author & Date Info -->
              <div class="d-flex align-items-center gap-3 mb-4">
                <div class="d-flex align-items-center">
                  <div class="bg-primary rounded-circle p-2 me-2">
                    <i class="bi bi-person-fill text-white"></i>
                  </div>
                  <span class="fw-semibold">{{ news.authorName || 'Tác giả' }}</span>
                </div>
                <div class="d-flex align-items-center text-muted">
                  <i class="bi bi-calendar3 me-2"></i>
                  <span>{{ formatDate(news.createdDate) }}</span>
                </div>
                <div class="d-flex align-items-center text-muted">
                  <i class="bi bi-eye me-2"></i>
                  <span>{{ formatCount(news.views || 0) }} lượt xem</span>
                </div>
              </div>
            </div>

            <!-- Featured Image -->
            <div class="mb-5 text-center" v-if="news.thumbnail">
              <img 
                :src="`/img/${news.thumbnail}`" 
                class="img-fluid rounded-4 shadow" 
                alt="Article Thumbnail"
                style="max-height: 400px; object-fit: cover; width: 100%;"
                @error="handleImageError"
              />
            </div>

            <!-- Article Content -->
            <div class="article-content">
              <div v-if="news.details && news.details.length > 0">
                <div v-for="(detail, index) in news.details" :key="index" class="mb-4">
                  <div class="fs-5 lh-lg" v-html="detail"></div>
                </div>
              </div>
              <div v-else class="text-center py-4">
                <p class="text-muted">Nội dung bài viết đang được cập nhật...</p>
              </div>
            </div>

            <!-- Tags -->
            <div class="mt-4" v-if="news.tags && news.tags.length > 0">
              <h6 class="fw-bold mb-3">Thẻ:</h6>
              <div class="d-flex flex-wrap gap-2">
                <span v-for="tag in news.tags" :key="tag" class="badge bg-light text-dark border px-3 py-2">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Comments Section -->
        <div class="card shadow-lg border-0 rounded-4 mb-4">
          <div class="card-header bg-light border-0 py-4">
            <h5 class="mb-0 fw-bold">
              <i class="bi bi-chat-dots me-2 text-primary"></i>
              Bình luận ({{ comments.length }})
            </h5>
          </div>
          <div class="card-body p-4">
            <!-- Comment Form -->
            <div class="mb-4">
              <textarea
                v-model="newComment"
                class="form-control border-2 rounded-3"
                rows="4"
                placeholder="Chia sẻ suy nghĩ của bạn về bài viết này..."
                style="resize: none;"
              ></textarea>
              <div class="d-flex justify-content-between align-items-center mt-3">
                <small class="text-muted">
                  Hãy giữ bình luận lịch sự và tích cực
                </small>
                <button 
                  class="btn btn-primary px-4 py-2 rounded-pill"
                  @click="submitComment"
                  :disabled="!newComment.trim()"
                >
                  <i class="bi bi-send me-2"></i>
                  Gửi bình luận
                </button>
              </div>
            </div>

            <!-- Comments List -->
            <div v-if="comments.length > 0">
              <div v-for="comment in comments" :key="comment.commentId" class="border-bottom pb-3 mb-3">
                <div class="d-flex align-items-start">
                  <div class="bg-secondary rounded-circle p-2 me-3">
                    <i class="bi bi-person-fill text-white"></i>
                  </div>
                  <div class="flex-grow-1">
                    <div class="d-flex align-items-center gap-2 mb-1">
                      <strong>{{ comment.user?.name || 'Ẩn danh' }}</strong>
                      <small class="text-muted">{{ formatDate(comment.date) }}</small>
                    </div>
                    <p class="mb-0">{{ comment.commentDetail }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4">
              <i class="bi bi-chat-dots display-6 text-muted"></i>
              <p class="text-muted mt-2">Chưa có bình luận nào</p>
            </div>
          </div>
        </div>

        <!-- Recommended Articles -->
        <div class="card shadow-lg border-0 rounded-4">
          <div class="card-header bg-success text-white py-4 border-0">
            <h5 class="mb-0 fw-bold">
              <i class="bi bi-lightbulb me-2"></i>
              Bài viết gợi ý
            </h5>
          </div>
          <div class="card-body p-4">
            <div class="row g-3">
              <div class="col-md-4" v-for="article in suggestNews.slice(0, 3)" :key="article.newsId">
                <div class="card h-100 border-0 shadow-sm">
                  <div class="card-body p-3">
                    <div class="bg-light rounded-3 p-3 mb-2 text-center" v-if="!article.thumbnail">
                      <i class="bi bi-newspaper fs-3 text-muted"></i>
                    </div>
                    <img 
                      v-else
                      :src="`/img/${article.thumbnail}`" 
                      class="img-fluid rounded-3 mb-2"
                      style="height: 100px; object-fit: cover; width: 100%;"
                      alt="Suggested article"
                    />
                    <h6 class="card-title">{{ article.title || `Tin tức gợi ý ${article.newsId}` }}</h6>
                    <p class="card-text small text-muted">{{ article.subtitle || 'Mô tả ngắn về bài viết...' }}</p>
                    <RouterLink :to="`/detail/${article.newsId}`" class="btn btn-outline-success btn-sm" @click="scrollToTop">
                      Đọc thêm
                    </RouterLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar -->
      <div class="col-xl-3 col-lg-3 col-md-3">
        <div class="sticky-top" style="top: 20px;">
          <!-- Hot News -->
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
                  v-for="(hotArticle, index) in hotNews.slice(0, 5)"
                  :key="hotArticle.newsId"
                  :to="`/detail/${hotArticle.newsId}`"
                  class="text-decoration-none"
                  @click="scrollToTop"
                >
                  <div class="d-flex align-items-center p-3 border-bottom hot-news-item position-relative">
                    <div class="flex-shrink-0 me-3 position-relative">
                      <img 
                        :src="hotArticle.thumbnail ? `/img/${hotArticle.thumbnail}` : 'https://placehold.co/60x60'" 
                        alt="thumbnail" 
                        class="rounded"
                        style="width: 60px; height: 60px; object-fit: cover;"
                      >
                      <span class="position-absolute top-0 start-0 translate-middle badge bg-danger rounded-pill">
                        {{ index + 1 }}
                      </span>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="mb-1 fw-semibold text-dark hot-news-title">{{ hotArticle.title }}</h6>
                      <small class="text-muted">
                        <i class="bi bi-clock me-1"></i>
                        {{ formatDate(hotArticle.createdDate) }}
                      </small>
                    </div>
                  </div>
                </RouterLink>
              </div>
            </div>
          </div>

          <!-- Newsletter Signup -->
          <div class="card shadow-lg border-0 rounded-4 mb-4">
            <div class="card-body p-4 text-center bg-gradient" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <div class="text-white">
                <i class="bi bi-envelope-open fs-1 mb-3"></i>
                <h6 class="fw-bold mb-3">Đăng ký nhận tin</h6>
                <p class="small mb-4 opacity-75">Nhận những tin tức mới nhất qua email</p>
                <div class="input-group mb-3">
                  <input 
                    type="email" 
                    v-model="email"
                    class="form-control border-0 rounded-start-pill" 
                    placeholder="Email của bạn"
                  />
                  <button 
                    class="btn btn-light rounded-end-pill px-4" 
                    type="button"
                    @click="subscribeNewsletter"
                    :disabled="!isValidEmail(email)"
                  >
                    <i class="bi bi-send"></i>
                  </button>
                </div>
                <small class="opacity-75">Chúng tôi không spam email</small>
              </div>
            </div>
          </div>

          <!-- Social Media -->
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-4 text-center">
              <h6 class="fw-bold mb-3">Theo dõi chúng tôi</h6>
              <div class="d-flex justify-content-center gap-2">
                <a href="#" class="btn btn-primary btn-sm rounded-circle p-2" aria-label="Facebook">
                  <i class="bi bi-facebook"></i>
                </a>
                <a href="#" class="btn btn-info btn-sm rounded-circle p-2" aria-label="Twitter">
                  <i class="bi bi-twitter-x"></i>
                </a>
                <a href="#" class="btn btn-danger btn-sm rounded-circle p-2" aria-label="YouTube">
                  <i class="bi bi-youtube"></i>
                </a>
                <a href="#" class="btn btn-success btn-sm rounded-circle p-2" aria-label="WhatsApp">
                  <i class="bi bi-whatsapp"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Advertisement Banner -->
    <div class="row mt-5">
      <div class="col-12">
        <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
          <div class="card-body p-0 text-center bg-light">
            <div class="p-4">
              <h6 class="text-muted mb-3">Quảng cáo</h6>
              <img 
                src="/img/qc2.jpg" 
                alt="Advertisement" 
                class="img-fluid rounded-3"
                style="max-height: 200px; object-fit: cover;"
                @error="handleAdError"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-md-6 text-center py-5">
        <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Đang tải...</span>
        </div>
        <h5 class="text-muted">Đang tải dữ liệu...</h5>
        <p class="text-muted">Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { newsService } from "@/services/NewsService";
import { commentService } from "@/services/commentService.js";
import { useAuthStore } from '@/stores/auth.js';
import { newsLetterService } from "@/services/index.js";
import { ReactService } from "@/services/React.js";

export default {
  setup() {
    const news = ref(null);
    const route = useRoute();
    const router = useRouter();
    const hotNews = ref([]);
    const suggestNews = ref([]);
    const comments = ref([]);
    const newComment = ref('');
    const email = ref('');
    const auth = useAuthStore();
    const isLiked = ref(false);

    const fetchDetail = async () => {
      try {
        const newsId = route.params.newsId;
        if (!newsId) {
          throw new Error('newsId không tồn tại trong route params');
        }
        const data = await newsService.getNewsDetail(newsId);
        news.value = data;
      } catch (err) {
        console.error('Error fetching news:', err);
      }
    };

    const fetchComments = async () => {
      try {
        const newsId = route.params.newsId;
        if (!newsId) return;
        comments.value = await commentService.getComments(newsId);
      } catch (err) {
        console.error('Error fetching comments:', err);
        comments.value = [];
      }
    };

    const fetchHotNews = async () => {
      try {
        const data = await newsService.getHotNews();
        const currentNewsId = route.params.newsId;
        hotNews.value = data.filter(article => article.newsId != currentNewsId);
      } catch (err) {
        console.error('Error fetching hot news:', err);
      }
    };

    const fetchSuggestNews = async () => {
      try {
        const data = await newsService.getSuggestNews();
        const currentNewsId = route.params.newsId;
        suggestNews.value = data.filter(article => article.newsId != currentNewsId);
      } catch (err) {
        console.error('Error fetching suggest news:', err);
      }
    };

    const submitComment = async () => {
      if (!newComment.value.trim()) return;

      // Kiểm tra đăng nhập bằng Pinia store
      if (!auth.isLoggedIn || !auth.currentUser) {
        router.push('/login');
        return;
      }

      try {
        const comment = {
          userId: auth.currentUser.user.userId,
          newsId: route.params.newsId,
          commentDetail: newComment.value.trim(),
          date: new Date().toISOString()
        };
        await commentService.addComment(comment);
        await fetchComments();
        newComment.value = '';
      } catch (err) {
        console.error('Error submitting comment:', err);
      }
    };

    const shareArticle = async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('✅ Đã sao chép link bài viết vào clipboard!');
      } catch (err) {
        console.error('Error copying to clipboard:', err);
        // Fallback for older browsers
        try {
          const textArea = document.createElement('textarea');
          textArea.value = window.location.href;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert('✅ Đã sao chép link bài viết vào clipboard!');
        } catch (fallbackErr) {
          alert('❌ Không thể sao chép link. Vui lòng thử lại!');
        }
      }
    };

    const subscribeNewsletter = async () => {
      if (!isValidEmail(email.value)) return;
      
      try {
        await newsLetterService.subscribeNewsletter(email.value);
        alert('Đăng ký thành công!');
        email.value = '';
      } catch (err) {
        console.error('Error subscribing:', err);
        alert('Có lỗi xảy ra, vui lòng thử lại!');
      }
    };

    const isValidEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };

    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      return d.toLocaleDateString("vi-VN", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const formatCount = (count) => {
      if (count >= 1000000) {
        return Math.floor(count / 1000000) + 'M';
      } else if (count >= 1000) {
        return Math.floor(count / 1000) + 'K';
      }
      return count.toString();
    };

    const handleImageError = (event) => {
      event.target.src = 'https://placehold.co/800x400?text=Hình+ảnh+không+tồn+tại';
    };

    const handleAdError = (event) => {
      event.target.src = 'https://placehold.co/800x200?text=Quảng+cáo';
    };

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Kiểm tra trạng thái like
    const checkLikeStatus = async () => {
      if (!auth.isLoggedIn || !auth.currentUser) {
        isLiked.value = false;
        return;
      }

      try {
        const body = {
          user_id: String(auth.currentUser.user.userId),
          news_id: String(route.params.newsId)
        };
        const response = await ReactService.getCheckReact(body);
        isLiked.value = response;
      } catch (err) {
        console.error('Error checking like status:', err);
        isLiked.value = false;
      }
    };

    const handleLike = async () => {
      if (!auth.isLoggedIn || !auth.currentUser) {
        router.push('/login');
        return;
      }

      try {
        const body = {
          user_id: String(auth.currentUser.user.userId),
          news_id: String(route.params.newsId)
        };
        await ReactService.getReacts(body);
        
        // Cập nhật trạng thái like
        isLiked.value = !isLiked.value;
        
        // Cập nhật số lượng like
        if (news.value) {
          if (isLiked.value) {
            news.value.likes = (news.value.likes || 0) + 1;
          } else {
            news.value.likes = Math.max(0, (news.value.likes || 0) - 1);
          }
        }
      } catch (err) {
        console.error('Error handling like:', err);
        alert('Có lỗi xảy ra khi thích bài viết. Vui lòng thử lại!');
      }
    };

    // Watch for route changes
    watch(
      () => route.params.newsId,
      (newId) => {
        if (newId) {
          fetchDetail();
          fetchComments();
          fetchSuggestNews();
          fetchHotNews();
          checkLikeStatus();
        }
      },
      { immediate: true }
    );

    onMounted(() => {
      fetchComments();
      fetchHotNews();
      fetchSuggestNews();
      checkLikeStatus();
    });

    return { 
      news, 
      hotNews, 
      suggestNews, 
      comments,
      newComment,
      email,
      auth,
      isLiked,
      formatDate, 
      formatCount,
      submitComment,
      shareArticle,
      subscribeNewsletter,
      isValidEmail,
      handleImageError,
      handleAdError,
      scrollToTop,
      handleLike,
      checkLikeStatus
    };
  },
};
</script>

<style scoped>
/* Custom styles for better appearance */
.article-content {
  font-family: 'Times New Roman', Times, serif;
  line-height: 1.8;
}

.article-content p {
  margin-bottom: 1.5rem;
}

.article-content img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
}

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
}

.btn {
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:disabled {
  transform: none;
  opacity: 0.6;
}

.hot-news-item:hover {
  background-color: #f8f9fa !important;
  transition: background-color 0.2s ease;
}

.hot-news-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Gradient backgrounds */
.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

/* Improved tag styling */
.badge {
  transition: all 0.2s ease;
}

.badge:hover {
  transform: scale(1.05);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .sticky-top {
    position: relative !important;
    top: auto !important;
  }
  
  .display-4 {
    font-size: 2rem !important;
  }
  
  .card-body.p-5 {
    padding: 2rem !important;
  }
  
  .col-xl-1, .col-xl-8, .col-xl-3 {
    order: 2;
  }
  
  .col-xl-8 {
    order: 1;
  }
}

/* Loading animations */
.spinner-border {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Accessibility improvements */
.btn:focus,
.form-control:focus {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* Print styles */
@media print {
  .sticky-top,
  .card-header,
  .btn,
  .badge {
    display: none !important;
  }
  
  .card {
    border: none !important;
    box-shadow: none !important;
  }
}
</style>