<template>
  <div class="container-fluid p-0 d-flex flex-column vh-100">
    <!-- Banner -->
    <Banner></Banner>

    <!-- Top Bar -->
    <div class="row g-0 text-center align-items-center flex-shrink-0">
      <div class="col-2" id="logo"><img class="img-fluid" src="/src/assets/img/logo.png" alt=""></div>
      <div class="col-2">03/06/2025 - 12:00:00</div>
      <div class="col-7">
        <div class="input-group">
          <input type="text" class="form-control" placeholder="Type here" />
          <span class="input-group-text">🔍</span>
        </div>
      </div>
      <div class="col-1 px-2">
        <div class="input-group">
          <RouterLink to="/login">Login</RouterLink>
        </div>
      </div>
    </div>

    <!-- Category/Menu -->
    <user_menu class="flex-shrink-0"></user_menu>

    <!-- Content Section -->
    <div class="row g-0 flex-grow-1" style="min-height: 0;">
      <!-- Left Sidebar -->
      <div class="col-2 bg-secondary text-white text-center py-5 d-flex align-items-center justify-content-center">
        ADVERTISING BANNER
      </div>

      <!-- Main Content -->
      <div class="col-8 bg-info text-white text-center py-5 overflow-auto">
        NEWS LIST
      </div>

      <!-- Right Sidebar -->
      <div class="col-2 d-flex flex-column text-center gap-2">
        <div class="bg-danger text-white flex-fill py-3">TOP'S HOTTEST NEWS</div>
        <div class="bg-success text-white flex-fill py-3">RECOMMEND NEWS</div>
        <div class="bg-primary text-white flex-fill py-3">CHAT</div>
      </div>
    </div>

    <!-- Pages -->
    <div class="bg-danger text-center py-2 text-white flex-shrink-0">
      PAGES
    </div>

    <!-- Footer -->
    <div class="bg-secondary text-white text-center py-3 flex-shrink-0">
      FOOTER
    </div>
  </div>
</template>

<script>
import Banner from '@/components/banner.vue';
import user_menu from '@/components/user_menu.vue';

export default {
  components: {
    Banner,
    user_menu,
  },
};
</script>

<style scoped>
html,
body {
  height: 100%;
  margin: 0;
}

.container-fluid {
  /* Bootstrap class vh-100 rồi nên không cần thêm height nữa */
  overflow: hidden;
}

.overflow-auto {
  overflow: auto;
}
</style>
