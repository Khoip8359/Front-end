import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import apiClient from './api';

let stompClient = null;

export const chatService = {
  connect(onMessageReceived) {
    const socket = new SockJS('http://localhost:8080/ws-chat');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      stompClient.subscribe('/topic/messages', (message) => {
        onMessageReceived(JSON.parse(message.body));
      });
    });
  },

  sendMessage(message) {
    if (stompClient && stompClient.connected) {
      stompClient.send('/app/chat', {}, JSON.stringify(message));
    }
  },

  async fetchChatHistory(userId) {
    try {
        const response = await apiClient.get(`/api/help-detail/history/user/${userId}`)
        return response.data
      } catch (error) {
        console.error('getNewsDetail error:', error)
        throw new Error('Không thể tải lịch sử chat')
      }
  },

  async fetchChatHistoryByUser(userId) {
    try {
      const response = await apiClient.get(`/api/help-detail/history/user/${userId}`)
      return response.data
    } catch (error) {
      console.error('getNewsDetail error:', error)
      throw new Error('Không thể tải lịch sử chat')
    }
  }
}; 