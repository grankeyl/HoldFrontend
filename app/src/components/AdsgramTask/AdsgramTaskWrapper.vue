<script setup lang="ts">
import { Icon } from '@/components/Icons';

import IconComp from '@/components/IconComp.vue';

const props = defineProps<{
  rewardAmount: number,
  dataBlockId: string,
  dataDebug: boolean
}>();
</script>

<template>
  <adsgram-task
    :data-block-id="props.dataBlockId"
    :data-debug="props.dataDebug"
    class="task"
  >
    <p slot='reward' class="task__reward">
      <strong>+{{ props.rewardAmount }}</strong>
      <IconComp 
        :icon="Icon.Token"
        width="16px"
        height="16px"
      />
    </p>
    <div slot='button' class="task__button go">
      <span v-html="$t('Tasks.Start')"></span>
    </div>
    <div slot='done' class="task__button done">
      <span v-html="$t('Tasks.Claim')"></span>
    </div>
  </adsgram-task>
</template>

<style scoped>
@import './AdsgramTask.module.scss';
</style>