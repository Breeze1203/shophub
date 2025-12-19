<template>
  <header class="site-header">
    <!-- 顶部栏 -->
    <div class="top-bar">
      <div class="container">
        <div class="top-nav">
          <span class="welcome">欢迎来到怪叽叽!</span>
          <div class="top-actions">
            <a
              href="#"
              class="link"
              @click.prevent="goToSellerLogin"
            >卖家中心</a>
            <a
              href="#"
              class="link"
              @click.prevent="$emit('chat-click')"
            >系统服务</a>
            <a
              v-if="authStore.isAuthenticated"
              href="#"
              class="link"
              @click.prevent="$emit('logout-click')"
            >退出登录</a>
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
            <BaseButton
              @click="handleSearch"
              size="medium"
            >搜索</BaseButton>
          </div>

          <div class="header-actions">
            <button
              class="action-btn"
              @click="$emit('cart-click')"
            >
              <img
                src="/icons/cart.svg"
                class="icon"
                alt="订单图标"
              />
              <span class="text">购物车</span>
            </button>
            <button
              class="action-btn"
              @click="$emit('orders-click')"
            >
              <img
                src="/icons/me.svg"
                class="icon"
                alt="订单图标"
              />
              <span class="text">我的订单</span>
            </button>
            <button
              class="action-btn"
              @click="$emit('star-click')"
            >
              <img
                src="/icons/star.svg"
                class="icon"
                alt="订单图标"
              />
              <span class="text">我的收藏</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 导航菜单 -->
    <div class="nav-menu">
      <div class="container">
        <nav class="nav-list">
          <a
            class="nav-item"
            @click.prevent="$emit('handle-category',0)"
          >
            首页
          </a>

          <a
            v-for="item in categories"
            :key="item.id"
            class="nav-item"
            @click.prevent="$emit('handle-category',item.id)"
          >
            {{ item.name }}
          </a>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { onMounted, ref } from "vue";
import BaseInput from "@/views/base/BaseInput.vue";
import BaseButton from "@/views/base/BaseButton.vue";
import { useRouter } from "vue-router";
const router = useRouter();
import { useAuthStore } from "@/stores/auth.js";
import { productApi } from "@/api/business/product";
const authStore = useAuthStore();
const categories = ref([]);

const props = defineProps({
  title: {
    type: String,
    default: "怪叽叽",
  },
});

const emit = defineEmits([
  "search",
  "cart-click",
  "orders-click",
  "chat-click",
  "logout-click",
  "handle-category",
  "star-click",
]);

const searchQuery = ref("");

// 初始化所有分类
const loadCategories = async () => {
  try {
    const res = await productApi.getCategories();
    categories.value = res.data;
    console.log(categories.value);
  } catch (e) {
    console.error("加载分类失败", e);
  } finally {
  }
};

onMounted(() => {
  loadCategories();
});
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit("search", searchQuery.value);
  }
};
const goToSellerLogin = () => {
  router.push("/login");
};
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
  color: #667eea;
}

/* 主导航 */
.main-header {
  padding: 20px 0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: center;
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
  color: #667eea;
  margin: 0;
  line-height: 1;
}

.search-box {
  flex: 1;
  max-width: 550px;
  display: flex;
  gap: 0;
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
  color: #764ba2;
}

.action-btn .icon {
  width: 25px;
  height: 25px;
  margin-right: 8px;
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
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
  position: relative;
}

.nav-item:hover {
  color: #764ba2;
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
