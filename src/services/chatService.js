import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import apiClient from './api';

let stompClient = null;
let currentUserId = null;

export const chatService = {
  setCurrentUserId(userId) {
    currentUserId = userId;
    console.log('ChatService: currentUserId set to', userId);
  },

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
      // Đảm bảo message có trường sender
      if (!message.sender && currentUserId) {
        message.sender = currentUserId.toString();
      }
      stompClient.send('/app/chat', {}, JSON.stringify(message));
    }
  },

  async fetchChatHistory(userId) {
    try {
      const response = await apiClient.get(`/api/help-detail/history/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('fetchChatHistory error:', error);
      throw new Error('Không thể tải lịch sử chat');
    }
  },

  async fetchChatHistoryByUser(userId) {
    try {
      const response = await apiClient.get(`/api/help-detail/history/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('fetchChatHistoryByUser error:', error);
      throw new Error('Không lấy được lịch sử chat');
    }
  },

  async fetchConversationsByUserId(userId) {
    try {
      const response = await apiClient.get(`/api/help-detail/conversations/${userId}`);
      return response.data;
    } catch (error) {
      console.error('fetchConversationsByUserId error:', error);
      throw new Error('Không lấy được danh sách hội thoại');
    }
  },

  async fetchChatHistoryByMerge(merge) {
    try {
      if (!currentUserId) {
        throw new Error('User chưa đăng nhập');
      }
      const response = await apiClient.get(`/api/help-detail/history/conversation/${merge}?currentUserId=${currentUserId}`);
      return response.data;
    } catch (error) {
      console.error('fetchChatHistoryByMerge error:', error);
      throw new Error('Không lấy được lịch sử chat');
    }
  }
}; 