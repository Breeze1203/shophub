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
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          <span>信息加密</span>
        </div>
        <div class="badge-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>安全认证</span>
        </div>
        <div class="badge-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
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
          <div v-if="error" class="error-alert">
            {{ error }}
          </div>
          <div v-if="success" class="success-alert">
            {{ success }}
          </div>

          <!-- 注册表单 -->
          <div class="register-form-new">
            <!-- 用户名输入 -->
            <div class="form-field">
              <label>用户名</label>
              <div class="input-wrapper">
                <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input
                    v-model="username"
                    type="text"
                    placeholder="请输入用户名"
                    required
                />
              </div>
            </div>

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
                    placeholder="至少8位字符"
                    required
                    minlength="8"
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
              <!-- 密码强度指示器 -->
              <div class="password-strength" v-if="password">
                <div class="strength-bar">
                  <div
                      class="strength-fill"
                      :class="passwordStrength.class"
                      :style="{ width: passwordStrength.width }"
                  ></div>
                </div>
                <span class="strength-text" :class="passwordStrength.class">
                  {{ passwordStrength.text }}
                </span>
              </div>
            </div>

            <!-- 确认密码输入 -->
            <div class="form-field">
              <label>确认密码</label>
              <div class="input-wrapper">
                <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                    v-model="confirmPassword"
                    type="password"
                    placeholder="再次输入密码"
                    required
                />
                <div class="match-indicator" v-if="confirmPassword">
                  <svg v-if="password === confirmPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="match-icon">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mismatch-icon">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
              </div>
            </div>

            <!-- 服务条款 -->
            <div class="terms-checkbox">
              <label>
                <input type="checkbox" v-model="agreeTerms" required />
                <span>我已阅读并同意
                  <a href="#">服务条款</a> 和
                  <a href="#">隐私政策</a>
                </span>
              </label>
            </div>

            <!-- 注册按钮 -->
            <button
                @click="handleRegister"
                :disabled="loading || !agreeTerms"
                class="btn-register"
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
                注册中...
              </span>
              <span v-else>创建账户</span>
            </button>
          </div>

          <!-- 分隔线 -->
          <div class="divider-new">
            <span>或使用第三方注册</span>
          </div>

          <!-- 第三方注册 -->
          <div class="oauth-grid">
            <button
                v-for="provider in authStore.availableProviders"
                :key="provider"
                @click="handleOAuthSignup(provider)"
                class="oauth-btn"
            >
              <svg v-if="provider === 'google'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.788 5.108A9 9 0 1 0 21 12h-8"></path>
              </svg>
              <svg v-else-if="provider === 'github'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              <svg v-else-if="provider === 'wechat'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16.5 7.5c-3.333-3.333-8.667-3.333-12 0-2.667 2.667-3.333 6.333-2 9.5.667 1.333 1.667 2.333 3 2.833.333.667.333 1.167-.167 1.167-.667 0-1.333-.333-2-.667l-1.333.667c1.333 1 3 1.667 4.5 1.667 3.333 3.333 8.667 3.333 12 0 2.667-2.667 3.333-6.333 2-9.5-.667-1.333-1.667-2.333-3-2.833-.333-.667-.333-1.167.167-1.167.667 0 1.333.333 2 .667l1.333-.667c-1.333-1-3-1.667-4.5-1.667z"/>
                <path d="M8.833 12.167a1.167 1.167 0 1 0 0-2.334 1.167 1.167 0 0 0 0 2.334z"/>
                <path d="M15.167 12.167a1.167 1.167 0 1 0 0-2.334 1.167 1.167 0 0 0 0 2.334z"/>
              </svg>
            </button>
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');
const showPassword = ref(false);
const agreeTerms = ref(false);

// 密码强度计算
const passwordStrength = computed(() => {
  const pwd = password.value;
  if (pwd.length === 0) return { width: '0%', class: '', text: '' };

  let strength = 0;
  if (pwd.length >= 8) strength++;
  if (pwd.length >= 12) strength++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
  if (/\d/.test(pwd)) strength++;
  if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

  if (strength <= 2) {
    return { width: '33%', class: 'weak', text: '弱' };
  } else if (strength <= 3) {
    return { width: '66%', class: 'medium', text: '中' };
  } else {
    return { width: '100%', class: 'strong', text: '强' };
  }
});

const handleRegister = async () => {
  loading.value = true;
  error.value = '';
  success.value = '';

  // 验证密码匹配
  if (password.value !== confirmPassword.value) {
    error.value = '两次输入的密码不一致';
    loading.value = false;
    return;
  }

  // 验证密码长度
  if (password.value.length < 8) {
    error.value = '密码至少需要8位字符';
    loading.value = false;
    return;
  }

  const result = await authStore.register(
      email.value,
      username.value,
      password.value
  );

  if (result.success) {
    success.value = '注册成功！正在跳转...';
    setTimeout(() => {
      router.push('/dashboard/home');
    }, 1500);
  } else {
    error.value = result.error;
  }

  loading.value = false;
};

const handleOAuthSignup = async (provider) => {
  loading.value = true;
  error.value = '';

  try {
    await authStore.loginWithOAuth(provider);
    router.push('/dashboard/home');
  } catch (err) {
    error.value = err.message || 'OAuth注册失败';
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
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
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

.register-form-new {
  display: flex;
  flex-direction: column;
  gap: 18px;
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

.match-indicator {
  position: absolute;
  right: 16px;
  display: flex;
  align-items: center;
}

.match-icon {
  color: #16a34a;
}

.mismatch-icon {
  color: #dc2626;
}

.password-strength {
  margin-top: 8px;
}

.strength-bar {
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s, background-color 0.3s;
}


.strength-text {
  font-size: 12px;
  font-weight: 500;
}

.terms-checkbox {
  margin-top: 4px;
}

.terms-checkbox label {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  font-size: 13px;
  color: #6b7280;
}

.terms-checkbox input {
  width: 16px;
  height: 16px;
  min-width: 16px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
  margin-top: 2px;
}

.terms-checkbox a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.terms-checkbox a:hover {
  text-decoration: underline;
}

.btn-register {
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
  margin-top: 8px;
}

.btn-register:hover {
  box-shadow: 0 20px 25px -5px rgba(102, 126, 234, 0.4);
  transform: translateY(-2px);
}

.btn-register:disabled {
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
  margin: 24px 0 20px;
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
  border: 1px solid #d1d5db;
  padding: 12px 16px;
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