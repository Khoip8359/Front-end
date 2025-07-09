<template>
  <div class="page-container d-flex flex-column min-vh-100">
    <!-- Top Bar -->
    <TopBar></TopBar>

    <!-- Main Content Area -->
    <div class="main-content flex-grow-1">
      <div class="container-fluid h-100">
        <div class="row h-100">
          <!-- Sidebar Column: Ẩn hoàn toàn trên mobile -->
          <div class="col-lg-3 col-xl-2 p-0 d-none d-lg-block">
            <ReportSlideBar />
          </div>
          
          <!-- Main Content Column: Chiếm toàn bộ chiều rộng trên mobile -->
          <div class="col-12 col-lg-9 col-xl-10 p-4">
            <RouterView />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from '@/components/footer.vue';
import TopBar from '@/components/top_bar.vue';
import ReportSlideBar from '@/components/reportSideBar.vue';

export default {
  name: 'ReporterView',
  components: {
    Footer,
    TopBar,
    ReportSlideBar
  },
};
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  overflow: hidden;
}

/* Ensure proper spacing and layout */
.container-fluid {
  padding: 0;
}

/* Mobile responsive adjustments */
@media (max-width: 991.98px) {
  .main-content .row {
    position: relative;
  }
  
  .col-lg-9 {
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>