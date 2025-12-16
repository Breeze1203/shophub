<template>
  <div class="dashboard">
    <header class="header">
      <div class="header-left">
        <div class="logo">
          <span class="logo-icon">🚀</span>
          <span class="logo-text">ShopHub</span>
        </div>
      </div>

      <div class="header-right">
        <div class="user-info">
          <span class="user-greeting">你好，{{ user?.username || '访客' }}</span>
          <div class="user-avatar" :style="{ background: getAvatarColor() }">
            {{ getUserInitial() }}
          </div>
          <button @click="handleLogout" class="logout-btn">logout</button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="prototype-container">
        <aside class="sidebar">
          <nav class="nav-list">
            <router-link
                v-for="page in pages"
                :key="page.id"
                :to="`/dashboard/${page.id}`"
                class="nav-item"
                active-class="active"
            >
              <span class="nav-icon">{{ page.icon }}</span>
              <span class="nav-label">{{ page.label }}</span>
            </router-link>
          </nav>
        </aside>

        <div class="content-area">
          <div class="content-header">
            <h2>{{ currentPageInfo.label }}</h2>
            <p>{{ currentPageInfo.description }}</p>
          </div>
          <div class="content-body">
            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component"/>
              </transition>
            </router-view>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import {useRoute} from 'vue-router';
import {useAuthStore} from '@/stores/auth.js';
const route = useRoute();
const authStore = useAuthStore();
const user = computed(() => authStore.user);

// 页面配置
const pages = [
  {
    id: 'home',
    label: '首页',
    icon: '🏠',
    description: '产品概览与快速入口',
  },
  {
    id: 'create',
    label: '创建房间',
    icon: '➕',
    description: '选择房间类型并创建',
  },
  {
    id: 'rooms',
    label: '房间列表',
    icon: '🚪',
    description: '我的房间',
  },
  {
    id: 'features',
    label: '核心功能',
    icon: '✨',
    description: '产品功能特性展示',
  },
  {
    id: 'customer',
    label: '客户服务',
    icon: '✨',
    description: '在线客户服务功能',
  }
];

const currentPageInfo = computed(() => {
  const currentId = route.path.split('/').pop() || 'home';
  return pages.find(p => p.id === currentId) || pages[0];
});

const getUserInitial = () => {
  return user.value?.username?.charAt(0).toUpperCase() || 'G';
};

const getAvatarColor = () => {
  const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#ff6b6b'];
  const index = user.value?.id ? user.value.id % colors.length : 0;
  return colors[index];
};

const handleLogout = () => {
  authStore.logout();
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dashboard {
  min-height: 100vh;
  background: #f8f9fa;
}

/* ===== 顶部导航栏 ===== */
.header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-greeting {
  font-size: 14px;
  color: #666;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 14px;
}

.logout-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #f1f3f5;
  color: #495057;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #e9ecef;
}

/* ===== 主内容区 ===== */
.main-content {
  width: 100%;
  margin: 0 auto;
  padding: 14px;
  height: calc(100vh - 68px); /* 减去 header 的高度 */
}

.prototype-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  height: 100%;
  overflow: hidden;
}

.sidebar {
  width: 240px;
  background: #f8f9fa;
  padding: 24px 16px;
  border-right: 1px solid #e9ecef;
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  text-decoration: none;
  color: inherit;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  color: #495057;
  text-align: left;
}

.nav-item:hover {
  background: rgba(102, 126, 234, 0.08);
}


.nav-icon {
  font-size: 18px;
}

/* ===== 内容区 ===== */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-header {
  padding: 28px 32px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: baseline;
  gap: 16px;
}

.content-header h2 {
  font-size: 24px;
  color: #212529;
  margin-bottom: 8px;
}

.content-header p {
  font-size: 14px;
  color: #6c757d;
}

.content-body {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}



@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== 响应式 (仅布局) ===== */
@media (max-width: 768px) {
  .header {
    padding: 12px 16px;
  }

  .main-content {
    padding: 16px;
  }

  .prototype-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e9ecef;
  }

  .nav-list {
    flex-direction: row;
    overflow-x: auto;
  }

  .nav-item {
    white-space: nowrap;
  }
}
</style>
