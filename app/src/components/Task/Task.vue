<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { toast } from 'vue3-toastify';
import { collectConfetti } from '@/utils/useConfetti';
import { AppCache } from '@/stores/pinia';
import * as adsApi from '@/api/services/ads.service';
import TelegramModule from '@/hooks/useTelegram';

type Task = {
  id: string
  title: string
  image_url: string | null
  link: string
}

const props = defineProps<{
  rewardAmount: number
}>()

const hasTasks = ref(false);
const traffyTasks = ref<HTMLElement | null>(null);

function onTaskLoad(tasks: Task[]) {
  console.log('onTaskLoad triggered with tasks:', tasks);

  if (!Array.isArray(tasks) || tasks.length === 0) {
    hasTasks.value = false;
    return;
  }

  hasTasks.value = true;

  tasks.forEach(task => {
    console.log(`Task loaded: ${task.title} (ID: ${task.id})`);
  });
}

function onTaskRender(
  changeReward: (str: string) => void,
  changeCardTitle: (str: string) => void,
  changeDescription: (str: string) => void,
  changeButtonCheckText: (str: string) => void
) {
  changeReward(`+${props.rewardAmount}`);
  changeCardTitle("");
  changeDescription(`+${props.rewardAmount}`);
  changeButtonCheckText("Check");
}

async function onTaskReward(task: Task, signedToken: string) {
  console.log(`Task rewarded: ${task.title} (ID: ${task.id}) with token: ${signedToken}`);
  
  const appCache = AppCache() as any;
  const adUse = await adsApi.request({ task_type: "task" });
  if (!adUse) return;

  const adToken = adUse.reward_token;
  localStorage.setItem('ads_task', adToken);

  if (adToken) {
    const result = await adsApi.complete({ reward_token: adToken || localStorage.getItem('ads_task') });
    if (!result) return;

    if (result.status === "error" && result.type === 'no_cost') {
      toast.error('Error');
      return;
    }

    if (result.status === "success") {
      collectConfetti();
      TelegramModule.useMediumHaptic();
      toast.success(`+${props.rewardAmount}`);
      appCache.UserData.balance = result.new_balance;
    }
  }
}

function onTaskReject(task: Task) {
  console.log(`Task rejected: ${task.title} (ID: ${task.id})`);
  toast.error('Task rejected');
}

function renderTraffyTasks() {
  const oldEl = traffyTasks.value;

  if (!oldEl || !oldEl.parentNode) {
    console.warn('traffyTasksEl not found');
    return;
  }

  hasTasks.value = false;

  const newEl = document.createElement('div');
  newEl.className = 'traffyTasks';

  oldEl.parentNode.replaceChild(newEl, oldEl);
  traffyTasks.value = newEl;

  if (window.Traffy && typeof window.Traffy.renderTasks === 'function') {
    window.Traffy.renderTasks(newEl, {
      max_tasks: 3,
      onTaskLoad,
      onTaskRender,
      onTaskReward,
      onTaskReject
    });

    setTimeout(() => {
      console.log('[DEBUG] traffyTasksEl.innerHTML after render:', newEl.innerHTML);
    }, 500);
  } else {
    console.warn('Traffy.renderTasks is not available');
  }
}

onMounted(() => {
  nextTick(() => {
    renderTraffyTasks();
  });
});
</script>

<template>
  <div class="contextTasks" :class="{ 'hide': !hasTasks }">
    <div v-if="!hasTasks" class="loader-button"></div>
    <div class="contextTasksTitle">
      <h4 v-html="$t('Tasks.Partners')"></h4>
    </div>
    <div class="contextTasksItems">
      <div class="traffyTasks" ref="traffyTasks"></div>
    </div>
  </div>
</template>

<style scoped>
@import url('./Task.module.scss');

.traffyTasks {
  width: 100%;
}
</style>