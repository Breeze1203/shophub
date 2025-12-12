<template>
  <div class="login-wrapper">
    <!-- 左侧品牌展示区 -->
    <div class="brand-section">
      <!-- 装饰性背景元素 -->
      <div class="bg-decoration">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
      </div>

      <div class="brand-content">
        <!-- Logo -->
        <div class="brand-header">
          <div class="logo-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line
                x1="3"
                y1="6"
                x2="21"
                y2="6"
              ></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <div class="brand-info">
            <h1>ShopHub</h1>
            <p>企业级电商平台</p>
          </div>
        </div>

        <!-- 特色功能展示 -->
        <div class="features">
          <div class="feature-card">
            <div class="feature-icon">
              <div class="icon-inner"></div>
            </div>
            <h3>海量商品</h3>
            <p>超过100万件精选商品，满足您的所有需求</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <div class="icon-inner"></div>
            </div>
            <h3>安全支付</h3>
            <p>多重加密保护，确保每一笔交易安全可靠</p>
          </div>
        </div>
      </div>

      <!-- 底部统计信息 -->
      <div class="stats">
        <div class="stat-item">
          <div class="stat-value">2M+</div>
          <div class="stat-label">活跃用户</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">50K+</div>
          <div class="stat-label">商家入驻</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">99.9%</div>
          <div class="stat-label">好评率</div>
        </div>
      </div>
    </div>

    <!-- 右侧登录表单区 -->
    <div class="form-section">
      <div class="form-container">
        <!-- 移动端 Logo -->
        <div class="mobile-logo">
          <div class="mobile-logo-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line
                x1="3"
                y1="6"
                x2="21"
                y2="6"
              ></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <span>ShopHub</span>
        </div>

        <!-- 登录卡片 -->
        <div class="login-card-new">
          <div class="card-header">
            <h2>欢迎回来</h2>
            <p>登录您的账户继续购物之旅</p>
          </div>

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
              @login-click="handleAdminOAuthLogin"
            />
          </div>
          <p class="signup-text">
            还没有账户？
            <router-link to="/register">立即注册</router-link>
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
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.js";
import OAuthButton from "@/views/base/OAuthButton.vue";
import LoginForm from "../base/LoginForm.vue";
const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);
const error = ref("");

const handleLocalLogin = async (data) => {
  loading.value = true;
  error.value = "";
  const result = await authStore.login(
    data.email,
    data.password,
    data.rememberMe
  );
  if (result.success) {
    router.push("/dashboard/home");
  } else {
    error.value = result.error;
  }

  loading.value = false;
};

const handleAdminOAuthLogin = async (provider) => {
  loading.value = true;
  error.value = "";
  try {
    await authStore.loginWithOAuth(provider, "merchant");
    router.push("/dashboard/home");
  } catch (err) {
    error.value = err.message || "OAuth登录失败";
  }

  loading.value = false;
};

</script>

<style scoped>
.login-wrapper {
  display: flex;
  min-height: 100vh;
}

/* 左侧品牌展示区 */
.brand-section {
  display: none;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 48px;
  flex-direction: column;
  justify-content: space-between;
}

@media (min-width: 1024px) {
  .brand-section {
    display: flex;
    width: 50%;
  }
}

.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
}

.circle {
  position: absolute;
  background: white;
  border-radius: 50%;
  filter: blur(80px);
}

.circle-1 {
  top: 80px;
  left: 80px;
  width: 288px;
  height: 288px;
}

.circle-2 {
  bottom: 80px;
  right: 80px;
  width: 384px;
  height: 384px;
}

.brand-content {
  position: relative;
  z-index: 10;
}

.brand-header {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-info h1 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.brand-info p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.features {
  margin-top: 64px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.icon-inner {
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 8px;
}

.feature-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.feature-card p {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  line-height: 1.5;
}

.stats {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  color: white;
}

.stat-value {
  font-size: 30px;
  font-weight: 700;
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4px;
}

/* 右侧表单区 */
.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: #f9fafb;
}

.form-container {
  width: 100%;
  max-width: 448px;
}

.mobile-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
}

@media (min-width: 1024px) {
  .mobile-logo {
    display: none;
  }
}

.mobile-logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.mobile-logo span {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.login-card-new {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 32px;
}

.card-header {
  margin-bottom: 32px;
}

.card-header h2 {
  font-size: 30px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.card-header p {
  color: #6b7280;
  margin: 0;
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

.divider-new {
  position: relative;
  display: flex;
  align-items: center;
  margin: 24px 0;
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
  margin-top: 32px;
  color: #6b7280;
  font-size: 14px;
}


.signup-text a:hover {
  color: #5568d3;
}

.footer-links {
  margin-top: 32px;
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
</style>