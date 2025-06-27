import os from 'os';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tìm IP của máy
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const interfaceInfo of interfaces[name]) {
      // Bỏ qua IPv6 và loopback
      if (interfaceInfo.family === 'IPv4' && !interfaceInfo.internal) {
        return interfaceInfo.address;
      }
    }
  }
  
  return 'localhost';
}

// Tạo file .env với IP đúng
function createEnvFile() {
  const localIP = getLocalIP();
  const envContent = `VITE_API_BASE_URL=http://${localIP}:8080
VITE_DEBUG_MODE=true
`;

  const envPath = path.join(__dirname, '.env');
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ File .env đã được tạo thành công!');
    console.log(`📍 IP của máy: ${localIP}`);
    console.log(`🌐 Frontend URL: http://${localIP}:5173`);
    console.log(`🔗 Backend URL: http://${localIP}:8080`);
    console.log('\n📋 Hướng dẫn:');
    console.log(`1. Chạy backend server trên port 8080`);
    console.log(`2. Chạy: npm run dev`);
    console.log(`3. Truy cập từ máy khác: http://${localIP}:5173`);
  } catch (error) {
    console.error('❌ Lỗi khi tạo file .env:', error.message);
  }
}

// Kiểm tra port có đang được sử dụng không
function checkPort(port) {
  return new Promise((resolve) => {
    import('net').then(({ default: net }) => {
      const server = net.createServer();
      server.listen(port, () => {
        server.once('close', () => {
          resolve(false); // Port available
        });
        server.close();
      });
      server.on('error', () => {
        resolve(true); // Port in use
      });
    });
  });
}

// Main function
async function main() {
  console.log('🚀 Cấu hình Network Access cho Vue App\n');
  
  const localIP = getLocalIP();
  console.log(`📍 IP của máy: ${localIP}`);
  
  // Kiểm tra ports
  const port5173InUse = await checkPort(5173);
  const port8080InUse = await checkPort(8080);
  
  console.log(`🔌 Port 5173 (Frontend): ${port5173InUse ? '❌ Đang sử dụng' : '✅ Sẵn sàng'}`);
  console.log(`🔌 Port 8080 (Backend): ${port8080InUse ? '❌ Đang sử dụng' : '✅ Sẵn sàng'}`);
  
  if (port5173InUse) {
    console.log('\n⚠️  Port 5173 đang được sử dụng. Có thể frontend đã chạy.');
  }
  
  if (port8080InUse) {
    console.log('\n⚠️  Port 8080 đang được sử dụng. Có thể backend đã chạy.');
  }
  
  // Tạo file .env
  createEnvFile();
  
  console.log('\n🔧 Các bước tiếp theo:');
  console.log('1. Đảm bảo backend server chạy trên 0.0.0.0:8080');
  console.log('2. Chạy: npm run dev');
  console.log('3. Từ máy khác, truy cập: http://' + localIP + ':5173');
  console.log('\n📖 Xem file NETWORK_ACCESS.md để biết thêm chi tiết');
}

// Chạy script
main().catch(console.error);

export { getLocalIP, createEnvFile }; 