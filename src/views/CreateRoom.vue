<template>
  <div class="page create-page">
    <div class="room-types">
      <div
          v-for="type in roomTypes"
          :key="type.id"
          @click="selectedType = type.id"
          :class="['room-type-card', { selected: selectedType === type.id }]"
      >
        <div class="type-icon">{{ type.icon }}</div>
        <h4>{{ type.name }}</h4>
        <p>{{ type.desc }}</p>
      </div>
    </div>

    <div class="form-section">
      <div class="form-group">
        <label>房间名称</label>
        <input
            v-model="roomName"
            type="text"
            placeholder="例如：摸鱼聊天"
            class="input"
            @keyup.enter="createRoom"
        />
      </div>

      <div class="form-group">
        <label>房间描述 (可选)</label>
        <textarea
            v-model="roomDescription"
            placeholder="简单描述一下这个房间的用途..."
            class="textarea"
            rows="3"
        ></textarea>
      </div>

      <div class="form-group" v-if="selectedType === 'code'">
        <label>默认编程语言</label>
        <select v-model="defaultLanguage" class="select">
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="go">Go</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
      </div>

      <div class="form-group">
        <label>权限设置</label>
        <select v-model="privacy" class="select">
          <option value="public">🌐 公开 - 任何人可加入</option>
          <option value="private">🔒 私有 - 仅邀请</option>
          <option value="password">🔑 密码保护</option>
        </select>
      </div>

      <div class="form-group" v-if="privacy === 'password'">
        <label>房间密码</label>
        <input
            v-model="roomPassword"
            type="password"
            placeholder="设置房间密码"
            class="input"
        />
      </div>

      <div class="error-message" v-if="error">
        {{ error }}
      </div>

      <button
          @click="createRoom"
          :disabled="loading || !roomName.trim()"
          class="btn btn-primary btn-block"
      >
        <span v-if="loading">创建中...</span>
        <span v-else>✨ 创建房间</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import {roomsApi} from "@/api/rooms.js";

const router = useRouter();
const authStore = useAuthStore();

// 表单数据
const selectedType = ref('chat');
const roomName = ref('');
const roomDescription = ref('');
const defaultLanguage = ref('javascript');
const privacy = ref('public');
const roomPassword = ref('');

// 状态
const loading = ref(false);
const error = ref('');

// 房间类型配置
const roomTypes = [
  {
    id: 'code',
    name: '代码编辑器',
    icon: '💻',
    desc: '实时协作写代码',
    route: '/editor'
  },
  {
    id: 'whiteboard',
    name: '白板',
    icon: '🎨',
    desc: '可视化头脑风暴',
    route: '/whiteboard'
  },
  {
    id: 'chat',
    name: '聊天室',
    icon: '💬',
    desc: '文字与语音交流',
    route: '/chat'
  },
  {
    id: 'video',
    name: '视频会议',
    icon: '📹',
    desc: '面对面沟通',
    route: '/video'
  },
];

// 创建房间
const createRoom = async () => {
  // 验证
  if (!roomName.value.trim()) {
    error.value = '请输入房间名称';
    return;
  }

  if (privacy.value === 'password' && !roomPassword.value) {
    error.value = '请设置房间密码';
    return;
  }
  loading.value = true;
  error.value = '';

  try {
    // 构建请求数据
    const roomData = {
      name: roomName.value.trim(),
      description: roomDescription.value.trim(),
      type: selectedType.value,
      privacy: privacy.value,
      password: privacy.value === 'password' ? roomPassword.value : undefined,
      language: selectedType.value === 'code' ? defaultLanguage.value : undefined,
      owner_id: authStore.user?.id,
    };

    // 调用后端 API 创建房间
    const response = await roomsApi.createRoom(roomData);
    const createdRoom = response.data;

    // 创建成功，跳转到对应的房间
    const roomType = roomTypes.find(t => t.id === selectedType.value);
    router.push(`${roomType.route}/${createdRoom.id}`);
  } catch (err) {
    console.error('创建房间失败:', err);
    error.value = err.response?.data?.error || '创建房间失败，请重试';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.create-page {
  max-width: 900px;
  margin: 0 auto;
}

.room-types {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.room-type-card {
  padding: 24px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.room-type-card:hover {
  border-color: #cbd5e1;
  transform: translateY(-2px);
}

.type-icon {
  font-size: 36px;
  margin-bottom: 12px;
}

.room-type-card h4 {
  font-size: 16px;
  color: #212529;
  margin-bottom: 6px;
}

.room-type-card p {
  font-size: 13px;
  color: #6c757d;
  margin: 0;
}

.form-section {
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
}

.input,
.textarea,
.select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  font-family: inherit;
  background-color: white;
}

.select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
   background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;
  cursor: pointer;
}

.select::-ms-expand {
  display: none;
}

.textarea {
  resize: vertical;
  min-height: 80px;
}

.input:focus,
.textarea:focus,
.select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.error-message {
  padding: 12px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  color: #c33;
  font-size: 14px;
  margin-bottom: 16px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-block {
  width: 100%;
}

@media (max-width: 768px) {
  .room-types {
    grid-template-columns: 1fr;
  }
}
</style>
