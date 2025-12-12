<template>
  <BaseCard :hover="true" padding="none" @click="handleClick" class="product-card">
    <div class="product-image">
      <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.title" />
      <div v-else class="placeholder">
        <span>{{ product.image }}</span>
      </div>
      <div v-if="showBadge" class="corner-badge">
        <BaseBadge :variant="badgeVariant">{{ badgeText }}</BaseBadge>
      </div>
    </div>

    <div class="product-info">
      <div class="product-price">
        <span class="current-price">{{ formatPrice(product.price) }}</span>
        <span v-if="product.originalPrice" class="original-price">
          {{ formatPrice(product.originalPrice) }}
        </span>
      </div>

      <h3 class="product-title">{{ product.title }}</h3>

      <div class="product-meta">
        <span class="condition">{{ product.condition }}</span>
        <span class="views" v-if="product.views">{{ product.views }}人看过</span>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue';
import BaseCard from "@/views/base/BaseCard.vue";
import BaseBadge from "@/views/base/BaseBadge.vue";

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['click']);

const formatPrice = (price) => `¥${price.toLocaleString()}`;

const showBadge = computed(() => {
  const condition = props.product.condition;
  return condition.includes('99') || condition.includes('全新') || condition.includes('95');
});

const badgeVariant = computed(() => {
  const condition = props.product.condition;
  if (condition.includes('全新')) return 'new';
  if (condition.includes('99')) return 'hot';
  if (condition.includes('95')) return 'good';
  return 'default';
});

const badgeText = computed(() => {
  const condition = props.product.condition;
  if (condition.includes('全新')) return '全新';
  if (condition.includes('99')) return '99新';
  if (condition.includes('95')) return '精品';
  return '';
});

const handleClick = () => {
  emit('click', props.product);
};
</script>

<style scoped>
.product-card {
  position: relative;
}

.product-image {
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: #fafafa;
  position: relative;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  font-size: 14px;
  background: linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%);
}

.corner-badge {
  position: absolute;
  top: 8px;
  left: 0;
}

.product-info {
  padding: 12px;
}

.product-price {
  margin-bottom: 8px;
  line-height: 1;
}

.current-price {
  font-size: 18px;
  font-weight: bold;
  color: #667eea;
}

.original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
  margin-left: 6px;
}

.product-title {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  margin: 0 0 8px 0;
  height: 42px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-weight: 400;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999;
}

.condition {
  color: #666;
}

.views {
  color: #999;
}
</style>