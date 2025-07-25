<template>
  <div class="payment-container">
    <div class="header">
      <h1>
        <i class="fas fa-wallet"></i>
        Mua các gói giao dịch
      </h1>
      <p class="subtitle">Quét mã QR để thực hiện giao dịch</p>
    </div>

    <div class="content">
      <div class="account-section">
        <div class="account-info">
          <div class="info-row">
            <span class="info-label">Người nhận</span>
            <span class="info-value account-name">{{ accountName }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Số tài khoản</span>
            <div class="account-number-group">
              <span class="info-value">{{ maskedAccountNumber }}</span>
              <button 
                class="copy-btn" 
                @click="copyAccountNumber"
                :disabled="isCopying"
              >
                <i :class="isCopying ? 'fas fa-check' : 'fas fa-copy'"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="instructions">
        <h3>
          <i class="fas fa-info-circle"></i>
          Hướng dẫn thanh toán
        </h3>
        <ol>
          <li v-for="step in instructionSteps" :key="step.id">
            {{ step.text }}
          </li>
        </ol>
        <small class="text-danger">*Lưu ý, giá trị quy đổi là 100-1 ( 10.000 VNĐ ~ 100 point) </small>
      </div>

      <div class="amount-section" v-if="showAmountInput">
        <h3>
          <i class="fas fa-money-bill-wave"></i>
          Số tiền giao dịch
        </h3>
        <div class="amount-input-group">
          <input 
            v-model="amount" 
            type="number" 
            placeholder="Nhập số tiền"
            class="amount-input"
            min="10000"
            step="1000"
            @input="onAmountChange"
          />
          <span class="currency">VNĐ</span>
        </div>
        <div class="quick-amounts">
          <button 
            v-for="quickAmount in quickAmounts" 
            :key="quickAmount"
            @click="selectQuickAmount(quickAmount)"
            class="quick-amount-btn"
            :class="{ active: amount == quickAmount }"
          >
            {{ formatCurrency(quickAmount) }}
          </button>
        </div>
        
        <!-- Nút xác nhận thanh toán -->
        <div class="confirmation-section" v-if="canProcess">
          <button 
            class="confirm-payment-btn"
            @click="confirmPayment"
            :disabled="isProcessing"
          >
            <i :class="isProcessing ? 'fas fa-spinner fa-spin' : 'fas fa-check-circle'"></i>
            {{ isProcessing ? 'Đang xử lý...' : 'Xác nhận thanh toán' }}
          </button>
        </div>
      </div>

      <div class="qr-section" v-if="showQR">
        <div class="payment-confirmed-info">
          <div class="confirmed-amount">
            <h4>Số tiền đã xác nhận</h4>
            <span class="amount-display">{{ formatCurrency(confirmedAmount) }}</span>
          </div>
          <!-- Countdown timer -->
          <div class="countdown-timer" v-if="timeRemaining > 0">
            <i class="fas fa-clock"></i>
            <span>Mã QR sẽ hết hạn sau: <strong>{{ formatTime(timeRemaining) }}</strong></span>
          </div>
          <div class="countdown-timer expired" v-else>
            <i class="fas fa-exclamation-triangle"></i>
            <span>Mã QR đã hết hạn</span>
          </div>
        </div>
        <div class="qr-container" :class="{ expired: timeRemaining <= 0 }">
          <img 
            :src="qrCodeUrl" 
            alt="QR Code" 
            class="qr-image"
            :class="{ pulse: isAnimating && timeRemaining > 0, expired: timeRemaining <= 0 }"
          />
          <div v-if="timeRemaining <= 0" class="expired-overlay">
            <i class="fas fa-times-circle"></i>
            <span>Hết hạn</span>
          </div>
        </div>
        <div class="qr-actions">
          <button class="change-amount-btn" @click="changeAmount">
            <i class="fas fa-edit"></i>
            Thay đổi số tiền
          </button>
        </div>
      </div>

      <div class="action-buttons text-center">
        <RouterLink to="/payment/history" class="btn-success btn">Lịch sử giao dịch</RouterLink>
      </div>
    </div>

    <div class="footer">
      <div class="support-info">
        <i class="fas fa-headset"></i>
        <span>Hỗ trợ 24/7: <strong>{{ supportPhone }}</strong></span>
      </div>
    </div>

    <!-- Toast notification -->
    <div v-if="showToast" class="toast" :class="toastType">
      <i :class="toastIcon"></i>
      <span>{{ toastMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { paymentService } from '../services/paymentService'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const userId = computed(() => authStore.user?.user?.userId)

// Props
const props = defineProps({
  qrCodeUrl: {
    type: String,
    default: ''
  },
  accountName: {
    type: String,
    default: 'PHẠM NGỌC NGUYÊN KHÔI'
  },
  accountNumber: {
    type: String,
    default: '0858321119'
  },
  supportPhone: {
    type: String,
    default: '1900 xxxx'
  },
  showAmountInput: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['payment-selected', 'payment-processed', 'account-copied', 'payment-confirmed'])

// Reactive data
const amount = ref('')
const confirmedAmount = ref(0)
const isCopying = ref(false)
const isProcessing = ref(false)
const isAnimating = ref(true)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')
const showQR = ref(false)
const qrCodeUrl = ref(props.qrCodeUrl)
const transactionId = ref()

// Timer related
const timeRemaining = ref(0)
const countdownTimer = ref(null)
const QR_TIMEOUT_MINUTES = 5

// Instructions
const instructionSteps = ref([
  { id: 1, text: 'Nhập số tiền muốn nạp' },
  { id: 2, text: 'Nhấn "Xác nhận thanh toán" để tạo mã QR' },
  { id: 3, text: 'Mở ứng dụng ngân hàng hoặc ví điện tử' },
  { id: 4, text: 'Chọn chức năng quét mã QR' },
  { id: 5, text: 'Quét mã QR hiển thị và xác nhận giao dịch' }
])

// Quick amounts
const quickAmounts = ref([50000, 100000, 200000, 500000])

// Computed
const maskedAccountNumber = computed(() => {
  const number = props.accountNumber
  return `*******${number.slice(-3)}`
})

const canProcess = computed(() => {
  return amount.value && amount.value >= 10000 && !showQR.value
})

const toastIcon = computed(() => {
  return toastType.value === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'
})

// Methods
const copyAccountNumber = async () => {
  try {
    await navigator.clipboard.writeText(props.accountNumber)
    isCopying.value = true
    showToastMessage('Đã sao chép số tài khoản!', 'success')
    emit('account-copied', props.accountNumber)
    
    setTimeout(() => {
      isCopying.value = false
    }, 2000)
  } catch (error) {
    showToastMessage('Không thể sao chép!', 'error')
  }
}

const selectQuickAmount = (quickAmount) => {
  amount.value = quickAmount
}

const onAmountChange = () => {
  // Reset QR when amount changes
  if (showQR.value) {
    resetQRState()
  }
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN').format(value) + 'đ'
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const startCountdown = () => {
  timeRemaining.value = QR_TIMEOUT_MINUTES * 60 // 5 minutes in seconds
  
  countdownTimer.value = setInterval(() => {
    timeRemaining.value--
    
    // Warning at 1 minute
    if (timeRemaining.value === 60) {
      showToastMessage('Mã QR sẽ hết hạn sau 1 phút!', 'warning')
    }
    
    // Expired
    if (timeRemaining.value <= 0) {
      handleQRExpired()
    }
  }, 1000)
}

const stopCountdown = () => {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value)
    countdownTimer.value = null
  }
  timeRemaining.value = 0
}

const handleQRExpired = () => {
  stopCountdown()
  showToastMessage('Mã QR đã hết hạn. Vui lòng tạo mã QR mới!', 'error')
  
  // Auto reset after 3 seconds
  setTimeout(() => {
    resetQRState()
  }, 3000)
}

const resetQRState = () => {
  showQR.value = false
  confirmedAmount.value = 0
  qrCodeUrl.value = ''
  transactionId.value = null
  stopCountdown()
}

const confirmPayment = async () => {
  const value = Number(amount.value)
  if (value && value >= 10000) {
    isProcessing.value = true
    try {
      const response = await paymentService.addNewTransaction(value, userId.value)
      transactionId.value = response.transactionId

      qrCodeUrl.value = await paymentService.createVietQR({
        amount: value,
        content: `NAP ${transactionId.value}`,
        bank: 'MB',
        account_number: props.accountNumber
      })
      
      confirmedAmount.value = value
      showQR.value = true
      startCountdown() // Start the 5-minute countdown
      showToastMessage('Đã tạo mã QR thành công!', 'success')
      emit('payment-confirmed', { amount: value, qrCodeUrl: qrCodeUrl.value })
      
    } catch (e) {
      showToastMessage('Không tạo được mã QR!', 'error')
      showQR.value = false
    } finally {
      isProcessing.value = false
    }
  } else {
    showToastMessage('Vui lòng nhập số tiền hợp lệ (>= 10.000 VNĐ)', 'error')
  }
}

const changeAmount = () => {
  resetQRState()
  showToastMessage('Vui lòng nhập số tiền mới và xác nhận lại', 'info')
}

const showToastMessage = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Lifecycle
onMounted(() => {
  // Component initialization
})

onUnmounted(() => {
  // Clean up timer when component is destroyed
  stopCountdown()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.payment-container {
  margin: 20px auto;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  position: relative;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  padding: 32px 24px;
  text-align: center;
  position: relative;
}

.header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="white" opacity="0.1"/><circle cx="80" cy="40" r="1" fill="white" opacity="0.1"/><circle cx="40" cy="80" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.header h1 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
}

.subtitle {
  font-size: 14px;
  opacity: 0.9;
  position: relative;
  z-index: 1;
}

.content {
  padding: 32px 24px;
}

.confirmation-section {
  margin-top: 20px;
  text-align: center;
}

.confirm-payment-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 200px;
  justify-content: center;
}

.confirm-payment-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
}

.confirm-payment-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.payment-confirmed-info {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border: 1px solid #86efac;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.confirmed-amount h4 {
  color: #065f46;
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 500;
}

.amount-display {
  color: #059669;
  font-size: 24px;
  font-weight: 700;
}

.countdown-timer {
  margin-top: 16px;
  padding: 12px 16px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  color: #1e40af;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.countdown-timer.expired {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
  color: #dc2626;
}

.countdown-timer strong {
  font-weight: 700;
  font-size: 16px;
}

.qr-section {
  text-align: center;
  margin-bottom: 32px;
}

.qr-container {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}

.qr-container.expired {
  background: #fef2f2;
  border-color: #fecaca;
}

.qr-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 49%, rgba(99, 102, 241, 0.05) 50%, transparent 51%);
}

.qr-image {
  width: 200px;
  height: 200px;
  object-fit: contain;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: white;
  position: relative;
  z-index: 1;
  transition: all 0.3s;
}

.qr-image.expired {
  opacity: 0.3;
  filter: grayscale(100%);
}

.expired-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(239, 68, 68, 0.9);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  z-index: 2;
}

.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.qr-actions {
  text-align: center;
}

.change-amount-btn {
  background: white;
  color: #6b7280;
  border: 2px solid #e5e7eb;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.change-amount-btn:hover {
  border-color: #4f46e5;
  color: #4f46e5;
}

.account-section {
  background: #f1f5f9;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  border-left: 4px solid #4f46e5;
}

.account-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.info-value {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.account-name {
  color: #4f46e5;
  font-size: 16px;
}

.account-number-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.copy-btn {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: #3730a3;
  transform: translateY(-1px);
}

.copy-btn:disabled {
  background: #059669;
  cursor: not-allowed;
}

.instructions {
  background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.instructions h3 {
  color: #059669;
  font-size: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.instructions ol {
  color: #047857;
  font-size: 14px;
  line-height: 1.6;
  padding-left: 20px;
}

.instructions li {
  margin-bottom: 8px;
}

.amount-section {
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.amount-section h3 {
  color: #ea580c;
  font-size: 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.amount-input-group {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.amount-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  background: white;
}

.amount-input:focus {
  outline: none;
  border-color: #4f46e5;
}

.currency {
  padding: 12px 16px;
  background: #f1f5f9;
  border: 2px solid #e2e8f0;
  border-left: none;
  border-radius: 0 8px 8px 0;
  font-weight: 600;
  color: #64748b;
}

.quick-amounts {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.quick-amount-btn {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  color: #64748b;
}

.quick-amount-btn:hover {
  border-color: #4f46e5;
  color: #4f46e5;
}

.quick-amount-btn.active {
  background: #4f46e5;
  border-color: #4f46e5;
  color: white;
}

.action-buttons {
  margin-bottom: 24px;
}

.primary-btn {
  width: 100%;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.3);
}

.primary-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.primary-btn.loading {
  background: #6366f1;
}

.footer {
  background: #f8fafc;
  padding: 20px 24px;
  text-align: center;
  border-top: 1px solid #e2e8f0;
}

.support-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 13px;
}

.security-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #059669;
  font-size: 12px;
  margin-top: 8px;
}

.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #10b981;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.toast.error {
  background: #ef4444;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.toast.info {
  background: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.toast.warning {
  background: #f59e0b;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 480px) {
  .payment-container {
    margin: 10px;
  }
  
  .header {
    padding: 24px 20px;
  }
  
  .content {
    padding: 24px 20px;
  }
  
  .qr-image {
    width: 180px;
    height: 180px;
  }
  
  .payment-methods {
    flex-wrap: wrap;
  }
  
  .method-card {
    flex: 1;
    min-width: 100px;
  }
  
  .confirm-payment-btn {
    min-width: auto;
    width: 100%;
  }
}
</style>