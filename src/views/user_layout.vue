<template>
  <div class="page-container d-flex flex-column min-vh-100">
    <!-- Banner -->
    <Banner />

    <!-- Top Bar -->
    <top_bar></top_bar>

    <!-- Category/Menu -->
    <user_menu />

    <!-- Main Layout -->
    <RouterView></RouterView>
    <!-- Footer -->
    <foter></foter>
  </div>
</template>

<script>
import Banner from '@/components/banner.vue';
import user_menu from '@/components/user_menu.vue';
import foter from '@/components/footer.vue';
import top_bar from '@/components/top_bar.vue';
import main_content from '@/components/main_content.vue';

export default {
  components: {
    Banner,
    user_menu,
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