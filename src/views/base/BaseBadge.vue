<template>
  <span :class="['base-badge', `base-badge--${variant}`]">
    <slot />
  </span>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'new', 'hot', 'good'].includes(value)
  }
});
</script>

<style scoped>
.base-badge {
  display: inline-block;
  padding: 2px 6px;
  font-size: 12px;
  line-height: 16px;
  border-radius: 2px;
  font-weight: 400;
}
</style>