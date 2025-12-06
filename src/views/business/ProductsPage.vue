<template>
  <div class="home-page">
    <SearchHeader
        @search="handleSearch"
        @cart-click="showLoginModal"
        @profile-click="showLoginModal"
        @chat-click="handleCustomerChatClick"
    />

    <div class="page-container">
      <!-- 分类区域 -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">全部分类</h2>
        </div>
        <CategoryList
            :categories="categories"
            :active-id="activeCategoryId"
            @select="handleCategorySelect"
        />
      </section>

      <!-- 商品列表 -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">{{ listTitle }}</h2>
          <div class="section-extra">
            <span v-if="filteredProducts.length > 0" class="result-count">
              共<em>{{ filteredProducts.length }}</em>件商品
            </span>
            <div class="sort-options">
              <a href="#" :class="['sort-item', { active: sortType === 'default' }]"
                 @click.prevent="sortType = 'default'">默认</a>
              <a href="#" :class="['sort-item', { active: sortType === 'price' }]" @click.prevent="sortType = 'price'">价格</a>
              <a href="#" :class="['sort-item', { active: sortType === 'time' }]"
                 @click.prevent="sortType = 'time'">最新</a>
            </div>
          </div>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>加载中...</p>
        </div>

        <div v-else-if="filteredProducts.length === 0" class="empty-state">
          <div class="empty-icon">📦</div>
          <p class="empty-text">暂无商品</p>
          <BaseButton variant="secondary" size="small" @click="handleReset">查看全部商品</BaseButton>
        </div>

        <div v-else class="product-list">
          <ProductCard
              v-for="product in filteredProducts"
              :key="product.id"
              :product="product"
              @click="handleProductClick"
          />
        </div>
      </section>
    </div>

    <!-- 登录弹窗 -->
    <transition name="modal">
      <div v-if="isLoginModalVisible" class="modal-mask" @click="hideLoginModal">
        <div class="modal-wrapper">
          <div class="modal-container" @click.stop>
            <div class="modal-header">
              <h3>选择登录方式</h3>
              <button class="modal-close" @click="hideLoginModal">×</button>
            </div>
            <div class="modal-body">
              <!-- 新的 OAuth 登录网格 -->
              <div class="oauth-grid">
                <button
                    v-for="provider in authStore.availableProviders"
                    :key="provider"
                    @click="handleOAuthLogin(provider)"
                    class="oauth-btn"
                    :class="`oauth-btn-${provider}`"
                >
                  <!-- Google 图标 -->
                  <svg v-if="provider === 'google'" width="20" height="20" viewBox="0 0 24 24">
                    <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"/>
                    <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"/>
                    <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"/>
                    <path
                        d="M12 6.75c1.63 0 3.06.56 4.21 1.65l3.15-3.15C16.94 2.26 14.54 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"/>
                  </svg>

                  <!-- GitHub 图标 -->
                  <svg v-else-if="provider === 'github'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.797 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>

                  <!-- 微信图标（绿色官方色） -->
                  <svg v-else-if="provider === 'wechat'" width="20" height="20" viewBox="0 0 24 24" fill="#07C160">
                    <path
                        d="M9.5 4.5C6.462 4.5 4 6.96 4 9.99c0 1.97 1.113 3.698 2.837 4.586.374.193.506.68.306 1.04l-.56 1.058c-.19.36.14.786.518.786.155 0 .318-.07.418-.197l1.284-1.208c.236-.222.553-.32.87-.27 1.28.2 2.645-.077 3.827-1.005 1.054-2.04.666-4.462-.948-6.03C11.724 6.888 10.7 4.5 9.5 4.5z"/>
                    <path
                        d="M19.5 14.5c-3.038 0-5.5 2.46-5.5 5.5 0 1.63.715 3.182 1.96 4.242.374.32.47.88.237 1.302l-.56 1.058c-.19.36.14.786.518.786.155 0 .318-.07.418-.197l1.284-1.208c.236-.222.553-.32.87-.27 1.28.2 2.645-.077 3.827-1.005 1.054-2.04.666-4.462-.948-6.03-.832-1.862-1.856-4.25-3.106-4.25z"/>
                  </svg>

                  <!-- 显示文字 -->
                  <span class="provider-text">{{
                      provider === 'google' ? 'Google' : provider === 'github' ? 'GitHub' : '微信'
                    }} 登录</span>
                </button>
              </div>

              <p class="login-tip" style="margin-top: 24px; color: #999;">
                授权即代表您同意 <a href="#" style="color: #ff6700;">《用户协议》</a> 和 <a href="#"
                                                                                          style="color: #ff6700;">《隐私政策》</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 客服聊天组件 -->
    <CustomerServiceChat
        v-if="authStore.isAuthenticated"
        ref="customerServiceRef"
        :token="authStore.accessToken"
    />
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import SearchHeader from "@/views/business/SearchHeader.vue";
import CategoryList from "@/views/business/CategoryList.vue";
import ProductCard from "@/views/business/ProductCard.vue";
import BaseButton from "@/views/base/BaseButton.vue";
import CustomerServiceChat from "@/components/CustomerServiceChat.vue";
import {useAuthStore} from "@/stores/auth.js";
const customerServiceRef = ref(null);

const authStore = useAuthStore();
// Mock API
const mockApi = {
  async getCategories() {
    await this.delay(300);
    return [
      {id: 1, name: '数码电子', icon: '📱'},
      {id: 2, name: '服装配饰', icon: '👕'},
      {id: 3, name: '图书音像', icon: '📚'},
      {id: 4, name: '家居家电', icon: '🏠'},
      {id: 5, name: '游戏设备', icon: '🎮'},
      {id: 6, name: '文创手工', icon: '🎨'},
      {id: 7, name: '运动户外', icon: '⚽'},
      {id: 8, name: '美妆护肤', icon: '💄'}
    ];
  },

  async getProducts() {
    await this.delay(500);
    return [
      {
        id: 1,
        title: '苹果 iPhone 13 Pro 256G 远峰蓝 国行正品',
        price: 4999,
        originalPrice: 7999,
        condition: '95新',
        image: 'iPhone 13 Pro',
        categoryId: 1,
        views: 128
      },
      {
        id: 2,
        title: 'MacBook Air M1 8G+256G 2020款 银色 轻薄便携',
        price: 5299,
        originalPrice: 7999,
        condition: '90新',
        image: 'MacBook Air',
        categoryId: 1,
        views: 89
      },
      {
        id: 3,
        title: 'Apple AirPods Pro 2代 主动降噪 无线充电',
        price: 1299,
        originalPrice: 1899,
        condition: '99新',
        image: 'AirPods Pro',
        categoryId: 1,
        views: 256
      },
      {
        id: 4,
        title: '索尼A7M3 全画幅微单相机 含镜头套装',
        price: 8999,
        originalPrice: 13999,
        condition: '85新',
        image: '索尼相机',
        categoryId: 1,
        views: 67
      },
      {
        id: 5,
        title: 'Nintendo Switch 续航版 国行 游戏机',
        price: 1699,
        originalPrice: 2099,
        condition: '95新',
        image: 'Switch',
        categoryId: 5,
        views: 145
      },
      {
        id: 6,
        title: '戴森 Dyson HD08 吹风机 红色 高端护发',
        price: 1899,
        originalPrice: 2990,
        condition: '90新',
        image: '戴森',
        categoryId: 4,
        views: 98
      },
      {
        id: 7,
        title: 'iPad Pro 2021 11寸 256G WiFi版 深空灰',
        price: 4299,
        originalPrice: 6299,
        condition: '95新',
        image: 'iPad',
        categoryId: 1,
        views: 176
      },
      {
        id: 8,
        title: 'Sony WH-1000XM5 降噪耳机 黑色 旗舰级音质',
        price: 1899,
        originalPrice: 2799,
        condition: '99新',
        image: '索尼耳机',
        categoryId: 1,
        views: 203
      },
      {
        id: 9,
        title: 'Kindle Paperwhite 第11代 8G 墨水屏阅读器',
        price: 599,
        originalPrice: 998,
        condition: '95新',
        image: 'Kindle',
        categoryId: 3,
        views: 134
      },
      {
        id: 10,
        title: '小米扫地机器人 Pro 智能规划 自动回充',
        price: 1299,
        originalPrice: 2199,
        condition: '90新',
        image: '扫地机器人',
        categoryId: 4,
        views: 87
      }
    ];
  },

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

const categories = ref([]);
const products = ref([]);
const loading = ref(false);
const activeCategoryId = ref(null);
const searchKeyword = ref('');
const isLoginModalVisible = ref(false);
const sortType = ref('default');

const filteredProducts = computed(() => {
  let result = products.value;

  if (activeCategoryId.value) {
    result = result.filter(p => p.categoryId === activeCategoryId.value);
  }

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(p => p.title.toLowerCase().includes(keyword));
  }

  return result;
});

const listTitle = computed(() => {
  if (searchKeyword.value) return `"${searchKeyword.value}" 的搜索结果`;
  if (activeCategoryId.value) {
    const category = categories.value.find(c => c.id === activeCategoryId.value);
    return category ? category.name : '推荐商品';
  }
  return '推荐商品';
});

const fetchData = async () => {
  loading.value = true;
  try {
    const [cats, prods] = await Promise.all([
      mockApi.getCategories(),
      mockApi.getProducts()
    ]);
    categories.value = cats;
    products.value = prods;
  } catch (error) {
    console.error('获取数据失败:', error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = (keyword) => {
  searchKeyword.value = keyword;
  activeCategoryId.value = null;
};

const handleCategorySelect = (category) => {
  activeCategoryId.value = activeCategoryId.value === category.id ? null : category.id;
  searchKeyword.value = '';
};

const handleProductClick = (product) => {
  showLoginModal();
  console.log('查看商品:', product);
};

const handleReset = () => {
  activeCategoryId.value = null;
  searchKeyword.value = '';
};

const showLoginModal = () => {
  if (!authStore.isAuthenticated) {
    isLoginModalVisible.value = true;
  } else {
    document.body.style.overflow = 'hidden';
  }
};

const hideLoginModal = () => {
  isLoginModalVisible.value = false;
  document.body.style.overflow = '';
};
//  登录认证
const handleOAuthLogin = async (provider) => {
  try {
    await authStore.loginWithOAuth(provider,false);
    hideLoginModal();
    await customerServiceRef.value?.openChat();
  } catch (err) {
    console.log('登录失败')
  }
};

// 客服点击事件
const handleCustomerChatClick = () => {
  if (!authStore.isAuthenticated) {
    showLoginModal();
  } else {
    customerServiceRef.value?.openChat();
  }
};
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px 40px;
}

.section {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e8e8e8;
}

.section-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.section-extra {
  display: flex;
  align-items: center;
  gap: 20px;
}

.result-count {
  font-size: 12px;
  color: #999;
}

.result-count em {
  color: #ff6700;
  font-style: normal;
  font-weight: bold;
  margin: 0 2px;
}

.sort-options {
  display: flex;
  gap: 16px;
}

.oauth-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 10px;
}

.oauth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px 20px;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.oauth-btn:hover {
  border-color: #ff6700;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.provider-text {
  font-weight: 500;
}

/* 手机端两列 */
@media (min-width: 480px) {
  .oauth-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.sort-item {
  font-size: 14px;
  color: #666;
  text-decoration: none;
  transition: color 0.2s;
}

.sort-item:hover,
.sort-item.active {
  color: #ff6700;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}

.loading-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 4px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f0f0;
  border-top-color: #ff6700;
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-state p {
  color: #999;
  font-size: 14px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 4px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  color: #999;
  font-size: 14px;
  margin-bottom: 20px;
}

/* 登录弹窗 */
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-container {
  width: 400px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e8e8e8;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 28px;
  color: #999;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: #666;
}

.modal-body {
  padding: 30px 24px;
  text-align: center;
}

.qr-code {
  margin-bottom: 20px;
}

.qr-placeholder {
  width: 200px;
  height: 200px;
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.qr-icon {
  font-size: 48px;
  opacity: 0.5;
}

.qr-placeholder p {
  margin: 0;
  color: #ccc;
  font-size: 12px;
}

.login-tip {
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
}

.login-tip strong {
  color: #ff6700;
}

.login-benefits {
  text-align: left;
  background: #fafafa;
  padding: 12px 16px;
  border-radius: 4px;
}

.login-benefits p {
  margin: 0;
  padding: 4px 0;
  color: #999;
  font-size: 12px;
  line-height: 1.6;
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: all 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}

@media (max-width: 768px) {
  .product-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .modal-container {
    width: 90%;
    margin: 0 16px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .section-extra {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
