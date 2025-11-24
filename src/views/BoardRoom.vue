<template>
  <div class="whiteboard-room">
    <!-- 顶部工具栏 -->
    <header class="whiteboard-header">
      <div class="header-left">
        <button @click="$router.push('/dashboard/rooms.js')" class="btn-back">
          ← 返回
        </button>
        <div class="room-info">
          <h2>{{ roomName }}</h2>
          <span :class="['status', { connected: isConnected }]">
            <span class="status-dot"></span>
            {{ isConnected ? '已连接' : '连接中...' }}
          </span>
        </div>
      </div>

      <div class="header-right">
        <!-- 在线用户 -->
        <div class="online-users">
          <div
              v-for="user in onlineUsers"
              :key="user.user_id"
              class="user-badge"
              :style="{ background: user.color }"
              :title="user.username"
          >
            {{ user.username.charAt(0).toUpperCase() }}
          </div>
          <span class="user-count">{{ onlineUsers.length }} 在线</span>
        </div>
      </div>
    </header>

    <!-- 工具栏 -->
    <div class="toolbar">
      <!-- 工具选择 -->
      <div class="tool-group">
        <button
            v-for="tool in tools"
            :key="tool.type"
            :class="['tool-btn', { active: currentTool === tool.type }]"
            @click="selectTool(tool.type)"
            :title="tool.name"
        >
          {{ tool.icon }}
        </button>
      </div>

      <!-- 颜色选择 -->
      <div class="tool-group">
        <div class="color-picker-wrapper">
          <div
              class="current-color"
              :style="{ background: currentColor }"
              @click="showColorPicker = !showColorPicker"
          ></div>
          <div v-if="showColorPicker" class="color-options">
            <div
                v-for="color in colors"
                :key="color"
                class="color-option"
                :style="{ background: color }"
                @click="selectColor(color)"
            ></div>
          </div>
        </div>
      </div>

      <!-- 笔刷粗细 -->
      <div class="tool-group">
        <label class="tool-label">粗细</label>
        <input
            type="range"
            v-model.number="brushSize"
            min="1"
            max="50"
            class="brush-size-slider"
        />
        <span class="brush-size-value">{{ brushSize }}</span>
      </div>

      <div class="spacer"></div>

      <!-- 操作按钮 -->
      <div class="tool-group">
        <button @click="undo" :disabled="!canUndo" class="tool-btn" title="撤销">
          ↶
        </button>
        <button @click="redo" :disabled="!canRedo" class="tool-btn" title="重做">
          ↷
        </button>
        <button @click="clearCanvas" class="tool-btn danger" title="清空画布">
          🗑️
        </button>
        <button @click="downloadImage" class="tool-btn" title="下载">
          💾
        </button>
      </div>
    </div>

    <!-- 画布 -->
    <div class="canvas-container" ref="canvasContainer">
      <canvas
          ref="canvas"
          @mousedown="startDrawing"
          @mousemove="draw"
          @mouseup="stopDrawing"
          @mouseleave="stopDrawing"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="stopDrawing"
      ></canvas>

      <!-- 远程光标 -->
      <div
          v-for="(cursor, userId) in remoteCursors"
          :key="userId"
          class="remote-cursor"
          :style="{
            left: cursor.x + 'px',
            top: cursor.y + 'px',
            borderColor: cursor.color
          }"
      >
        <div class="cursor-label" :style="{ background: cursor.color }">
          {{ cursor.username }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useWebSocket } from '@/composables/useWebSocket';
import api from "@/api/http.js";

const route = useRoute();
const authStore = useAuthStore();

const roomId = route.params.id;
const roomName = ref('协同画板');
const canvas = ref(null);
const canvasContainer = ref(null);
const ctx = ref(null);

// WebSocket
const token = localStorage.getItem('access_token');
const { connect, send, on, isConnected } = useWebSocket(roomId, token, 'board');

// 在线用户
const onlineUsers = ref([]);
const remoteCursors = ref({});

// 绘图状态
const isDrawing = ref(false);
const lastX = ref(0);
const lastY = ref(0);

// 工具配置
const tools = [
  { type: 'pen', icon: '✏️', name: '画笔' },
  { type: 'eraser', icon: '🧹', name: '橡皮擦' },
  { type: 'line', icon: '📏', name: '直线' },
  { type: 'rect', icon: '▭', name: '矩形' },
  { type: 'circle', icon: '○', name: '圆形' },
];

const colors = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  '#FFC0CB', '#A52A2A', '#808080', '#FFD700', '#4B0082'
];

const currentTool = ref('pen');
const currentColor = ref('#000000');
const brushSize = ref(5);
const showColorPicker = ref(false);

// 历史记录
const history = ref([]);
const historyStep = ref(-1);

const canUndo = computed(() => historyStep.value > 0);
const canRedo = computed(() => historyStep.value < history.value.length - 1);

// 形状绘制临时状态
const shapeStartX = ref(0);
const shapeStartY = ref(0);
const tempCanvas = ref(null);

// 初始化
onMounted(async () => {
  try {
    const response = await api.get(`/rooms/${roomId}`);
    roomName.value = response.data.name;
  } catch (error) {
    console.error('加载房间失败:', error);
  }

  await nextTick();
  initCanvas();
  connect();

  // 监听 WebSocket 消息
  on('init', (payload) => {
    console.log('初始化:', payload);
    onlineUsers.value = payload.users || [];

    // 加载已有的画布数据
    if (payload.canvas_data) {
      loadCanvasData(payload.canvas_data);
    }
  });

  on('draw', (payload) => {
    drawRemote(payload);
  });

  on('cursor', (payload) => {
    remoteCursors.value[payload.user_id] = {
      username: payload.username,
      color: payload.color,
      x: payload.x,
      y: payload.y
    };
  });

  on('user_joined', (payload) => {
    if (payload.users) {
      onlineUsers.value = payload.users;
    }
  });

  on('user_left', (payload) => {
    if (payload.users) {
      onlineUsers.value = payload.users;
    }
    delete remoteCursors.value[payload.user_id];
  });

  on('clear', () => {
    clearCanvasLocal();
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas);
});

// 初始化画布
const initCanvas = () => {
  const canvasEl = canvas.value;
  const container = canvasContainer.value;

  if (!canvasEl || !container) return;

  // 设置画布大小
  canvasEl.width = container.clientWidth;
  canvasEl.height = container.clientHeight;

  ctx.value = canvasEl.getContext('2d');
  ctx.value.lineCap = 'round';
  ctx.value.lineJoin = 'round';

  // 填充白色背景
  ctx.value.fillStyle = '#FFFFFF';
  ctx.value.fillRect(0, 0, canvasEl.width, canvasEl.height);

  // 保存初始状态
  saveHistory();

  // 监听窗口大小变化
  window.addEventListener('resize', resizeCanvas);
};

// 调整画布大小
const resizeCanvas = () => {
  const canvasEl = canvas.value;
  const container = canvasContainer.value;

  if (!canvasEl || !container) return;

  // 保存当前画布内容
  const imageData = ctx.value.getImageData(0, 0, canvasEl.width, canvasEl.height);

  // 调整大小
  canvasEl.width = container.clientWidth;
  canvasEl.height = container.clientHeight;

  // 恢复内容
  ctx.value.putImageData(imageData, 0, 0);
};

// 选择工具
const selectTool = (tool) => {
  currentTool.value = tool;
  showColorPicker.value = false;
};

// 选择颜色
const selectColor = (color) => {
  currentColor.value = color;
  showColorPicker.value = false;
};

// 获取鼠标位置
const getMousePos = (e) => {
  const rect = canvas.value.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
};

// 开始绘制
const startDrawing = (e) => {
  isDrawing.value = true;
  const pos = getMousePos(e);
  lastX.value = pos.x;
  lastY.value = pos.y;

  if (['line', 'rect', 'circle'].includes(currentTool.value)) {
    shapeStartX.value = pos.x;
    shapeStartY.value = pos.y;
    // 保存当前画布状态用于预览
    tempCanvas.value = ctx.value.getImageData(0, 0, canvas.value.width, canvas.value.height);
  }
};

// 绘制
const draw = (e) => {
  if (!isDrawing.value) {
    // 更新光标位置
    const pos = getMousePos(e);
    send('cursor', { x: pos.x, y: pos.y });
    return;
  }

  const pos = getMousePos(e);

  if (currentTool.value === 'pen' || currentTool.value === 'eraser') {
    drawLine(lastX.value, lastY.value, pos.x, pos.y);

    // 发送给其他用户
    send('draw', {
      tool: currentTool.value,
      color: currentColor.value,
      size: brushSize.value,
      x1: lastX.value,
      y1: lastY.value,
      x2: pos.x,
      y2: pos.y
    });

    lastX.value = pos.x;
    lastY.value = pos.y;
  } else if (['line', 'rect', 'circle'].includes(currentTool.value)) {
    // 恢复画布状态（清除预览）
    ctx.value.putImageData(tempCanvas.value, 0, 0);

    // 绘制预览
    drawShape(shapeStartX.value, shapeStartY.value, pos.x, pos.y, currentTool.value, true);
  }
};

// 停止绘制
const stopDrawing = () => {
  if (!isDrawing.value) return;

  if (['line', 'rect', 'circle'].includes(currentTool.value)) {
    const pos = { x: lastX.value, y: lastY.value };

    // 发送最终形状
    send('draw', {
      tool: currentTool.value,
      color: currentColor.value,
      size: brushSize.value,
      x1: shapeStartX.value,
      y1: shapeStartY.value,
      x2: pos.x,
      y2: pos.y
    });
  }

  isDrawing.value = false;
  saveHistory();
};

// 绘制线条
const drawLine = (x1, y1, x2, y2, color = currentColor.value, size = brushSize.value, isEraser = currentTool.value === 'eraser') => {
  ctx.value.beginPath();
  ctx.value.moveTo(x1, y1);
  ctx.value.lineTo(x2, y2);
  ctx.value.strokeStyle = isEraser ? '#FFFFFF' : color;
  ctx.value.lineWidth = size;
  ctx.value.stroke();
};

// 绘制形状
const drawShape = (x1, y1, x2, y2, shape, isPreview = false, color = currentColor.value, size = brushSize.value) => {
  ctx.value.strokeStyle = color;
  ctx.value.lineWidth = size;

  if (shape === 'line') {
    ctx.value.beginPath();
    ctx.value.moveTo(x1, y1);
    ctx.value.lineTo(x2, y2);
    ctx.value.stroke();
  } else if (shape === 'rect') {
    ctx.value.strokeRect(x1, y1, x2 - x1, y2 - y1);
  } else if (shape === 'circle') {
    const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    ctx.value.beginPath();
    ctx.value.arc(x1, y1, radius, 0, 2 * Math.PI);
    ctx.value.stroke();
  }
};

// 绘制远程操作
const drawRemote = (data) => {
  if (data.tool === 'pen' || data.tool === 'eraser') {
    drawLine(data.x1, data.y1, data.x2, data.y2, data.color, data.size, data.tool === 'eraser');
  } else if (['line', 'rect', 'circle'].includes(data.tool)) {
    drawShape(data.x1, data.y1, data.x2, data.y2, data.tool, false, data.color, data.size);
  }
};

// 触摸事件处理
const handleTouchStart = (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent('mousedown', {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.value.dispatchEvent(mouseEvent);
};

const handleTouchMove = (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent('mousemove', {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.value.dispatchEvent(mouseEvent);
};

// 历史记录管理
const saveHistory = () => {
  const imageData = ctx.value.getImageData(0, 0, canvas.value.width, canvas.value.height);

  // 删除当前步骤之后的历史
  history.value = history.value.slice(0, historyStep.value + 1);

  history.value.push(imageData);
  historyStep.value++;

  // 限制历史记录数量
  if (history.value.length > 50) {
    history.value.shift();
    historyStep.value--;
  }
};

const undo = () => {
  if (!canUndo.value) return;
  historyStep.value--;
  ctx.value.putImageData(history.value[historyStep.value], 0, 0);
};

const redo = () => {
  if (!canRedo.value) return;
  historyStep.value++;
  ctx.value.putImageData(history.value[historyStep.value], 0, 0);
};

// 清空画布
const clearCanvas = () => {
  if (confirm('确定要清空画布吗？')) {
    clearCanvasLocal();
    send('clear', {});
  }
};

const clearCanvasLocal = () => {
  ctx.value.fillStyle = '#FFFFFF';
  ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height);
  saveHistory();
};

// 下载图片
const downloadImage = () => {
  const link = document.createElement('a');
  link.download = `whiteboard_${Date.now()}.png`;
  link.href = canvas.value.toDataURL();
  link.click();
};

// 加载画布数据
const loadCanvasData = (dataUrl) => {
  const img = new Image();
  img.onload = () => {
    ctx.value.drawImage(img, 0, 0);
    saveHistory();
  };
  img.src = dataUrl;
};
</script>

<style scoped>
.whiteboard-room {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

/* 顶部工具栏 */
.whiteboard-header {
  background: white;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-back {
  padding: 6px 14px;
  background: #f1f3f5;
  color: #495057;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-back:hover {
  background: #e9ecef;
}

.room-info h2 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 700;
  color: #212529;
}

.status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6c757d;
}

.status.connected {
  color: #10b981;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f48771;
}

.status.connected .status-dot {
  background: #10b981;
  animation: pulse-dot 2s infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.online-users {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 13px;
  border: 2px solid white;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-badge:hover {
  transform: scale(1.1);
}

.user-count {
  font-size: 12px;
  color: #6c757d;
  font-weight: 600;
}

/* 工具栏 */
.toolbar {
  background: white;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  border-bottom: 1px solid #e9ecef;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
}

.tool-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tool-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tool-btn:hover:not(:disabled) {
  border-color: #667eea;
  transform: scale(1.05);
}

.tool-btn.active {
  border-color: #667eea;
  background: #f0f3ff;
}

.tool-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.tool-btn.danger:hover:not(:disabled) {
  border-color: #dc3545;
  background: #fff5f5;
}

.color-picker-wrapper {
  position: relative;
}

.current-color {
  width: 40px;
  height: 40px;
  border: 3px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: inset 0 0 0 2px white;
  transition: all 0.2s;
}

.current-color:hover {
  border-color: #667eea;
  transform: scale(1.05);
}

.color-options {
  position: absolute;
  top: 50px;
  left: 0;
  background: white;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  z-index: 100;
}

.color-option {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid #e9ecef;
  transition: all 0.2s;
}

.color-option:hover {
  transform: scale(1.15);
  border-color: #667eea;
}

.tool-label {
  font-size: 13px;
  color: #6c757d;
  font-weight: 600;
}

.brush-size-slider {
  width: 100px;
}

.brush-size-value {
  font-size: 13px;
  color: #495057;
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

.spacer {
  flex: 1;
}

/* 画布容器 */
.canvas-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: #ffffff;
}

canvas {
  display: block;
  cursor: crosshair;
  touch-action: none;
}

.remote-cursor {
  position: absolute;
  width: 3px;
  height: 20px;
  border-left: 3px solid;
  pointer-events: none;
  z-index: 10;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.5; }
}

.cursor-label {
  position: absolute;
  top: -26px;
  left: -4px;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  color: white;
  white-space: nowrap;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 响应式 */
@media (max-width: 768px) {
  .toolbar {
    overflow-x: auto;
    padding: 8px 12px;
  }

  .tool-btn {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  .brush-size-slider {
    width: 80px;
  }
}
</style>
