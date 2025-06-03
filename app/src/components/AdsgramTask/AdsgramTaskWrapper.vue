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

const onReward = (event: Event) => {
  const customEvent = event as CustomEvent;
  console.log('✅ onReward', customEvent);
  toast.success(`+${props.rewardAmount}`);
};

onMounted(() => {
  taskRef.value?.addEventListener('reward', onReward);
});

onBeforeUnmount(() => {
  taskRef.value?.removeEventListener('reward', onReward);
});
</script>

<template>
  <adsgram-task
    ref="taskRef"
    :data-block-id="props.dataBlockId"
    :data-debug="props.dataDebug"
    class="task"
  >
    <p slot="reward" class="task__reward">
      <strong>+{{ props.rewardAmount }}</strong>
      <IconComp 
        :icon="Icon.Token"
        width="16px"
        height="16px"
      />
    </p>
    <div slot="button" class="task__button go">
      Start
    </div>
    <div slot="done" class="task__button done">
      Claim
    </div>
  </adsgram-task>
</template>

<style scoped>
@import './AdsgramTask.module.scss';
</style>