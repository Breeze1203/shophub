import api from './http.js';

/**
 * 房间相关API
 */
export const roomsApi = {
    /**
     * 获取房间信息
     * @param {string} roomId - 房间ID
     */
    getRoomInfo(roomId) {
        return api.get(`/rooms/${roomId}`);
    },

    /**
     * 更新房间内容
     * @param {string} roomId - 房间ID
     * @param {string} content - 内容
     */
    updateRoomContent(roomId, content) {
        return api.put(`/rooms/${roomId}/content`, { content });
    },

    /**
     * 获取房间在线用户
     * @param {string} roomType - 房间类型 ('chat' | 'editor' | 'whiteboard')
     * @param {string} roomId - 房间ID
     */
    getOnlineUsers(roomType, roomId) {
        return api.get(`/${roomType}/${roomId}/online-users`);
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
    getMessages(roomId) {
        return api.get(`/chat/${roomId}/messages`);
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
