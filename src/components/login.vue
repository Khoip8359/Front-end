<template>
  <div class="vh-100 d-flex justify-content-center align-items-center bg-light">
    <div class="card p-4 shadow" style="min-width: 320px; max-width: 400px; width: 100%;">
      <h3 class="text-center mb-4">Login</h3>
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="email" class="form-label">Email address</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="form-control"
            placeholder="Enter your email"
            required
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="form-control"
            placeholder="Enter your password"
            required
          />
        </div>
        <RouterLink to="/" type="submit" class="btn btn-primary w-100">Login</RouterLink>
      </form>
      <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router';

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    handleSubmit() {
      this.errorMessage = "";
      if (!this.email || !this.password) {
        this.errorMessage = "Please enter both email and password.";
        return;
      }
      // Ví dụ xử lý đăng nhập giả lập
      if (this.email === "user@example.com" && this.password === "123456") {
        alert("Login successful!");
        // Chuyển hướng hoặc gọi API
      } else {
        this.errorMessage = "Invalid email or password.";
      }
    },
  },
};
</script>

<style scoped>
body, html {
  margin: 0;
  height: 100%;
}
</style>
