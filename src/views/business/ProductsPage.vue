<template>
  <div class="home-page">
    <SearchHeader
      @search="handleSearch"
      @cart-click="handleCart"
      @orders-click="handleOrders"
      @logout-click="authStore.logout"
      @chat-click="handleCustomerChatClick"
      @handle-category="handleCategoryTab"
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
            <span
              v-if="filteredProducts.length > 0"
              class="result-count"
            >
              共<em>{{ filteredProducts.length }}</em>件商品
            </span>
            <div class="sort-options">
              <a
                href="#"
                :class="['sort-item', { active: sortType === 'default' }]"
                @click.prevent="sortType = 'default'"
              >默认</a>
              <a
                href="#"
                :class="['sort-item', { active: sortType === 'price' }]"
                @click.prevent="sortType = 'price'"
              >价格</a>
              <a
                href="#"
                :class="['sort-item', { active: sortType === 'time' }]"
                @click.prevent="sortType = 'time'"
              >最新</a>
            </div>
          </div>
        </div>

        <div
          v-if="loading"
          class="loading-state"
        >
          <div class="spinner"></div>
          <p>加载中...</p>
        </div>

        <div
          v-else-if="filteredProducts.length === 0"
          class="empty-state"
        >
          <div class="empty-icon">📦</div>
          <p class="empty-text">暂无商品</p>
          <BaseButton
            variant="secondary"
            size="small"
            @click="handleReset"
          >查看全部商品</BaseButton>
        </div>

        <div
          v-else
          class="product-list"
        >
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :product="product"
            @click="handleProductClick"
          />
        </div>
      </section>
    </div>

    <transition name="login">
      <!-- 登录弹窗 -->
      <div
        v-if="isLoginModalVisible"
        class="modal-mask"
        @click="hideLoginModal"
      >
        <div class="modal-wrapper">
          <div
            class="modal-container"
            @click.stop
          >
            <div class="modal-header">
              <h3>选择登录方式</h3>
              <button
                class="modal-close"
                @click="hideLoginModal"
              >×</button>
            </div>
            <div class="modal-body">
              <!-- 错误提示 -->
              <div
                v-if="error"
                class="error-alert"
              >
                {{ error }}
              </div>
              <!-- 登录表单 -->
              <LoginForm
                :loading="authStore.isLoading"
                @login="handleLocalLogin"
              />
              <!-- 分隔线 -->
              <div class="divider-new">
                <span>或使用第三方登录</span>
              </div>

              <!-- 第三方登录 -->
              <div class="oauth-grid">
                <OAuthButton
                  v-for="provider in authStore.availableProviders"
                  :key="provider"
                  :provider="provider"
                  @login-click="handleOAuthLogin"
                />
              </div>
              <p class="signup-text">
                还没有账户？
                <a @click="switchType('register')">立即注册</a>
              </p>
            </div>
            <div class="footer-links">
              <p>登录即表示您同意我们的</p>
              <div class="links">
                <a href="#">服务条款</a>
                <span>·</span>
                <a href="#">隐私政策</a>
                <span>·</span>
                <a href="#">Cookie政策</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="register">
      <!-- 注册弹窗 -->
      <div
        v-if="isRegisterModalVisible"
        class="modal-mask"
        @click="hideRegisterModal"
      >
        <div class="modal-wrapper">
          <div
            class="modal-container"
            @click.stop
          >
            <div class="modal-header">
              <h3>选择注册方式</h3>
              <button
                class="modal-close"
                @click="hideRegisterModal"
              >×</button>
            </div>
            <div class="modal-body">
              <!-- 错误提示 -->
              <div
                  v-if="error"
                  class="error-alert"
              >
                {{ error }}
              </div>
              <!-- 注册表单 -->
              <RegisterForm
                :loading="authStore.isLoading"
                @login="handleRegister"
              />
              <!-- 分隔线 -->
              <div class="divider-new">
                <span>或使用第三方注册</span>
              </div>

              <!-- 第三方注册 -->
              <div class="oauth-grid">
                <OAuthButton
                  v-for="provider in authStore.availableProviders"
                  :key="provider"
                  :provider="provider"
                  @login-click="handleOAuthSignup"
                />
              </div>
              <p class="signup-text">
                已有账户？
                <a @click="switchType('login')">立即登录</a>
              </p>
            </div>
            <div class="footer-links">
              <p>注册即表示您同意我们的</p>
              <div class="links">
                <a href="#">服务条款</a>
                <span>·</span>
                <a href="#">隐私政策</a>
                <span>·</span>
                <a href="#">Cookie政策</a>
              </div>
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
import { ref, computed, onMounted } from "vue";
import SearchHeader from "@/views/business/SearchHeader.vue";
import CategoryList from "@/views/business/CategoryList.vue";
import ProductCard from "@/views/business/ProductCard.vue";
import BaseButton from "@/views/base/BaseButton.vue";
import CustomerServiceChat from "@/components/CustomerServiceChat.vue";
import LoginForm from "@/views/base/LoginForm.vue";
import OAuthButton from "@/views/base/OAuthButton.vue";
import RegisterForm from "@/views/base/RegisterForm.vue";
import { useAuthStore } from "@/stores/auth.js";
const customerServiceRef = ref(null);
const error = ref("");
import { productApi } from "@/api/business/product";

const authStore = useAuthStore();

const handleLocalLogin = async (data) => {
  loading.value = true;
  error.value = "";
  const result = await authStore.login(
    data.email,
    data.password,
    data.rememberMe
  );
  if (result.success) {
    isLoginModalVisible.value=false;
  } else {
    error.value = result.error;
  }
  loading.value = false;
};

const handleRegister = async (formData) => {
  loading.value = true;
  error.value = "";

  // 验证密码匹配
  if (formData.password !== formData.confirmPassword) {
    error.value = "两次输入的密码不一致";
    loading.value = false;
    return;
  }

  // 验证密码长度
  if (formData.password.length < 8) {
    error.value = "密码至少需要8位字符";
    loading.value = false;
    return;
  }

  const result = await authStore.register(
    formData.email,
    formData.username,
    formData.password,
    "client"
  );

  if (result.success) {
    success.value = "注册成功!";
  } else {
    error.value = result.error;
  }

  loading.value = false;
};

const handleOAuthSignup = async (provider) => {
  loading.value = true;
  error.value = "";

  try {
    await authStore.loginWithOAuth(provider, "client");
  } catch (err) {
    error.value = err.message || "OAuth注册失败";
  }
  loading.value = false;
};

const switchType = (type) => {
  if (type === "register") {
    isLoginModalVisible.value = false;
    isRegisterModalVisible.value = true;
  } else {
    isLoginModalVisible.value = true;
    isRegisterModalVisible.value = false;
  }
};
// Mock API
const mockApi = {
  async getProducts() {
    await this.delay(500);
    return [
      {
        id: 1,
        title: "苹果 iPhone 13 Pro 256G 远峰蓝 国行正品",
        price: 4999,
        originalPrice: 7999,
        condition: "95新",
        image: "iPhone 13 Pro",
        categoryId: 1,
        views: 128,
      },
      {
        id: 2,
        title: "MacBook Air M1 8G+256G 2020款 银色 轻薄便携",
        price: 5299,
        originalPrice: 7999,
        condition: "90新",
        image: "MacBook Air",
        categoryId: 1,
        views: 89,
      },
      {
        id: 3,
        title: "Apple AirPods Pro 2代 主动降噪 无线充电",
        price: 1299,
        originalPrice: 1899,
        condition: "99新",
        image: "AirPods Pro",
        categoryId: 1,
        views: 256,
      },
      {
        id: 4,
        title: "索尼A7M3 全画幅微单相机 含镜头套装",
        price: 8999,
        originalPrice: 13999,
        condition: "85新",
        image: "索尼相机",
        categoryId: 1,
        views: 67,
      },
      {
        id: 5,
        title: "Nintendo Switch 续航版 国行 游戏机",
        price: 1699,
        originalPrice: 2099,
        condition: "95新",
        image: "Switch",
        categoryId: 5,
        views: 145,
      },
      {
        id: 6,
        title: "戴森 Dyson HD08 吹风机 红色 高端护发",
        price: 1899,
        originalPrice: 2990,
        condition: "90新",
        image: "戴森",
        categoryId: 4,
        views: 98,
      },
      {
        id: 7,
        title: "iPad Pro 2021 11寸 256G WiFi版 深空灰",
        price: 4299,
        originalPrice: 6299,
        condition: "95新",
        image: "iPad",
        categoryId: 1,
        views: 176,
      },
      {
        id: 8,
        title: "Sony WH-1000XM5 降噪耳机 黑色 旗舰级音质",
        price: 1899,
        originalPrice: 2799,
        condition: "99新",
        image: "索尼耳机",
        categoryId: 1,
        views: 203,
      },
      {
        id: 9,
        title: "Kindle Paperwhite 第11代 8G 墨水屏阅读器",
        price: 599,
        originalPrice: 998,
        condition: "95新",
        image: "Kindle",
        categoryId: 3,
        views: 134,
      },
      {
        id: 10,
        title: "小米扫地机器人 Pro 智能规划 自动回充",
        price: 1299,
        originalPrice: 2199,
        condition: "90新",
        image: "扫地机器人",
        categoryId: 4,
        views: 87,
      },
    ];
  },

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
};
const allCategories=ref([]);
const currentId=ref(0); //当前分类id
const products = ref([]);
const loading = ref(false);
const activeCategoryId = ref(null);
const searchKeyword = ref("");
const isLoginModalVisible = ref(false);
const isRegisterModalVisible = ref(false);
const sortType = ref("default");

// 计算分类信息
const categories = computed(() => {
  if (currentId.value === 0) {
    return allCategories.value.flatMap(cat => cat.children || [])
  } else {
    const category = allCategories.value.find(cat => cat.id === currentId.value)
    return category ? (category.children || []) : []
  }
})

// 过滤产品信息
const filteredProducts = computed(() => {
  let result = products.value;

  if (activeCategoryId.value) {
    result = result.filter((p) => p.categoryId === activeCategoryId.value);
  }

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter((p) => p.title.toLowerCase().includes(keyword));
  }

  return result;
});

const listTitle = computed(() => {
  if (searchKeyword.value) return `"${searchKeyword.value}" 的搜索结果`;
  if (activeCategoryId.value) {
    const category = categories.value.find(
      (c) => c.id === activeCategoryId.value
    );
    return category ? category.name : "推荐商品";
  }
  return "推荐商品";
});

const fetchData = async () => {
  loading.value = true;
  try {
    // 并发请求
    const [cats, prods] = await Promise.all([
      productApi.getCategories(),
      mockApi.getProducts(),
    ]);
    allCategories.value = cats.data;
    products.value = prods;
  } catch (error) {
    console.error("获取数据失败:", error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = (keyword) => {
  searchKeyword.value = keyword;
  activeCategoryId.value = null;
};

// 切换导航分类路由
const handleCategoryTab=(id)=>{
  currentId.value = id
}
const handleCategorySelect = (category) => {
  activeCategoryId.value =
    activeCategoryId.value === category.id ? null : category.id;
  searchKeyword.value = "";
};

const handleProductClick = (product) => {
  showLoginModal();
};

const handleReset = () => {
  activeCategoryId.value = null;
  searchKeyword.value = "";
};

const showLoginModal = () => {
  if (!authStore.isAuthenticated) {
    isLoginModalVisible.value = true;
  }
};

const hideLoginModal = () => {
  isLoginModalVisible.value = false;
};

const hideRegisterModal = () => {
  isRegisterModalVisible.value = false;
};

// 购物车路由跳转
const handleCart = () => {
  if (!authStore.isAuthenticated) {
    isLoginModalVisible.value = true;
  } else {
    console.log("跳转到购物车页面");
  }
};
// 订单路由跳转
const handleOrders = () => {
  if (!authStore.isAuthenticated) {
    isLoginModalVisible.value = true;
  } else {
    console.log("跳转到订单页面");
  }
};

//  登录认证
const handleOAuthLogin = async (provider) => {
  try {
    await authStore.loginWithOAuth(provider, "client");
    hideLoginModal();
    await customerServiceRef.value?.openChat();
  } catch (err) {
    console.log("登录失败");
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
  color: #667eea;
  font-style: normal;
  font-weight: bold;
  margin: 0 2px;
}

.sort-options {
  display: flex;
  gap: 16px;
}
.error-alert {
  margin-bottom: 24px;
  padding: 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 14px;
}
.oauth-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 10px;
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
  border-top-color: #667eea;
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
  width: 450px;
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
  padding: 10px 24px;
}
.divider-new {
  position: relative;
  display: flex;
  align-items: center;
  margin: 10px 0;
  color: #9ca3af;
  font-size: 14px;
}

.divider-new::before,
.divider-new::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #d1d5db;
}

.divider-new span {
  padding: 0 16px;
}
.oauth-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.signup-text {
  text-align: center;
  margin-top: 10px;
  color: #6b7280;
  font-size: 14px;
}
.signup-text a:hover {
  color: #5568d3;
}

.footer-links {
  margin-bottom: 10px;
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
}

.footer-links p {
  margin: 0 0 4px 0;
}

.links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.links a {
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.3s;
}

.links a:hover {
  color: #374151;
}

.qr-placeholder p {
  margin: 0;
  color: #ccc;
  font-size: 12px;
}

.login-tip strong {
  color: #667eea;
}

.login-benefits p {
  margin: 0;
  padding: 4px 0;
  color: #999;
  font-size: 12px;
  line-height: 1.6;
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
