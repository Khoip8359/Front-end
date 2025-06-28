<template>
  <div class="page-container d-flex flex-column min-vh-100">
    <!-- Top Bar -->
    <top_bar></top_bar>

    <!-- Main Layout -->
    <RouterView></RouterView>
    
    <!-- Footer -->
    <Footer></Footer>
  </div>
</template>

<script>
import Footer from '@/components/footer.vue';
import top_bar from '@/components/top_bar.vue';

export default {
  components: {
    Footer,
    top_bar
  },
};
</script>

<style scoped>

.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>