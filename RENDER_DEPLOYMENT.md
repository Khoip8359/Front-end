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

### WebSocket Connection Issues
1. Kiểm tra console logs
2. Đảm bảo backend service đang chạy
3. Kiểm tra CORS configuration
4. Verify HTTPS/HTTP protocol matching

### Build Issues
1. Kiểm tra Node.js version (>= 16)
2. Clear npm cache: `npm cache clean --force`
3. Delete node_modules và reinstall

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