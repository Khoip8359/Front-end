import api from './api'

export default {
    async createNews(newsData) {
        return api.post('/api/news/create', newsData)
    },
    
    async getCategories() {
        return api.get('/api/categories')
    }
} 