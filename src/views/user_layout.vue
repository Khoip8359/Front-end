<template>
  <div class="page-container d-flex flex-column min-vh-100">
    <!-- Banner -->
    <Banner />

    <!-- Top Bar -->
    <div class="row g-0 text-center align-items-center py-2 shadow-sm bg-white">
      <div class="col-2" id="logo">
        <img class="img-fluid px-2" src="/src/assets/img/logo.png" alt="Logo" />
      </div>
      <div class="col-2 text-muted fw-semibold">03/06/2025 - 12:00:00</div>
      <div class="col-7 px-3">
        <div class="input-group">
          <input type="text" class="form-control" placeholder="Tìm kiếm bài viết..." />
          <span class="input-group-text bg-primary text-white">🔍</span>
        </div>
      </div>
      <div class="col-1 px-3">
        <RouterLink to="/login" class="btn btn-outline-primary btn-sm w-100">Login</RouterLink>
      </div>
    </div>

    <!-- Category/Menu -->
    <user_menu />

    <!-- Main Layout -->
    <div class="row gx-2 flex-grow-1" style="min-height: 0;">
      <!-- Left Sidebar -->
      <div class="col-2 d-flex justify-content-center align-items-start sticky-top pt-3 bg-white">
        <img src="/src/assets/img/qc1.jpg" class="img-fluid rounded shadow-sm" alt="QC" />
      </div>

      <!-- Main Content -->
      <div class="col-8 bg-light overflow-auto py-4 px-3">
        <h4 class="mb-4 text-center fw-bold">📰 Tin tức mới nhất</h4>

          <div class="row g-0 border my-1">
            <div class="col-md-4">
              <img src="https://placehold.co/400x250" class="img-fluid h-100 object-fit-cover" alt="Ảnh bài viết"/>
            </div>
            <div class="col-md-8 p-3 d-flex flex-column justify-content-between">
              <div>
                <h5 class="fw-bold mb-2">TP.HCM lo vỡ tiến độ khởi công metro số 2 cuối năm nay</h5>
                <p class="mb-2 text-secondary small">
                  UBND TP.HCM dự kiến khởi công tuyến metro số 2 (Bến Thành - Tham Lương)
                  vào tháng 12, nhưng hiện nhiều hạng mục đang chậm tiến độ.
                </p>
              </div>
              <div class="text-end">
                <small class="text-muted">📅 Ngày đăng: 03/06/2025</small>
              </div>
            </div>
          </div>

          <div class="row g-0 border my-1">
            <div class="col-md-4">
              <img
                src="https://placehold.co/400x250"
                class="img-fluid h-100 object-fit-cover"
                alt="Ảnh bài viết"
              />
            </div>
            <div class="col-md-8 p-3 d-flex flex-column justify-content-between">
              <div>
                <h5 class="fw-bold mb-2">TP.HCM lo vỡ tiến độ khởi công metro số 2 cuối năm nay</h5>
                <p class="mb-2 text-secondary small">
                  UBND TP.HCM dự kiến khởi công tuyến metro số 2 (Bến Thành - Tham Lương)
                  vào tháng 12, nhưng hiện nhiều hạng mục đang chậm tiến độ.
                </p>
              </div>
              <div class="text-end">
                <small class="text-muted">📅 Ngày đăng: 03/06/2025</small>
              </div>
            </div>
          </div>
          
        <nav aria-label="Page navigation example">
            <ul class="pagination justify-content-center">
                <li class="page-item">
                <a class="page-link" href="#" aria-label="First">
                    &laquo;&laquo;
                </a>
                </li>
                <li class="page-item">
                <a class="page-link" href="#" aria-label="Previous">
                    &laquo;
                </a>
                </li>
                <li class="page-item active">
                <a class="page-link" href="#">1</a>
                </li>
                <li class="page-item">
                <a class="page-link" href="#" aria-label="Next">
                    &raquo;
                </a>
                </li>
                <li class="page-item">
                <a class="page-link" href="#" aria-label="Last">
                    &raquo;&raquo;
                </a>
                </li>
            </ul>
        </nav>
          
      </div>

      <!-- Right Sidebar -->
      <div class="col-2 d-flex flex-column gap-3 text-center">
        <div class="bg-danger text-white py-3 rounded shadow-sm fw-semibold">
          🔥 TOP HOTTEST NEWS
        </div>
        <div class="bg-success text-white py-3 rounded shadow-sm fw-semibold">
          💡 RECOMMEND NEWS
        </div>
        <div class="bg-primary text-white py-3 rounded shadow-sm fw-semibold chat-box">
            💬
        </div>
      </div>
    </div>

    <!-- Footer -->
    <foter></foter>
  </div>
</template>

<script>
import Banner from '@/components/banner.vue';
import user_menu from '@/components/user_menu.vue';
import foter from '@/components/footer.vue';

export default {
  components: {
    Banner,
    user_menu,
    foter,
  },
};
</script>

<style scoped>
.object-fit-cover {
  object-fit: cover;
}

/* Container bố trí theo flex column, cao tối thiểu 100vh */
.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* phần main layout sẽ giãn ra hết không gian còn lại */
.row.flex-grow-1 {
  flex-grow: 1;
  min-height: 0; /* để con overflow-auto hoạt động đúng */
}

/* Footer luôn ở dưới cùng */
footer {
  /* margin-top: auto được đặt trong class mt-auto của Bootstrap */
}

.chat-box {
  position: fixed;      /* cố định trên viewport */
  bottom: 16px;         /* cách dưới màn hình 16px */
  right: 16px;          /* cách phải màn hình 16px */
  width: 20px;          /* nhỏ gọn */
  height: 10px;
  border-radius: 50%;   /* nút tròn */
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  cursor: pointer;
  z-index: 1050;        /* ưu tiên lên trên */
  user-select: none;    /* không cho bôi đen chữ */
}
</style>