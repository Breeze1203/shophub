import api from "@/api/base/http.js";

export const productApi = {
    // 获取商品分类列表
    getCategories() {
        return api.get('/categories');
    },

    // 获取商品列表
    getProducts(params = {}) {
        const query = new URLSearchParams(params).toString();
        return api.get(`/products${query ? '?' + query : ''}`);
    },

    // 获取商品详情
    getProductDetail(id) {
        return api.get(`/products/${id}`);
    },

    // 搜索商品
    searchProducts(keyword, filters = {}) {
        return api.post('/products/search', { keyword, ...filters });
    },

    // 发布商品
    publishProduct(data) {
        return api.post('/products', data);
    },

    // 更新商品
    updateProduct(id, data) {
        return api.put(`/products/${id}`, data);
    },

    // 删除商品
    deleteProduct(id) {
        return api.delete(`/products/${id}`);
    }
};
