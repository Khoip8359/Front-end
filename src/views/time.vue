<template>
    <div class="page-container d-flex flex-column min-vh-100">
      <!-- Top Bar -->
      <TopBar></TopBar>
  
      <Calendar></Calendar>
      
      <!-- Footer -->
      <Footer></Footer>
    </div>
  </template>
  
  <script>
  import Footer from '@/components/footer.vue';
  import TopBar from '@/components/top_bar.vue';
  import Calendar from '@/components/calendar.vue';
  
  export default {
    name: 'TimeView',
    components: {
      Footer,
      TopBar,
      Calendar
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