<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <!-- 弹窗头部 -->
          <div class="modal-header">
            <div class="header-left">
              <h2 class="modal-title">订单详情</h2>
              <span :class="['status-badge', order.status]">
                {{ getStatusText(order.status) }}
              </span>
            </div>
            <button class="close-btn" @click="closeModal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <!-- 弹窗内容 -->
          <div class="modal-body">
            <!-- 订单基本信息 -->
            <section class="info-section">
              <h3 class="section-title">订单信息</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">订单号</span>
                  <span class="info-value">{{ order.orderNo }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">下单时间</span>
                  <span class="info-value">{{ order.createdAt }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">订单状态</span>
                  <span class="info-value status-text">{{ getStatusText(order.status) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">实付金额</span>
                  <span class="info-value price-text">¥{{ order.totalAmount.toFixed(2) }}</span>
                </div>
              </div>
            </section>

            <!-- 宠物信息 -->
            <section class="info-section">
              <h3 class="section-title">宠物信息</h3>
              <div class="pet-list">
                <div v-for="item in order.items" :key="item.id" class="pet-card">
                  <img :src="item.image" :alt="item.name" class="pet-image" />
                  <div class="pet-info">
                    <h4 class="pet-name">{{ item.name }}</h4>
                    <div class="pet-specs">
                      <div class="spec-item">
                        <span class="spec-label">品种：</span>
                        <span class="spec-value">{{ item.species }}</span>
                      </div>
                      <div class="spec-item">
                        <span class="spec-label">年龄：</span>
                        <span class="spec-value">{{ item.age }}</span>
                      </div>
                      <div class="spec-item">
                        <span class="spec-label">性别：</span>
                        <span class="spec-value">{{ item.gender }}</span>
                      </div>
                    </div>
                    <div class="pet-health">
                      <span class="health-icon">✓</span>
                      <span class="health-text">{{ item.healthStatus }}</span>
                    </div>
                  </div>
                  <div class="pet-price">
                    <div class="price-main">¥{{ item.price.toFixed(2) }}</div>
                    <div class="price-quantity">x{{ item.quantity }}</div>
                  </div>
                </div>
              </div>
            </section>

            <!-- 物流信息 -->
            <section v-if="order.logistics" class="info-section">
              <h3 class="section-title">物流信息</h3>
              <div class="logistics-card">
                <div class="logistics-header">
                  <div class="logistics-company">
                    <span class="company-icon">🚚</span>
                    <span class="company-name">{{ order.logistics.company }}</span>
                  </div>
                  <div class="tracking-number">
                    <span class="tracking-label">运单号：</span>
                    <span class="tracking-value">{{ order.logistics.trackingNo }}</span>
                    <button class="copy-btn" @click="copyTrackingNo">复制</button>
                  </div>
                </div>
                <div class="logistics-status">
                  <div class="status-icon">📍</div>
                  <div class="status-text">{{ order.logistics.status }}</div>
                </div>
                <div class="logistics-timeline">
                  <div class="timeline-item" v-for="(track, index) in mockTimeline" :key="index">
                    <div class="timeline-dot" :class="{ active: index === 0 }"></div>
                    <div class="timeline-content">
                      <div class="timeline-time">{{ track.time }}</div>
                      <div class="timeline-desc">{{ track.description }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- 收货信息 -->
            <section class="info-section">
              <h3 class="section-title">收货信息</h3>
              <div class="address-card">
                <div class="address-row">
                  <span class="address-label">收货人：</span>
                  <span class="address-value">张三</span>
                </div>
                <div class="address-row">
                  <span class="address-label">联系电话：</span>
                  <span class="address-value">138****8888</span>
                </div>
                <div class="address-row">
                  <span class="address-label">收货地址：</span>
                  <span class="address-value">北京市朝阳区某某街道某某小区1号楼101室</span>
                </div>
              </div>
            </section>

            <!-- 费用明细 -->
            <section class="info-section">
              <h3 class="section-title">费用明细</h3>
              <div class="cost-detail">
                <div class="cost-row">
                  <span class="cost-label">商品总价</span>
                  <span class="cost-value">¥{{ order.totalAmount.toFixed(2) }}</span>
                </div>
                <div class="cost-row">
                  <span class="cost-label">运费</span>
                  <span class="cost-value">¥0.00</span>
                </div>
                <div class="cost-row">
                  <span class="cost-label">优惠券</span>
                  <span class="cost-value discount">-¥0.00</span>
                </div>
                <div class="cost-row total">
                  <span class="cost-label">实付款</span>
                  <span class="cost-value">¥{{ order.totalAmount.toFixed(2) }}</span>
                </div>
              </div>
            </section>
          </div>

          <!-- 弹窗底部操作 -->
          <div class="modal-footer">
            <button class="btn-secondary" @click="handleContact">联系客服</button>
            <div class="footer-actions">
              <button
                v-if="order.status === 'pending_payment'"
                class="btn-outline"
                @click="handleCancel"
              >
                取消订单
              </button>
              <button
                v-if="order.status === 'pending_payment'"
                class="btn-primary"
                @click="handlePay"
              >
                立即付款
              </button>
              <button
                v-if="order.status === 'shipped'"
                class="btn-primary"
                @click="handleConfirm"
              >
                确认收货
              </button>
              <button
                v-if="order.status === 'completed'"
                class="btn-primary"
                @click="handleEvaluate"
              >
                评价订单
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'pay', 'cancel', 'confirm', 'evaluate', 'contact']);

// 模拟物流轨迹
const mockTimeline = ref([
  {
    time: '2024-12-19 14:30',
    description: '【北京市】快件已送达，签收人：本人签收'
  },
  {
    time: '2024-12-19 10:15',
    description: '【北京市】快件正在派送中，快递员：李师傅 13800138000'
  },
  {
    time: '2024-12-19 08:20',
    description: '【北京市】快件已到达【北京朝阳区分拨中心】'
  },
  {
    time: '2024-12-18 20:45',
    description: '【天津市】快件已发出，正在运往【北京朝阳区分拨中心】'
  },
  {
    time: '2024-12-18 18:30',
    description: '【天津市】快件已到达【天津转运中心】'
  }
]);

const getStatusText = (status) => {
  const statusMap = {
    pending_payment: '待付款',
    pending_shipment: '待发货',
    shipped: '运输中',
    completed: '已完成',
    cancelled: '已取消'
  };
  return statusMap[status] || status;
};

const closeModal = () => {
  emit('close');
};

const copyTrackingNo = () => {
  navigator.clipboard.writeText(props.order.logistics.trackingNo);
  alert('运单号已复制到剪贴板');
};

const handlePay = () => {
  emit('pay', props.order);
  closeModal();
};

const handleCancel = () => {
  emit('cancel', props.order);
  closeModal();
};

const handleConfirm = () => {
  emit('confirm', props.order);
  closeModal();
};

const handleEvaluate = () => {
  emit('evaluate', props.order);
  closeModal();
};

const handleContact = () => {
  emit('contact', props.order);
};
</script>

<style scoped>
/* 遮罩层动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}

/* 遮罩层 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  backdrop-filter: blur(4px);
}

/* 弹窗容器 */
.modal-container {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

/* 弹窗头部 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

/* 弹窗内容 */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
  min-height: 0;
}

.info-section {
  margin-bottom: 28px;
}

.info-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

/* 订单基本信息 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  background: #fafafa;
  padding: 20px;
  border-radius: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-label {
  font-size: 13px;
  color: #8c8c8c;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.status-text {
  color: #667eea;
}

.price-text {
  color: #ff4d4f;
  font-size: 18px;
  font-weight: 600;
}

/* 宠物列表 */
.pet-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pet-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #fafafa;
  border-radius: 12px;
  transition: all 0.3s;
}

.pet-card:hover {
  background: #f0f0f0;
}

.pet-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
  flex-shrink: 0;
}

.pet-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pet-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.pet-specs {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.spec-item {
  font-size: 13px;
}

.spec-label {
  color: #8c8c8c;
}

.spec-value {
  color: #333;
}

.pet-health {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 6px;
  width: fit-content;
}

.health-icon {
  color: #52c41a;
  font-weight: bold;
}

.health-text {
  font-size: 12px;
  color: #52c41a;
}

.pet-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 6px;
}

.price-main {
  font-size: 20px;
  font-weight: 700;
  color: #ff4d4f;
}

.price-quantity {
  font-size: 13px;
  color: #999;
}

/* 物流信息 */
.logistics-card {
  background: #fafafa;
  border-radius: 12px;
  padding: 20px;
}

.logistics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.logistics-company {
  display: flex;
  align-items: center;
  gap: 8px;
}

.company-icon {
  font-size: 20px;
}

.company-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.tracking-number {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tracking-label {
  font-size: 13px;
  color: #8c8c8c;
}

.tracking-value {
  font-size: 13px;
  color: #333;
  font-family: monospace;
}

.copy-btn {
  padding: 4px 12px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 12px;
  color: #667eea;
  cursor: pointer;
  transition: all 0.3s;
}

.copy-btn:hover {
  border-color: #667eea;
  background: #f0f2ff;
}

.logistics-status {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  margin-bottom: 16px;
}

.status-icon {
  font-size: 24px;
}

.status-text {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.logistics-timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.timeline-item {
  display: flex;
  gap: 16px;
  position: relative;
}

.timeline-item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 24px;
  bottom: -16px;
  width: 2px;
  background: #e8e8e8;
}

.timeline-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 3px solid #e8e8e8;
  background: white;
  flex-shrink: 0;
  margin-top: 4px;
}

.timeline-dot.active {
  border-color: #52c41a;
  background: #52c41a;
}

.timeline-content {
  flex: 1;
}

.timeline-time {
  font-size: 13px;
  color: #8c8c8c;
  margin-bottom: 4px;
}

.timeline-desc {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

/* 收货信息 */
.address-card {
  background: #fafafa;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.address-row {
  display: flex;
  font-size: 14px;
}

.address-label {
  color: #8c8c8c;
  min-width: 80px;
}

.address-value {
  color: #333;
  flex: 1;
}

/* 费用明细 */
.cost-detail {
  background: #fafafa;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cost-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.cost-row.total {
  padding-top: 12px;
  border-top: 1px solid #e8e8e8;
  margin-top: 4px;
}

.cost-row.total .cost-label {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.cost-row.total .cost-value {
  font-size: 20px;
  font-weight: 700;
  color: #ff4d4f;
}

.cost-label {
  color: #8c8c8c;
}

.cost-value {
  color: #333;
  font-weight: 500;
}

.cost-value.discount {
  color: #ff4d4f;
}

/* 弹窗底部 */
.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 28px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
  flex-shrink: 0;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

/* 按钮样式 */
.btn-primary {
  padding: 10px 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  padding: 10px 24px;
  background: white;
  color: #667eea;
  border: 1px solid #667eea;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: #f0f2ff;
}

.btn-outline {
  padding: 10px 24px;
  background: white;
  color: #666;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-outline:hover {
  color: #667eea;
  border-color: #667eea;
}

/* 响应式 */
@media (max-width: 768px) {
  .modal-container {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .pet-card {
    flex-direction: column;
  }

  .pet-image {
    width: 100%;
    height: 200px;
  }

  .pet-price {
    flex-direction: row;
    justify-content: space-between;
  }

  .modal-footer {
    flex-direction: column;
    gap: 12px;
  }

  .footer-actions {
    width: 100%;
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary,
  .btn-outline {
    width: 100%;
  }
}
</style>