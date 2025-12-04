<template>
  <header class="site-header">
    <!-- 顶部栏 -->
    <div class="top-bar">
      <div class="container">
        <div class="top-nav">
          <span class="welcome">欢迎来到怪叽叽!</span>
          <div class="top-actions">
            <a href="#" class="link" @click.prevent="goToSellerLogin">卖家中心</a>
            <a href="#" class="link">客户服务</a>
            <a href="#" class="link" @click.prevent="$emit('profile-click')">我的订单</a>
          </div>
        </div>
      </div>
    </div>

    <!-- 主导航栏 -->
    <div class="main-header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <h1>{{ title }}</h1>
          </div>

          <div class="search-box">
            <BaseInput
                v-model="searchQuery"
                placeholder="搜索怪叽叽..."
                @enter="handleSearch"
            />
            <BaseButton @click="handleSearch" size="medium">搜索</BaseButton>
          </div>

          <div class="header-actions">
            <button class="action-btn" @click="$emit('cart-click')">
              <span class="icon">🛒</span>
              <span class="text">购物车</span>
            </button>
            <button class="action-btn" @click="$emit('profile-click')">
              <span class="icon">👤</span>
              <span class="text">我的</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 导航菜单 -->
    <div class="nav-menu">
      <div class="container">
        <nav class="nav-list">
          <a href="#" class="nav-item active">首页</a>
          <a href="#" class="nav-item">数码</a>
          <a href="#" class="nav-item">图书</a>
          <a href="#" class="nav-item">服饰</a>
          <a href="#" class="nav-item">家电</a>
          <a href="#" class="nav-item">游戏</a>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import BaseInput  from "@/views/base/BaseInput.vue";
import BaseButton from "@/views/base/BaseButton.vue";
import { useRouter } from 'vue-router'
const router = useRouter()

const props = defineProps({
  title: {
    type: String,
    default: '怪叽叽'
  }
});

const emit = defineEmits(['search', 'cart-click', 'profile-click']);

const searchQuery = ref('');

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value);
  }
};
const goToSellerLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.site-header {
  margin-bottom: 20px;
  position: sticky;
  top: 0;
  background: #ffffff;
  z-index: 1000;
  transition: box-shadow 0.3s;
}

.site-header.is-fixed {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* 顶部栏 */
.top-bar {
  background: #ffffff;
  height: 30px;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  font-size: 12px;
  color: #666;
}

.welcome {
  color: #999;
}

.top-actions {
  display: flex;
  gap: 16px;
}

.link {
  color: #666;
  text-decoration: none;
  transition: color 0.2s;
}

.link:hover {
  color: #ff6700;
}

/* 主导航 */
.main-header {
  padding: 20px 0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 30px;
}

.logo {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.logo h1 {
  font-size: 24px;
  font-weight: bold;
  color: #ff6700;
  margin: 0;
  line-height: 1;
}

.slogan {
  font-size: 12px;
  color: #999;
}

.search-box {
  flex: 1;
  max-width: 550px;
  display: flex;
  gap: 0;
}

.search-box .base-input {
  border-radius: 4px 0 0 4px;
  border-right: none;
}

.search-box .base-button {
  border-radius: 0 4px 4px 0;
  width: 100px;
}

.header-actions {
  display: flex;
  gap: 20px;
}

.action-btn {
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
  padding: 0;
}

.action-btn:hover {
  color: #ff6700;
}

.action-btn .icon {
  font-size: 20px;
}

.action-btn .text {
  font-size: 12px;
}

.nav-list {
  display: flex;
  gap: 40px;
  height: 44px;
  align-items: center;
}

.nav-item {
  color: #333;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
  position: relative;
}

.nav-item:hover,
.nav-item.active {
  color: #ff6700;
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 0;
  right: 0;
  height: 2px;
  background: #ff6700;
}

@media (max-width: 768px) {
  .top-bar {
    display: none;
  }

  .header-content {
    flex-wrap: wrap;
    gap: 12px;
  }

  .search-box {
    order: 3;
    flex-basis: 100%;
    max-width: none;
  }

  .nav-list {
    overflow-x: auto;
    gap: 20px;
  }
}
</style>