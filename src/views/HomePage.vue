<template>
  <div class="page home-page">
    <div class="hero">
      <h1 class="hero-title">🚀 WorkTogether</h1>
      <p class="hero-subtitle">让远程编程协作像在同一个屏幕前一样简单</p>
      <div class="hero-actions">
        <button class="btn btn-primary">开始使用</button>
        <button class="btn btn-secondary">查看演示</button>
      </div>
    </div>

    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">⚡</div>
        <h3>实时同步</h3>
        <p>毫秒级延迟，流畅的协作体验</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🎨</div>
        <h3>多种房间</h3>
        <p>代码、白板、聊天、视频全支持</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🔒</div>
        <h3>安全可靠</h3>
        <p>端到端加密，保护你的数据</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// 这个组件暂时不需要 JS 逻辑
</script>

<style scoped>
/* ===== 首页 ===== */
.hero {
  text-align: center;
  padding: 40px 0;
  margin-bottom: 48px;
}

.hero-title {
  font-size: 48px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 18px;
  color: #6c757d;
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

/* 按钮样式 (复制到这里以保证组件独立) */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-secondary:hover {
  background: #f8f9ff;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feature-card {
  padding: 28px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s;
}

.feature-card:hover {
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 18px;
  color: #212529;
  margin-bottom: 8px;
}

.feature-card p {
  font-size: 14px;
  color: #6c757d;
  line-height: 1.6;
}

/* ===== 响应式 (HomePage 专属) ===== */
@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
