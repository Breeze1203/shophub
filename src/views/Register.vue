<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Create Account</h1>

      <!-- Registration Form -->
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label>Username</label>
          <input
              v-model="username"
              type="text"
              placeholder="Choose a username"
              required
          />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              required
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input
              v-model="password"
              type="password"
              placeholder="Choose a password (min 8 characters)"
              required
              minlength="8"
          />
        </div>

        <div class="form-group">
          <label>Confirm Password</label>
          <input
              v-model="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              required
          />
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Creating account...' : 'Sign Up' }}
        </button>

        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="success" class="success-message">{{ success }}</div>
      </form>

      <!-- OAuth Providers -->
      <div class="oauth-section">
        <div class="divider">
          <span>Or sign up with</span>
        </div>

        <div class="oauth-buttons">
          <button
              v-for="provider in authStore.availableProviders"
              :key="provider"
              @click="handleOAuthSignup(provider)"
              class="btn-oauth"
              :class="`btn-oauth-${provider}`"
          >
            <i :class="`icon-${provider}`"></i>
            {{ capitalizeProvider(provider) }}
          </button>
        </div>
      </div>

      <p class="login-link">
        Already have an account?
        <router-link to="/login">Sign in</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');

const handleRegister = async () => {
  loading.value = true;
  error.value = '';
  success.value = '';

  // Validate passwords match
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    loading.value = false;
    return;
  }

  // Validate password length
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters long';
    loading.value = false;
    return;
  }

  const result = await authStore.register(
      email.value,
      username.value,
      password.value
  );

  if (result.success) {
    success.value = 'Account created successfully! Redirecting...';
    setTimeout(() => {
      router.push('/dashboard');
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
    router.push('/dashboard');
  } catch (err) {
    error.value = err.message || 'OAuth signup failed';
  }

  loading.value = false;
};

const capitalizeProvider = (provider) => {
  return provider.charAt(0).toUpperCase() + provider.slice(1);
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.register-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #5568d3;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-message {
  margin-top: 15px;
  padding: 10px;
  background: #fee;
  color: #c33;
  border-radius: 6px;
  text-align: center;
}

.success-message {
  margin-top: 15px;
  padding: 10px;
  background: #efe;
  color: #3c3;
  border-radius: 6px;
  text-align: center;
}

.oauth-section {
  margin-top: 30px;
}

.divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: #999;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #ddd;
}

.divider span {
  padding: 0 15px;
  font-size: 14px;
}

.oauth-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-oauth {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.btn-oauth:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.btn-oauth-google:hover {
  border-color: #ea4335;
}

.btn-oauth-github:hover {
  border-color: #333;
}

.btn-oauth-facebook:hover {
  border-color: #1877f2;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}
</style>
