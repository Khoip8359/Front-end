<template>
  <div class="page-container d-flex flex-column min-vh-100">
    <!-- Top Bar -->
    <top_bar></top_bar>

    <!-- Main Content -->
    <div class="main-content">
      <RouterView></RouterView>
    </div>
    
    <!-- Footer -->
    <Footer></Footer>

    <!-- Floating Chat Button -->
    <div class="position-fixed bottom-0 end-0 p-4" style="z-index: 1050;">
      <button class="btn btn-primary rounded-circle shadow-lg chat-btn" @click="showChat = !showChat" data-bs-toggle="tooltip" data-bs-placement="left" title="Trò chuyện">
        <i class="bi bi-chat-dots"></i>
      </button>
      <div v-if="showChat" class="chat-box card shadow-lg border-0" style="width: 400px; position: absolute; bottom: 80px; right: 0; z-index: 1100;">
        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center py-2 px-3">
          <span><i class="bi bi-chat-dots me-2"></i>Hỗ trợ trực tuyến</span>
          <button class="btn btn-sm btn-light" @click="showChat = false"><i class="bi bi-x"></i></button>
        </div>
        
        <!-- Conversation List -->
        <div v-if="!selectedConversation" class="card-body p-3" style="height: 220px; overflow-y: auto; background: #f8f9fa;">
          <div class="conversation-header mb-3">
            <h6 class="text-primary mb-2">
              <i class="bi bi-chat-dots me-2"></i>
              Hội thoại hiện tại
            </h6>
            <div class="current-conversation mb-3">
              <span class="badge bg-primary">{{ currentConversation }}</span>
            </div>
            <button @click="startChat" class="btn btn-primary btn-sm w-100 mb-3">
              <i class="bi bi-plus-circle me-2"></i>
              Bắt đầu chat với kiểm duyệt viên
            </button>
          </div>
          
          <div class="conversations-section">
            <h6 class="text-secondary mb-2">
              <i class="bi bi-list-ul me-2"></i>
              Hội thoại của bạn:
            </h6>
            <div class="conversation-list">
              <div v-for="conv in conversations" :key="conv.merge" class="conversation-item mb-2">
                <button @click="selectConversation(conv.merge)" class="btn btn-outline-primary btn-sm w-100 text-start conversation-btn">
                  <i class="bi bi-chat me-2"></i>
              Hội thoại với user {{ getOtherUserId(conv.merge) }}
                  <span class="badge bg-secondary ms-2">{{ conv.merge }}</span>
            </button>
          </div>
              <div v-if="conversations.length === 0" class="text-center text-muted py-3">
                <i class="bi bi-inbox display-6 text-muted"></i>
                <p class="mt-2 mb-0">Chưa có hội thoại nào</p>
                <small>Bắt đầu chat để tạo hội thoại mới</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Messages -->
        <div v-if="selectedConversation" class="card-body p-3 chat-messages" style="height: 220px; overflow-y: auto; background: #f8f9fa;">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="mb-0 text-primary">
              <i class="bi bi-chat-dots me-2"></i>
              Hội thoại: {{ selectedConversation }}
            </h6>
            <button @click="backToConversations" class="btn btn-sm btn-outline-secondary">
              <i class="bi bi-arrow-left"></i>
            </button>
          </div>
          
          <div class="messages-container">
            <div v-for="(msg, idx) in messages" :key="idx" class="message-item mb-3">
              <!-- Bot Message -->
              <div v-if="msg.from === 'bot'" class="d-flex align-items-start">
                <div class="bot-avatar me-2">
                  <i class="bi bi-robot text-primary"></i>
                </div>
                <div class="message-bubble bot-message">
                  <div class="message-header">
                    <span class="sender-name">Bot Hỗ Trợ</span>
                    <small class="message-time">{{ formatTime(msg.time) }}</small>
                  </div>
                  <div class="message-content">{{ msg.text }}</div>
                </div>
              </div>
              
              <!-- User Message -->
              <div v-else>
                <!-- Other User Message (Left) -->
                <div v-if="!isCurrentUserMessage(msg)" class="d-flex align-items-start">
                  <div class="user-avatar me-2">
                    <i class="bi bi-person-circle text-secondary"></i>
                  </div>
                  <div class="message-bubble other-user-message">
                    <div class="message-header">
                      <span class="sender-name">User {{ msg.sender || msg.userId || 'Unknown' }}</span>
                      <small class="message-time">{{ formatTime(msg.time) }}</small>
                    </div>
                    <div class="message-content">{{ msg.text }}</div>
                  </div>
                </div>
                
                <!-- Current User Message (Right) -->
                <div v-else class="d-flex align-items-start justify-content-end">
                  <div class="message-bubble current-user-message">
                    <div class="message-header">
                      <span class="sender-name">Bạn</span>
                      <small class="message-time">{{ formatTime(msg.time) }}</small>
                    </div>
                    <div class="message-content">{{ msg.text }}</div>
                  </div>
                  <div class="user-avatar ms-2">
                    <i class="bi bi-person-circle text-primary"></i>
                  </div>
                </div>
              </div>
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
import { ref, onMounted, computed, watch } from 'vue';
import Footer from '@/components/footer.vue';
import top_bar from '@/components/top_bar.vue';
import { chatService } from '../services/chatService';
import { useAuthStore } from '@/stores/auth.js';

const auth = useAuthStore();
const showChat = ref(false);
const input = ref('');
const messages = ref([]);
const conversations = ref([]);
const selectedConversation = ref(null);
const defaultOtherUserId = ref(3); // User mặc định để chat cùng
const currentConversation = ref(null); // Hội thoại hiện tại

// Computed property để lấy currentUserId an toàn
const currentUserId = computed(() => {
  return auth.currentUser?.user?.userId || null;
});

watch(currentUserId, async (newUserId) => {
  if (newUserId) {
    console.log('User đã đăng nhập, khởi tạo chat service');
    chatService.setCurrentUserId(newUserId);
    await initializeChat();
  } else {
    console.log('User đã đăng xuất, reset chat');
    conversations.value = [];
    messages.value = [];
    selectedConversation.value = null;
    currentConversation.value = null;
  }
}, { immediate: true });

// Hàm khởi tạo chat
async function initializeChat() {
  if (!currentUserId.value) {
    console.warn('User chưa đăng nhập, không thể khởi tạo chat');
    alert("Vui lòng đăng nhập để chat")
    return;
  }
  
  // Lấy danh sách hội thoại của user hiện tại
  try {
    const allConversations = await chatService.fetchConversationsByUserId(currentUserId.value);
    // Lọc chỉ những hội thoại mà user hiện tại tham gia
    conversations.value = allConversations.filter(conv => {
      const [userId1, userId2] = conv.merge.split('-').map(Number);
      return userId1 === currentUserId.value || userId2 === currentUserId.value;
    });
    
    // Tự động chọn hội thoại mặc định với user 3
    const defaultMerge = Math.min(currentUserId.value, defaultOtherUserId.value) + "-" + Math.max(currentUserId.value, defaultOtherUserId.value);
    currentConversation.value = defaultMerge;
    loadChatHistory(defaultMerge);
  } catch (e) {
    console.error('Không lấy được danh sách hội thoại:', e);
    // Nếu lỗi, vẫn tạo hội thoại mặc định
    const defaultMerge = Math.min(currentUserId.value, defaultOtherUserId.value) + "-" + Math.max(currentUserId.value, defaultOtherUserId.value);
    currentConversation.value = defaultMerge;
    messages.value = [{ from: 'bot', text: 'Xin chào! Bạn cần hỗ trợ gì?' }];
  }
  
  // Kết nối websocket
  chatService.connect((msg) => {
    messages.value.push(msg);
  });
}

function selectConversation(merge) {
  selectedConversation.value = merge;
  currentConversation.value = merge;
  loadChatHistory(merge);
}

function backToConversations() {
  selectedConversation.value = null;
  // Không reset currentConversation, vẫn giữ hội thoại hiện tại
}

async function loadChatHistory(merge) {
  try {
    const history = await chatService.fetchChatHistoryByMerge(merge);
    messages.value = history.map(item => ({
      from: 'user',
      text: item.detail,
      time: item.helpTime,
      sender: item.sender || item.userId?.toString() // Sử dụng sender từ database hoặc userId
    }));
  } catch (e) {
    messages.value = [{ from: 'bot', text: 'Xin chào! Bạn cần hỗ trợ gì?' }];
  }
}

function sendMessage() {
  if (input.value.trim() === '' || !currentConversation.value || !currentUserId.value) return;
  
  // Tách merge để lấy userId1 và userId2
  const [userId1, userId2] = currentConversation.value.split('-').map(Number);
  
  const msg = { 
    from: 'user', 
    text: input.value, 
    userId1: userId1,
    userId2: userId2,
    sender: currentUserId.value.toString() // Thêm trường sender với userId hiện tại
  };
  chatService.sendMessage(msg);
  input.value = '';
}

function startChat() {
  if (!currentUserId.value) {
    console.warn('User chưa đăng nhập, không thể bắt đầu chat');
    return;
  }
  const newMerge = Math.min(currentUserId.value, defaultOtherUserId.value) + "-" + Math.max(currentUserId.value, defaultOtherUserId.value);
  currentConversation.value = newMerge;
  selectedConversation.value = newMerge;
  loadChatHistory(newMerge);
}

function getOtherUserId(merge) {
  const [userId1, userId2] = merge.split('-').map(Number);
  if (userId1 === currentUserId.value) return userId2;
  return userId1;
}

function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const timeStr = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  
  // Kiểm tra nếu là hôm nay
  if (date.toDateString() === now.toDateString()) {
    return `Hôm nay ${timeStr}`;
  }
  
  // Kiểm tra nếu là hôm qua
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Hôm qua ${timeStr}`;
  }
  
  // Nếu là ngày khác, hiển thị đầy đủ ngày tháng
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year} ${timeStr}`;
}

function isCurrentUserMessage(msg) {
  return msg.sender === currentUserId.value.toString();
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
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.chat-messages {
  font-size: 0.9rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.messages-container {
  padding: 10px 0;
}

.message-item {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message-bubble {
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
  word-wrap: break-word;
}

.bot-message {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border-bottom-left-radius: 6px;
}

.user-message {
  background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
  color: white;
  border-bottom-right-radius: 6px;
}

.current-user-message {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border-bottom-right-radius: 6px;
}

.other-user-message {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
  color: white;
  border-bottom-left-radius: 6px;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  font-size: 0.75rem;
}

.sender-name {
  font-weight: 600;
  opacity: 0.9;
}

.message-time {
  opacity: 0.7;
  font-size: 0.7rem;
}

.message-content {
  line-height: 1.4;
  word-break: break-word;
}

.bot-avatar, .user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.bot-avatar i, .user-avatar i {
  font-size: 16px;
}

/* Chat button styling */
.chat-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
  transition: all 0.3s ease;
  animation: pulse 2s infinite;
}

.chat-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 123, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
  }
}

/* Input styling */
.card-footer input {
  border-radius: 20px;
  border: 1px solid #e9ecef;
  padding: 8px 16px;
  transition: all 0.3s ease;
}

.card-footer input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.card-footer button {
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  border: none;
  transition: all 0.3s ease;
}

.card-footer button:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

/* Conversation list styling */
.btn-outline-primary {
  border-radius: 10px;
  transition: all 0.3s ease;
  border: 1px solid #007bff;
  color: #007bff;
}

.btn-outline-primary:hover {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  border-color: #007bff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
}

.conversation-btn {
  border-radius: 12px;
  padding: 10px 15px;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
  background: white;
  color: #495057;
}

.conversation-btn:hover {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  border-color: #007bff;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
}

.conversation-item {
  transition: all 0.3s ease;
}

.conversation-item:hover {
  transform: translateX(5px);
}

.current-conversation .badge {
  font-size: 0.8rem;
  padding: 8px 12px;
  border-radius: 20px;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
}

.conversation-header h6 {
  font-weight: 600;
  color: #495057;
}

.conversations-section h6 {
  font-weight: 600;
  color: #6c757d;
}

/* Empty state styling */
.text-center.text-muted {
  opacity: 0.7;
}

.text-center.text-muted i {
  opacity: 0.5;
}

/* Badge styling */
.badge {
  font-weight: 500;
  letter-spacing: 0.5px;
}

.badge.bg-secondary {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%) !important;
}

/* Card header styling */
.card-header {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%) !important;
  border-radius: 15px 15px 0 0 !important;
  border: none;
}

.card-header button {
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  transition: all 0.3s ease;
}

.card-header button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* Scrollbar styling */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(0, 123, 255, 0.5);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 123, 255, 0.7);
}

/* Main content styling */
.main-content {
  flex: 1;
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 200px); /* Adjust based on header/footer height */
}
</style>