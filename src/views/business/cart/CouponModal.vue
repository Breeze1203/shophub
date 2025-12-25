<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">选择优惠券</h2>
            <button class="close-btn" @click="closeModal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div v-if="coupons.length === 0" class="empty-state">
              <div class="empty-icon">🎫</div>
              <p>暂无可用优惠券</p>
            </div>

            <div v-else class="coupon-list">
              <div
                v-for="coupon in coupons"
                :key="coupon.id"
                :class="['coupon-card', { selected: selected?.id === coupon.id }]"
                @click="selectCoupon(coupon)"
              >
                <div class="coupon-left">
                  <div class="discount-amount">
                    <span class="currency">¥</span>
                    <span class="amount">{{ coupon.discount }}</span>
                  </div>
                  <div class="min-amount">满{{ coupon.minAmount }}可用</div>
                </div>
                <div class="coupon-divider">
                  <div class="circle top"></div>
                  <div class="dashed-line"></div>
                  <div class="circle bottom"></div>
                </div>
                <div class="coupon-right">
                  <div class="coupon-name">{{ coupon.name }}</div>
                  <div class="coupon-expire">有效期至 {{ coupon.expireDate }}</div>
                  <div v-if="selected?.id === coupon.id" class="selected-icon">✓</div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="closeModal">取消</button>
            <button class="btn-confirm" @click="confirmSelect">确定</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  coupons: {
    type: Array,
    default: () => []
  },
  selected: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['select', 'close']);

const currentSelected = ref(props.selected);

const selectCoupon = (coupon) => {
  currentSelected.value = coupon;
};

const confirmSelect = () => {
  emit('select', currentSelected.value);
};

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
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

.modal-container {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f5f5f5;
  color: #666;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #e8e8e8;
  transform: rotate(90deg);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  min-height: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.coupon-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.coupon-card {
  display: flex;
  background: linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
  position: relative;
}

.coupon-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(255, 169, 64, 0.3);
}

.coupon-card.selected {
  border-color: #fa8c16;
  box-shadow: 0 8px 20px rgba(250, 140, 22, 0.4);
}

.coupon-left {
  width: 140px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffa940 0%, #fa8c16 100%);
  color: white;
  flex-shrink: 0;
}

.discount-amount {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
}

.currency {
  font-size: 18px;
  font-weight: 600;
  margin-right: 2px;
}

.amount {
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
}

.min-amount {
  font-size: 12px;
  opacity: 0.9;
}

.coupon-divider {
  width: 12px;
  position: relative;
  background: linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%);
  flex-shrink: 0;
}

.circle {
  width: 16px;
  height: 16px;
  background: #f5f7fa;
  border-radius: 50%;
  position: absolute;
  left: -2px;
}

.circle.top {
  top: -8px;
}

.circle.bottom {
  bottom: -8px;
}

.dashed-line {
  position: absolute;
  left: 50%;
  top: 8px;
  bottom: 8px;
  width: 1px;
  border-left: 2px dashed rgba(250, 140, 22, 0.3);
  transform: translateX(-50%);
}

.coupon-right {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.coupon-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.coupon-expire {
  font-size: 13px;
  color: #8c8c8c;
}

.selected-icon {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  background: #fa8c16;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-cancel:hover {
  background: #e8e8e8;
}

.btn-confirm {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .coupon-left {
    width: 100px;
    padding: 16px;
  }

  .amount {
    font-size: 28px;
  }

  .coupon-right {
    padding: 16px;
  }

  .modal-footer {
    flex-direction: column;
  }
}
</style>