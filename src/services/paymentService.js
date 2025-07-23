import apiClient from './api.js'

export const paymentService = {
  async createVietQR({ amount, content, bank, account_number }) {
    try {
        return `https://qr.sepay.vn/img?acc=${account_number}&bank=${bank}&amount=${amount}&des=${content}&template=qronly&download=DOWNLOAD`
    } catch (error) {
        console.log('Lỗi khi tạo qr : ' + error)
    }
  },
  async findHistoryTransactions(userId){
    try {
      const response = await apiClient.get(`/api/transaction/get?userId=${userId}`)
      return response.data
    } catch (error) {
      console.log('Lỗi khi tìm kiếm lịch sử giao dịch' + error);
    }
  },
  async addNewTransaction(total,userId){
    try {
      const response = await apiClient.post(`/api/transaction/add?total=${total}&userId=${userId}`)
      return response.data
    } catch (error) {
      console.log('Lỗi khi thêm giao dịch' + error);
    }
  }
}
