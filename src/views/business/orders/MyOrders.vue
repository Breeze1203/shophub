<template>
  <div class="orders-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <p class="page-subtitle">管理您的宠物订单，查看详细信息</p>
    </div>

    <!-- 订单状态筛选 -->
    <div class="order-tabs">
      <div
        v-for="tab in tabs"
        :key="tab.status"
        :class="['tab-item', { active: activeTab === tab.status }]"
        @click="activeTab = tab.status"
      >
        <span class="tab-label">{{ tab.label }}</span>
        <span
          v-if="tab.count > 0"
          class="tab-badge"
        >{{ tab.count }}</span>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="orders-list">
      <div
        v-if="loading"
        class="loading-state"
      >
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <div
        v-else-if="filteredOrders.length === 0"
        class="empty-state"
      >
        <div class="empty-icon">📦</div>
        <h3>暂无订单</h3>
        <p>您还没有{{ getTabLabel(activeTab) }}订单</p>
        <button
          class="btn-primary"
          @click="goShopping"
        >去选购宠物</button>
      </div>

      <div
        v-else
        class="order-cards"
      >
        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="order-card"
        >
          <!-- 订单头部 -->
          <div class="order-header">
            <div class="order-info">
              <span class="order-number">订单号：{{ order.orderNo }}</span>
              <span class="order-time">{{ formatDateTime(order.createdAt) }}</span>
            </div>
            <span :class="['order-status', order.status]">
              {{ getStatusText(order.status) }}
            </span>
          </div>

          <!-- 订单商品列表 -->
          <div class="order-body">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="order-item"
              @click="viewOrderDetail(order.id)"
            >
              <img
                :src="item.image"
                :alt="item.name"
                class="item-image"
              />
              <div class="item-info">
                <h4 class="item-name">{{ item.name }}</h4>
                <div class="item-specs">
                  <span v-if="item.species">品种：{{ item.species }}</span>
                  <span v-if="item.age">年龄：{{ item.age }}</span>
                  <span v-if="item.gender">性别：{{ item.gender }}</span>
                </div>
                <div
                  class="item-health"
                  v-if="item.healthStatus"
                >
                  <span class="health-badge">{{ item.healthStatus }}</span>
                </div>
              </div>
              <div class="item-price-wrapper">
                <div class="item-price">¥{{ item.price.toFixed(2) }}</div>
                <div class="item-quantity">x{{ item.quantity }}</div>
              </div>
            </div>
          </div>

          <!-- 订单底部 -->
          <div class="order-footer">
            <div class="footer-left">
              <div
                v-if="order.logistics"
                class="logistics-info"
              >
                <span class="logistics-icon">🚚</span>
                <span class="logistics-text">{{ order.logistics.status }}</span>
                <a
                  v-if="order.logistics.trackingNo"
                  class="logistics-link"
                  @click.stop="viewLogistics(order)"
                >
                  查看物流
                </a>
              </div>
            </div>

            <div class="footer-right">
              <div class="total-amount">
                <span class="total-label">实付款：</span>
                <span class="total-price">¥{{ order.totalAmount.toFixed(2) }}</span>
              </div>
              <div class="order-actions">
                <button
                  v-if="order.status === 'pending_payment'"
                  class="btn-primary"
                  @click.stop="payOrder(order)"
                >
                  立即付款
                </button>
                <button
                  v-if="order.status === 'pending_payment'"
                  class="btn-outline"
                  @click.stop="cancelOrder(order)"
                >
                  取消订单
                </button>
                <button
                  v-if="order.status === 'shipped'"
                  class="btn-primary"
                  @click.stop="confirmReceipt(order)"
                >
                  确认收货
                </button>
                <button
                  v-if="order.status === 'completed'"
                  class="btn-outline"
                  @click.stop="evaluateOrder(order)"
                >
                  评价
                </button>
                <button
                  v-if="order.status === 'completed' || order.status === 'cancelled'"
                  class="btn-outline"
                  @click.stop="deleteOrder(order)"
                >
                  删除订单
                </button>
                <button
                  class="btn-text"
                  @click.stop="contactService(order)"
                >
                  联系客服
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 订单详情弹窗 -->
    <OrderDetailModal
      v-if="showDetailModal"
      :order="selectedOrder"
      @close="showDetailModal = false"
      @pay="payOrder"
      @cancel="cancelOrder"
      @confirm="confirmReceipt"
      @evaluate="evaluateOrder"
      @contact="contactService"
    />

    <!-- 分页 -->
    <div
      v-if="false && totalPages > 1"
      class="pagination"
    >
      <button
        class="page-btn"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        上一页
      </button>
      <div class="page-numbers">
        <span
          v-for="page in displayPages"
          :key="page"
          :class="['page-number', { active: page === currentPage }]"
          @click="changePage(page)"
        >
          {{ page }}
        </span>
      </div>
      <button
        class="page-btn"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import OrderDetailModal from "@/views/business/orders/OrderDetailModal.vue";

// 状态管理
const activeTab = ref("all");
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const showDetailModal = ref(false);
const selectedOrder = ref(null);

// Tab 配置
const tabs = ref([
  { status: "all", label: "全部订单", count: 0 },
  { status: "pending_payment", label: "待付款", count: 3 },
  { status: "pending_shipment", label: "待发货", count: 1 },
  { status: "shipped", label: "已发货", count: 2 },
  { status: "completed", label: "已完成", count: 5 },
  { status: "cancelled", label: "已取消", count: 0 },
]);

// 模拟订单数据
const orders = ref([
  {
    id: 1,
    orderNo: "EP2024121901234",
    status: "pending_payment",
    createdAt: "2024-12-19 10:30:25",
    totalAmount: 3680.0,
    items: [
      {
        id: 1,
        name: "豹纹守宫",
        species: "高黄白化",
        age: "3个月",
        gender: "母",
        price: 1680.0,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=200&h=200&fit=crop",
        healthStatus: "健康证明已上传",
      },
      {
        id: 2,
        name: "蓝舌石龙子",
        species: "印尼亚种",
        age: "6个月",
        gender: "公",
        price: 2000.0,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1565002604749-dfd1cfc6d4de?w=200&h=200&fit=crop",
        healthStatus: "已完成检疫",
      },
    ],
    logistics: null,
  },
  {
    id: 2,
    orderNo: "EP2024121802156",
    status: "shipped",
    createdAt: "2024-12-18 14:22:10",
    totalAmount: 5200.0,
    items: [
      {
        id: 3,
        name: "玉米蛇",
        species: "暴风雪纹",
        age: "1岁",
        gender: "母",
        price: 2600.0,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1531520615002-27fddcc13e1e?w=200&h=200&fit=crop",
        healthStatus: "健康证明已上传",
      },
    ],
    logistics: {
      status: "运输中，预计明天送达",
      trackingNo: "SF1234567890123",
      company: "顺丰速运",
    },
  },
  {
    id: 3,
    orderNo: "EP2024121701234",
    status: "completed",
    createdAt: "2024-12-17 09:15:30",
    totalAmount: 980.0,
    items: [
      {
        id: 4,
        name: "鬃狮蜥",
        species: "标准型",
        age: "4个月",
        gender: "公",
        price: 980.0,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1612363148951-15f16817648f?w=200&h=200&fit=crop",
        healthStatus: "已完成检疫",
      },
    ],
    logistics: {
      status: "已签收",
      trackingNo: "YTO9876543210987",
      company: "圆通速递",
    },
  },
  {
    id: 4,
    orderNo: "EP2024121502345",
    status: "completed",
    createdAt: "2024-12-15 16:45:20",
    totalAmount: 1580.0,
    items: [
      {
        id: 5,
        name: "绿鬣蜥",
        species: "哥伦比亚亚种",
        age: "5个月",
        gender: "母",
        price: 1580.0,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1551767058-f0e994e5b731?w=200&h=200&fit=crop",
        healthStatus: "健康证明已上传",
      },
    ],
    logistics: {
      status: "已签收",
      trackingNo: "ZTO1122334455667",
      company: "中通快递",
    },
  },
  {
    id: 5,
    orderNo: "EP2024121401234",
    status: "pending_shipment",
    createdAt: "2024-12-14 11:20:15",
    totalAmount: 3200.0,
    items: [
      {
        id: 6,
        name: "高冠变色龙",
        species: "也门变色龙",
        age: "6个月",
        gender: "公",
        price: 3200.0,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1569235186275-626cb53b83ce?w=200&h=200&fit=crop",
        healthStatus: "已完成检疫",
      },
    ],
    logistics: null,
  },
  {
    id: 6,
    orderNo: "EP2024121201234",
    status: "shipped",
    createdAt: "2024-12-12 13:30:45",
    totalAmount: 2280.0,
    items: [
      {
        id: 7,
        name: "王者蜥",
        species: "澳洲亚种",
        age: "8个月",
        gender: "母",
        price: 2280.0,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1527335480088-278dbeec0ad5?w=200&h=200&fit=crop",
        healthStatus: "健康证明已上传",
      },
    ],
    logistics: {
      status: "运输中",
      trackingNo: "JD7788990011223",
      company: "京东物流",
    },
  },
]);

// 计算属性
const filteredOrders = computed(() => {
  if (activeTab.value === "all") {
    return orders.value;
  }
  return orders.value.filter((order) => order.status === activeTab.value);
});

const totalPages = computed(() => {
  return Math.ceil(filteredOrders.value.length / pageSize.value);
});

const displayPages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push("...");
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push("...");
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push("...");
      pages.push(total);
    }
  }

  return pages;
});

// 方法
const getTabLabel = (status) => {
  const tab = tabs.value.find((t) => t.status === status);
  return tab ? tab.label : "";
};

const getStatusText = (status) => {
  const statusMap = {
    pending_payment: "待付款",
    pending_shipment: "待发货",
    shipped: "运输中",
    completed: "已完成",
    cancelled: "已取消",
  };
  return statusMap[status] || status;
};

const formatDateTime = (dateStr) => {
  return dateStr;
};

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const viewOrderDetail = (orderId) => {
  const order = orders.value.find((o) => o.id === orderId);
  if (order) {
    selectedOrder.value = order;
    showDetailModal.value = true;
  }
};

const viewLogistics = (order) => {
  console.log("查看物流:", order);
  alert(
    `物流单号：${order.logistics.trackingNo}\n物流公司：${order.logistics.company}`
  );
};

const payOrder = (order) => {
  console.log("支付订单:", order);
  alert("跳转到支付页面...");
};

const cancelOrder = (order) => {
  if (confirm("确定要取消此订单吗？")) {
    console.log("取消订单:", order);
  }
};

const confirmReceipt = (order) => {
  if (confirm("确认已收到宠物并检查健康状况无误？")) {
    console.log("确认收货:", order);
    order.status = "completed";
  }
};

const evaluateOrder = (order) => {
  console.log("评价订单:", order);
  alert("跳转到评价页面...");
};

const deleteOrder = (order) => {
  if (confirm("确定要删除此订单吗？")) {
    console.log("删除订单:", order);
  }
};

const contactService = (order) => {
  console.log("联系客服:", order);
  alert("正在为您转接客服...");
};

const goShopping = () => {
  console.log("去选购");
};

onMounted(() => {
  // 初始化加载
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 500);
});
</script>

<style scoped>
.orders-container {
  max-width: 1200px;
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
  text-align: center;
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

/* 订单状态筛选 */
.order-tabs {
  display: flex;
  background: white;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  flex-shrink: 0;
}

.tab-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s;
  position: relative;
  gap: 8px;
}

.tab-item:hover {
  background: #f5f7fa;
}

.tab-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.tab-label {
  font-size: 15px;
  font-weight: 500;
}

.tab-badge {
  background: rgba(255, 255, 255, 0.25);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.tab-item:not(.active) .tab-badge {
  background: #ff4d4f;
  color: white;
}

/* 订单列表 */
.orders-list {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: white;
  border-radius: 8px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: white;
  border-radius: 8px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 18px;
  color: #333;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: #999;
  margin: 0 0 24px 0;
}

/* 订单卡片 */
.order-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.order-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.order-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.order-number {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.order-time {
  font-size: 13px;
  color: #999;
}

.order-status {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

.order-status.pending_payment {
  background: #fff7e6;
  color: #fa8c16;
}

.order-status.pending_shipment {
  background: #e6f7ff;
  color: #1890ff;
}

.order-status.shipped {
  background: #f6ffed;
  color: #52c41a;
}

.order-status.completed {
  background: #f0f0f0;
  color: #8c8c8c;
}

.order-status.cancelled {
  background: #fff1f0;
  color: #ff4d4f;
}

/* 订单商品 */
.order-body {
  padding: 20px;
}

.order-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 12px;
}

.order-item:last-child {
  margin-bottom: 0;
}

.order-item:hover {
  background: #f0f0f0;
}

.item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.item-specs {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #666;
}

.item-health {
  display: flex;
  gap: 8px;
}

.health-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
  border-radius: 4px;
  font-size: 12px;
}

.item-price-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 4px;
}

.item-price {
  font-size: 18px;
  font-weight: 600;
  color: #ff4d4f;
}

.item-quantity {
  font-size: 13px;
  color: #999;
}

/* 订单底部 */
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

.footer-left {
  flex: 1;
}

.logistics-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.logistics-icon {
  font-size: 18px;
}

.logistics-link {
  color: #667eea;
  cursor: pointer;
  text-decoration: none;
  margin-left: 4px;
}

.logistics-link:hover {
  text-decoration: underline;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.total-amount {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.total-label {
  font-size: 14px;
  color: #666;
}

.total-price {
  font-size: 22px;
  font-weight: 700;
  color: #ff4d4f;
}

.order-actions {
  display: flex;
  gap: 12px;
}

/* 按钮样式 */
.btn-primary {
  padding: 8px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-outline {
  padding: 8px 20px;
  background: white;
  color: #666;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-outline:hover {
  color: #667eea;
  border-color: #667eea;
}

.btn-text {
  padding: 8px 16px;
  background: transparent;
  color: #667eea;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-text:hover {
  color: #764ba2;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 32px;
  padding: 20px;
  background: white;
  border-radius: 8px;
}

.page-btn {
  padding: 8px 16px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  color: #667eea;
  border-color: #667eea;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.page-number {
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-number:hover {
  background: #f5f7fa;
  color: #667eea;
}

.page-number.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
}

/* 响应式 */
@media (max-width: 768px) {
  .orders-container {
    padding: 16px;
  }

  .order-tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
  }

  .tab-item {
    flex: 0 0 auto;
    min-width: 100px;
  }

  .order-item {
    flex-direction: column;
  }

  .item-image {
    width: 100%;
    height: 200px;
  }

  .order-footer {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .footer-right {
    flex-direction: column;
    gap: 12px;
  }

  .order-actions {
    flex-wrap: wrap;
  }
}
</style>