<template>
    <!-- Banner Slider -->
        <div id="bannerCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
            <div class="carousel-item active">
            <img src="/src/assets/img/banner1.jpg" class="d-block w-100" alt="Banner 1">
            </div>
            <div class="carousel-item">
            <img src="/src/assets/img/banner2.jpg" class="d-block w-100" alt="Banner 2">
            </div>
            <div class="carousel-item">
            <img src="/src/assets/img/banner3.jpg" class="d-block w-100" alt="Banner 3">
            </div>
        </div>

        <button class="carousel-control-prev" type="button" data-bs-target="#bannerCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#bannerCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
        </div>
</template>

<style scoped>
.carousel img {
  height: 200px;
}
</style>