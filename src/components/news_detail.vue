<template>
  <div class="container py-4" v-if="news && news.newsId">
    <!-- Title -->
    <div class="row mb-4">
      <div class="col">
        <h2 class="fw-bold text-center">{{ news.title }}</h2>
      </div>
    </div>

    <!-- Main Content Row: React | Content | Hot News -->
    <div class="row g-3">
      <!-- React -->
      <div class="col-md-1 d-flex flex-column align-items-center">
        <div class="bg-success text-white p-2 w-100 text-center mb-2 rounded">
          <i class="fa-solid fa-thumbs-up"></i>
        </div>
        <div class="bg-primary text-white p-2 w-100 text-center rounded">
          <i class="fa-solid fa-star"></i>
        </div>
      </div>

      <!-- Main Content -->
      <div class="col-md-8">
        <div class="container py-4">
          <h2 class="fw-bold mb-3">{{ news.title }}</h2>
          <h5 class="text-muted mb-4">{{ news.subtitle }}</h5>
          <img :src="news.thumbnail" class="img-fluid rounded mb-4" alt="Thumbnail" />

          <!-- Hiển thị từng phần detail -->
          <div v-for="(detail, index) in news.details" :key="index" class="mb-4">
            <p v-html="detail"></p>
          </div>

          <div class="text-end text-muted">
            ✍️ {{ news.authorName }} – 🗓 {{ formatDate(news.createdDate) }}
          </div>
        </div>

        <!-- Comments -->
        <div class="mb-4">
          <div class="bg-light p-3 border rounded">
            <h5 class="mb-3">Bình luận</h5>
            <textarea
              class="form-control mb-2"
              rows="3"
              placeholder="Viết bình luận..."
            ></textarea>
            <button class="btn btn-primary">Gửi</button>
          </div>
        </div>

        <!-- Recommend News -->
        <div>
          <div class="bg-success text-white p-3 rounded">
            <h5 class="mb-3">Tin tức gợi ý</h5>
            <ul class="mb-0">
              <li>Tin 1...</li>
              <li>Tin 2...</li>
              <li>Tin 3...</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Hot News + Newsletter -->
      <div class="col-md-3">
        <div class="bg-danger text-white p-3 rounded mb-3">
          <h6 class="mb-2">🔥 Hot News</h6>
          <ul class="small mb-0">
            <li>Tin nóng 1</li>
            <li>Tin nóng 2</li>
            <li>Tin nóng 3</li>
          </ul>
        </div>
        <div class="border p-3 rounded">
          <h6 class="mb-2">📧 Đăng ký nhận tin</h6>
          <input type="email" class="form-control mb-2" placeholder="Email của bạn" />
          <button class="btn btn-primary w-100">Đăng ký</button>
        </div>
      </div>
    </div>

    <!-- Advertising Banner -->
    <div class="row mt-4">
      <div class="col-12 p-0">
        <div class="text-center">
          <img src="/src/assets/img/qc2.jpg" alt="" class="img-fluid w-100" />
        </div>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-4">
    <p>Đang tải dữ liệu...</p>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

export default {
  setup() {
    const news = ref(null);
    const route = useRoute();

    onMounted(async () => {
      const id = route.params.newsId;
      if (!id) {
        console.error("Không có newsId trong route params");
        return;
      }
      try {
        const res = await axios.get(`http://localhost:8080/api/news/detail/${id}`);
        news.value = res.data;
      } catch (error) {
        console.error("Lấy tin tức thất bại:", error);
      }
    });

    function formatDate(dateStr) {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      return d.toLocaleDateString("vi-VN");
    }

    return { news, formatDate };
  },
};
</script>

<style scoped>
/* Tuỳ chỉnh thêm nếu muốn */
</style>
