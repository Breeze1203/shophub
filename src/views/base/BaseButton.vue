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

</style>