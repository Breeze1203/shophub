import { defineStore } from 'pinia';
import { authAPI } from '@/api/admin/auth.js';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const isAdmin = ref(false);
    const accessToken = ref(localStorage.getItem('access_token'));
    const refreshToken = ref(localStorage.getItem('refresh_token'));
    const isAuthenticated = computed(() => !!accessToken.value);
    const availableProviders = ref([]);
    const isInitialized = ref(false);
    const router = useRouter();

    // 辅助判断是否为扫码类 Provider
    const isQRCodeProvider = (provider) => {
        return ['en_wechat', 'wechat', 'lark', 'dingtalk'].includes(provider);
    }

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

    //  内部通用逻辑：监听 OAuth 弹窗消息
    const _waitForPopupResult = (popup) => {
        return new Promise((resolve, reject) => {
            // 1. 定时器：检查弹窗是否被用户手动关闭
            const checkClosed = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkClosed);
                    window.removeEventListener('message', messageHandler);
                    sessionStorage.removeItem('oauth_state');
                    reject(new Error('用户关闭了认证窗口'));
                }
            }, 500);

            // 2. 事件监听：接收来自 Callback 页面的 postMessage
            const messageHandler = async (event) => {
                // 安全检查：确保消息来自当前源（Callback 页面通常与主页同源）
                if (event.origin !== window.location.origin) return;

                // 处理成功消息
                if (event.data.type === 'oauth-success') {
                    clearInterval(checkClosed);
                    window.removeEventListener('message', messageHandler);

                    try {
                        popup.close(); // 尝试关闭弹窗
                    } catch (e) {
                        console.warn('Could not close popup:', e);
                    }

                    const { authData } = event.data;
                    if (authData) {
                        setAuth(authData);
                        sessionStorage.removeItem('oauth_state');
                        resolve({ success: true });
                    } else {
                        reject(new Error('未接收到有效的认证数据'));
                    }
                }
                // 处理失败消息
                else if (event.data.type === 'oauth-error') {
                    clearInterval(checkClosed);
                    window.removeEventListener('message', messageHandler);

                    try {
                        popup.close();
                    } catch (e) {}

                    sessionStorage.removeItem('oauth_state');
                    reject(new Error(event.data.error || 'OAuth 认证流程失败'));
                }
            };

            window.addEventListener('message', messageHandler);
        });
    };

    //  功能补全：二维码扫码登录处理
    const handleQRCodeLogin = (authUrl) => {
        // 二维码页面（如企业微信、钉钉）通常内容较多，使用稍大的正方形或竖屏窗口
        const width = 800;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
            authUrl,
            'QRCode Login',
            `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,status=yes`
        );

        if (!popup) {
            throw new Error('无法打开扫码窗口，请检查浏览器拦截设置');
        }
        // 复用通用的监听逻辑
        return _waitForPopupResult(popup);
    };

    // 传统弹窗模式（复用通用逻辑）
    const handlePopupLogin = (authUrl) => {
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
            authUrl,
            'OAuth Login',
            `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`
        );

        if (!popup) {
            throw new Error('无法打开弹窗，请检查浏览器是否允许弹窗');
        }

        return _waitForPopupResult(popup);
    };

    // OAuth login - 主入口
    const loginWithOAuth = async (provider, isAdminUser = false) => {
        try {
            isAdmin.value = isAdminUser;
            const state = Math.random().toString(36).substring(7);
            sessionStorage.setItem('oauth_state', state);

            const data = await authAPI.getOAuthURL(provider, state);

            if (isQRCodeProvider(provider)) {
                // 方案一：二维码模式（窗口较大，适应扫码页）
                return await handleQRCodeLogin(data.auth_url);
            } else {
                // 方案二：传统弹窗模式（窗口较窄，适应表单）
                return await handlePopupLogin(data.auth_url);
            }
        } catch (error) {
            return {
                success: false,
                error: error.message || 'OAuth login failed'
            };
        }
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
        isInitialized.value = true;
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
        accessToken,
        isInitialized
    };
});
