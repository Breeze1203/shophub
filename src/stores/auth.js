import { defineStore } from 'pinia';
import { authAPI } from '@/api/admin/auth.js';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const isAdmin = ref(false)
    const accessToken = ref(localStorage.getItem('access_token'));
    const refreshToken = ref(localStorage.getItem('refresh_token'));
    const isAuthenticated = computed(() => !!accessToken.value);
    const availableProviders = ref([]);
    const isInitialized = ref(false)

    const router = useRouter();

    // Load providers on init
    const loadProviders = async () => {
        try {
            const data = await authAPI.getProviders();
            availableProviders.value = data.providers;
        } catch (error) {
            console.error('Failed to load OAuth providers:', error);
        }
    };

    // Set auth data
    const setAuth = (authData) => {
        accessToken.value = authData.access_token;
        refreshToken.value = authData.refresh_token;
        user.value = authData.user;

        localStorage.setItem('access_token', authData.access_token);
        localStorage.setItem('refresh_token', authData.refresh_token);
        localStorage.setItem('user', JSON.stringify(authData.user));
    };

    // Local registration
    const register = async (email, username, password) => {
        try {
            const data = await authAPI.register(email, username, password);
            setAuth(data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Registration failed'
            };
        }
    };

    // Local login
    const login = async (email, password) => {
        try {
            const data = await authAPI.login(email, password);
            setAuth(data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Login failed'
            };
        }
    };

    // OAuth login - opens popup window
    const loginWithOAuth = async (provider,isAdminUser=false) => {
        try {
            isAdmin.value=isAdminUser;
            // 生成随机 state 用于 CSRF 保护
            const state = Math.random().toString(36).substring(7);
            sessionStorage.setItem('oauth_state', state);
            // 获取 OAuth URL
            const data = await authAPI.getOAuthURL(provider, state);
            // 打开 OAuth 弹窗
            const width = 400;
            const height = 500;
            const left = window.screenX + (window.outerWidth - width) / 2;
            const top = window.screenY + (window.outerHeight - height) / 2;

            const popup = window.open(
                data.auth_url,
                'OAuth Login',
                `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`
            );

            if (!popup) {
                throw new Error('无法打开弹窗，请检查浏览器是否允许弹窗');
            }

            // 监听弹窗
            return new Promise((resolve, reject) => {
                // 检查弹窗是否被关闭
                const checkClosed = setInterval(() => {
                    if (popup.closed) {
                        clearInterval(checkClosed);
                        sessionStorage.removeItem('oauth_state');
                        reject(new Error('OAuth 弹窗被关闭'));
                    }
                }, 500);

                // 监听来自弹窗的消息
                const messageHandler = async (event) => {
                    // 安全检查：确保消息来自正确的源
                    if (event.origin !== window.location.origin) return;
                    if (event.data.type === 'oauth-success') {
                        clearInterval(checkClosed);
                        window.removeEventListener('message', messageHandler);
                        try {
                            popup.close();
                        } catch (e) {
                            console.log('Failed to close popup:', e);
                        }

                        const { authData } = event.data;
                        // const savedState = sessionStorage.getItem('oauth_state');
                        // 验证 state（虽然后端已经验证过了）
                        if (authData) {
                            setAuth(authData);
                            sessionStorage.removeItem('oauth_state');
                            resolve({ success: true });
                        } else {
                            reject(new Error('认证数据无效'));
                        }
                    } else if (event.data.type === 'oauth-error') {
                        clearInterval(checkClosed);
                        window.removeEventListener('message', messageHandler);

                        try {
                            popup.close();
                        } catch (e) {
                            console.log('Failed to close popup:', e);
                        }

                        sessionStorage.removeItem('oauth_state');
                        reject(new Error(event.data.error || 'OAuth 认证失败'));
                    }
                };

                window.addEventListener('message', messageHandler);
            });
        } catch (error) {
            return {
                success: false,
                error: error.message || 'OAuth login failed'
            };
        }
    };


    // Fetch current user
    const fetchCurrentUser = async () => {
        try {
            user.value = await authAPI.getCurrentUser();
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch user'
            };
        }
    };

    // Logout
    const logout = () => {
        authAPI.logout();
        accessToken.value = null;
        refreshToken.value = null;
        user.value = null;
        router.push('/login');
    };

    // Initialize store
    const init = async () => {
        await loadProviders();
        if (accessToken.value) {
            await fetchCurrentUser();
        }
        isInitialized.value=true;
    };

    return {
        isAdmin,
        user,
        isAuthenticated,
        availableProviders,
        register,
        login,
        loginWithOAuth,
        logout,
        fetchCurrentUser,
        init,
        isInitialized
    };
});
