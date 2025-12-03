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
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
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
          <div v-if="error" class="error-alert">
            {{ error }}
          </div>

          <!-- 登录表单 -->
          <div class="login-form-new">
            <!-- 邮箱输入 -->
            <div class="form-field">
              <label>邮箱地址</label>
              <div class="input-wrapper">
                <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input
                    v-model="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                />
              </div>
            </div>

            <!-- 密码输入 -->
            <div class="form-field">
              <label>密码</label>
              <div class="input-wrapper">
                <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    required
                />
                <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="password-toggle"
                >
                  <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>

            <!-- 记住我和忘记密码 -->
            <div class="form-options">
              <label class="remember-me">
                <input
                    type="checkbox"
                    v-model="rememberMe"
                />
                <span>记住我</span>
              </label>
              <a href="#" class="forgot-password">忘记密码？</a>
            </div>

            <!-- 登录按钮 -->
            <button
                @click="handleLocalLogin"
                :disabled="loading"
                class="btn-login"
            >
              <span v-if="loading" class="loading-spinner">
                <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="2" x2="12" y2="6"></line>
                  <line x1="12" y1="18" x2="12" y2="22"></line>
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                  <line x1="2" y1="12" x2="6" y2="12"></line>
                  <line x1="18" y1="12" x2="22" y2="12"></line>
                  <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                  <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                </svg>
                登录中...
              </span>
              <span v-else>登录</span>
            </button>
          </div>

          <!-- 分隔线 -->
          <div class="divider-new">
            <span>或使用第三方登录</span>
          </div>

          <!-- 第三方登录 -->
          <div class="oauth-grid">
            <button
                v-for="provider in authStore.availableProviders"
                :key="provider"
                @click="handleOAuthLogin(provider)"
                class="oauth-btn"
            >
              <svg v-if="provider === 'google'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
              <svg v-else-if="provider === 'github'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </button>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const showPassword = ref(false);
const rememberMe = ref(false);

const handleLocalLogin = async () => {
  loading.value = true;
  error.value = '';

  const result = await authStore.login(email.value, password.value);

  if (result.success) {
    router.push('/dashboard/home');
  } else {
    error.value = result.error;
  }

  loading.value = false;
};

const handleOAuthLogin = async (provider) => {
  loading.value = true;
  error.value = '';
  try {
    await authStore.loginWithOAuth(provider);
    console.log("认证成功")
    router.push('/dashboard/home');
  } catch (err) {
    error.value = err.message || 'OAuth登录失败';
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
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
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

.login-form-new {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-field label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: #9ca3af;
  pointer-events: none;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.password-toggle {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: color 0.3s;
}

.password-toggle:hover {
  color: #4b5563;
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.remember-me {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.remember-me input {
  width: 16px;
  height: 16px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
}

.remember-me span {
  font-size: 14px;
  color: #374151;
}

.forgot-password {
  font-size: 14px;
  font-weight: 500;
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s;
}

.forgot-password:hover {
  color: #5568d3;
}

.btn-login {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 10px 15px -3px rgba(102, 126, 234, 0.3);
}

.btn-login:hover {
  box-shadow: 0 20px 25px -5px rgba(102, 126, 234, 0.4);
  transform: translateY(-2px);
}

.btn-login:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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
  content: '';
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

.oauth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  color: #4b5563;
}

.oauth-btn:hover {
  border-color: #667eea;
  background: #f8f9ff;
  color: #111827;
}

.signup-text {
  text-align: center;
  margin-top: 32px;
  color: #6b7280;
  font-size: 14px;
}

.signup-text a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
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