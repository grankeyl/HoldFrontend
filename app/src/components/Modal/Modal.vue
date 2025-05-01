<script lang="ts" setup>
import { onUnmounted, ref, watch } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps<{ isVisible: boolean }>();
const emit = defineEmits<{
  (e: 'update:isVisible', value: boolean): void;
  (e: 'close'): void;
}>();

const isMounted = ref(false);
const isModalVisible = ref(false);

watch(() => props.isVisible, (visible) => {
  console.log(visible);

  if (visible) {
    isModalVisible.value = true;
  } else {
    isModalVisible.value = false;
  }
});

onUnmounted(() => {
  document.body.style.overflow = '';
});

const handleClose = () => {
  emit('update:isVisible', false);
  emit('close');
};
</script>

<template>
  <div class="modalWrapper" :class="{ active: isMounted }">
    <div class="modalOverlay" :class="{ hide: !isModalVisible }" @click="handleClose" />
    <div class="modal" :class="{ hide: !isModalVisible }">
      <div class="modalBorder" />
      <div class="modalInner">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './Modal.scss' as *;
</style>