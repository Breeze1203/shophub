<template>
  <div class="register-wrapper">
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

        <!-- 注册优势展示 -->
        <div class="features">
          <div class="feature-card">
            <div class="feature-icon">
              <div class="icon-inner"></div>
            </div>
            <h3>专享会员权益</h3>
            <p>注册即享新人礼包，积分兑换，会员折扣等多重福利</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <div class="icon-inner"></div>
            </div>
            <h3>快速下单体验</h3>
            <p>一键下单，智能推荐，让购物更简单高效</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <div class="icon-inner"></div>
            </div>
            <h3>订单实时追踪</h3>
            <p>随时查看订单状态，物流信息一目了然</p>
          </div>
        </div>
      </div>

      <!-- 底部信任标识 -->
      <div class="trust-badges">
        <div class="badge-item">
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
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span>信息加密</span>
        </div>
        <div class="badge-item">
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
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>安全认证</span>
        </div>
        <div class="badge-item">
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
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>7x24客服</span>
        </div>
      </div>
    </div>

    <!-- 右侧注册表单区 -->
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

        <!-- 注册卡片 -->
        <div class="register-card-new">
          <div class="card-header">
            <h2>创建账户</h2>
            <p>加入我们，开启精彩购物之旅</p>
          </div>

          <!-- 错误/成功提示 -->
          <div
            v-if="error"
            class="error-alert"
          >
            {{ error }}
          </div>
          <div
            v-if="success"
            class="success-alert"
          >
            {{ success }}
          </div>

          <!-- 注册表单 -->
          <RegisterForm
            :loading="authStore.isLoading"
            @register="handleRegister"
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
              @login-click="handleOAuthSignup(provider)"
            />
          </div>

          <!-- 登录链接 -->
          <p class="login-text">
            已有账户？
            <router-link to="/login">立即登录</router-link>
          </p>
        </div>

        <!-- 底部信息 -->
        <div class="footer-info">
          <p>注册即表示您已满18岁并同意我们的政策</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import OAuthButton from "@/views/base/OAuthButton.vue";
import RegisterForm from "@/views/base/RegisterForm.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.js";
const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);
const error = ref("");
const success = ref("");

const handleRegister = async (formData) => {
  loading.value = true;
  error.value = "";
  success.value = "";

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
    "merchant"
  );

  if (result.success) {
    success.value = "注册成功！正在跳转...";
    setTimeout(() => {
      router.push("/dashboard/home");
    }, 1500);
  } else {
    error.value = result.error;
  }

  loading.value = false;
};

const handleOAuthSignup = async (provider) => {
  loading.value = true;
  error.value = "";

  try {
    await authStore.loginWithOAuth(provider, "merchant");
    router.push("/dashboard/home");
  } catch (err) {
    error.value = err.message || "OAuth注册失败";
  }

  loading.value = false;
};
</script>

<style scoped>
.register-wrapper {
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
  margin-top: 48px;
  display: flex;
  flex-direction: column;
  gap: 24px;
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
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.feature-card p {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  line-height: 1.5;
  font-size: 14px;
}

.trust-badges {
  position: relative;
  z-index: 10;
  display: flex;
  gap: 24px;
  color: white;
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
}

/* 右侧表单区 */
.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: #f9fafb;
  overflow-y: auto;
}

.form-container {
  width: 100%;
  max-width: 480px;
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

.register-card-new {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 32px;
}

.card-header {
  margin-bottom: 24px;
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
  margin-bottom: 20px;
  padding: 12px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 14px;
}

.success-alert {
  margin-bottom: 20px;
  padding: 12px 16px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  color: #16a34a;
  font-size: 14px;
}

.divider-new {
  position: relative;
  display: flex;
  align-items: center;
  margin: 24px 0 20px;
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

.login-text {
  text-align: center;
  margin-top: 24px;
  color: #6b7280;
  font-size: 14px;
}

.login-text a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
}

.login-text a:hover {
  color: #5568d3;
}

.footer-info {
  margin-top: 24px;
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
}

.footer-info p {
  margin: 0;
}
</style>