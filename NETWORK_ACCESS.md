# Hướng dẫn truy cập từ máy khác trong mạng

## Vấn đề
Khi chạy ứng dụng Vue trên máy chủ và muốn truy cập từ máy khác trong cùng mạng LAN, có thể gặp các vấn đề sau:

1. **Frontend (Vue app)** không thể truy cập được
2. **Backend API** không thể kết nối được
3. **CORS errors** khi gọi API

## Giải pháp

### 1. Cấu hình Frontend (Vue App)

File `vite.config.js` đã được cấu hình đúng:
```javascript
server: {
  host: '0.0.0.0',  // Cho phép truy cập từ tất cả IP
  port: 5173,
  cors: true
}
```

### 2. Cấu hình Backend Server

**Nếu bạn đang sử dụng Spring Boot:**

Thêm vào `application.properties`:
```properties
# Cho phép truy cập từ tất cả IP
server.address=0.0.0.0
server.port=8080

# CORS configuration
spring.web.cors.allowed-origins=*
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
```

**Nếu bạn đang sử dụng Node.js/Express:**

```javascript
const cors = require('cors');

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.listen(8080, '0.0.0.0', () => {
  console.log('Server running on 0.0.0.0:8080');
});
```

### 3. Tìm IP của máy chủ

**Trên Windows:**
```cmd
ipconfig
```
Tìm dòng "IPv4 Address" (thường là 192.168.x.x)

**Trên Linux/Mac:**
```bash
ifconfig
# hoặc
ip addr show
```

### 4. Truy cập từ máy khác

Thay vì truy cập `localhost:5173`, hãy sử dụng:
```
http://[IP_MÁY_CHỦ]:5173
```

Ví dụ: `http://192.168.1.100:5173`

### 5. Cấu hình Environment Variables

Tạo file `.env` với IP của máy chủ:
```env
VITE_API_BASE_URL=http://192.168.1.100:8080
VITE_DEBUG_MODE=true
```

### 6. Kiểm tra Firewall

**Windows:**
- Mở Windows Defender Firewall
- Cho phép ứng dụng Node.js/Vite qua firewall
- Hoặc tạm thời tắt firewall để test

**Linux:**
```bash
sudo ufw allow 5173
sudo ufw allow 8080
```

### 7. Test kết nối

1. Trên máy chủ, chạy:
```bash
npm run dev
```

2. Trên máy khác, mở browser và truy cập:
```
http://[IP_MÁY_CHỦ]:5173
```

### 8. Troubleshooting

**Nếu vẫn không được:**

1. **Kiểm tra kết nối mạng:**
```bash
ping [IP_MÁY_CHỦ]
```

2. **Kiểm tra port có đang listen không:**
```bash
netstat -an | grep 5173
netstat -an | grep 8080
```

3. **Test API trực tiếp:**
```bash
curl http://[IP_MÁY_CHỦ]:8080/api/categories
```

4. **Kiểm tra console trong browser** để xem lỗi CORS

### 9. Cấu hình Production

Khi deploy production, nên sử dụng domain thay vì IP:
```env
VITE_API_BASE_URL=https://your-domain.com/api
```

## Lưu ý bảo mật

- Chỉ sử dụng `origin: '*'` trong development
- Production nên chỉ định domain cụ thể
- Cân nhắc sử dụng HTTPS cho production 