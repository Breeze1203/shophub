<template>
  <div class="login-form-new">
    <!-- 邮箱输入 -->
    <div class="form-field">
      <label>邮箱地址</label>
      <div class="input-wrapper">
        <svg
          class="input-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
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
        <svg
          class="input-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect
            x="3"
            y="11"
            width="18"
            height="11"
            rx="2"
            ry="2"
          ></rect>
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
          <svg
            v-if="showPassword"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line
              x1="1"
              y1="1"
              x2="23"
              y2="23"
            ></line>
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle
              cx="12"
              cy="12"
              r="3"
            ></circle>
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
      <a
        href="#"
        class="forgot-password"
      >忘记密码？</a>
    </div>

    <!-- 登录按钮 -->
    <button
      @click="handleLocalLogin"
      :disabled="loading"
      class="btn-login"
    >
      <span
        v-if="loading"
        class="loading-spinner"
      >
        <svg
          class="spinner"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line
            x1="12"
            y1="2"
            x2="12"
            y2="6"
          ></line>
          <line
            x1="12"
            y1="18"
            x2="12"
            y2="22"
          ></line>
          <line
            x1="4.93"
            y1="4.93"
            x2="7.76"
            y2="7.76"
          ></line>
          <line
            x1="16.24"
            y1="16.24"
            x2="19.07"
            y2="19.07"
          ></line>
          <line
            x1="2"
            y1="12"
            x2="6"
            y2="12"
          ></line>
          <line
            x1="18"
            y1="12"
            x2="22"
            y2="12"
          ></line>
          <line
            x1="4.93"
            y1="19.07"
            x2="7.76"
            y2="16.24"
          ></line>
          <line
            x1="16.24"
            y1="7.76"
            x2="19.07"
            y2="4.93"
          ></line>
        </svg>
        登录中...
      </span>
      <span v-else>登录</span>
    </button>
  </div>
</template>
<script setup>
import { ref } from "vue";
import CookieUtil from "@/utils/CookieUtil.js";

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const rememberMe = ref(false);
const savedEmail = CookieUtil.getCookie("remember_email");
const savedPassword = CookieUtil.getCookie("remember_password");

if (savedEmail) {
    email.value = savedEmail;
}

if (savedPassword) {
    password.value = savedPassword;
}
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});


// 定义向父组件发送的事件
const emit = defineEmits(["login"]);
// 提交处理
const handleLocalLogin = () => {
  console.log(rememberMe.value);
  
  // 将数据打包发给父组件
  emit("login", {
    email: email.value,
    password: password.value,
    rememberMe: rememberMe.value,
  });
};
</script>

<style scoped>
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
</style>