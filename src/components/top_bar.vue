<template>
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
</template>