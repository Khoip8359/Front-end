<template>
    <div class="transaction-history-container">
      <div class="header">
        <h1>
          <i class="fas fa-history"></i>
          Lịch sử giao dịch
        </h1>
        <p class="subtitle">Xem lại các giao dịch đã thực hiện</p>
      </div>
  
      <div class="content">
        <!-- Filter Section -->
        <div class="filter-section">
          <div class="filter-group">
            <select v-model="statusFilter" class="filter-select">
              <option value="">Tất cả trạng thái</option>
              <option value="completed">Hoàn thành</option>
              <option value="pending">Đang xử lý</option>
              <option value="failed">Thất bại</option>
            </select>
            <button @click="refreshHistory" class="refresh-btn" :disabled="isLoading">
              <i :class="isLoading ? 'fas fa-spinner fa-spin' : 'fas fa-sync-alt'"></i>
              Làm mới
            </button>
          </div>
          <div class="summary-stats">
            <div class="stat-item">
              <span class="stat-label">Tổng giao dịch</span>
              <span class="stat-value">{{ totalTransactions }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Tổng tiền</span>
              <span class="stat-value">{{ formatCurrency(totalAmount) }}</span>
            </div>
          </div>
        </div>
  
        <!-- Loading State -->
        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner">
            <div class="spinner"></div>
          </div>
          <p>Đang tải lịch sử giao dịch...</p>
        </div>
  
        <!-- Empty State -->
        <div v-else-if="filteredTransactions.length === 0" class="empty-state">
          <div class="empty-icon">
            <i class="fas fa-receipt"></i>
          </div>
          <h3>Chưa có giao dịch nào</h3>
          <p>Bạn chưa thực hiện giao dịch nào hoặc không tìm thấy giao dịch phù hợp với bộ lọc.</p>
          <button @click="refreshHistory" class="refresh-empty-btn">
            <i class="fas fa-sync-alt"></i>
            Làm mới
          </button>
        </div>
  
        <!-- Transaction List -->
        <div v-else class="transaction-list">
          <div 
            v-for="transaction in filteredTransactions" 
            :key="transaction.transactionId"
            class="transaction-card"
            :class="getTransactionStatusClass(transaction.status)"
          >
            <div class="transaction-header">
              <div class="transaction-info">
                <h3 class="transaction-title">
                  {{ getPackageDisplayName(transaction.package) }}
                </h3>
                <p class="transaction-id">#{{ String(transaction.transactionId).padStart(6, '0') }}</p>
              </div>
              <div class="transaction-amount">
                <span class="amount">{{ formatCurrency(transaction.total) }}</span>
                <span class="status-badge" :class="transaction.status">
                  <i :class="getStatusIcon(transaction.status)"></i>
                  {{ getStatusText(transaction.status) }}
                </span>
              </div>
            </div>
  
            <div class="transaction-details">
              <div class="detail-row">
                <span class="detail-label">
                  <i class="fas fa-calendar-alt"></i>
                  Thời gian
                </span>
                <span class="detail-value">{{ formatDate(transaction.createdDate) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">
                  <i class="fas fa-user"></i>
                  Người mua
                </span>
                <span class="detail-value">{{ transaction.user?.name || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">
                  <i class="fas fa-envelope"></i>
                  Email
                </span>
                <span class="detail-value">{{ transaction.user?.email || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">
                  <i class="fas fa-phone"></i>
                  Điện thoại
                </span>
                <span class="detail-value">{{ transaction.user?.phone || 'N/A' }}</span>
              </div>
            </div>
  
            <div class="transaction-actions">
              <button 
                v-if="transaction.status === 'completed'"
                @click="downloadReceipt(transaction)" 
                class="action-btn download-btn"
              >
                <i class="fas fa-download"></i>
                Tải biên lai
              </button>
            </div>
          </div>
        </div>
  
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button 
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="pagination-btn"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="page-numbers">
            <button
              v-for="page in getVisiblePages()"
              :key="page"
              @click="currentPage = page"
              :class="['page-btn', { active: page === currentPage }]"
            >
              {{ page }}
            </button>
          </div>
          <button 
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="pagination-btn"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
  
      <!-- Toast notification -->
      <Transition name="toast">
        <div v-if="showToast" class="toast" :class="toastType">
          <i :class="toastIcon"></i>
          <span>{{ toastMessage }}</span>
          <button @click="showToast = false" class="toast-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </Transition>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { paymentService } from '../services/paymentService'
  import { useAuthStore } from '@/stores/auth'
  
  const authStore = useAuthStore()
  const userId = computed(() => authStore.user?.user?.userId)
  
  // Reactive data
  const historyTransaction = ref([])
  const isLoading = ref(false)
  const statusFilter = ref('')
  const currentPage = ref(1)
  const itemsPerPage = 10
  
  // Toast
  const showToast = ref(false)
  const toastMessage = ref('')
  const toastType = ref('success')
  
  // Computed properties
  const filteredTransactions = computed(() => {
    let filtered = historyTransaction.value
    
    if (statusFilter.value) {
      filtered = filtered.filter(t => t.status === statusFilter.value)
    }
    
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    
    return filtered.slice(start, end)
  })
  
  const totalPages = computed(() => {
    const filtered = statusFilter.value 
      ? historyTransaction.value.filter(t => t.status === statusFilter.value)
      : historyTransaction.value
    return Math.ceil(filtered.length / itemsPerPage)
  })
  
  const totalTransactions = computed(() => {
    return statusFilter.value 
      ? historyTransaction.value.filter(t => t.status === statusFilter.value).length
      : historyTransaction.value.length
  })
  
  const totalAmount = computed(() => {
    const filtered = statusFilter.value 
      ? historyTransaction.value.filter(t => t.status === statusFilter.value)
      : historyTransaction.value
    return filtered.reduce((sum, transaction) => sum + (transaction.total || 0), 0)
  })
  
  const toastIcon = computed(() => {
    const iconMap = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    }
    return iconMap[toastType.value] || 'fas fa-info-circle'
  })
  
  // Methods
  const getHistory = async () => {
    if (!userId.value) return
    
    isLoading.value = true
    try {
      const data = await paymentService.findHistoryTransactions(userId.value)
      historyTransaction.value = data || []
    } catch (error) {
      console.error('Lỗi khi tải lịch sử giao dịch:', error)
      showToastMessage('Không thể tải lịch sử giao dịch!', 'error')
      historyTransaction.value = []
    } finally {
      isLoading.value = false
    }
  }
  
  const refreshHistory = async () => {
    await getHistory()
    showToastMessage('Đã cập nhật lịch sử giao dịch!', 'success')
  }
  
  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return '0 ₫'
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value)
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(date)
    } catch {
      return 'N/A'
    }
  }
  
  const getStatusText = (status) => {
    const statusMap = {
      'completed': 'Hoàn thành',
      'pending': 'Đang xử lý',
      'failed': 'Thất bại'
    }
    return statusMap[status] || 'Không xác định'
  }
  
  const getStatusIcon = (status) => {
    const iconMap = {
      'completed': 'fas fa-check-circle',
      'pending': 'fas fa-clock',
      'failed': 'fas fa-times-circle'
    }
    return iconMap[status] || 'fas fa-question-circle'
  }
  
  const getTransactionStatusClass = (status) => {
    return `status-${status}`
  }
  
  const getPackageDisplayName = (packageData) => {
    if (!packageData) return 'Gói dịch vụ lẻ'
    
    // Nếu có packageItems và không rỗng
    if (packageData.packageItems && packageData.packageItems.trim()) {
      return packageData.packageItems
    }
    
    // Nếu có tên package
    if (packageData.name && packageData.name.trim()) {
      return packageData.name
    }
    
    // Nếu có ID package
    if (packageData.id) {
      return `Gói #${packageData.id}`
    }
    
    return 'Gói dịch vụ'
  }
  
  const getVisiblePages = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages.value, start + maxVisible - 1)
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    return pages
  }
  
  const downloadReceipt = (transaction) => {
    
  }
  
  const showToastMessage = (message, type = 'success') => {
    toastMessage.value = message
    toastType.value = type
    showToast.value = true
    
    setTimeout(() => {
      showToast.value = false
    }, 4000)
  }
  
  // Lifecycle
  onMounted(() => {
    getHistory()
  })
  </script>
  
  <style scoped>
  * {
    box-sizing: border-box;
  }
  
  .transaction-history-container {
    max-width: 1000px;
    margin: 20px auto;
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  .header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 40px 32px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  
  .header::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: float 6s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
  
  .header h1 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 8px;
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  
  .subtitle {
    font-size: 16px;
    opacity: 0.9;
    position: relative;
    z-index: 1;
    margin: 0;
  }
  
  .content {
    padding: 32px;
  }
  
  .filter-section {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 32px;
    border: 1px solid #e2e8f0;
  }
  
  .filter-group {
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    align-items: center;
    flex-wrap: wrap;
  }
  
  .filter-select {
    padding: 12px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 14px;
    background: white;
    color: #1e293b;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 160px;
  }
  
  .filter-select:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  .refresh-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
  
  .refresh-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
  
  .refresh-btn:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  .summary-stats {
    display: flex;
    gap: 48px;
  }
  
  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .stat-label {
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
  }
  
  .stat-value {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
  }
  
  .loading-state {
    text-align: center;
    padding: 80px 20px;
    color: #64748b;
  }
  
  .loading-spinner {
    margin-bottom: 24px;
  }
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #e2e8f0;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .empty-state {
    text-align: center;
    padding: 80px 20px;
    color: #64748b;
  }
  
  .empty-icon {
    font-size: 64px;
    margin-bottom: 24px;
    color: #e2e8f0;
  }
  
  .empty-state h3 {
    font-size: 20px;
    color: #1e293b;
    margin-bottom: 12px;
    font-weight: 600;
  }
  
  .empty-state p {
    margin-bottom: 24px;
    line-height: 1.6;
  }
  
  .refresh-empty-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
  }
  
  .refresh-empty-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
  
  .transaction-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .transaction-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 24px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .transaction-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: #e2e8f0;
    transition: all 0.3s ease;
  }
  
  .transaction-card:hover {
    border-color: #667eea;
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.15);
  }
  
  .transaction-card.status-completed::before {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }
  
  .transaction-card.status-pending::before {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }
  
  .transaction-card.status-failed::before {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  }
  
  .transaction-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
  }
  
  .transaction-info h3 {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 6px;
    line-height: 1.4;
  }
  
  .transaction-id {
    font-size: 13px;
    color: #64748b;
    font-family: 'JetBrains Mono', monospace;
    background: #f1f5f9;
    padding: 4px 8px;
    border-radius: 6px;
    display: inline-block;
  }
  
  .transaction-amount {
    text-align: right;
  }
  
  .amount {
    display: block;
    font-size: 22px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 12px;
  }
  
  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
  }
  
  .status-badge.completed {
    background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
    color: #166534;
  }
  
  .status-badge.pending {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #92400e;
  }
  
  .status-badge.failed {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
    color: #991b1b;
  }
  
  .transaction-details {
    display: grid;
    gap: 16px;
    margin-bottom: 24px;
  }
  
  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f1f5f9;
  }
  
  .detail-row:last-child {
    border-bottom: none;
  }
  
  .detail-label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
    min-width: 140px;
  }
  
  .detail-label i {
    width: 16px;
    text-align: center;
  }
  
  .detail-value {
    font-size: 14px;
    color: #1e293b;
    font-weight: 500;
    text-align: right;
    flex: 1;
  }
  
  .detail-value.highlight {
    color: #667eea;
    font-weight: 600;
  }
  
  .transaction-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }
  
  .action-btn {
    padding: 10px 16px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    border: none;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
  }
  
  .view-btn {
    background: #f8fafc;
    color: #475569;
    border: 1px solid #e2e8f0;
  }
  
  .view-btn:hover {
    background: #e2e8f0;
    transform: translateY(-1px);
  }
  
  .download-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
  
  .download-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 40px;
  }
  
  .pagination-btn {
    background: #f8fafc;
    color: #64748b;
    border: 1px solid #e2e8f0;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .pagination-btn:hover {
    background: #667eea;
    color: white;
    border-color: #667eea;
  }
  
  .pagination-btn:disabled {
    background: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
    border-color: #e2e8f0;
  }
  
  .page-numbers {
    display: flex;
    gap: 4px;
    margin: 0 8px;
  }
  
  .page-btn {
    background: #f8fafc;
    color: #64748b;
    border: 1px solid #e2e8f0;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
    min-width: 40px;
  }
  
  .page-btn:hover {
    background: #e2e8f0;
    color: #1e293b;
  }
  
  .page-btn.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-color: #667eea;
  }
  
  .toast {
    position: fixed;
    top: 24px;
    right: 24px;
    padding: 16px 20px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: white;
    font-weight: 500;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    max-width: 400px;
    min-width: 300px;
  }
  
  .toast.success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }
  
  .toast.error {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  }
  
  .toast.warning {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }
  
  .toast.info {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  }
  
  .toast-close {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 4px;
    margin-left: auto;
    border-radius: 4px;
    transition: all 0.2s ease;
  }
  
  .toast-close:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .toast-enter-active, .toast-leave-active {
    transition: all 0.3s ease;
  }
  
  .toast-enter-from {
    transform: translateX(100%);
    opacity: 0;
  }
  
  .toast-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }
  
  @media (max-width: 768px) {
    .transaction-history-container {
      margin: 10px;
    }
    
    .header {
      padding: 24px 20px;
    }
    
    .content {
      padding: 24px 20px;
    }
    
    .filter-group {
      flex-direction: column;
      align-items: stretch;
    }
    
    .summary-stats {
      justify-content: center;
    }
    
    .transaction-header {
      flex-direction: column;
      gap: 16px;
    }
    
    .transaction-amount {
      text-align: left;
    }
    
    .detail-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
    
    .transaction-actions {
      flex-direction: column;
    }
  }
  </style>