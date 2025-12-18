<template>
  <button
    class="oauth-btn"
    @click="handleClick"
  >
    <img
      v-if="iconPath"
      :src="iconPath"
      :alt="provider"
      class="provider-icon"
    />
    <span class="provider-text">{{ displayName }}</span>
  </button>
</template>

<script setup>
import { computed } from "vue";

const iconPath = computed(() => {
  if (!props.provider) return "";
  return `/icons/auth/${props.provider}.svg`;
});
const props = defineProps({
  provider: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["login-click"]);
const displayName = computed(() => {
  const nameMap = {
    google: "google",
    github: "github",
    wechat: "微信",
    workchat: "企业微信",
  };
  return nameMap[props.provider] || props.provider;
});

const handleClick = () => {
  emit("login-click", props.provider);
};
</script>

<style scoped>
.oauth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d1d5db;
  padding: 12px 16px;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  color: #4b5563;
}

.oauth-btn:hover {
  border-color: #667eea;
  background: #f8f9ff;
  color: #111827;
}

.provider-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}
.provider-text {
  margin-left: 5px;
}
</style>
