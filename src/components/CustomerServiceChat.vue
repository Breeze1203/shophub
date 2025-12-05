<template>
  <transition name="slide-up">
    <div v-if="isVisible" class="customer-service-widget">
      <!-- 最小化时的图标 -->
      <div v-if="isMinimized" class="chat-minimized" @click="toggleMinimize">
        <span class="icon">💬</span>
        <span class="badge" v-if="unreadCount > 0">{{ unreadCount }}</span>
      </div>

      <!-- 展开的聊天窗口 -->
      <div v-else class="chat-window">
        <div class="chat-header">
          <div class="header-left">
            <span class="icon">👨‍💼</span>
            <span class="title">客服咨询</span>
          </div>
          <div class="header-actions">
            <button class="minimize-btn" @click="toggleMinimize">—</button>
            <button class="close-btn" @click="closeChat">×</button>
          </div>
        </div>

        <div class="chat-messages" ref="messagesContainer">
          <div v-for="msg in messages" :key="msg.id" :class="['message', msg.type]">
            <div v-if="msg.type === 'system'" class="system-message">
              {{ msg.content }}
            </div>
            <div v-else class="user-message">
              <div class="message-header">
                <span class="username" :style="{ color: msg.user_color }">
                  {{ msg.username }}
                </span>
                <span class="time">{{ formatTime(msg.created_at) }}</span>
              </div>
              <div class="message-content">{{ msg.content }}</div>
            </div>
          </div>

          <div v-if="isConnected && messages.length === 0" class="welcome-message">
            <p>👋 您好,我是客服助手</p>
            <p>有什么可以帮您的吗?</p>
          </div>

          <!-- 连接状态提示 -->
          <div v-if="!isConnected && sessionId" class="connection-status">
            <p>正在连接...</p>
          </div>
        </div>

        <div class="chat-input">
          <input
              v-model="inputMessage"
              @keypress.enter="sendMessage"
              placeholder="输入消息..."
              :disabled="!isConnected"
          />
          <button @click="sendMessage" :disabled="!isConnected || !inputMessage.trim()">
            发送
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useWebSocket } from '@/composables/useWebSocket';
import { customerApi } from "@/api/admin/customer.js";

const props = defineProps({
  userId: {
    type: Number,
    required: true
  },
  token: {
    type: String,
    required: true
  }
});

// 状态
const isVisible = ref(false);
const isMinimized = ref(false);
const messages = ref([]);
const inputMessage = ref('');
const unreadCount = ref(0);
const messagesContainer = ref(null);
const sessionId = ref(null);
const isCreatingSession = ref(false); // 防止重复创建会话

const roomId = computed(() => `${props.userId}`);

// WebSocket 连接
const { connect, disconnect, send, on, isConnected } = useWebSocket(
    roomId.value,
    props.token,
    'chat'
);

// 创建或获取会话
const createSession = async () => {
  // 防止重复创建
  if (isCreatingSession.value || sessionId.value) {
    return;
  }

  isCreatingSession.value = true;

  try {
    const response = await customerApi.createSession();
    sessionId.value = response.data.session.id;

    // 连接 WebSocket
    await connect();
  } catch (error) {
    console.error('创建会话失败:', error);
    // 创建失败后重置状态
    sessionId.value = null;
    // 可以在这里添加错误提示
    messages.value.push({
      id: Date.now(),
      type: 'system',
      content: '连接失败,请稍后重试'
    });
  } finally {
    isCreatingSession.value = false;
  }
};

// 打开聊天窗口
const openChat = async () => {
  isVisible.value = true;
  isMinimized.value = false;
  unreadCount.value = 0;

  // 如果没有会话或者未连接,则创建新会话
  if (!sessionId.value && !isCreatingSession.value) {
    await createSession();
  } else if (sessionId.value && !isConnected.value) {
    // 如果有会话但未连接,尝试重新连接
    try {
      await connect();
    } catch (error) {
      console.error('重新连接失败:', error);
      // 连接失败,清除旧会话,创建新会话
      sessionId.value = null;
      await createSession();
    }
  }
};

// 关闭客服聊天
const closeChat = () => {
  isVisible.value = false;

  // 安全断开连接
  try {
    disconnect();
  } catch (error) {
    console.error('断开连接时出错:', error);
  }

  // 清理状态
  sessionId.value = null;
  messages.value = [];
  inputMessage.value = '';
  unreadCount.value = 0;
};

// 最小化切换
const toggleMinimize = () => {
  isMinimized.value = !isMinimized.value;
  if (!isMinimized.value) {
    unreadCount.value = 0;
    scrollToBottom();
  }
};

// 发送消息
const sendMessage = () => {
  if (!inputMessage.value.trim() || !isConnected.value) return;

  try {
    send('message', {
      content: inputMessage.value.trim()
    });
    inputMessage.value = '';
  } catch (error) {
    console.error('发送消息失败:', error);
    // 可以添加错误提示
    messages.value.push({
      id: Date.now(),
      type: 'system',
      content: '消息发送失败,请重试'
    });
  }
};

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
};

// 监听消息
watch(() => messages.value.length, () => {
  scrollToBottom();
  // 如果最小化,增加未读数
  if (isMinimized.value) {
    unreadCount.value++;
  }
});

// 生命周期
onMounted(() => {
  // 监听消息事件
  on('message', (data) => {
    messages.value.push({
      id: data.id || Date.now(),
      type: data.type || 'text',
      user_id: data.user_id,
      username: data.username,
      user_color: data.user_color,
      content: data.content,
      created_at: data.created_at
    });
  });

  on('init', (data) => {
    console.log('客服聊天初始化:', data);
  });

  on('user_joined', (data) => {
    console.log('客服加入:', data);
  });

  on('user_left', (data) => {
    console.log('客服离开:', data);
  });

  // 监听连接错误
  on('error', (error) => {
    console.error('WebSocket错误:', error);
    messages.value.push({
      id: Date.now(),
      type: 'system',
      content: '连接出现问题,请稍后重试'
    });
  });

  // 监听断开连接
  on('disconnect', () => {
    console.log('WebSocket已断开');
  });
});

onUnmounted(() => {
  // 组件卸载时清理
  try {
    disconnect();
  } catch (error) {
    console.error('卸载时断开连接出错:', error);
  }
});

// 暴露方法给父组件
defineExpose({
  openChat,
  closeChat
});
</script>

<style scoped>
.customer-service-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

/* 最小化状态 */
.chat-minimized {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ff6700 0%, #ff8533 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 103, 0, 0.4);
  transition: transform 0.3s;
  position: relative;
}

.chat-minimized:hover {
  transform: scale(1.1);
}

.chat-minimized .icon {
  font-size: 28px;
}

.chat-minimized .badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4d4f;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: bold;
  min-width: 20px;
  text-align: center;
}

/* 聊天窗口 */
.chat-window {
  width: 360px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  background: linear-gradient(135deg, #ff6700 0%, #ff8533 100%);
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-left .icon {
  font-size: 20px;
}

.title {
  font-weight: 500;
  font-size: 16px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.minimize-btn,
.close-btn {
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  transition: background 0.2s;
}

.minimize-btn:hover,
.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 消息区域 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f5f5f5;
}

.message {
  margin-bottom: 16px;
}

.system-message {
  text-align: center;
  color: #999;
  font-size: 12px;
  padding: 8px;
}

.user-message {
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.username {
  font-weight: 500;
  font-size: 13px;
}

.time {
  font-size: 11px;
  color: #999;
}

.message-content {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  word-wrap: break-word;
}

.welcome-message {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  line-height: 1.8;
}

.connection-status {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 13px;
}

/* 输入区域 */
.chat-input {
  padding: 12px;
  background: white;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 8px;
}

.chat-input input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
}

.chat-input input:focus {
  border-color: #ff6700;
}

.chat-input button {
  padding: 8px 16px;
  background: #ff6700;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.chat-input button:hover:not(:disabled) {
  background: #ff8533;
}

.chat-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

/* 滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #999;
}

@media (max-width: 768px) {
  .chat-window {
    width: calc(100vw - 40px);
    height: calc(100vh - 100px);
  }
}
</style>
