<template>
  <div :class="['base-card', `base-card--${padding}`, { 'base-card--hover': hover, 'base-card--border': border }]">
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  hover: {
    type: Boolean,
    default: false
  },
  border: {
    type: Boolean,
    default: true
  },
  padding: {
    type: String,
    default: 'normal',
    validator: (value) => ['none', 'small', 'normal', 'large'].includes(value)
  }
});
</script>

<style scoped>
.base-card {
  background: white;
  border-radius: 0;
  overflow: hidden;
}

.base-card--border {
  border: 1px solid #e8e8e8;
}

.base-card--none {
  padding: 0;
}

.base-card--small {
  padding: 10px;
}

.base-card--normal {
  padding: 16px;
}

.base-card--large {
  padding: 24px;
}

.base-card--hover {
  cursor: pointer;
  transition: all 0.2s;
}

.base-card--hover:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}
</style>