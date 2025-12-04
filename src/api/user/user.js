import api from "@/api/base/http.js";

export const userApi = {
    // 获取用户信息
    getUserInfo() {
        return api.get('/user/info');
    },

    // 更新用户信息
    updateUserInfo(data) {
        return api.put('/user/info', data);
    },

    // 获取收藏列表
    getFavorites() {
        return api.get('/user/favorites');
    },

    // 添加收藏
    addFavorite(productId) {
        return api.post('/user/favorites', { productId });
    },

    // 取消收藏
    removeFavorite(productId) {
        return api.delete(`/user/favorites/${productId}`);
    }
};