<template>
  <div class="container py-4">
    <!-- Title -->
    <div class="row mb-4">
      <div class="col">
        <h2 class="fw-bold text-center">{{ article.title }}</h2>
      </div>
    </div>

    <!-- Main Content Row: React | Content | Hot News -->
    <div class="row g-3">
      <!-- React -->
      <div class="col-md-1 d-flex flex-column align-items-center">
        <div class="bg-success text-white p-2 w-100 text-center mb-2 rounded"><i class="fa-solid fa-thumbs-up"></i></div>
        <div class="bg-primary text-white p-2 w-100 text-center rounded"><i class="fa-solid fa-star"></i></div>
      </div>

      <!-- Main Content (Thumbnail + Subtitle + Details + Comments + Recommend) -->
      <div class="col-md-8">
        <!-- Thumbnail + Subtitle -->
        <div class="row g-3 mb-3">
          <div class="col-md-8">
            <img :src="article.thumbnail" class="img-fluid rounded w-100" alt="Thumbnail" />
          </div>
          <div class="col-md-4">
            <div class="bg-light h-100 p-3 rounded">
              <h6 class="fw-bold mb-2">Subtitle</h6>
              <p class="mb-0">{{ article.subtitle }}</p>
            </div>
          </div>
        </div>

        <!-- Details -->
        <div class="mb-4">
          <div class="bg-white p-3 rounded shadow-sm">
            <p class="fs-5 mb-0">{{ article.details }}</p>
          </div>
        </div>

        <!-- Comments -->
        <div class="mb-4">
          <div class="bg-light p-3 border rounded">
            <h5 class="mb-3">Bình luận</h5>
            <textarea class="form-control mb-2" rows="3" placeholder="Viết bình luận..."></textarea>
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
      <div class="col">
        <div class="bg-secondary text-white text-center p-3 rounded">
          Quảng cáo - Banner
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const article = {
      title: 'TP.HCM lo vỡ tiến độ khởi công metro số 2 cuối năm nay',
      thumbnail: 'https://placehold.co/800x450',
      subtitle: 'Tuyến metro số 2 (Bến Thành - Tham Lương) vẫn đang gặp nhiều vướng mắc trong giải phóng mặt bằng.',
      details: `UBND TP.HCM dự kiến khởi công tuyến metro số 2 vào tháng 12,
      nhưng hiện nhiều hạng mục đang chậm tiến độ, ảnh hưởng đến kế hoạch chung của dự án...`
    };
    return { article };
  }
};
</script>

<style scoped>
/* Tuỳ chỉnh thêm nếu muốn */
</style>
