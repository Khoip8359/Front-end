# Render Deployment Guide

## Backend Deployment (Spring Boot)

### 1. Tạo Web Service trên Render
- **Build Command:** `./mvnw clean install`
- **Start Command:** `java -jar target/Esport_Website-0.0.1-SNAPSHOT.jar`
- **Environment Variables:**
  - `PORT`: 8080 (hoặc để Render tự động)
  - `SPRING_PROFILES_ACTIVE`: prod

### 2. Cấu hình Database
- Sử dụng Railway MySQL database đã có
- Database URL: `jdbc:mysql://yamanote.proxy.rlwy.net:59719/railway`

### 3. Kiểm tra Deployment
Sau khi deploy, kiểm tra các endpoint:
- `https://your-backend-url.onrender.com/health.html` - Health check page
- `https://your-backend-url.onrender.com/test` - Test API
- `https://your-backend-url.onrender.com/ws-test` - WebSocket test

## Frontend Deployment (Vue.js)

### 1. Tạo Static Site trên Render
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
- **Environment Variables:**
  - `VITE_API_BASE_URL`: URL của backend service

### 2. Cấu hình Domain
- Đảm bảo frontend và backend cùng domain hoặc subdomain
- Ví dụ: 
  - Frontend: `https://your-app.onrender.com`
  - Backend: `https://your-app-backend.onrender.com`

## WebSocket Configuration

### 1. Backend WebSocket
- Endpoint: `/ws-chat`
- Sử dụng SockJS với HTTPS support
- CORS đã được cấu hình cho production

### 2. Frontend WebSocket
- Tự động detect HTTPS/HTTP
- Sử dụng cùng domain với frontend
- Fallback cho development environment

## Troubleshooting

### WebSocket 404 Error
1. **Kiểm tra backend deployment:**
   - Truy cập: `https://your-backend-url.onrender.com/health.html`
   - Nếu không load được, backend chưa deploy thành công

2. **Kiểm tra build logs trên Render:**
   - Vào Render Dashboard → Service → Logs
   - Tìm lỗi trong build hoặc startup

3. **Kiểm tra WebSocket endpoint:**
   - Truy cập: `https://your-backend-url.onrender.com/ws-chat/info`
   - Nếu 404, có vấn đề với WebSocket config

4. **Kiểm tra CORS:**
   - Mở Developer Tools → Network
   - Xem có lỗi CORS không

### Build Issues
1. Kiểm tra Node.js version (>= 16)
2. Clear npm cache: `npm cache clean --force`
3. Delete node_modules và reinstall

### Common Issues
1. **Backend không start:**
   - Kiểm tra database connection
   - Kiểm tra port configuration
   - Xem logs trên Render

2. **WebSocket không connect:**
   - Đảm bảo backend đang chạy
   - Kiểm tra URL trong frontend
   - Verify HTTPS/HTTP protocol

## Environment Variables

### Backend (.env)
```
PORT=8080
SPRING_PROFILES_ACTIVE=prod
```

### Frontend (.env.production)
```
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

## Testing Steps

1. **Deploy backend trước**
2. **Kiểm tra backend:**
   - `https://your-backend-url.onrender.com/health.html`
   - `https://your-backend-url.onrender.com/test`
3. **Deploy frontend**
4. **Test WebSocket connection**
5. **Kiểm tra console logs** 