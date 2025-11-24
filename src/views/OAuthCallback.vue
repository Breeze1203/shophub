<template>
  <div class="oauth-callback">
    <div class="callback-content">
      <div v-if="loading" class="loading">
        <img
            v-if="providerDetails[provider]"
            :src="providerDetails[provider].logo"
            :alt="providerDetails[provider].name"
            class="provider-logo"
        />
        <div class="spinner"></div>
        <p>
          正在处理 {{ providerDetails[provider]?.name || provider }} 认证...
        </p>
      </div>

      <div v-else-if="error" class="error">
        <div class="error-icon">❌</div>
        <p>{{ error }}</p>
      </div>

      <div v-else class="success">
        <div class="success-icon">✓</div>
        <p>
          认证成功！正在关闭窗口...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const loading = ref(true);
const error = ref('');
// 从路由参数中获取 provider，并移到 onMounted 外部，以便模板可以访问
const provider = route.params.provider;

// 定义 provider 的 logo 和名称
const providerDetails = ref({
  github: {
    name: 'GitHub',
    logo: 'https://cdn.simpleicons.org/github' // 使用 CDN logo
  },
  google: {
    name: 'Google',
    logo: 'https://cdn.simpleicons.org/google'
  }
});

onMounted(async () => {
  try {
    // 从 URL 获取 code 和 state
    const code = route.query.code;
    const state = route.query.state;

    if (!code || !state) {
      throw new Error('缺少认证参数');
    }
    // 直接调用后端回调接口获取 token
    const response = await axios.get(
        // provider 变量现在从外部获取
        `http://localhost:8080/api/v1/auth/oauth/${provider}/callback`,
        {
          params: { code, state }
        }
    );
    const authData = response.data;
    console.log(authData);
    // 发送认证数据到父窗口
    if (window.opener) {
      window.opener.postMessage(
          {
            type: 'oauth-success',
            authData: authData
          },
          window.location.origin
      );
    }

    loading.value = false;

    // 1秒后自动关闭窗口
    setTimeout(() => {
      window.close();
    }, 1000);

  } catch (err) {
    console.error('OAuth callback error:', err);
    error.value = err.response?.data?.error || err.message || '认证失败';
    loading.value = false;

    // 发送错误消息到父窗口
    if (window.opener) {
      window.opener.postMessage(
          {
            type: 'oauth-error',
            error: error.value
          },
          window.location.origin
      );
    }

    // 3秒后关闭窗口
    setTimeout(() => {
      window.close();
    }, 3000);
  }
});
</script>

<style scoped>
.oauth-callback {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.callback-content {
  background: white;
  padding: 60px 40px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.loading,
.error,
.success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.provider-logo {
  width: 70px;
  height: 90px;
  /* 图标颜色默认为黑色，适合白色背景 */
  filter: invert(0);
}

.spinner {
  width: 30px;
  height: 30px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon,
.success-icon {
  font-size: 60px;
  animation: scaleIn 0.5s ease;
}

.error-icon {
  color: #ef4444;
}

.success-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #10b981;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: bold;
}

@keyframes scaleIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

p {
  margin: 0;
  color: #666;
  font-size: 16px;
  line-height: 1.5;
}

.error p {
  color: #ef4444;
}
</style>
