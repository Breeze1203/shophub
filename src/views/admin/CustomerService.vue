<template>
  <div class="admin-customer-service">
    <div class="sidebar">
      <div class="tabs">
        <button
            :class="['tab', { active: activeTab === 'pending' }]"
            @click="activeTab = 'pending'"
        >
          待处理 <span class="badge" v-if="pendingCount">{{ pendingCount }}</span>
        </button>
        <button
            :class="['tab', { active: activeTab === 'active' }]"
            @click="activeTab = 'active'"
        >
          处理中 <span class="badge">{{ activeCount }}</span>
        </button>
        <button
            :class="['tab', { active: activeTab === 'closed' }]"
            @click="activeTab = 'closed'"
        >
          已关闭
        </button>
      </div>

      <div class="session-list">
        <div
            v-for="session in filteredSessions"
            :key="session.id"
            :class="['session-item', { active: currentSession?.id === session.id }]"
            @click="selectSession(session)"
        >
          <div class="session-header">
            <span class="username">{{ session.user.username }}</span>
            <span class="time">{{ formatTime(session.updated_at) }}</span>
          </div>
          <div class="last-message">{{ session.last_message || '暂无消息' }}</div>
          <span v-if="session.status === 'pending'" class="status-badge">新</span>
        </div>
      </div>
    </div>

    <div class="chat-area">
      <div v-if="!currentSession" class="empty-state">
        <div class="empty-icon">💬</div>
        <p>请选择一个会话</p>
      </div>

      <div v-else class="chat-content">
        <div class="chat-header">
          <div class="user-info">
            <span class="username">{{ currentSession.user.username }}</span>
            <span class="user-id">ID: {{ currentSession.user.id }}</span>
          </div>
          <div class="actions">
            <button
                v-if="currentSession.status !== 'closed'"
                @click="closeSession"
                class="close-session-btn"
            >
              结束会话
            </button>
          </div>
        </div>

        <!-- 复用聊天消息组件 -->
        <div class="messages" ref="messagesContainer">
          <div v-for="msg in messages" :key="msg.id" :class="['message', getMessageClass(msg)]">
            <div class="message-header">
              <span class="username" :style="{ color: msg.user_color }">
                {{ msg.username }}
              </span>
              <span class="time">{{ formatTime(msg.created_at) }}</span>
            </div>
            <div class="message-content">{{ msg.content }}</div>
          </div>
        </div>

        <div class="input-area">
          <input
              v-model="inputMessage"
              @keypress.enter="sendMessage"
              placeholder="输入回复..."
              :disabled="!isConnected || currentSession.status === 'closed'"
          />
          <button
              @click="sendMessage"
              :disabled="!isConnected || !inputMessage.trim() || currentSession.status === 'closed'"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import {useWebSocket} from '@/composables/useWebSocket';
import {customerApi} from "@/api/admin/customer.js";
import {chatApi} from "@/api/admin/rooms.js";

const activeTab = ref('pending');
const sessions = ref([]);
const currentSession = ref(null);
const messages = ref([]);
const inputMessage = ref('');
const token = localStorage.getItem('adminToken');

let wsConnection = null;

// 筛选会话
const filteredSessions = computed(() => {
  return sessions.value.filter(s => s.status === activeTab.value);
});

const pendingCount = computed(() => {
  return sessions.value.filter(s => s.status === 'pending').length;
});

const activeCount = computed(() => {
  return sessions.value.filter(s => s.status === 'active').length;
});

// 获取会话列表
const fetchSessions = async () => {
  try {
    const response = await customerApi.getSessions();
    sessions.value = response.sessions;
  } catch (error) {
    console.error('获取会话列表失败:', error);
  }
};

// 选择会话
const selectSession = (session) => {
  // 断开之前的连接
  if (wsConnection) {
    wsConnection.disconnect();
  }

  currentSession.value = session;
  messages.value = [];

  // 连接到该会话的房间
  wsConnection = useWebSocket(session.room_id, token, 'chat');

  wsConnection.on('message', (data) => {
    messages.value.push(data);
  });

  wsConnection.on('init', (data) => {
    console.log('初始化:', data);
  });

  wsConnection.connect();

  // 获取历史消息
  fetchMessages(session.room_id);
};

// 获取历史消息
const fetchMessages = async (roomId) => {
  try {
    const response = await chatApi.getMessages(roomId);
    messages.value = response.data || [];
  } catch (error) {
    console.error('获取消息失败:', error);
  }
};

// 发送消息
const sendMessage = () => {
  if (!inputMessage.value.trim() || !wsConnection?.isConnected.value) return;

  wsConnection.send('message', {
    content: inputMessage.value.trim()
  });

  inputMessage.value = '';
};

// 关闭会话
const closeSession = async () => {
  if (!currentSession.value) return;
  try {
    await customerApi.closeSession(currentSession.value.id);
    currentSession.value.status = 'closed';
    fetchSessions();
  } catch (error) {
    console.error('关闭会话失败:', error);
  }
};

// 消息分类
const getMessageClass = (msg) => {
  if (msg.type === 'system') return 'system';
  return msg.user_id === currentSession.value.user_id ? 'user' : 'admin';
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN');
};

// 定时刷新会话列表
onMounted(() => {
  fetchSessions();
  setInterval(fetchSessions, 10000); // 每10秒刷新
});
</script>

<style scoped>
.admin-customer-service {
  display: flex;
  height: 100vh;
  background: #f5f5f5;
}

.sidebar {
  width: 320px;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
}

.tab {
  flex: 1;
  padding: 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  position: relative;
  transition: color 0.2s;
}

.tab:hover {
  color: #ff6700;
}

.tab.active {
  color: #ff6700;
  font-weight: 500;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #ff6700;
}

.tab .badge {
  display: inline-block;
  padding: 2px 6px;
  background: #ff4d4f;
  color: white;
  border-radius: 10px;
  font-size: 12px;
  margin-left: 6px;
}

.session-list {
  flex: 1;
  overflow-y: auto;
}

.session-item {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;
  position: relative;
}

.session-item:hover {
  background: #fafafa;
}

.session-item.active {
  background: #fff7e6;
}

.session-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.username {
  font-weight: 500;
  color: #333;
}

.time {
  font-size: 12px;
  color: #999;
}

.last-message {
  font-size: 13px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 2px 8px;
  background: #ff4d4f;
  color: white;
  border-radius: 10px;
  font-size: 12px;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-id {
  font-size: 12px;
  color: #999;
}

.close-session-btn {
  padding: 6px 16px;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.close-session-btn:hover {
  background: #ff7875;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #f5f5f5;
}

.message {
  margin-bottom: 16px;
  max-width: 70%;
}

.message.user {
  margin-left: 0;
  margin-right: auto;
}

.message.admin {
  margin-left: auto;
  margin-right: 0;
}

.message.system {
  max-width: 100%;
  text-align: center;
  color: #999;
  font-size: 12px;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 13px;
}

.message-content {
  background: white;
  padding: 12px;
  border-radius: 8px;
  line-height: 1.5;
  word-wrap: break-word;
}

.input-area {
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 12px;
}

.input-area input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
}

.input-area button {
  padding: 10px 24px;
  background: #ff6700;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.input-area button:hover:not(:disabled) {
  background: #ff8533;
}

.input-area button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>