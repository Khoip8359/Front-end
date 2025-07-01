import apiClient from './api.js'

export const commentService = {
    async getComments(newsId) {
        const response = await apiClient.get(`/api/comments`, {
            params: { newsId }
        });
        return response.data;
    },
    async addComment(commentData) {
        const response = await apiClient.post('/api/comments/add', commentData);
        return response.data;
    }
}