import api from "@/api/base/http.js";

/**
 * 客户相关API
 */
export const customerApi = {
    /**
     * 获取会话列表
     */
    async getSessions() {
        return await api.get(`/customer/sessions`);
    },
    /**
     * 关闭客户服务会话
     * @param {string | number} sessionId - 当前会话的 ID
     */
    async closeSession(sessionId) {
        return await api.put(`/customer/sessions/${sessionId}`, {
            status: 'closed'
        });
    },

    /**
     * 创建会话
     */
    async createSession(sessionType=1) {
        return await api.post(`/customer/session`,{
            sessionType:sessionType
        });
    },
};
