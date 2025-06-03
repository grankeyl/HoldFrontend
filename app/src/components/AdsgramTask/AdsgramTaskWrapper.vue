<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { toast } from 'vue3-toastify';
import { Icon } from '@/components/Icons';

import IconComp from '@/components/IconComp.vue';

const props = defineProps<{
  rewardAmount: number;
  dataBlockId: string;
  dataDebug: boolean;
}>();

const taskRef = ref<HTMLElement | null>(null);
const hasTask = ref(true); // флаг отображения

const onReward = (event: Event) => {
  const customEvent = event as CustomEvent;
  console.log('✅ onReward', customEvent);
  toast.success(`+${props.rewardAmount}`);
};

const onError = (event: Event) => {
  const customEvent = event as CustomEvent;
  console.error('❌ Error:', customEvent.detail);
  hasTask.value = false;
};

const onBannerNotFound = () => {
  console.log('❌ No task to display');
  hasTask.value = false;
};

onMounted(() => {
  taskRef.value?.addEventListener('reward', onReward);
  taskRef.value?.addEventListener('onError', onError);
  taskRef.value?.addEventListener('onBannerNotFound', onBannerNotFound);
});

onBeforeUnmount(() => {
  taskRef.value?.removeEventListener('reward', onReward);
  taskRef.value?.removeEventListener('onError', onError);
  taskRef.value?.removeEventListener('onBannerNotFound', onBannerNotFound);
});
</script>

<template>
  <adsgram-task
    v-if="hasTask"
    ref="taskRef"
    :data-block-id="props.dataBlockId"
    :data-debug="props.dataDebug"
    class="task"
  >
    <span slot="reward" class="task__reward">
      <strong>+{{ props.rewardAmount }}</strong>
      <IconComp 
        :icon="Icon.Token"
        width="16px"
        height="16px"
      />
    </span>
    <div slot="button" class="task__button go">
      <span>Start</span>
    </div>
    <div slot="claim" class="task__button claim">
      <span>Claim</span>
    </div>
    <div slot="done" class="task__button done">
      <span>Done</span>
    </div>
  </adsgram-task>
</template>

<style scoped>
@import './AdsgramTask.module.scss';
</style>