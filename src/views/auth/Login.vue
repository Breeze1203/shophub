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
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                  <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                       fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                       stroke-linejoin="round">
                    <path
                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                @click="handleAdminOAuthLogin(provider)"
                class="oauth-btn"
            >
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

              <svg v-else-if="provider === 'github'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.797 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>

              <svg v-else-if="provider === 'wechat'" width="20" height="20" viewBox="0 0 24 24" fill="#07C160">
                <path
                    d="M8 12.015c-3.96 0-6.91-2.62-6.91-6.07 0-3.45 2.95-6.07 6.91-6.07s6.91 2.62 6.91 6.07c0 3.45-2.95 6.07-6.91 6.07zM5.96 4.74c-.3 0-.55.22-.55.51s.24.51.55.51c.3 0 .55-.22.55-.51s-.24-.51-.55-.51zm4.09 0c-.3 0-.55.22-.55.51s.24.51.55.51c.3 0 .55-.22.55-.51s-.24-.51-.55-.51z"/>
                <path
                    d="M16.59 10.97c-3.83 0-6.64 2.37-6.64 5.48 0 3.11 2.81 5.48 6.64 5.48.82 0 1.61-.11 2.34-.32l2.36 1.25-.56-1.89c1.55-1.12 2.5-2.63 2.5-4.52 0-3.11-2.81-5.48-6.64-5.48zm-2.4 3.7c-.32 0-.59-.25-.59-.55s.26-.55.59-.55c.32 0 .59.25.59.55s-.26.55-.59.55zm4.8 0c-.32 0-.59-.25-.59-.55s.26-.55.59-.55c.32 0 .59.25.59.55s-.26.55-.59.55z"/>
              </svg>

              <svg v-else-if="provider === 'en_wechat'" width="20" height="20" viewBox="0 0 24 24">
                <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.06l-4.13-2.38c-.37-.21-.5-.68-.29-1.05.21-.37.68-.5 1.05-.29l3.37 1.94 5.87-5.87c.3-.3.77-.3 1.06 0 .3.3.3.77 0 1.06l-6.93 6.93c-.15.15-.34.22-.53.22-.19 0-.38-.07-.53-.22z"
                    fill="#3370ff"/>
                <path
                    d="M16.8 8.6c-2.7-1.5-5.6-1.5-8.3 0-.8.4-1.1 1.4-.7 2.2.4.8 1.4 1.1 2.2.7 1.8-1 3.8-1 5.6 0 .8.4 1.8.1 2.2-.7.4-.8.1-1.8-.7-2.2z"
                    fill="#FFFFFF"/>
              </svg>
              <span class="provider-text">{{
                  provider === 'google' ? 'Google' :
                      provider === 'github' ? 'GitHub' :
                          provider === 'wechat' ? '微信' :
                              '企业微信'
                }}
              </span>
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
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {useAuthStore} from '@/stores/auth.js';

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

const handleAdminOAuthLogin = async (provider) => {
  loading.value = true;
  error.value = '';
  try {
    await authStore.loginWithOAuth(provider, true);
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