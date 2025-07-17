<template>
  <div v-if="news" class="card shadow-lg border-0 rounded-4 overflow-hidden mb-4">
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
          :src="getImageUrl(news.thumbnail)" 
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
            <div v-if="isImageSection(detail)" class="d-flex justify-content-center my-4">
              <img :src="detail" class="img-fluid rounded-3 shadow" style="width: 600px; max-width: 100%; max-height: 350px; object-fit: cover; display: block; margin: 0 auto;" alt="Ảnh nội dung" />
            </div>
            <div v-else class="fs-5 lh-lg">{{ detail }}</div>
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
      <!-- Approve/Reject Buttons -->
      <div class="mt-5 d-flex justify-content-center gap-4">
        <button class="btn btn-success px-4 py-2 fw-bold rounded-pill" @click="approveNews">Phê duyệt</button>
        <button class="btn btn-danger px-4 py-2 fw-bold rounded-pill" @click="rejectNews">Từ chối</button>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-5">
    <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
      <span class="visually-hidden">Đang tải...</span>
    </div>
    <h5 class="text-muted">Đang tải dữ liệu...</h5>
    <p class="text-muted">Vui lòng đợi trong giây lát</p>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { newsService } from "@/services/NewsService";
import { getImageUrl } from '@/services/api'
import router from "@/router";

export default {
  setup() {
    const news = ref(null);
    const route = useRoute();
    const loading = ref(false);

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

    const approveNews = async () => {
      if (!news.value) return;
      loading.value = true;
      try {
        await newsService.updateNewsStatus(news.value.newsId, 'published');
        await fetchDetail();
        alert('Bài viết đã được phê duyệt!');
        router.push('/censor/pending-articles')        
      } catch (err) {
        alert('Có lỗi khi phê duyệt bài viết!');
      } finally {
        loading.value = false;
      }
    };

    const rejectNews = async () => {
      if (!news.value) return;
      loading.value = true;
      try {
        await newsService.updateNewsStatus(news.value.newsId, 'rejected');
        await fetchDetail();
        alert('Bài viết đã bị từ chối!');
        router.push('/censor/pending-articles')
      } catch (err) {
        alert('Có lỗi khi từ chối bài viết!');
      } finally {
        loading.value = false;
      }
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

    function isImageSection(section) {
      return typeof section === 'string' && /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(section)
    }

    watch(
      () => route.params.newsId,
      (newId) => {
        if (newId) {
          fetchDetail();
        }
      },
      { immediate: true }
    );

    onMounted(() => {
      fetchDetail();
    });

    return {
      news,
      formatDate,
      formatCount,
      handleImageError,
      getImageUrl,
      isImageSection,
      approveNews,
      rejectNews,
      loading
    };
  },
};
</script>