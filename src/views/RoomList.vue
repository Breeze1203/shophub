<template>
  <div class="room-list-page">
    <!-- 顶部搜索栏 -->
    <div class="search-bar">
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索房间名称..."
            class="search-input"
        />
      </div>

      <select v-model="filterType" class="filter-select">
        <option value="all">全部类型</option>
        <option value="code">💻 代码编辑器</option>
        <option value="whiteboard">🎨 白板</option>
        <option value="chat">💬 聊天室</option>
        <option value="video">📹 视频会议</option>
      </select>

      <button @click="$router.push('/dashboard/create')" class="btn-create">
        ➕ 创建房间
      </button>
    </div>

    <!-- 房间列表 -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="loadRooms" class="btn-retry">重试</button>
    </div>

    <div v-else-if="filteredRooms.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <h3>没有找到房间</h3>
      <p>试试创建一个新房间吧！</p>
      <button @click="$router.push('/dashboard/create')" class="btn-primary">
        创建房间
      </button>
    </div>

    <div v-else class="rooms-grid">
      <div
          v-for="room in filteredRooms"
          :key="room.id"
          @click="joinRoom(room)"
          class="room-card"
      >
        <div class="room-header">
          <div class="room-icon" :class="`icon-${room.type}`">
            {{ getRoomIcon(room.type) }}
          </div>
          <div class="room-badges">
            <span v-if="room.is_active" class="badge active">
              <span class="pulse-dot"></span>
              活跃
            </span>
            <span class="badge privacy" :class="room.privacy">
              {{ getPrivacyText(room.privacy) }}
            </span>
          </div>
        </div>

        <div class="room-body">
          <h3>{{ room.name }}</h3>
          <p class="room-description">
            {{ room.description || '暂无描述' }}
          </p>

          <div class="room-meta">
            <span class="meta-item">
              <span class="meta-icon">👥</span>
              {{ room.online_users || 0 }} 在线
            </span>
            <span class="meta-item">
              <span class="meta-icon">🕐</span>
              {{ formatTime(room.created_at) }}
            </span>
          </div>
        </div>

        <div class="room-footer">
          <div class="room-owner">
            创建者: {{ room.owner_name || '未知' }}
          </div>
          <button class="btn-join" @click.stop="joinRoom(room)">
            加入 →
          </button>
        </div>
      </div>
    </div>

    <!-- 密码输入弹窗 -->
    <div v-if="showPasswordModal" class="modal-overlay" @click="showPasswordModal = false">
      <div class="modal-content" @click.stop>
        <h3>🔒 房间需要密码</h3>
        <p>{{ selectedRoom?.name }}</p>
        <input
            v-model="roomPassword"
            type="password"
            placeholder="请输入房间密码"
            class="password-input"
            @keyup.enter="confirmJoin"
        />
        <div class="modal-actions">
          <button @click="showPasswordModal = false" class="btn-cancel">
            取消
          </button>
          <button @click="confirmJoin" class="btn-confirm">
            确认
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from "@/api/http.js";

const router = useRouter();

// 状态
const rooms = ref([]);
const loading = ref(true);
const error = ref('');
const searchQuery = ref('');
const filterType = ref('all');
const showPasswordModal = ref(false);
const selectedRoom = ref(null);
const roomPassword = ref('');

// 加载房间列表
const loadRooms = async () => {
  loading.value = true;
  error.value = '';

  try {
    const response = await api.get('/rooms');
    rooms.value = response.data;
  } catch (err) {
    console.error('加载房间列表失败:', err);
    error.value = '加载失败，请重试';
  } finally {
    loading.value = false;
  }
};

// 过滤房间
const filteredRooms = computed(() => {
  let result = rooms.value;

  // 按类型过滤
  if (filterType.value !== 'all') {
    result = result.filter(room => room.type === filterType.value);
  }

  // 按搜索关键词过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(room =>
        room.name.toLowerCase().includes(query) ||
        (room.description && room.description.toLowerCase().includes(query))
    );
  }

  return result;
});

// 加入房间
const joinRoom = (room) => {
  if (room.privacy === 'password') {
    selectedRoom.value = room;
    showPasswordModal.value = true;
  } else {
    enterRoom(room);
  }
};

// 确认加入（密码保护的房间）
const confirmJoin = async () => {
  if (!roomPassword.value) {
    alert('请输入密码');
    return;
  }

  try {
    await api.post(`/rooms/${selectedRoom.value.id}/join`, {
      password: roomPassword.value
    });

    showPasswordModal.value = false;
    roomPassword.value = '';
    enterRoom(selectedRoom.value);
  } catch (err) {
    alert(err.response?.data?.error || '密码错误');
  }
};

// 进入房间
const enterRoom = (room) => {
  const routes = {
    code: '/editor',
    whiteboard: '/whiteboard',
    chat: '/chat',
    video: '/video'
  };

  router.push(`${routes[room.type]}/${room.id}`);
};

// 辅助函数
const getRoomIcon = (type) => {
  const icons = {
    code: '💻',
    whiteboard: '🎨',
    chat: '💬',
    video: '📹'
  };
  return icons[type] || '📁';
};

const getPrivacyText = (privacy) => {
  const texts = {
    public: '🌐 公开',
    private: '🔒 私有',
    password: '🔑 密码'
  };
  return texts[privacy] || privacy;
};

const formatTime = (timestamp) => {
  if (!timestamp) return '未知';
  const date = new Date(timestamp);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000 / 60); // 分钟

  if (diff < 1) return '刚刚';
  if (diff < 60) return `${diff} 分钟前`;
  if (diff < 1440) return `${Math.floor(diff / 60)} 小时前`;
  return `${Math.floor(diff / 1440)} 天前`;
};

onMounted(() => {
  loadRooms();
});
</script>

<style scoped>
.room-list-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

.search-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  align-items: center;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-select {
  padding: 12px 40px 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 15px;
  background: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
}

.btn-create {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.loading,
.error-state,
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 24px;
  color: #333;
  margin-bottom: 12px;
}

.empty-state p {
  color: #666;
  margin-bottom: 24px;
}

.btn-primary,
.btn-retry {
  padding: 12px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover,
.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.room-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s;
}

.room-card:hover {
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(102, 126, 234, 0.15);
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.room-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.room-badges {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;
}

.badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.badge.active {
  background: #d1fae5;
  color: #065f46;
}

.badge.privacy {
  background: #e0e7ff;
  color: #3730a3;
}

.badge.privacy.password {
  background: #fef3c7;
  color: #92400e;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.room-body h3 {
  font-size: 18px;
  color: #212529;
  margin-bottom: 8px;
}

.room-description {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 16px;
  line-height: 1.5;
}

.room-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #868e96;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.room-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f1f3f5;
}

.room-owner {
  font-size: 13px;
  color: #868e96;
}

.btn-join {
  padding: 8px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-join:hover {
  transform: scale(1.05);
}

/* 密码弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 32px;
  border-radius: 16px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-content h3 {
  font-size: 20px;
  margin-bottom: 12px;
  color: #212529;
}

.modal-content p {
  color: #6c757d;
  margin-bottom: 20px;
}

.password-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 15px;
  margin-bottom: 20px;
}

.password-input:focus {
  outline: none;
  border-color: #667eea;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-cancel,
.btn-confirm {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-cancel {
  background: #f1f3f5;
  color: #495057;
}

.btn-confirm {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
  }

  .rooms-grid {
    grid-template-columns: 1fr;
  }
}
</style>
