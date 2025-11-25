import { ref } from 'vue';
import {chatApi, editorApi, whiteboardApi } from '@/api/rooms.js';

/**
 * 在线用户管理 Composable
 * @param {string} roomType - 房间类型 ('chat' | 'editor' | 'whiteboard')
 * @param {string} roomId - 房间ID
 * @param {number} pollingInterval - 轮询间隔（毫秒），默认5000
 */
export function useOnlineUsers(roomType, roomId, pollingInterval = 5000) {
    const onlineUsers = ref([]);
    const isLoading = ref(false);
    const error = ref(null);
    const isUnmounting = ref(false);

    let pollingTimer = null;

    // 根据房间类型选择API
    const getApiMethod = () => {
        switch (roomType) {
            case 'chat':
                return chatApi.getOnlineUsers;
            case 'editor':
                return editorApi.getOnlineUsers;
            case 'whiteboard':
                return whiteboardApi.getOnlineUsers;
            default:
                throw new Error(`Unknown room type: ${roomType}`);
        }
    };

    /**
     * 获取在线用户列表
     */
    const fetchOnlineUsers = async () => {
        if (isUnmounting.value) return;

        try {
            isLoading.value = true;
            error.value = null;

            const apiMethod = getApiMethod();
            const response = await apiMethod(roomId);

            onlineUsers.value = response.data.users || [];
            console.log(`[${roomType}] 在线用户已更新:`, onlineUsers.value.length, '人');
        } catch (err) {
            error.value = err;
            console.error(`[${roomType}] 获取在线用户失败:`, err);
        } finally {
            isLoading.value = false;
        }
    };

    /**
     * 开始轮询
     */
    const startPolling = () => {
        // 立即获取一次
        fetchOnlineUsers();
        // 定时轮询
        pollingTimer = setInterval(() => {
            fetchOnlineUsers();
        }, pollingInterval);

        console.log(`[${roomType}] 开始轮询在线用户（每${pollingInterval / 1000}秒）`);
    };

    /**
     * 停止轮询
     */
    const stopPolling = () => {
        if (pollingTimer) {
            clearInterval(pollingTimer);
            pollingTimer = null;
            console.log(`[${roomType}] 停止轮询在线用户`);
        }
    };

    /**
     * 手动刷新
     */
    const refresh = () => {
        fetchOnlineUsers();
    };

    /**
     * 清理
     */
    const cleanup = () => {
        isUnmounting.value = true;
        stopPolling();
    };

    return {
        // 状态
        onlineUsers,
        isLoading,
        error,
        // 方法
        fetchOnlineUsers,
        startPolling,
        stopPolling,
        refresh,
        cleanup,
    };
}
