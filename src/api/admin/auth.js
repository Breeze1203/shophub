import api from "@/api/base/http.js";

// Auth API methods
export const authAPI = {
    // Get available OAuth providers
    async getProviders() {
        const response = await api.get('/auth/providers');
        return response.data;
    },

    // Local authentication
    async register(email, username, password,type) {
        const response = await api.post('/auth/register', {
            email,
            username,
            password,
            type
        });
        return response.data;
    },

    async login(email, password,rememberMe) {
        const response = await api.post('/auth/login', {
            email,
            password,
            rememberMe,
        });
        return response.data;
    },

    async refreshToken(refreshToken) {
        const response = await api.post('/auth/refresh', {
            refresh_token: refreshToken,
        });
        return response.data;
    },

    // OAuth authentication
    async getOAuthURL(provider, state,type) {
        const response = await api.get(`/auth/oauth/${provider}`, {
            params: { state,type},
        });
        return response.data;
    },

    async handleOAuthCallback(provider, code, state) {
        const response = await api.get(`/auth/oauth/${provider}/callback`, {
            params: { code, state },
        });
        return response.data;
    },

    // Get current user
    async getCurrentUser() {
        const response = await api.get('/user');
        return response.data;
    },

    // Logout
    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    },
};
