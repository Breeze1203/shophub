import api from './http.js';

/**
 * 房间相关API
 */
export const roomsApi = {
    /**
     * 创建房间
     * @param {Object} roomData - 房间创建所需的数据对象
     */
    async createRoom(roomData) {
        // 通常创建是 POST 请求，且是对集合操作（/rooms）
        return await api.post('/rooms', roomData);
    },
    /**
     * 获取房间信息
     * @param {string} roomId - 房间ID
     */
    async getRoomInfo(roomId) {
        return await api.get(`/rooms/${roomId}`);
    },
    /**
     * 获取房间列表
     */
    async getRoomList() {
        return await api.get(`/rooms`);
    },
    /**
     * 校验房间列表
     * @param {string} roomId - 房间ID
     */
    /**
     * 尝试加入房间并验证密码
     * @param {string} roomId - 房间ID
     * @param {string} password - 用户输入的密码
     */
    async joinRoom(roomId, password) {
        return await api.post(`/rooms/${roomId}/join`, {
            password: password
        });
    },
};

/**
 * 聊天相关API
 */
export const chatApi = {
    /**
     * 获取聊天历史消息
     * @param {string} roomId - 房间ID
     */
    async getMessages(roomId) {
        return await api.get(`/chat/${roomId}/messages`);
    },

    /**
     * 获取聊天室在线用户
     * @param {string} roomId - 房间ID
     */
    getOnlineUsers(roomId) {
        return api.get(`/chat/${roomId}/online-users`);
    },
};

/**
 * 编辑器相关API
 */
export const editorApi = {
    /**
     * 获取编辑器在线用户
     * @param {string} roomId - 房间ID
     */
    getOnlineUsers(roomId) {
        return api.get(`/editor/${roomId}/online-users`);
    },
};

/**
 * 画板相关API
 */
export const whiteboardApi = {
    /**
     * 获取画板在线用户
     * @param {string} roomId - 房间ID
     */
    getOnlineUsers(roomId) {
        return api.get(`/whiteboard/${roomId}/online-users`);
    },
};
