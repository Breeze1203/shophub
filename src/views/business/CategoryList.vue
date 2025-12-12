<template>
  <div class="category-container">
    <div
        v-for="category in categories"
        :key="category.id"
        :class="['category-item', { active: activeId === category.id }]"
        @click="handleSelect(category)"
    >
      <div class="category-icon">{{ category.icon }}</div>
      <div class="category-name">{{ category.name }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  activeId: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['select']);

const handleSelect = (category) => {
  emit('select', category);
};
</script>

<style scoped>
.category-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.category-item {
  background: white;
  border: 1px solid #e8e8e8;
  padding: 16px 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 4px;
}

.category-item:hover {
  border-color: #667eea;
  color: #667eea;
}


.category-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.category-name {
  font-size: 14px;
  color: inherit;
}
</style>