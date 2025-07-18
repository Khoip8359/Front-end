import apiClient from './api.js'

export const paymentService = {
  async createVietQR({ amount, content, bank, account_number }) {
    try {
        return `https://qr.sepay.vn/img?acc=${account_number}&bank=${bank}&amount=${amount}&des=${content}&template=qronly&download=DOWNLOAD`
    } catch (error) {
        console.log('Lỗi khi tạo qr : ' + error)
    }
  }
}
