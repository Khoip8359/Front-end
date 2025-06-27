import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    email: '',
    role: '',
    name: '',
    isAuthenticated: false
  }),
  actions: {
    login(email, role, name) {
      this.email = email
      this.role = role
      this.name = name
      this.isAuthenticated = true
    },
    logout() {
      this.email = ''
      this.role = ''
      this.name = ''
      this.isAuthenticated = false
    }
  },
  persist: true // ✅ hoặc cấu hình chi tiết: persist: { enabled: true, ... }
})
