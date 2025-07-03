import apiClient from "./api";

export const ReactService = {
    async getReacts(body) {
        console.log("change " + body.user_id + " " + body.news_id);
        const response = await apiClient.post(`/api/react/change`, body);
        return response.data;
    },
    async getCheckReact(body) {
        const response = await apiClient.post(`/api/react/check`, body);
        return response.data;
    }
}