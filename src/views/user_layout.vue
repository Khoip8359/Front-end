<template>
  <div class="page-container d-flex flex-column min-vh-100">
    <!-- Top Bar -->
    <top_bar></top_bar>

    <!-- Main Layout -->
    <RouterView></RouterView>
    
    <!-- Footer -->
    <foter></foter>
  </div>
</template>

<script>
import foter from '@/components/footer.vue';
import top_bar from '@/components/top_bar.vue';

export default {
  components: {
    foter,
    top_bar
  },
};
</script>

<style scoped>

/* Container bố trí theo flex column, cao tối thiểu 100vh */
.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>