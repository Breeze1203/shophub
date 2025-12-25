<template>
  <div class="cart-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <p class="page-subtitle">{{ cartItems.length }} 件宠物待结算</p>
    </div>

    <div class="cart-content">
      <!-- 购物车主体 -->
      <div class="cart-main">
        <!-- 空购物车状态 -->
        <div
          v-if="cartItems.length === 0"
          class="empty-cart"
        >
          <div class="empty-icon">🛒</div>
          <h3>购物车空空如也</h3>
          <p>快去选购心仪的宠物吧~</p>
          <button
            class="btn-primary"
            @click="goShopping"
          >去选购</button>
        </div>

        <!-- 购物车列表 -->
        <div
          v-else
          class="cart-list"
        >
          <!-- 全选栏 -->
          <div class="select-all-bar">
            <label class="checkbox-wrapper">
              <input
                type="checkbox"
                :checked="isAllSelected"
                @change="toggleSelectAll"
              />
              <span class="checkbox-label">全选</span>
            </label>
            <button
              class="btn-text-danger"
              @click="clearInvalid"
            >
              清空失效商品
            </button>
          </div>

          <!-- 购物车项目 -->
          <div class="cart-items">
            <div
              v-for="item in cartItems"
              :key="item.id"
              :class="['cart-item', { disabled: !item.available }]"
            >
              <!-- 选择框 -->
              <div class="item-select">
                <label class="checkbox-wrapper">
                  <input
                    type="checkbox"
                    :checked="item.selected"
                    :disabled="!item.available"
                    @change="toggleSelect(item)"
                  />
                </label>
              </div>

              <!-- 宠物图片 -->
              <div
                class="item-image-wrapper"
                @click="viewDetail(item)"
              >
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="item-image"
                />
                <div
                  v-if="!item.available"
                  class="unavailable-mask"
                >
                  <span>已下架</span>
                </div>
              </div>

              <!-- 宠物信息 -->
              <div
                class="item-info"
                @click="viewDetail(item)"
              >
                <h3 class="item-name">{{ item.name }}</h3>
                <div class="item-specs">
                  <span class="spec-tag">{{ item.species }}</span>
                  <span class="spec-tag">{{ item.age }}</span>
                  <span class="spec-tag">{{ item.gender }}</span>
                </div>
                <div class="item-health">
                  <span class="health-icon">✓</span>
                  <span class="health-text">{{ item.healthStatus }}</span>
                </div>
                <div
                  v-if="item.stock"
                  class="item-stock"
                >
                  仅剩 {{ item.stock }} 只
                </div>
              </div>

              <!-- 单价 -->
              <div class="item-price">
                <div class="current-price">¥{{ item.price.toFixed(2) }}</div>
                <div
                  v-if="item.originalPrice"
                  class="original-price"
                >
                  ¥{{ item.originalPrice.toFixed(2) }}
                </div>
              </div>

              <!-- 数量 -->
              <div class="item-quantity">
                <div class="quantity-control">
                  <button
                    class="quantity-btn"
                    :disabled="item.quantity <= 1 || !item.available"
                    @click="decreaseQuantity(item)"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    class="quantity-input"
                    :value="item.quantity"
                    :disabled="!item.available"
                    @input="updateQuantity(item, $event)"
                  />
                  <button
                    class="quantity-btn"
                    :disabled="!item.available || item.quantity >= item.stock"
                    @click="increaseQuantity(item)"
                  >
                    +
                  </button>
                </div>
              </div>

              <!-- 小计 -->
              <div class="item-subtotal">
                ¥{{ (item.price * item.quantity).toFixed(2) }}
              </div>

              <!-- 操作 -->
              <div class="item-actions">
                <button
                  class="action-btn"
                  @click="moveToFavorite(item)"
                >
                  移入收藏
                </button>
                <button
                  class="action-btn delete"
                  @click="removeItem(item)"
                >
                  删除
                </button>
              </div>
            </div>
          </div>

          <!-- 推荐商品 -->
          <div class="recommend-section">
            <h3 class="recommend-title">
              <span class="title-icon">💡</span>
              为您推荐
            </h3>
            <div class="recommend-list">
              <div
                v-for="item in recommendItems"
                :key="item.id"
                class="recommend-item"
                @click="addToCart(item)"
              >
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="recommend-image"
                />
                <div class="recommend-info">
                  <div class="recommend-name">{{ item.name }}</div>
                  <div class="recommend-price">¥{{ item.price.toFixed(2) }}</div>
                </div>
                <button class="add-btn">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 结算栏 -->
      <div
        v-if="cartItems.length > 0"
        class="cart-summary"
      >
        <div class="summary-card">
          <h3 class="summary-title">结算信息</h3>

          <!-- 优惠券 -->
          <div
            class="coupon-section"
            @click="showCouponModal = true"
          >
            <div class="coupon-label">优惠券</div>
            <div class="coupon-value">
              <span v-if="selectedCoupon">-¥{{ selectedCoupon.discount }}</span>
              <span
                v-else
                class="coupon-hint"
              >{{ availableCoupons.length }} 张可用</span>
              <span class="arrow">›</span>
            </div>
          </div>

          <!-- 费用明细 -->
          <div class="summary-detail">
            <div class="detail-row">
              <span class="detail-label">商品总价</span>
              <span class="detail-value">¥{{ totalPrice.toFixed(2) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">运费</span>
              <span class="detail-value">¥{{ shippingFee.toFixed(2) }}</span>
            </div>
            <div
              v-if="selectedCoupon"
              class="detail-row discount"
            >
              <span class="detail-label">优惠券</span>
              <span class="detail-value">-¥{{ selectedCoupon.discount }}</span>
            </div>
          </div>

          <!-- 总计 -->
          <div class="summary-total">
            <div class="total-label">合计</div>
            <div class="total-amount">
              <span class="total-price">¥{{ finalPrice.toFixed(2) }}</span>
            </div>
          </div>

          <!-- 已选商品 -->
          <div class="selected-info">
            已选 <span class="highlight">{{ selectedCount }}</span> 件商品
          </div>

          <!-- 结算按钮 -->
          <button
            class="checkout-btn"
            :disabled="selectedCount === 0"
            @click="checkout"
          >
            结算 ({{ selectedCount }})
          </button>

          <!-- 温馨提示 -->
          <div class="tips-section">
            <div class="tips-title">🐾 温馨提示</div>
            <ul class="tips-list">
              <li>所有宠物均经过健康检疫</li>
              <li>支持7天无理由退换</li>
              <li>专业物流配送，确保安全</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 优惠券弹窗 -->
    <CouponModal
      v-if="showCouponModal"
      :coupons="availableCoupons"
      :selected="selectedCoupon"
      @select="selectCoupon"
      @close="showCouponModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import CouponModal from "./CouponModal.vue";

// 购物车数据
const cartItems = ref([
  {
    id: 1,
    name: "豹纹守宫",
    species: "高黄白化",
    age: "3个月",
    gender: "母",
    price: 1680.0,
    originalPrice: 1980.0,
    quantity: 1,
    stock: 3,
    image:
      "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=300&h=300&fit=crop",
    healthStatus: "健康证明已上传",
    available: true,
    selected: true,
  },
  {
    id: 2,
    name: "蓝舌石龙子",
    species: "印尼亚种",
    age: "6个月",
    gender: "公",
    price: 2000.0,
    quantity: 1,
    stock: 2,
    image:
      "https://images.unsplash.com/photo-1565002604749-dfd1cfc6d4de?w=300&h=300&fit=crop",
    healthStatus: "已完成检疫",
    available: true,
    selected: true,
  },
  {
    id: 3,
    name: "玉米蛇",
    species: "暴风雪纹",
    age: "1岁",
    gender: "母",
    price: 2600.0,
    quantity: 2,
    stock: 5,
    image:
      "https://images.unsplash.com/photo-1531520615002-27fddcc13e1e?w=300&h=300&fit=crop",
    healthStatus: "健康证明已上传",
    available: true,
    selected: false,
  },
  {
    id: 4,
    name: "鬃狮蜥",
    species: "标准型",
    age: "4个月",
    gender: "公",
    price: 980.0,
    quantity: 1,
    stock: 0,
    image:
      "https://images.unsplash.com/photo-1612363148951-15f16817648f?w=300&h=300&fit=crop",
    healthStatus: "已完成检疫",
    available: false,
    selected: false,
  },
]);

// 推荐商品
const recommendItems = ref([
  {
    id: 101,
    name: "绿鬣蜥",
    price: 1580.0,
    image:
      "https://images.unsplash.com/photo-1551767058-f0e994e5b731?w=200&h=200&fit=crop",
  },
  {
    id: 102,
    name: "高冠变色龙",
    price: 3200.0,
    image:
      "https://images.unsplash.com/photo-1569235186275-626cb53b83ce?w=200&h=200&fit=crop",
  },
  {
    id: 103,
    name: "王者蜥",
    price: 2280.0,
    image:
      "https://images.unsplash.com/photo-1527335480088-278dbeec0ad5?w=200&h=200&fit=crop",
  },
]);

// 优惠券数据
const availableCoupons = ref([
  {
    id: 1,
    name: "新人专享券",
    discount: 100,
    minAmount: 500,
    expireDate: "2024-12-31",
  },
  {
    id: 2,
    name: "满1000减150",
    discount: 150,
    minAmount: 1000,
    expireDate: "2024-12-31",
  },
  {
    id: 3,
    name: "满2000减300",
    discount: 300,
    minAmount: 2000,
    expireDate: "2024-12-31",
  },
]);

const selectedCoupon = ref(null);
const showCouponModal = ref(false);

// 计算属性
const isAllSelected = computed(() => {
  const availableItems = cartItems.value.filter((item) => item.available);
  return (
    availableItems.length > 0 && availableItems.every((item) => item.selected)
  );
});

const selectedCount = computed(() => {
  return cartItems.value.filter((item) => item.selected && item.available)
    .length;
});

const totalPrice = computed(() => {
  return cartItems.value
    .filter((item) => item.selected && item.available)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
});

const shippingFee = computed(() => {
  return totalPrice.value >= 1000 ? 0 : 20;
});

const finalPrice = computed(() => {
  let price = totalPrice.value + shippingFee.value;
  if (selectedCoupon.value && price >= selectedCoupon.value.minAmount) {
    price -= selectedCoupon.value.discount;
  }
  return Math.max(0, price);
});

// 方法
const toggleSelectAll = () => {
  const newState = !isAllSelected.value;
  cartItems.value.forEach((item) => {
    if (item.available) {
      item.selected = newState;
    }
  });
};

const toggleSelect = (item) => {
  item.selected = !item.selected;
};

const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    item.quantity--;
  }
};

const increaseQuantity = (item) => {
  if (item.quantity < item.stock) {
    item.quantity++;
  }
};

const updateQuantity = (item, event) => {
  let value = parseInt(event.target.value) || 1;
  value = Math.max(1, Math.min(value, item.stock));
  item.quantity = value;
};

const removeItem = (item) => {
  if (confirm(`确定要删除 ${item.name} 吗？`)) {
    const index = cartItems.value.findIndex((i) => i.id === item.id);
    if (index > -1) {
      cartItems.value.splice(index, 1);
    }
  }
};

const moveToFavorite = (item) => {
  alert(`${item.name} 已移入收藏夹`);
  removeItem(item);
};

const clearInvalid = () => {
  const invalidItems = cartItems.value.filter((item) => !item.available);
  if (invalidItems.length === 0) {
    alert("没有失效商品");
    return;
  }
  if (confirm(`确定要清空 ${invalidItems.length} 件失效商品吗？`)) {
    cartItems.value = cartItems.value.filter((item) => item.available);
  }
};

const viewDetail = (item) => {
  console.log("查看详情:", item);
};

const addToCart = (item) => {
  alert(`${item.name} 已加入购物车`);
};

const selectCoupon = (coupon) => {
  if (totalPrice.value >= coupon.minAmount) {
    selectedCoupon.value = coupon;
    showCouponModal.value = false;
  } else {
    alert(
      `再购买 ¥${(coupon.minAmount - totalPrice.value).toFixed(
        2
      )} 即可使用此优惠券`
    );
  }
};

const checkout = () => {
  if (selectedCount.value === 0) {
    alert("请选择要结算的商品");
    return;
  }
  console.log("去结算");
  alert("跳转到结算页面...");
};

const goShopping = () => {
  console.log("去选购");
};
</script>

<style scoped>
.cart-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  background: #f5f7fa;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 页面头部 */
.page-header {
  margin-bottom: 24px;
  flex-shrink: 0;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0;
}

/* 购物车内容 */
.cart-content {
  flex: 1;
  display: flex;
  gap: 24px;
  overflow: hidden;
  min-height: 0;
}

/* 购物车主体 */
.cart-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

/* 空购物车 */
.empty-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 24px;
  opacity: 0.5;
}

.empty-cart h3 {
  font-size: 20px;
  color: #333;
  margin: 0 0 12px 0;
}

.empty-cart p {
  font-size: 14px;
  color: #999;
  margin: 0 0 32px 0;
}

/* 购物车列表 */
.cart-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

/* 全选栏 */
.select-all-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: white;
  border-radius: 12px;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.checkbox-wrapper input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #667eea;
}

.checkbox-label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.btn-text-danger {
  background: none;
  border: none;
  color: #ff4d4f;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  transition: all 0.3s;
}

.btn-text-danger:hover {
  color: #ff7875;
}

/* 购物车项目 */
.cart-items {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 4px;
  min-height: 0;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  transition: all 0.3s;
  position: relative;
}

.cart-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.cart-item.disabled {
  opacity: 0.6;
  background: #fafafa;
}

.item-select {
  flex-shrink: 0;
}

/* 宠物图片 */
.item-image-wrapper {
  width: 120px;
  height: 120px;
  position: relative;
  flex-shrink: 0;
  cursor: pointer;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.unavailable-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 500;
}

/* 宠物信息 */
.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.item-specs {
  display: flex;
  gap: 8px;
}

.spec-tag {
  padding: 2px 8px;
  background: #f0f2ff;
  color: #667eea;
  border-radius: 4px;
  font-size: 12px;
}

.item-health {
  display: flex;
  align-items: center;
  gap: 4px;
}

.health-icon {
  color: #52c41a;
  font-weight: bold;
  font-size: 12px;
}

.health-text {
  font-size: 12px;
  color: #52c41a;
}

.item-stock {
  font-size: 12px;
  color: #ff4d4f;
}

/* 单价 */
.item-price {
  width: 100px;
  text-align: center;
  flex-shrink: 0;
}

.current-price {
  font-size: 18px;
  font-weight: 600;
  color: #ff4d4f;
}

.original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
  margin-top: 4px;
}

/* 数量控制 */
.item-quantity {
  width: 120px;
  flex-shrink: 0;
}

.quantity-control {
  display: flex;
  align-items: center;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  overflow: hidden;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #fafafa;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.quantity-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
}

.quantity-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.quantity-input {
  width: 56px;
  height: 32px;
  border: none;
  text-align: center;
  font-size: 14px;
  outline: none;
}

.quantity-input::-webkit-inner-spin-button,
.quantity-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* 小计 */
.item-subtotal {
  width: 100px;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: #ff4d4f;
  flex-shrink: 0;
}

/* 操作 */
.item-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  padding: 6px 12px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.action-btn:hover {
  color: #667eea;
  border-color: #667eea;
}

.action-btn.delete:hover {
  color: #ff4d4f;
  border-color: #ff4d4f;
}

/* 推荐商品 */
.recommend-section {
  margin-top: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  flex-shrink: 0;
}

.recommend-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
}

.title-icon {
  font-size: 20px;
}

.recommend-list {
  display: flex;
  gap: 16px;
  overflow-x: auto;
}

.recommend-item {
  flex-shrink: 0;
  width: 200px;
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.recommend-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.recommend-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 8px;
}

.recommend-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recommend-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.recommend-price {
  font-size: 14px;
  color: #ff4d4f;
  font-weight: 600;
}

.add-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(102, 126, 234, 0.9);
  color: white;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn:hover {
  background: #667eea;
  transform: scale(1.1);
}

/* 结算栏 */
.cart-summary {
  width: 360px;
  flex-shrink: 0;
  overflow-y: auto;
}

.summary-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  position: sticky;
  top: 0;
}

.summary-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 20px 0;
}

/* 优惠券 */
.coupon-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #fff7e6;
  border: 1px dashed #ffa940;
  border-radius: 8px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.coupon-section:hover {
  background: #ffe7ba;
}

.coupon-label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.coupon-value {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #fa8c16;
  font-weight: 600;
}

.coupon-hint {
  color: #fa8c16;
}

.arrow {
  font-size: 18px;
  color: #fa8c16;
}

/* 费用明细 */
.summary-detail {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.detail-row.discount {
  color: #ff4d4f;
}

.detail-label {
  color: #8c8c8c;
}

.detail-value {
  color: #333;
  font-weight: 500;
}

/* 总计 */
.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.total-label {
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.total-amount {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.total-price {
  font-size: 28px;
  font-weight: 700;
  color: #ff4d4f;
}

.selected-info {
  text-align: center;
  font-size: 13px;
  color: #8c8c8c;
  margin-bottom: 16px;
}

.highlight {
  color: #667eea;
  font-weight: 600;
}

/* 结算按钮 */
.checkout-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;
}

.checkout-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.checkout-btn:disabled {
  background: #d9d9d9;
  cursor: not-allowed;
  transform: none;
}

/* 温馨提示 */
.tips-section {
  padding: 16px;
  background: #f0f2ff;
  border-radius: 8px;
}

.tips-title {
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 12px;
}

.tips-list {
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tips-list li {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

/* 按钮样式 */
.btn-primary {
  padding: 12px 32px;
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

/* 响应式 */
@media (max-width: 1200px) {
  .cart-content {
    flex-direction: column;
  }

  .cart-summary {
    width: 100%;
  }

  .summary-card {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-container {
    padding: 16px;
  }

  .cart-item {
    flex-wrap: wrap;
    gap: 12px;
  }

  .item-image-wrapper {
    width: 100%;
    height: 200px;
  }

  .item-info {
    width: 100%;
  }

  .item-price,
  .item-quantity,
  .item-subtotal,
  .item-actions {
    width: auto;
  }

  .recommend-item {
    width: 160px;
  }
}
</style>