<template>
  <div class="admin-customer-service fixed-container">
    <div class="sidebar">
      <div class="tabs">
        <div
          v-for="tab in ['pending', 'active', 'closed']"
          :key="tab"
          :class="['tab', { active: activeTab === tab }]"
          @click="activeTab = tab"
        >
          {{ tabName(tab) }}
          <span
            class="badge"
            v-if="tab === 'pending' && pendingCount > 0"
          >{{ pendingCount }}</span>
          <span
            class="badge-dot"
            v-else-if="tab === 'active' && activeCount > 0"
          ></span>
        </div>
      </div>

      <div class="session-list">
        <div
          v-for="session in filteredSessions"
          :key="session.id"
          :class="['session-item', { active: currentSession?.id === session.id }]"
          @click="selectSession(session)"
        >
          <div class="avatar-placeholder">
            {{ session.user.username.charAt(0).toUpperCase() }}
          </div>
          <div class="session-info">
            <div class="session-header">
              <span class="username">{{ session.user.username }}</span>
              <span class="time">{{ formatTimeShort(session.updated_at) }}</span>
            </div>
            <div class="last-message">{{ session.last_message || '暂无消息' }}</div>
          </div>
          <span
            v-if="session.status === 'pending'"
            class="new-tag"
          >NEW</span>
        </div>
      </div>
    </div>

    <div class="chat-area">
      <div
        v-if="!currentSession"
        class="empty-state"
      >
        <div class="empty-img">👋</div>
        <h2>欢迎使用客服系统</h2>
        <p>请在左侧选择一个会话开始接入</p>
      </div>

      <div
        v-else
        class="chat-content"
      >
        <div class="chat-header">
          <div class="header-left">
            <span class="current-username">{{ currentSession.user.username }}</span>
            <span class="current-id">ID: {{ currentSession.user.id }}</span>
            <span :class="['status-indicator', currentSession.status]">
              {{ tabName(currentSession.status) }}
            </span>
          </div>
          <div class="actions">
            <button
              v-if="currentSession.status !== 'closed'"
              @click="closeSession"
              class="btn-danger-outline"
            >
              结束会话
            </button>
          </div>
        </div>

        <div
          class="messages"
          ref="messagesContainer"
        >
          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="['message-row', getMessageClass(msg)]"
          >

            <div
              v-if="msg.type === 'system'"
              class="system-message"
            >
              <span>{{ msg.content }}</span>
            </div>

            <template v-else>
              <div class="message-avatar">
                {{ getAvatarName(msg) }}
              </div>
              <div class="message-bubble-group">
                <div class="message-meta">
                  <span class="msg-name">{{ msg.username }}</span>
                  <span class="msg-time">{{ formatTime(msg.created_at) }}</span>
                </div>
                <div class="message-bubble">
                  {{ msg.content }}
                </div>
              </div>
            </template>

          </div>
        </div>

        <div class="input-area">
          <textarea
            v-model="inputMessage"
            @keydown.enter.prevent="handleEnter"
            placeholder="输入回复内容，Shift+Enter 换行..."
            :disabled="!isConnected || currentSession.status === 'closed'"
            rows="3"
          ></textarea>
          <div class="input-actions">
            <span class="tip">Enter 发送</span>
            <button
              class="btn-primary"
              @click="sendMessage"
              :disabled="!isConnected || !inputMessage.trim() || currentSession.status === 'closed'"
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { useWebSocket } from "@/composables/useWebSocket";
import { customerApi } from "@/api/admin/customer.js";
import { chatApi } from "@/api/admin/rooms.js";

const activeTab = ref("pending");
const sessions = ref([]);
const currentSession = ref(null);
const messages = ref([]);
const inputMessage = ref("");
const messagesContainer = ref(null); // 滚动容器引用
const token = localStorage.getItem("access_token");

let wsConnection = null;

// Tab 名称映射
const tabName = (status) => {
  const map = {
    pending: "待接入",
    active: "服务中",
    closed: "已结束",
  };
  return map[status] || status;
};

// 头像显示逻辑
const getAvatarName = (msg) => {
  return msg.username ? msg.username.charAt(0).toUpperCase() : "U";
};

// 筛选会话
const filteredSessions = computed(() => {
  return (sessions.value || []).filter((s) => s.status === activeTab.value);
});

const pendingCount = computed(() => {
  return (sessions.value || []).filter((s) => s.status === "pending").length;
});

const activeCount = computed(() => {
  return (sessions.value || []).filter((s) => s.status === "active").length;
});

const isConnected = computed(() => {
  return wsConnection?.isConnected.value;
});

// 自动滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

// 监听消息变化，自动滚动
watch(
  messages,
  () => {
    scrollToBottom();
  },
  { deep: true }
);

// 处理回车发送
const handleEnter = (e) => {
  if (e.shiftKey) return; // Shift+Enter 允许换行
  sendMessage();
};

// 获取会话列表
const fetchSessions = async () => {
  try {
    const response = await customerApi.getSessions();
    sessions.value = response.data.sessions;
  } catch (error) {
    console.error("获取会话列表失败:", error);
  }
};

// 选择会话
const selectSession = async (session) => {
  if (wsConnection) {
    wsConnection.disconnect();
  }

  currentSession.value = session;
  messages.value = [];

  wsConnection = useWebSocket(session.room_id, token, "chat");

  wsConnection.on("message", (data) => {
    messages.value.push(data);
  });

  wsConnection.connect();

  await fetchMessages(session.room_id);
  scrollToBottom(); // 切换会话时滚动到底部
};

const fetchMessages = async (roomId) => {
  try {
    const response = await chatApi.getMessages(roomId);
    messages.value = response.data || [];
  } catch (error) {
    console.error("获取消息失败:", error);
  }
};

const sendMessage = () => {
  if (!inputMessage.value.trim() || !wsConnection?.isConnected.value) return;

  // 乐观更新：先推入本地，防止网络延迟感觉卡顿（可选）
  // 实际开发中通常等待 socket 回调，这里简化直接发送
  wsConnection.send("message", {
    content: inputMessage.value.trim(),
  });

  inputMessage.value = "";
};

const closeSession = async () => {
  if (!currentSession.value) return;
  try {
    await customerApi.closeSession(currentSession.value.id);
    currentSession.value.status = "closed";
    fetchSessions();
  } catch (error) {
    console.error("关闭会话失败:", error);
  }
};

const getMessageClass = (msg) => {
  if (msg.type === "system") return "system";
  // 假设 currentSession.user_id 是客户ID
  // 如果 msg.user_id 等于客户ID，就是 user (左边)，否则是 admin (右边)
  return msg.user_id === currentSession.value.user_id ? "user" : "admin";
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString("zh-CN", { hour: "2-digit", minute: "2-digit" });
};

const formatTimeShort = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return date.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" });
};

onMounted(() => {
  fetchSessions();
  setInterval(fetchSessions, 10000);
});
</script>

<style scoped>
.fixed-container {
  display: flex;
  background: #f0f2f5;
  overflow: hidden;
  height: 100%;
  width: 100%;
}

/* 左侧栏样式 */
.sidebar {
  height: 100%;
  overflow: hidden;
  width: 280px;
  background: white;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.02);
  z-index: 2;
}

.tabs {
  display: flex;
  padding: 0 8px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 14px 0;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
}

.tab:hover {
  color: #1890ff;
}

.tab.active {
  color: #1890ff;
  font-weight: 500;
}

.tab.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 2px;
  background: #1890ff;
}

.badge {
  background: #ff4d4f;
  color: white;
  padding: 0 6px;
  border-radius: 10px;
  font-size: 12px;
  transform: scale(0.8);
  display: inline-block;
  vertical-align: top;
}

.badge-dot {
  width: 6px;
  height: 6px;
  background: #52c41a;
  border-radius: 50%;
  display: inline-block;
  vertical-align: top;
  margin-top: 5px;
  margin-left: 2px;
}

.session-list {
  flex: 1;
  overflow-y: auto;
}

.session-item {
  display: flex;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f5f5f5;
  align-items: center;
}

.session-item:hover {
  background: #f9f9f9;
}

.session-item.active {
  background: #e6f7ff; /* 选中态使用淡蓝色 */
  border-right: 3px solid #1890ff;
}

.avatar-placeholder {
  width: 40px;
  height: 40px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 12px;
  flex-shrink: 0;
}

.session-info {
  flex: 1;
  overflow: hidden;
}

.session-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.username {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.time {
  font-size: 12px;
  color: #999;
}

.last-message {
  font-size: 12px;
  color: #8c8c8c;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.new-tag {
  font-size: 10px;
  color: #ff4d4f;
  background: #fff1f0;
  border: 1px solid #ffa39e;
  padding: 0 4px;
  border-radius: 2px;
  margin-left: 5px;
}

/* 右侧区域 */
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  height: 100%;
  overflow: hidden;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #bfbfbf;
  background: #f0f2f5;
}

.empty-img {
  font-size: 48px;
  margin-bottom: 20px;
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.chat-header {
  height: 60px;
  padding: 0 24px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  flex-shrink: 0; /* 防止被挤压 */
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.current-username {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.current-id {
  font-size: 12px;
  color: #8c8c8c;
}

.status-indicator {
  font-size: 12px;
  padding: 1px 8px;
  border-radius: 10px;
}
.status-indicator.pending {
  background: #fffbe6;
  color: #faad14;
}
.status-indicator.active {
  background: #f6ffed;
  color: #52c41a;
}
.status-indicator.closed {
  background: #f5f5f5;
  color: #d9d9d9;
}

.btn-danger-outline {
  border: 1px solid #ff4d4f;
  color: #ff4d4f;
  background: white;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}
.btn-danger-outline:hover {
  background: #fff1f0;
}

/* 消息区域 - 核心修复 */
.messages {
  flex: 1;
  padding: 24px;
  overflow-y: auto; /* 这里需要滚动 */
  background: #f0f2f5;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message-row {
  display: flex;
  align-items: flex-start;
  max-width: 80%;
}

.message-row.user {
  align-self: flex-start;
}

/* 管理员（自己）的消息靠右 */
.message-row.admin {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  background: #d9d9d9;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.message-row.admin .message-avatar {
  background: #1890ff;
  margin-left: 12px;
}

.message-row.user .message-avatar {
  background: #faad14;
  margin-right: 12px;
}

.message-bubble-group {
  display: flex;
  flex-direction: column;
}

.message-row.admin .message-bubble-group {
  align-items: flex-end;
}

.message-meta {
  font-size: 12px;
  color: #b0b0b0;
  margin-bottom: 4px;
}

.msg-time {
  margin-left: 8px;
}

.message-bubble {
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  position: relative;
  word-wrap: break-word;
  max-width: 100%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.message-row.user .message-bubble {
  background: white;
  color: #262626;
  border-top-left-radius: 0;
}

.message-row.admin .message-bubble {
  background: #1890ff;
  color: white;
  border-top-right-radius: 0;
}

.system-message {
  align-self: center;
  margin: 10px 0;
}
.system-message span {
  background: #e6e6e6;
  color: #8c8c8c;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 100px;
}

/* 输入区域优化 */
.input-area {
  border-top: 1px solid #e8e8e8;
  padding: 16px 24px;
  background: white;
  flex-shrink: 0;
}

.input-area textarea {
  width: 100%;
  border: none;
  resize: none;
  outline: none;
  font-size: 14px;
  font-family: inherit;
  color: #262626;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 8px;
}

.tip {
  font-size: 12px;
  color: #bfbfbf;
  margin-right: 12px;
}

.btn-primary {
  background: #1890ff;
  color: white;
  border: none;
  padding: 8px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background: #40a9ff;
}

.btn-primary:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
}
</style>