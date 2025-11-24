import { ref, watch } from 'vue';
import { useWebSocket } from './useWebSocket';

export function useCollaborativeEditor(documentId, token) {
    const content = ref('');
    const users = ref([]);
    const cursors = ref({});
    const version = ref(0);
    const isLoading = ref(true);
    const isSaving = ref(false);

    const wsUrl = `ws://localhost:8080/api/v1/editor/${documentId}`;
    const { connect, send, on, isConnected } = useWebSocket(wsUrl, token,'chat');

    // Handle initial state
    on('init', (payload) => {
        content.value = payload.document.content;
        users.value = payload.users;
        cursors.value = payload.cursors;
        version.value = payload.version;
        isLoading.value = false;
    });

    // Handle operations from other users
    on('operation', (payload) => {
        applyRemoteOperation(payload);
    });

    // Handle cursor updates
    on('cursor', (payload) => {
        cursors.value[payload.user_id] = {
            username: payload.username,
            color: payload.color,
            line: payload.line,
            column: payload.column,
        };
    });

    // Handle user joined
    on('user_joined', (payload) => {
        users.value.push({
            user_id: payload.user_id,
            username: payload.username,
            color: payload.color,
        });
    });

    // Handle user left
    on('user_left', (payload) => {
        users.value = users.value.filter(u => u.user_id !== payload.user_id);
        delete cursors.value[payload.user_id];
    });

    const applyRemoteOperation = (op) => {
        const text = content.value;

        if (op.type === 'insert') {
            content.value = text.slice(0, op.position) + op.text + text.slice(op.position);
        } else if (op.type === 'delete') {
            content.value = text.slice(0, op.position) + text.slice(op.position + op.length);
        }

        version.value = op.version;
    };

    const sendOperation = (type, position, text = '', length = 0) => {
        const operation = {
            type,
            position,
            text,
            length,
            version: version.value,
        };

        send('operation', operation);
    };

    const sendCursorUpdate = (line, column) => {
        send('cursor', { line, column });
    };

    const saveDocument = () => {
        isSaving.value = true;
        send('save', {});
        setTimeout(() => {
            isSaving.value = false;
        }, 500);
    };

    // Connect on mount
    connect();

    return {
        content,
        users,
        cursors,
        version,
        isLoading,
        isSaving,
        isConnected,
        sendOperation,
        sendCursorUpdate,
        saveDocument,
    };
}
