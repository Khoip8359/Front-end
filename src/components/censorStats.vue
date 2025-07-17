<template>
  <div class="container-fluid">
    <h1 class="mb-4">Thống kê bài viết</h1>
    <div class="row">
      <div class="col-md-8">
        <div class="card shadow-sm h-100">
          <div class="card-body d-flex align-items-center justify-content-center">
            <div>
              <Pie :data="statusPieData" :options="pieOptions" />
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card shadow-sm h-100">
          <div class="card-header">
            <h5 class="mb-0">
              {{ selectedStatusTitle }}
              <span class="badge bg-primary ms-2">{{ filteredNews.length }}</span>
            </h5>
          </div>
          <div class="card-body" style="max-height: 400px; overflow-y: auto;">
            <div v-if="filteredNews.length === 0" class="text-center text-muted py-4">
              <i class="fas fa-info-circle fa-2x mb-3"></i>
              <p>{{ selectedStatus ? 'Không có bài viết nào' : 'Bấm vào biểu đồ để xem danh sách' }}</p>
            </div>
            <div v-else>
              <div 
                v-for="news in filteredNews" 
                :key="news.id"
                class="news-item mb-3 p-3 border rounded"
                :class="[getStatusClass(news.status), { 'clickable': isPending(news.status) }]"
                @click="handleNewsClick(news)"
              >
                <h6 class="mb-1">
                  {{ news.title || 'Không có tiêu đề' }}
                  <i v-if="isPending(news.status)" class="fas fa-external-link-alt ms-2 text-primary small"></i>
                </h6>
                <p class="mb-1 text-muted small">{{ news.summary || 'Không có mô tả' }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="badge" :class="getStatusBadgeClass(news.status)">
                    {{ getStatusText(news.status) }}
                  </span>
                  <small class="text-muted">
                    {{ formatDate(news.created_at) }}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Bar, Pie } from 'vue-chartjs';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables)
import { newsService } from '@/services';
import { useRouter } from 'vue-router';

const newsList = ref([]);
const selectedStatus = ref('');
const router = useRouter();

onMounted(async () => {
  try {
    const data = await newsService.getAllNews();
    newsList.value = Array.isArray(data) ? data : [];
  } catch (err) {
    newsList.value = [];
    console.error('Lỗi tải dữ liệu:', err);
  }
});

const statusPieData = computed(() => {
  const statusCounts = { published: 0, pending: 0, rejected: 0 };
  newsList.value.forEach(news => {
    const status = (news.status || '').toLowerCase();
    if (statusCounts.hasOwnProperty(status)) {
      statusCounts[status]++;
    }
  });
  return {
    labels: ['Đã xuất bản', 'Chờ duyệt', 'Từ chối'],
    datasets: [
      {
        data: [statusCounts.published, statusCounts.pending, statusCounts.rejected],
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    }
  },
  onClick: (event, activeElements) => {
    if (activeElements.length > 0) {
      const clickedIndex = activeElements[0].index;
      const statusMap = ['published', 'pending', 'rejected'];
      selectedStatus.value = statusMap[clickedIndex];
    }
  }
};

const filteredNews = computed(() => {
  if (!selectedStatus.value) return [];
  return newsList.value.filter(news => 
    (news.status || '').toLowerCase() === selectedStatus.value
  );
});

const selectedStatusTitle = computed(() => {
  const statusTitles = {
    published: 'Bài viết đã xuất bản',
    pending: 'Bài viết chờ duyệt',
    rejected: 'Bài viết bị từ chối'
  };
  return statusTitles[selectedStatus.value] || 'Danh sách bài viết';
});

const getStatusText = (status) => {
  const statusText = {
    published: 'Đã xuất bản',
    pending: 'Chờ duyệt',
    rejected: 'Từ chối'
  };
  return statusText[status?.toLowerCase()] || 'Không xác định';
};

const getStatusBadgeClass = (status) => {
  const classes = {
    published: 'bg-success',
    pending: 'bg-warning',
    rejected: 'bg-danger'
  };
  return classes[status?.toLowerCase()] || 'bg-secondary';
};

const getStatusClass = (status) => {
  const classes = {
    published: 'border-success',
    pending: 'border-warning',
    rejected: 'border-danger'
  };
  return classes[status?.toLowerCase()] || 'border-secondary';
};

const formatDate = (dateString) => {
  if (!dateString) return 'Không có ngày';
  try {
    return new Date(dateString).toLocaleDateString('vi-VN');
  } catch {
    return 'Ngày không hợp lệ';
  }
};

const isPending = (status) => {
  return (status || '').toLowerCase() === 'pending';
};

const handleNewsClick = (news) => {
  if (isPending(news.status)) {
    router.push(`/checking/${news.newsId}`);
  }
};
</script>

<style scoped>
.news-item {
  transition: all 0.3s ease;
}

.news-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.news-item.clickable {
  cursor: pointer;
}

.news-item.clickable:hover {
  background-color: #f8f9fa;
  border-color: #007bff !important;
}

.card {
  border: none;
  border-radius: 10px;
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.badge {
  font-size: 0.75rem;
}
</style>