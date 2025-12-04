<template>
  <button
      :class="['base-button', `base-button--${variant}`, `base-button--${size}`]"
      :disabled="disabled"
      @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);

const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>

<style scoped>
.base-button {
  border: none;
  border-radius: 4px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s;
  outline: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.base-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 尺寸 */
.base-button--small {
  padding: 6px 15px;
  font-size: 12px;
  height: 28px;
}

.base-button--medium {
  padding: 8px 20px;
  font-size: 14px;
  height: 36px;
}

.base-button--large {
  padding: 12px 24px;
  font-size: 16px;
  height: 44px;
}

/* 变体 */
.base-button--primary {
  background: #ff6700;
  color: white;
}

.base-button--primary:hover:not(:disabled) {
  background: #ff8533;
}

.base-button--primary:active:not(:disabled) {
  background: #e65c00;
}

.base-button--secondary {
  background: white;
  color: #333;
  border: 1px solid #ddd;
}

.base-button--secondary:hover:not(:disabled) {
  border-color: #ff6700;
  color: #ff6700;
}

.base-button--danger {
  background: #ff4d4f;
  color: white;
}

.base-button--danger:hover:not(:disabled) {
  background: #ff7875;
}

.base-button--ghost {
  background: transparent;
  color: #666;
  border: 1px solid #e0e0e0;
}

.base-button--ghost:hover:not(:disabled) {
  color: #ff6700;
  border-color: #ff6700;
}
</style>