<template>
  <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="['base-input', { 'base-input--error': error }]"
      @input="handleInput"
      @keypress="handleKeypress"
      @focus="handleFocus"
      @blur="handleBlur"
  />
</template>

<script setup>
const props = defineProps({
  modelValue: [String, Number],
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  disabled: Boolean,
  error: Boolean
});

const emit = defineEmits(['update:modelValue', 'enter', 'focus', 'blur']);

const handleInput = (event) => {
  emit('update:modelValue', event.target.value);
};

const handleKeypress = (event) => {
  if (event.key === 'Enter') {
    emit('enter', event.target.value);
  }
};

const handleFocus = (event) => {
  emit('focus', event);
};

const handleBlur = (event) => {
  emit('blur', event);
};
</script>

<style scoped>
.base-input {
  width: 100%;
  padding: 0 12px;
  height: 36px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  outline: none;
  transition: all 0.2s;
  background: white;
}

.base-input::placeholder {
  color: #999;
}

.base-input:hover {
  border-color: #c0c0c0;
}

.base-input:focus {
  border-color: #ff6700;
}

.base-input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
  color: #999;
}

.base-input--error {
  border-color: #ff4d4f;
}

.base-input--error:focus {
  border-color: #ff4d4f;
}
</style>