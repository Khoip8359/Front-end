<template>
    <div class="page-container d-flex flex-column min-vh-100">
      <!-- Top Bar -->
      <TopBar></TopBar>
  
      <RouterView></RouterView>
      
      <!-- Footer -->
      <Footer></Footer>
    </div>
  </template>
  
  <script>
  import Footer from '@/components/footer.vue';
  import TopBar from '@/components/top_bar.vue';
  
  export default {
    name: 'CensorView',
    components: {
      Footer,
      TopBar,
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