<template>
  <div class="container-fluid py-4" v-if="news && news.newsId">

    <!-- Main Content Layout -->
    <div class="row g-4">
      <!-- Left Sidebar - Reactions -->
      <div class="col-xl-1 col-lg-2 col-md-2">
        <div class="sticky-top" style="top: 20px;">
          <div class="d-flex flex-column gap-3">
            <!-- Like Button -->
            <div class="btn btn-success btn-lg d-flex flex-column align-items-center py-3 shadow-sm position-relative">
              <i class="fa-solid fa-thumbs-up fs-4 mb-1"></i>
              <small class="fw-bold">Like</small>
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                99+
              </span>
            </div>
            
            <!-- Favorite Button -->
            <div class="btn btn-warning btn-lg d-flex flex-column align-items-center py-3 shadow-sm">
              <i class="fa-solid fa-star fs-4 mb-1"></i>
              <small class="fw-bold">Save</small>
            </div>
            
            <!-- Share Button -->
            <div class="btn btn-info btn-lg d-flex flex-column align-items-center py-3 shadow-sm">
              <i class="fa-solid fa-share fs-4 mb-1"></i>
              <small class="fw-bold">Share</small>
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
              <h2 class="fw-bold mb-3 text-dark">{{ news.title }}</h2>
              <h5 class="text-muted mb-4 fst-italic">{{ news.subtitle }}</h5>
              
              <!-- Author & Date Info -->
              <div class="d-flex align-items-center gap-3 mb-4">
                <div class="d-flex align-items-center">
                  <div class="bg-primary rounded-circle p-2 me-2">
                    <i class="fa-solid fa-user text-white"></i>
                  </div>
                  <span class="fw-semibold">{{ news.authorName }}</span>
                </div>
                <div class="d-flex align-items-center text-muted">
                  <i class="fa-regular fa-calendar me-2"></i>
                  <span>{{ formatDate(news.createdDate) }}</span>
                </div>
              </div>
            </div>

            <!-- Featured Image -->
            <div class="mb-5 text-center">
              <img 
                :src="`/Test/img/${news.thumbnail}`" 
                class="img-fluid rounded-4 shadow" 
                alt="Article Thumbnail"
                style="max-height: 400px; object-fit: cover; width: 100%;"
              />
            </div>

            <!-- Article Content -->
            <div class="article-content">
              <div v-for="(detail, index) in news.details" :key="index" class="mb-4">
                <div class="fs-5 lh-lg" v-html="detail"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Comments Section -->
        <div class="card shadow-lg border-0 rounded-4 mb-4">
          <div class="card-header bg-light border-0 py-4">
            <h5 class="mb-0 fw-bold">
              <i class="fa-regular fa-comments me-2 text-primary"></i>
              Bình luận
            </h5>
          </div>
          <div class="card-body p-4">
            <div class="mb-4">
              <textarea
                class="form-control border-2 rounded-3"
                rows="4"
                placeholder="Chia sẻ suy nghĩ của bạn về bài viết này..."
                style="resize: none;"
              ></textarea>
              <div class="d-flex justify-content-between align-items-center mt-3">
                <small class="text-muted">
                  <i class="fa-solid fa-info-circle me-1"></i>
                  Hãy giữ bình luận lịch sự và tích cực
                </small>
                <button class="btn btn-primary px-4 py-2 rounded-pill">
                  <i class="fa-solid fa-paper-plane me-2"></i>
                  Gửi bình luận
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Recommended Articles -->
        <div class="card shadow-lg border-0 rounded-4">
          <div class="card-header bg-success text-white py-4 border-0">
            <h5 class="mb-0 fw-bold">
              <i class="fa-solid fa-lightbulb me-2"></i>
              Bài viết gợi ý
            </h5>
          </div>
          <div class="card-body p-4">
            <div class="row g-3">
              <div class="col-md-4" v-for="i in 3" :key="i">
                <div class="card h-100 border-0 shadow-sm">
                  <div class="card-body p-3">
                    <div class="bg-light rounded-3 p-3 mb-2 text-center">
                      <i class="fa-solid fa-newspaper fs-3 text-muted"></i>
                    </div>
                    <h6 class="card-title">Tin tức gợi ý {{ i }}</h6>
                    <p class="card-text small text-muted">Mô tả ngắn về bài viết...</p>
                    <a href="#" class="btn btn-outline-success btn-sm">Đọc thêm</a>
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
          <div class="card shadow-lg border-0 rounded-4 mb-4 overflow-hidden">
            <div class="card-header bg-danger text-white py-3 border-0">
              <h6 class="mb-0 fw-bold">
                <i class="fa-solid fa-fire me-2"></i>
                Tin nóng hôm nay
              </h6>
            </div>
            <div class="card-body p-0">
              <div class="list-group list-group-flush">
                <a href="#" class="list-group-item list-group-item-action px-4 py-3 border-0" v-for="i in 5" :key="i">
                  <div class="d-flex align-items-start">
                    <span class="badge bg-danger rounded-pill me-3 mt-1">{{ i }}</span>
                    <div>
                      <h6 class="mb-1 fw-semibold">Tin nóng số {{ i }}</h6>
                      <p class="mb-0 small text-muted">Mô tả ngắn gọn về tin tức này...</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <!-- Newsletter Signup -->
          <div class="card shadow-lg border-0 rounded-4 mb-4">
            <div class="card-body p-4 text-center bg-gradient" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <div class="text-white">
                <i class="fa-solid fa-envelope-open fs-1 mb-3"></i>
                <h6 class="fw-bold mb-3">Đăng ký nhận tin</h6>
                <p class="small mb-4 opacity-75">Nhận những tin tức mới nhất qua email</p>
                <div class="input-group mb-3">
                  <input 
                    type="email" 
                    class="form-control border-0 rounded-start-pill" 
                    placeholder="Email của bạn"
                  />
                  <button class="btn btn-light rounded-end-pill px-4" type="button">
                    <i class="fa-solid fa-arrow-right text-primary"></i>
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
                <a href="#" class="btn btn-primary btn-sm rounded-circle p-2">
                  <i class="fa-brands fa-facebook-f"></i>
                </a>
                <a href="#" class="btn btn-info btn-sm rounded-circle p-2">
                  <i class="fa-brands fa-twitter"></i>
                </a>
                <a href="#" class="btn btn-danger btn-sm rounded-circle p-2">
                  <i class="fa-brands fa-youtube"></i>
                </a>
                <a href="#" class="btn btn-success btn-sm rounded-circle p-2">
                  <i class="fa-brands fa-whatsapp"></i>
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
          <span class="visually-hidden">Loading...</span>
        </div>
        <h5 class="text-muted">Đang tải dữ liệu...</h5>
        <p class="text-muted">Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { newsService } from "@/services/NewsService";

export default {
  setup() {
    const news = ref(null);
    const route = useRoute();

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
    }

    onMounted(() => {
      fetchDetail()
    });

    function formatDate(dateStr) {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      return d.toLocaleDateString("vi-VN", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    return { news, formatDate };
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

.list-group-item:hover {
  background-color: #f8f9fa !important;
}

/* Gradient backgrounds */
.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
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
}

/* Custom scrollbar for better UX */
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
</style>