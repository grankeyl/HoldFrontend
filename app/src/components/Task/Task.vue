<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { Icon } from '../Icons';

import IconComp from '@/components/IconComp.vue';
import taskStyles from '@/components/Task/Task.module.scss';


const props = defineProps<{
  debug: boolean;
  blockId: string;
  animationDelay: string;
  rewardAmount: number;
}>();

const contextTasksItemsItem = ref<HTMLElement | null>(null);
const isReady = ref(false);

const handler = (event: Event) => {
  const customEvent = event as CustomEvent;
  alert(`reward, detail = ${customEvent.detail}`);
};

onMounted(() => {
  if (customElements.get('adsgram-task')) {
    isReady.value = true;
  }

  if (contextTasksItemsItem.value) {
    contextTasksItemsItem.value.addEventListener('reward', handler);
  }
});

onUnmounted(() => {
  if (contextTasksItemsItem.value) {
    contextTasksItemsItem.value.removeEventListener('reward', handler);
  }
});
</script>

<template>
  <adsgram-task
    v-if="isReady"
    class="contextTasksItemsItem"
    :data-block-id="props.blockId"
    :data-debug="props.debug"
    ref="contextTasksItemsItem"
    :style="{ animationDelay: props.animationDelay }"
  >
    <div slot="reward" :class="taskStyles.reward">
        <span>+{{ rewardAmount }}</span>
        <IconComp 
            :icon="Icon.Token"
            width="16px"
            height="16px"
        />
    </div>
    <div slot="button" :class="taskStyles.button">
        <span v-html="$t('Tasks.Start')"></span>
    </div>
    <div slot="done" :class="taskStyles.done">
        <span v-html="$t('Tasks.Ready')"></span>
    </div>
  </adsgram-task>
</template>