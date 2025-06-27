# Vue News Application

A modern news application built with Vue 3, Vite, and Bootstrap 5.

## Features

- 📰 News listing with pagination
- 🔍 Search functionality
- 📱 Responsive design
- 🎨 Modern UI with Bootstrap 5
- ⚡ Fast loading with Vite
- 🔥 Hot news section
- 💬 Comments system
- 📊 Category filtering

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my_vue
```

2. Install dependencies:
```bash
npm install
```

3. Setup network access (cho phép truy cập từ máy khác):
```bash
npm run setup-network
```

4. Start development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Network Access (Truy cập từ máy khác)

### Tự động cấu hình:
```bash
npm run setup-network
```

### Thủ công:
1. Tìm IP của máy chủ:
   - Windows: `ipconfig`
   - Linux/Mac: `ifconfig`

2. Tạo file `.env`:
```env
VITE_API_BASE_URL=http://[IP_MÁY_CHỦ]:8080
VITE_DEBUG_MODE=true
```

3. Truy cập từ máy khác:
```
http://[IP_MÁY_CHỦ]:5173
```

### Lưu ý quan trọng:
- **Backend server** phải chạy trên `0.0.0.0:8080` (không phải localhost)
- **Firewall** có thể cần được cấu hình
- Xem file `NETWORK_ACCESS.md` để biết chi tiết

## Project Structure

```
src/
├── components/          # Vue components
│   ├── top_bar.vue     # Navigation and search
│   ├── footer.vue      # Footer component
│   ├── main_content.vue # Main news listing
│   ├── news_detail.vue # News detail page
│   ├── category.vue    # Category page
│   └── login.vue       # Login page
├── services/           # API services
│   ├── api.js         # Axios configuration
│   └── NewsService.js # News API methods
├── views/             # Page layouts
│   └── user_layout.vue # Main layout
├── router/            # Vue Router configuration
└── assets/            # Styles and static assets
```

## API Endpoints

The application expects the following API endpoints:

- `GET /api/home/list` - Get news list with pagination
- `GET /api/hotNews` - Get hot news
- `GET /api/suggestNews` - Get suggested news
- `GET /api/news/detail/{id}` - Get news detail
- `GET /api/news/category/{id}` - Get news by category
- `GET /api/news/search` - Search news
- `GET /api/categories` - Get categories

## Technologies Used

- Vue 3 (Composition API)
- Vite
- Vue Router 4
- Pinia (State Management)
- Bootstrap 5
- Font Awesome
- Axios

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Không thể truy cập từ máy khác:
1. Chạy `npm run setup-network`
2. Đảm bảo backend chạy trên `0.0.0.0:8080`
3. Kiểm tra firewall
4. Xem `NETWORK_ACCESS.md` để biết chi tiết

### Lỗi CORS:
- Backend cần cấu hình CORS để chấp nhận requests từ frontend
- Xem hướng dẫn trong `NETWORK_ACCESS.md`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
