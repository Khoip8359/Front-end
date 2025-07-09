<template>
  <div class="page-container d-flex flex-column min-vh-100">
    <!-- Top Bar -->
    <top_bar></top_bar>

    <RouterView></RouterView>
    
    <!-- Footer -->
    <Footer></Footer>

    <!-- Floating Chat Button -->
    <div class="position-fixed bottom-0 end-0 p-4" style="z-index: 1050;">
      <button class="btn btn-primary rounded-circle shadow-lg chat-btn" @click="showChat = !showChat" data-bs-toggle="tooltip" data-bs-placement="left" title="Trò chuyện">
        <i class="bi bi-chat-dots"></i>
      </button>
      <div v-if="showChat" class="chat-box card shadow-lg border-0" style="width: 350px; position: absolute; bottom: 80px; right: 0; z-index: 1100;">
        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center py-2 px-3">
          <span><i class="bi bi-chat-dots me-2"></i>Hỗ trợ trực tuyến</span>
          <button class="btn btn-sm btn-light" @click="showChat = false"><i class="bi bi-x"></i></button>
        </div>
        <div class="card-body p-3 chat-messages" style="height: 220px; overflow-y: auto; background: #f8f9fa;">
          <div v-for="(msg, idx) in messages" :key="idx" :class="['mb-2', msg.from === 'user' ? 'text-end' : 'text-start']">
            <span class="badge bg-secondary" v-if="msg.from === 'bot'">Bot</span>
            <span class="badge bg-primary" v-if="msg.from === 'user'">user{{ msg.userId ? msg.userId : '' }}</span>
            <div class="d-inline-block px-2 py-1 rounded bg-white border mt-1" style="max-width: 80%; word-break: break-word;">
              {{msg.text}}
            </div>
          </div>
        </div>
        <div class="card-footer p-2 bg-white border-0">
          <form @submit.prevent="sendMessage" class="d-flex align-items-center gap-2">
            <input v-model="input" type="text" class="form-control form-control-sm" placeholder="Nhập tin nhắn..." @keydown.enter.exact.prevent="sendMessage" />
            <button type="submit" class="btn btn-primary btn-sm"><i class="bi bi-send"></i></button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Footer from '@/components/footer.vue';
import top_bar from '@/components/top_bar.vue';
import { chatService } from '../services/chatService';
import { useAuthStore } from '@/stores/auth';

const showChat = ref(false);
const input = ref('');
const messages = ref([]);
const helpId = ref();

const authStore = useAuthStore()
const userId = computed(() => authStore.user?.user?.userId)

onMounted(async () => {
  // Lấy lịch sử chat theo userId
  if (userId.value) {
    try {
      const history = await chatService.fetchChatHistoryByUser(userId.value);
      messages.value = history.map(item => ({
        from: 'user',
        text: item.detail,
        time: item.helpTime
      }));
    } catch (e) {
      messages.value = [{ from: 'bot', text: 'Xin chào! Bạn cần hỗ trợ gì?' }];
    }
  } else {
    messages.value = [{ from: 'bot', text: 'Xin chào! Bạn cần hỗ trợ gì?' }];
  }
  chatService.connect((msg) => {
    messages.value.push(msg);
  });
});

function sendMessage() {
  if (input.value.trim() === '') return;
  const msg = { from: 'user', text: input.value, userId: userId.value };
  chatService.sendMessage(msg);
  input.value = '';
}
</script>

<style scoped>

.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.chat-box {
  animation: fadeInUp 0.3s;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.chat-messages {
  font-size: 0.97rem;
}
</style>