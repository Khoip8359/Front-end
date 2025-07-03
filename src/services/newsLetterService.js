import api from '@/services/api'

export default {
    async subscribeNewsletter(email) {
        return api.post(`/api/newsLetter/add?email=${email}`)
    }
}