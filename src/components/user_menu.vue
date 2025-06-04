<template>
  <nav class="navbar navbar-expand-lg navbar-light custom-bg-lightblue">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Game</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#gameNav"
        aria-controls="gameNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-center" id="gameNav">
        <ul class="navbar-nav mb-2 mb-lg-0">
          <li v-for="category in categories" :key="category.categoryId" class="nav-item">
            <a class="nav-link" href="#">{{ category.categoryName }}</a>
          </li> 
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const categories = ref([])

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/categories')
    categories.value = res.data
  } catch (error) {
    console.error('Lấy danh mục thất bại:', error)
  }
})
</script>

<style>
.custom-bg-lightblue {
  background-color: #85c1e9 !important;
}
</style>
