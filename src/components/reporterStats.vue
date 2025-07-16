<template>
  <div class="container-fluid">
    <h1 class="mb-4">Thống kê bài viết</h1>
    
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card shadow-sm h-100">
          <div class="card-body d-flex flex-column justify-content-center align-items-center text-center">
            <div class="text-muted mb-2">Tổng số lượt xem</div>
            <div class="display-4 fw-bold text-primary">{{ totalViews }}</div>
          </div>
        </div>
      </div>
      <div class="col-md-8">
        <div class="card shadow-sm h-100">
          <div class="card-body d-flex align-items-center justify-content-center">
            <div style="max-width: 100%; max-height: 240px;">
              <Pie :data="statusPieData" :options="pieOptions" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header bg-light">
            <h2 class="card-title mb-0">Thống kê bài viết theo tháng</h2>
          </div>
          <div class="card-body">
            <div style="height: 400px;">
              <Bar :data="monthlyStats" :options="chartOptions" />
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
import { useAuthStore } from '@/stores/auth';

const newsList = ref([]);
const authStore = useAuthStore();
const userId = computed(() => authStore.user?.user?.userId);

onMounted(async () => {
  try {
    const data = await newsService.getNewsByUser(userId.value);
    newsList.value = Array.isArray(data) ? data : [];
  } catch (err) {
    newsList.value = [];
    console.error('Lỗi tải dữ liệu:', err);
  }
});

function groupByMonth(newsList) {
  const result = {};
  newsList.forEach(news => {
    if (!news.createdDate) return;
    const date = new Date(news.createdDate);
    const key = `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    result[key] = (result[key] || 0) + 1;
  });
  return result;
}

const monthlyStats = computed(() => {
  const grouped = groupByMonth(newsList.value);
  const labels = Object.keys(grouped).sort((a, b) => {
    const [ma, ya] = a.split('/').map(Number);
    const [mb, yb] = b.split('/').map(Number);
    return ya !== yb ? ya - yb : ma - mb;
  });
  const data = labels.map(label => grouped[label]);
  return {
    labels,
    datasets: [
      {
        label: 'Số bài viết',
        backgroundColor: '#42A5F5',
        data
      }
    ]
  }
});

const totalViews = computed(() => {
  return newsList.value.reduce((sum, news) => sum + (news.views || 0), 0);
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
      position: 'bottom',
    }
  }
};
</script>