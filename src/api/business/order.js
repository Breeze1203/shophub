import api from "@/api/base/http.js";

export const orderApi = {
    // 获取订单列表
    getOrders(params = {}) {
        const query = new URLSearchParams(params).toString();
        return api.get(`/orders${query ? '?' + query : ''}`);
    },

    // 创建订单
    createOrder(data) {
        return api.post('/orders', data);
    },

    // 获取订单详情
    getOrderDetail(id) {
        return api.get(`/orders/${id}`);
    },

    // 取消订单
    cancelOrder(id) {
        return api.post(`/orders/${id}/cancel`);
    }
};