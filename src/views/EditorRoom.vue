<template>
  <div class="editor-room">
    <!-- 顶部工具栏 -->
    <header class="editor-header">
      <div class="header-left">
        <button @click="$router.push('/dashboard/rooms.js')" class="btn-back">
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
        <!-- 在线用户 -->
        <div class="online-users">
          <div
              v-for="user in onlineUsers"
              :key="user.user_id"
              class="user-badge"
              :style="{ background: user.color }"
              :title="user.username"
          >
            {{ user.username.charAt(0).toUpperCase() }}
          </div>
          <span class="user-count">{{ onlineUsers.length }} 在线</span>
        </div>

        <button @click="saveCode" :disabled="saving" class="btn-save">
          {{ saving ? '保存中...' : '💾 保存' }}
        </button>
      </div>
    </header>

    <!-- 编辑器主体 -->
    <div class="editor-container">
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
        <p>加载编辑器...</p>
      </div>

      <textarea
          v-else
          ref="editorTextarea"
          v-model="code"
          @input="handleInput"
          @keydown="handleKeyDown"
          class="code-textarea"
          placeholder="开始编写代码..."
          spellcheck="false"
      ></textarea>

      <!-- 其他用户的光标 -->
      <div class="remote-cursors">
        <div
            v-for="(cursor, userId) in remoteCursors"
            :key="userId"
            class="cursor-marker"
            :style="{
            top: cursor.line * 20 + 'px',
            left: cursor.column * 8 + 'px',
            borderColor: cursor.color
          }"
        >
          <span class="cursor-label" :style="{ background: cursor.color }">
            {{ cursor.username }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, onUnmounted, watch, nextTick } from 'vue';
import { useRoute, onBeforeRouteLeave } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useWebSocket } from '@/composables/useWebSocket';
import api from "@/api/http.js";

const route = useRoute();
const authStore = useAuthStore();

const roomId = route.params.id;
const roomName = ref('代码编辑器');
const code = ref('');
const loading = ref(true);
const saving = ref(false);
const editorTextarea = ref(null);
const isUnmounting = ref(false);

// WebSocket
const token = localStorage.getItem('access_token');
const { connect, send, on, disconnect, isConnected } = useWebSocket(roomId, token, 'chat');

// 在线用户和光标
const onlineUsers = ref([]);
const remoteCursors = ref({});

// 定时器
let pollingTimer = null;
let autoSaveTimer = null;

// 本地编辑标志
let isLocalChange = false;

// ==================== 在线用户管理 ====================

// 从后端获取在线用户列表
const fetchOnlineUsers = async () => {
  if (isUnmounting.value) return;

  try {
    const response = await api.get(`/chat/${roomId}/online-users`);
    onlineUsers.value = response.data.users || [];
    console.log('在线用户列表已更新:', onlineUsers.value.length, '人');
  } catch (error) {
    console.error('获取在线用户失败:', error);
  }
};

// 开始定时轮询
const startPollingUsers = () => {
  fetchOnlineUsers();

  pollingTimer = setInterval(() => {
    fetchOnlineUsers();
  }, 5000);

  console.log('开始轮询在线用户列表（每5秒）');
};

// 停止轮询
const stopPollingUsers = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
    console.log('停止轮询在线用户列表');
  }
};

// ==================== WebSocket 事件处理 ====================

const handleInit = (payload) => {
  if (isUnmounting.value) return;
  console.log('WebSocket 初始化成功');

  code.value = payload.document?.content || '';
  remoteCursors.value = payload.cursors || {};

  // 初始化时刷新在线列表
  fetchOnlineUsers();
};

const handleOperation = (payload) => {
  if (isUnmounting.value) return;
  console.log('收到操作:', payload);
  applyRemoteOperation(payload);
};

const handleCursor = (payload) => {
  if (isUnmounting.value) return;

  remoteCursors.value[payload.user_id] = {
    username: payload.username,
    color: payload.color,
    line: payload.line,
    column: payload.column
  };
};

const handleUserJoined = (payload) => {
  if (isUnmounting.value) return;
  console.log('用户加入:', payload);

  // 立即刷新在线列表
  fetchOnlineUsers();
};

const handleUserLeft = (payload) => {
  if (isUnmounting.value) return;
  console.log('用户离开:', payload);

  // 立即刷新在线列表
  fetchOnlineUsers();

  // 移除该用户的光标
  delete remoteCursors.value[payload.user_id];
};

const handleError = (payload) => {
  console.error('WebSocket错误:', payload);
};

// ==================== 编辑器逻辑 ====================

// 初始化
onMounted(async () => {
  try {
    const response = await api.get(`/rooms/${roomId}`);
    roomName.value = response.data.name;
    code.value = response.data.content || '';
  } catch (error) {
    console.error('加载房间失败:', error);
  } finally {
    loading.value = false;
  }

  await nextTick();

  // 连接 WebSocket
  connect();

  // 注册事件监听
  on('init', handleInit);
  on('operation', handleOperation);
  on('cursor', handleCursor);
  on('user_joined', handleUserJoined);
  on('user_left', handleUserLeft);
  on('error', handleError);

  // 开始轮询在线用户
  startPollingUsers();
});

// 应用远程操作
const applyRemoteOperation = (operation) => {
  isLocalChange = true;

  if (operation.type === 'insert') {
    const before = code.value.substring(0, operation.position);
    const after = code.value.substring(operation.position);
    code.value = before + operation.text + after;
  } else if (operation.type === 'delete') {
    const before = code.value.substring(0, operation.position);
    const after = code.value.substring(operation.position + operation.length);
    code.value = before + after;
  }

  nextTick(() => {
    isLocalChange = false;
  });
};

// 处理输入
const handleInput = (event) => {
  if (isLocalChange) return;

  const newValue = event.target.value;
  const oldValue = code.value;

  if (newValue.length > oldValue.length) {
    const position = getCursorPosition();
    const text = newValue.substring(position - (newValue.length - oldValue.length), position);

    send('operation', {
      type: 'insert',
      position: position - text.length,
      text: text,
      version: 0
    });
  } else if (newValue.length < oldValue.length) {
    const position = getCursorPosition();

    send('operation', {
      type: 'delete',
      position: position,
      length: oldValue.length - newValue.length,
      version: 0
    });
  }

  updateCursorPosition();
};

// 处理键盘事件
const handleKeyDown = (event) => {
  if (event.key === 'Tab') {
    event.preventDefault();
    document.execCommand('insertText', false, '  ');
  }
};

// 获取光标位置
const getCursorPosition = () => {
  return editorTextarea.value?.selectionStart || 0;
};

// 更新光标位置
const updateCursorPosition = () => {
  const textarea = editorTextarea.value;
  if (!textarea) return;

  const position = textarea.selectionStart;
  const textBeforeCursor = code.value.substring(0, position);
  const lines = textBeforeCursor.split('\n');
  const line = lines.length - 1;
  const column = lines[lines.length - 1].length;

  send('cursor', {
    line,
    column
  });
};

// 保存代码
const saveCode = async () => {
  saving.value = true;

  try {
    await api.put(`/rooms/${roomId}/content`, {
      content: code.value
    });

    send('save', {});
    console.log('代码保存成功');
  } catch (error) {
    console.error('保存失败:', error);
    alert('保存失败');
  } finally {
    saving.value = false;
  }
};

// 定时保存
watch(code, () => {
  if (autoSaveTimer) clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(saveCode, 5000);
});

// ==================== 生命周期 ====================

// 路由离开前清理
onBeforeRouteLeave((to, from, next) => {
  console.log('准备离开编辑器房间');
  isUnmounting.value = true;

  stopPollingUsers();
  disconnect();

  next();
});

// 组件卸载前清理
onBeforeUnmount(() => {
  console.log('编辑器组件开始卸载');
  isUnmounting.value = true;

  stopPollingUsers();
  disconnect();

  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = null;
  }
});

// 最终清理
onUnmounted(() => {
  console.log('编辑器组件已完全卸载');
});
</script>

<style scoped>
.editor-room {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
}

.editor-header {
  background: #2d2d30;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #3e3e42;
  color: white;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.btn-back {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.15);
}

.room-info h2 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
}

.status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #cccccc;
}

.status.connected {
  color: #4ec9b0;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f48771;
}

.status.connected .status-dot {
  background: #4ec9b0;
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.online-users {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-badge {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 14px;
  border: 2px solid #2d2d30;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.user-badge:hover {
  transform: scale(1.1);
}

.user-count {
  font-size: 13px;
  color: #cccccc;
}

.btn-save {
  padding: 8px 20px;
  background: #0e639c;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-save:hover:not(:disabled) {
  background: #1177bb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 99, 156, 0.4);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.editor-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #1e1e1e;
  color: #cccccc;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #3e3e42;
  border-top: 4px solid #569cd6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.code-textarea {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #1e1e1e;
  color: #d4d4d4;
  border: none;
  outline: none;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  tab-size: 2;
}

.code-textarea::selection {
  background: #264f78;
}

.remote-cursors {
  position: absolute;
  top: 20px;
  left: 20px;
  pointer-events: none;
}

.cursor-marker {
  position: absolute;
  width: 2px;
  height: 20px;
  border-left: 2px solid;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.cursor-label {
  position: absolute;
  top: -24px;
  left: -4px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  color: white;
  white-space: nowrap;
  font-weight: 600;
  pointer-events: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* 响应式 */
@media (max-width: 768px) {
  .editor-header {
    padding: 12px 16px;
  }

  .header-left {
    gap: 12px;
  }

  .room-info h2 {
    font-size: 14px;
  }

  .online-users {
    gap: 8px;
  }

  .user-badge {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }

  .user-count {
    font-size: 12px;
  }

  .code-textarea {
    padding: 12px;
    font-size: 13px;
  }
}
</style>
