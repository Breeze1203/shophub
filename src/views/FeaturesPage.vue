<template>
  <div class="page features-page">
    <div class="features-list">
      <div v-for="feature in features" :key="feature.title" class="feature-item">
        <div class="feature-icon-large">{{ feature.icon }}</div>
        <div class="feature-content">
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const features = [
  { icon: '⚡', title: '实时同步', desc: 'WebSocket 低延迟通信，所有操作 100ms 内同步' },
  { icon: '👁️', title: '可视化协作', desc: '显示每个用户的光标位置，避免编辑冲突' },
  { icon: '🎨', title: '多语言支持', desc: '支持 50+ 编程语言的语法高亮和补全' },
  { icon: '🔒', title: '权限管理', desc: '灵活的访问控制，支持公开/私有/只读模式' },
  { icon: '💾', title: '自动保存', desc: '编辑后 2 秒自动保存，支持版本历史回滚' },
  { icon: '🚀', title: '代码执行', desc: 'Docker 沙箱环境，安全地运行和测试代码' }
];
</script>

<style scoped>
/* ===== 功能特性页 ===== */
.features-list {
  display: grid;
  gap: 20px;
}

.feature-item {
  display: flex;
  gap: 20px;
  padding: 24px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  transition: all 0.3s;
}

.feature-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.feature-icon-large {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  flex-shrink: 0;
}

.feature-content h3 {
  font-size: 18px;
  color: #212529;
  margin-bottom: 8px;
}

.feature-content p {
  font-size: 14px;
  color: #6c757d;
  line-height: 1.6;
}
</style>
