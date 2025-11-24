// composables/useWebSocket.js
import { ref } from 'vue';

export function useWebSocket(roomId, token, wsType) {
    const ws = ref(null);
    const isConnected = ref(false);
    const eventHandlers = new Map();

    // 添加标志位，表示是否主动断开连接
    let isManualDisconnect = false;

    const connect = () => {
        if (ws.value && ws.value.readyState === WebSocket.OPEN) {
            console.log('WebSocket 已连接，跳过重复连接');
            return;
        }

        // 重置标志位
        isManualDisconnect = false;

        const endpoints = {
            chat: `ws://localhost:8080/api/v1/chat/${roomId}/ws`,
            board: `ws://localhost:8080/api/v1/board/${roomId}/ws`
        };
        const wsUrl = `${endpoints[wsType]}?token=${token}`;

        console.log('正在连接 WebSocket:', wsUrl);

        ws.value = new WebSocket(wsUrl);

        ws.value.onopen = () => {
            console.log('WebSocket 连接成功');
            isConnected.value = true;
        };

        ws.value.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const handler = eventHandlers.get(data.type);

                if (handler && typeof handler === 'function') {
                    handler(data.payload || data);
                }
            } catch (error) {
                console.error('WebSocket 消息解析失败:', error);
            }
        };

        ws.value.onerror = (error) => {
            console.error('WebSocket 错误:', error);
            isConnected.value = false;
        };

        ws.value.onclose = (event) => {
            console.log('WebSocket 连接关闭:', event.code, event.reason);
            isConnected.value = false;

            // 只有在非主动断开且连接异常时才重连
            if (!isManualDisconnect && event.code !== 1000 && event.code !== 1001) {
                console.log('WebSocket 异常断开，5秒后尝试重连...');
                setTimeout(() => {
                    // 再次检查是否是主动断开的
                    if (!isManualDisconnect) {
                        console.log('尝试重新连接...');
                        connect();
                    }
                }, 5000);
            } else {
                console.log('WebSocket 正常关闭或主动断开，不重连');
            }
        };
    };

    const disconnect = () => {
        console.log('主动断开 WebSocket 连接');

        // ⚠️ 关键：设置主动断开标志
        isManualDisconnect = true;

        if (ws.value) {
            // 移除所有事件监听器
            eventHandlers.clear();

            // 关闭连接（使用正常关闭码）
            if (ws.value.readyState === WebSocket.OPEN ||
                ws.value.readyState === WebSocket.CONNECTING) {
                ws.value.close(1000, 'Client disconnect');
            }

            ws.value = null;
        }

        isConnected.value = false;
    };

    const send = (type, payload) => {
        if (ws.value && ws.value.readyState === WebSocket.OPEN) {
            const message = {
                type,
                payload
            };
            ws.value.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket 未连接，无法发送消息');
        }
    };

    const on = (eventType, handler) => {
        eventHandlers.set(eventType, handler);
    };

    const off = (eventType) => {
        eventHandlers.delete(eventType);
    };

    return {
        connect,
        disconnect,
        send,
        on,
        off,
        isConnected
    };
}
