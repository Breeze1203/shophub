<template>
  <div class="chat-room">
    <!-- 顶部工具栏 -->
    <header class="chat-header">
      <div class="header-left">
        <button @click="router.push('/dashboard/rooms')" class="btn-back">
          ← 返回
        </button>
        <div class="room-info">
          <h2>{{ roomName }}</h2>
          <span :class="['status', { connected: isConnected }]">
            <span class="status-dot"></span>
            {{ isConnected ? '已连接' : '连接中...' }}
          </span>
        </div>
      </div>

      <div class="header-right">
        <button @click="showMembersPanel = !showMembersPanel" class="btn-members">
          👥 成员 ({{ onlineUsers.length }})
        </button>
      </div>
    </header>

    <!-- 主体区域 -->
    <div class="chat-main">
      <!-- 消息区域 -->
      <div class="messages-container" ref="messagesContainer">
        <div v-if="loading" class="loading-messages">
          <div class="spinner"></div>
          <p>加载消息...</p>
        </div>

        <div v-else class="messages-list">
          <!-- 日期分组 -->
          <div
              v-for="(group, index) in groupedMessages"
              :key="index"
              class="message-group"
          >
            <!-- 日期分隔符 -->
            <div v-if="group.date" class="date-divider">
              <span>{{ group.date }}</span>
            </div>

            <!-- 消息列表 -->
            <div
                v-for="message in group.messages"
                :key="message.id"
            >
              <!-- 系统消息 -->
              <div v-if="message.type === 'system'" class="system-message-wrapper">
                <div class="system-message">
                  {{ message.content }}
                </div>
              </div>

              <!-- 普通消息 -->
              <div v-else :class="['message-item', { 'message-own': isOwnMessage(message) }]">
                <!-- 别人的消息：头像在左 -->
                <template v-if="!isOwnMessage(message)">
                  <div class="message-avatar">
                    <div
                        class="avatar"
                        :style="{ background: message.user_color || getUserColor(message.user_id) }"
                        :title="message.username"
                    >
                      {{ getAvatarText(message.username) }}
                    </div>
                  </div>

                  <div class="message-content">
                    <div class="message-username">{{ message.username }}</div>
                    <div class="message-bubble message-bubble-other">
                      <div class="message-text" v-html="formatMessage(message.content)"></div>
                      <div class="message-time">{{ formatTime(message.created_at) }}</div>
                    </div>
                  </div>
                </template>

                <!-- 自己的消息：头像在右 -->
                <template v-else>
                  <div class="message-content message-content-own">
                    <div class="message-bubble message-bubble-own">
                      <div class="message-text" v-html="formatMessage(message.content)"></div>
                      <div class="message-time">{{ formatTime(message.created_at) }}</div>
                    </div>
                  </div>

                  <div class="message-avatar">
                    <div
                        class="avatar"
                        :style="{ background: getUserColor(message.user_id) }"
                        :title="'我'"
                    >
                      {{ getAvatarText(authStore.user?.username || '我') }}
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- 正在输入提示 -->
        <div v-if="typingUsers.length > 0" class="typing-indicator">
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span class="typing-text">
            {{ typingUsers.join(', ') }} 正在输入...
          </span>
        </div>
      </div>

      <!-- 成员侧边栏 -->
      <transition name="slide">
        <aside v-if="showMembersPanel" class="members-panel">
          <div class="panel-header">
            <h3>在线成员 ({{ onlineUsers.length }})</h3>
            <button @click="showMembersPanel = false" class="btn-close">×</button>
          </div>

          <div class="members-list">
            <div
                v-for="user in onlineUsers"
                :key="user.user_id"
                class="member-item"
            >
              <div class="member-avatar" :style="{ background: user.color }">
                {{ getAvatarText(user.username) }}
              </div>
              <div class="member-info">
                <div class="member-name">
                  {{ user.username }}
                  <span v-if="user.user_id === currentUserId" class="badge-me">我</span>
                </div>
                <div class="member-status">
                  <span class="online-dot"></span>
                  在线
                </div>
              </div>
            </div>
          </div>
        </aside>
      </transition>
    </div>

    <!-- 输入区域 -->
    <footer class="chat-footer">
      <!-- 表情选择器 -->
      <transition name="fade">
        <div v-if="showEmojiPicker" class="emoji-picker">
          <div class="emoji-grid">
            <button
                v-for="emoji in emojis"
                :key="emoji"
                @click="insertEmoji(emoji)"
                class="emoji-btn"
            >
              {{ emoji }}
            </button>
          </div>
        </div>
      </transition>

      <div class="input-wrapper">
        <button
            @click="showEmojiPicker = !showEmojiPicker"
            class="btn-emoji"
            title="添加表情"
        >
          😊
        </button>

        <textarea
            ref="messageInput"
            v-model="messageText"
            @keydown.enter.exact.prevent="sendMessage"
            @input="handleTyping"
            placeholder="输入消息... (Enter 发送，Shift+Enter 换行)"
            class="message-input"
            rows="1"
        ></textarea>

        <button
            @click="sendMessage"
            :disabled="!messageText.trim() || !isConnected"
            class="btn-send"
        >
          发送 📤
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onBeforeUnmount, onUnmounted, nextTick, watch} from 'vue';
import {useRoute, onBeforeRouteLeave,} from 'vue-router';
import router from "@/router/index.js";
import {useAuthStore} from '@/stores/auth';
import {useWebSocket} from '@/composables/useWebSocket';
import { useOnlineUsers } from '@/composables/useOnlineUsers';
import {chatApi, roomsApi} from "@/api/rooms.js";

const route = useRoute();
const authStore = useAuthStore();

const roomId = route.params.id;
const roomName = ref('聊天室');
const messageText = ref('');
const messages = ref([]);
const loading = ref(true);
const messagesContainer = ref(null);
const messageInput = ref(null);
const showEmojiPicker = ref(false);
const showMembersPanel = ref(false);
const isUnmounting = ref(false);

// WebSocket
const token = localStorage.getItem('access_token');
const {connect, send, on, disconnect, isConnected} = useWebSocket(roomId, token, 'chat');

const {
  onlineUsers,
  isLoading: usersLoading,
  startPolling,
  refresh: refreshOnlineUsers,
  cleanup: cleanupOnlineUsers
} = useOnlineUsers('chat', roomId, 5000);


const typingUsers = ref([]);
const currentUserId = computed(() => authStore.user?.id);

// 定时器
let typingTimer = null;
let isTyping = false;

// 表情列表
const emojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
  '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
  '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜',
  '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐',
  '👍', '👎', '👏', '🙌', '👌', '🤝', '💪', '🙏',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
  '💯', '✨', '🎉', '🎊', '🎈', '🎁', '🏆', '🔥'
];

// ==================== WebSocket 事件处理 ====================
// 添加系统消息
const addSystemMessage = (content) => {
  messages.value.push({
    id: `system_${Date.now()}`,
    type: 'system',
    content: content,
    created_at: new Date().toISOString()
  });
  nextTick(() => scrollToBottom());
};

// 处理初始化
const handleInit = (payload) => {
  if (isUnmounting.value) return;
  console.log('WebSocket 初始化成功');
  // 初始化时也刷新一次在线列表
  refreshOnlineUsers();
};

// 处理新消息
const handleMessage = (payload) => {
  if (isUnmounting.value) return;
  console.log('收到消息:', payload);

  messages.value.push(payload);
  nextTick(() => scrollToBottom());
};

// 处理用户加入
const handleUserJoined = (payload) => {
  if (isUnmounting.value) return;
  console.log('用户加入:', payload);
  // 立即刷新在线列表
  refreshOnlineUsers();
  // 显示系统消息
  if (payload.username && !payload.system_message_sent) {
    addSystemMessage(`${payload.username} 加入了聊天室`);
  }
};

// 处理用户离开
const handleUserLeft = (payload) => {
  if (isUnmounting.value) return;
  console.log('用户离开:', payload);
  refreshOnlineUsers();
  // 显示系统消息
  if (payload.username && !payload.system_message_sent) {
    addSystemMessage(`${payload.username} 离开了聊天室`);
  }
};

// 处理输入状态（来自 WebSocket 事件）
const handleTypingEvent = (payload) => {
  if (isUnmounting.value) return;

  // 忽略自己的输入状态
  if (payload.user_id === currentUserId.value) return;

  if (payload.is_typing) {
    if (!typingUsers.value.includes(payload.username)) {
      typingUsers.value.push(payload.username);
    }
  } else {
    typingUsers.value = typingUsers.value.filter(u => u !== payload.username);
  }
};

// 处理错误
const handleError = (payload) => {
  console.error('WebSocket错误:', payload);
};

// ==================== 业务逻辑 ====================

// 判断是否是自己的消息
const isOwnMessage = (message) => {
  const msgUserId = message.user_id || message.userId || message.sender_id;
  return msgUserId === currentUserId.value;
};

// 获取头像文字
const getAvatarText = (username) => {
  if (!username) return '?';
  return username.charAt(0).toUpperCase();
};

// 根据user_id生成颜色
const getUserColor = (userId) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
  return colors[(userId) % colors.length];
};

// 按日期分组消息
const groupedMessages = computed(() => {
  const groups = [];
  let currentDate = '';

  messages.value.forEach(message => {
    if (message.type === 'system') {
      if (groups.length === 0 || groups[groups.length - 1].date !== '') {
        groups.push({date: '', messages: []});
      }
      groups[groups.length - 1].messages.push(message);
      return;
    }

    const date = formatDate(message.created_at);
    if (date !== currentDate) {
      currentDate = date;
      groups.push({date, messages: []});
    }
    groups[groups.length - 1].messages.push(message);
  });

  return groups;
});

// 发送消息
const sendMessage = () => {
  const content = messageText.value.trim();
  if (!content || !isConnected.value) return;

  send('message', {
    content: content
  });

  messageText.value = '';
  showEmojiPicker.value = false;

  if (isTyping) {
    send('typing', {is_typing: false});
    isTyping = false;
  }

  if (messageInput.value) {
    messageInput.value.style.height = 'auto';
  }
};

// 插入表情
const insertEmoji = (emoji) => {
  const cursorPos = messageInput.value?.selectionStart || messageText.value.length;
  messageText.value =
      messageText.value.slice(0, cursorPos) +
      emoji +
      messageText.value.slice(cursorPos);

  showEmojiPicker.value = false;
  messageInput.value?.focus();
};

// 处理输入
const handleTyping = () => {
  if (!isConnected.value) return;

  if (!isTyping) {
    isTyping = true;
    send('typing', {is_typing: true});
  }

  if (typingTimer) clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    if (isTyping) {
      isTyping = false;
      send('typing', {is_typing: false});
    }
  }, 3000);

  const textarea = messageInput.value;
  if (textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }
};

// 滚动到底部
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// 格式化消息
const formatMessage = (content) => {
  if (!content) return '';

  let formatted = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  formatted = formatted.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  formatted = formatted.replace(/\n/g, '<br>');

  return formatted;
};

// 格式化日期
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return '今天';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return '昨天';
  } else {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};

// 格式化时间
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// ==================== 生命周期 ====================

onMounted(async () => {
  try {
    const roomResponse = await roomsApi.getRoomInfo(roomId);
    roomName.value = roomResponse.data.name;
    const messagesResponse = await chatApi.getMessages(roomId);
    messages.value = messagesResponse.data || [];

  } catch (error) {
    console.error('加载失败:', error);
  } finally {
    loading.value = false;
    await nextTick();
    scrollToBottom();
  }

  // 连接 WebSocket
  connect();

  // 注册事件监听
  on('init', handleInit);
  on('message', handleMessage);
  on('user_joined', handleUserJoined);
  on('user_left', handleUserLeft);
  on('typing', handleTypingEvent);
  on('error', handleError);

  // 开始轮询在线用户
  startPolling();
});

// 路由离开前清理
onBeforeRouteLeave((to, from, next) => {
  console.log('准备离开聊天室');
  isUnmounting.value = true;
  // 清理在线用户轮询
  cleanupOnlineUsers();
  // 发送停止输入状态
  if (isTyping) {
    send('typing', {is_typing: false});
    isTyping = false;
  }

  // 断开 WebSocket
  disconnect();

  next();
});

// 组件卸载前清理
onBeforeUnmount(() => {
  console.log('组件开始卸载');
  isUnmounting.value = true;
  cleanupOnlineUsers();
  if (isTyping) {
    send('typing', {is_typing: false});
  }

  disconnect();
});

// 最终清理
onUnmounted(() => {
  console.log('组件已完全卸载');

  if (typingTimer) {
    clearTimeout(typingTimer);
    typingTimer = null;
  }
});

watch(() => messages.value.length, () => {
  nextTick(() => scrollToBottom());
});
</script>

<style scoped>
/* ... 样式保持不变，从原代码复制过来 ... */
.chat-room {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.chat-header {
  background: white;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.btn-back {
  padding: 8px 16px;
  background: #f1f3f5;
  color: #495057;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-back:hover {
  background: #e9ecef;
}

.room-info h2 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 700;
  color: #212529;
}

.status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6c757d;
}

.status.connected {
  color: #10b981;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f48771;
}

.status.connected .status-dot {
  background: #10b981;
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.btn-members {
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-members:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.chat-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%);
}

.loading-messages {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6c757d;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.messages-list {
  max-width: 90%;
  margin: 0 auto;
}

.message-group {
  margin-bottom: 24px;
}

.date-divider {
  text-align: center;
  margin: 20px 0;
  position: relative;
}

.date-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #dee2e6;
}

.date-divider span {
  position: relative;
  padding: 4px 16px;
  background: white;
  color: #6c757d;
  font-size: 13px;
  font-weight: 600;
  border-radius: 12px;
  border: 1px solid #dee2e6;
}

.system-message-wrapper {
  display: flex;
  justify-content: center;
  margin: 12px 0;
}

.system-message {
  padding: 6px 16px;
  background: rgba(108, 117, 125, 0.1);
  color: #6c757d;
  font-size: 12px;
  border-radius: 12px;
  text-align: center;
}

.message-item {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  animation: slideIn 0.3s ease;
  align-items: flex-start;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-item:not(.message-own) {
  justify-content: flex-start;
}

.message-item.message-own {
  justify-content: flex-end;
}

.message-avatar {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message-content {
  display: flex;
  flex-direction: column;
  max-width: 60%;
}

.message-content-own {
  align-items: flex-end;
}

.message-username {
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 4px;
  margin-left: 8px;
  font-weight: 600;
}

.message-bubble {
  padding: 10px 14px;
  border-radius: 16px;
  word-wrap: break-word;
  word-break: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
}

.message-bubble-other {
  background: white;
  border-top-left-radius: 4px;
}

.message-bubble-own {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-top-right-radius: 4px;
}

.message-text {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 4px;
}

.message-text :deep(a) {
  color: #667eea;
  text-decoration: underline;
}

.message-bubble-own .message-text :deep(a) {
  color: white;
  opacity: 0.9;
}

.message-time {
  font-size: 11px;
  color: #adb5bd;
  margin-top: 2px;
}

.message-bubble-own .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  color: #6c757d;
  font-size: 13px;
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #adb5bd;
  animation: typing 1.4s infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.members-panel {
  width: 300px;
  background: white;
  border-left: 1px solid #e9ecef;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  color: #212529;
}

.btn-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: #f1f3f5;
  font-size: 24px;
  cursor: pointer;
  line-height: 1;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #e9ecef;
}

.members-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: background 0.2s;
}

.member-item:hover {
  background: #f8f9fa;
}

.member-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.member-info {
  flex: 1;
}

.member-name {
  font-size: 14px;
  font-weight: 600;
  color: #212529;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.badge-me {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.member-status {
  font-size: 12px;
  color: #10b981;
  display: flex;
  align-items: center;
  gap: 6px;
}

.online-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
}

.chat-footer {
  background: white;
  border-top: 1px solid #e9ecef;
  padding: 16px 24px;
  position: relative;
}

.emoji-picker {
  position: absolute;
  bottom: 100%;
  left: 24px;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.15);
  margin-bottom: 8px;
  max-width: 400px;
  z-index: 100;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
  max-height: 200px;
  overflow-y: auto;
}

.emoji-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  font-size: 24px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.emoji-btn:hover {
  background: #f1f3f5;
  transform: scale(1.2);
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.btn-emoji {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: #f1f3f5;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-emoji:hover {
  background: #e9ecef;
  transform: scale(1.1);
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 15px;
  font-family: inherit;
  resize: none;
  max-height: 120px;
  transition: all 0.2s;
}

.message-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-send {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-send:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.btn-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .chat-header {
    padding: 12px 16px;
  }

  .header-left {
    gap: 12px;
  }

  .room-info h2 {
    font-size: 16px;
  }

  .messages-container {
    padding: 12px;
  }

  .message-content {
    max-width: 90%;
  }

  .members-panel {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
  }

  .chat-footer {
    padding: 12px 16px;
  }

  .emoji-picker {
    left: 16px;
    right: 16px;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .message-content {
    max-width: 85%;
  }

  .message-text {
    font-size: 13px;
  }

  .message-bubble {
    padding: 8px 12px;
  }
}
</style>
