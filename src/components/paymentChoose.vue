<template>
  <div class="payment-choose-container">
    <div class="container">
      <div class="header">
        <h1 class="title">Chọn phương thức thanh toán</h1>
        <p class="subtitle">Lựa chọn gói dịch vụ phù hợp với nhu cầu của bạn</p>
      </div>
      
      <div class="card-grid">
        <router-link to="/payment/purchase" class="payment-card primary">
          <div class="card-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </div>
          <div class="card-content">
            <h2>Mua thêm point</h2>
            <p>Mua thêm các point với mức giá phù hợp và linh hoạt</p>
            <div class="card-badge">Phổ biến</div>
          </div>
          <div class="card-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </div>
        </router-link>

        <router-link to="/payment/package" class="payment-card featured">
          <div class="card-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div class="card-content">
            <h2>Các gói ưu đãi</h2>
            <p>Mua các gói point với ưu đãi lớn và tiết kiệm chi phí</p>
            <div class="card-badge special">Tiết kiệm nhất</div>
          </div>
          <div class="card-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </div>
        </router-link>

        <router-link to="/payment/update" class="payment-card premium">
          <div class="card-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <div class="card-content">
            <h2>Nâng cấp tài khoản</h2>
            <p>Nâng cấp tài khoản hiện tại để nhận nhiều ưu đãi hơn</p>
            <div class="card-badge premium-badge">Premium</div>
          </div>
          <div class="card-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.payment-choose-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.container {
  max-width: 1200px;
  width: 100%;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 1rem 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.subtitle {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.9);
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  align-items: stretch;
}

.payment-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  position: relative;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 2px solid transparent;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.payment-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.payment-card:hover::before {
  transform: scaleX(1);
}

.payment-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.card-icon {
  margin-bottom: 1.5rem;
  color: #667eea;
}

.featured .card-icon {
  color: #f093fb;
}

.premium .card-icon {
  color: #4facfe;
}

.card-content {
  flex: 1;
}

.card-content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #2d3748;
}

.card-content p {
  font-size: 1rem;
  color: #718096;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
}

.card-badge {
  display: inline-block;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-badge.special {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.card-badge.premium-badge {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.card-arrow {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  color: #a0aec0;
  transition: all 0.3s ease;
}

.payment-card:hover .card-arrow {
  color: #667eea;
  transform: translateX(4px);
}

.featured:hover .card-arrow {
  color: #f093fb;
}

.premium:hover .card-arrow {
  color: #4facfe;
}

/* Responsive design */
@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .payment-card {
    padding: 2rem;
  }
}

/* Animation cho card khi load */
.payment-card {
  animation: fadeInUp 0.6s ease-out;
}

.payment-card:nth-child(1) {
  animation-delay: 0.1s;
}

.payment-card:nth-child(2) {
  animation-delay: 0.2s;
}

.payment-card:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>