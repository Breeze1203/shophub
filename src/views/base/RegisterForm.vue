<template>
  <div class="register-form-new">
    <div class="form-field">
      <label>用户名</label>
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
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle
            cx="12"
            cy="7"
            r="4"
          ></circle>
        </svg>
        <input
          v-model="formData.username"
          type="text"
          placeholder="请输入用户名"
          required
        />
      </div>
    </div>

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
          v-model="formData.email"
          type="email"
          placeholder="your@email.com"
          required
        />
      </div>
    </div>

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
          v-model="formData.password"
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
      <div
        class="password-strength"
        v-if="formData.password"
      >
        <div class="strength-bar">
          <div
            class="strength-fill"
            :class="passwordStrength.class"
            :style="{ width: passwordStrength.width }"
          ></div>
        </div>
        <span
          class="strength-text"
          :class="passwordStrength.class"
        >
          {{ passwordStrength.text }}
        </span>
      </div>
    </div>

    <div class="form-field">
      <label>确认密码</label>
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
          v-model="formData.confirmPassword"
          type="password"
          placeholder="再次输入密码"
          required
        />
        <div
          class="match-indicator"
          v-if="formData.confirmPassword"
        >
          <svg
            v-if="passwordsMatch"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="match-icon"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
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
            class="mismatch-icon"
          >
            <line
              x1="18"
              y1="6"
              x2="6"
              y2="18"
            ></line>
            <line
              x1="6"
              y1="6"
              x2="18"
              y2="18"
            ></line>
          </svg>
        </div>
      </div>
    </div>

    <div class="terms-checkbox">
      <label>
        <input
          type="checkbox"
          v-model="agreeTerms"
          required
        />
        <span>我已阅读并同意
          <a
            href="#"
            @click.prevent="emit('open-terms')"
          >服务条款</a> 和
          <a
            href="#"
            @click.prevent="emit('open-privacy')"
          >隐私政策</a>
        </span>
      </label>
    </div>

    <button
      @click="handleSubmit"
      :disabled="loading || !isFormValid"
      class="btn-register"
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
        注册中...
      </span>
      <span v-else>创建账户</span>
    </button>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
// 只接收 loading 状态，UI 组件处理具体的 API 请求
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});

// 定义向父组件发送的事件
const emit = defineEmits(["register", "open-terms", "open-privacy"]);

// 内部状态
const showPassword = ref(false);
const agreeTerms = ref(false);

const formData = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

// 计算属性：密码匹配
const passwordsMatch = computed(() => {
  return formData.password && formData.password === formData.confirmPassword;
});

// 密码强度计算
const passwordStrength = computed(() => {
  const pwd = formData.password;
  if (pwd.length === 0) return { width: "0%", class: "", text: "" };

  let strength = 0;
  if (pwd.length >= 8) strength++;
  if (pwd.length >= 12) strength++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
  if (/\d/.test(pwd)) strength++;
  if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

  if (strength <= 2) {
    return { width: "33%", class: "weak", text: "弱" };
  } else if (strength <= 3) {
    return { width: "66%", class: "medium", text: "中" };
  } else {
    return { width: "100%", class: "strong", text: "强" };
  }
});

// 计算属性：表单是否有效
const isFormValid = computed(() => {
  return (
    formData.username &&
    formData.email &&
    formData.password.length >= 8 &&
    passwordsMatch.value &&
    agreeTerms.value
  );
});

// 提交处理
const handleSubmit = () => {
  if (isFormValid.value) {
    // 将数据打包发给父组件
    emit("register", {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });
  }
};
</script>

<style scoped>
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

.input-icon {
  position: absolute;
  left: 16px;
  color: #9ca3af;
  pointer-events: none;
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
</style>