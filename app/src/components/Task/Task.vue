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

const traffyTasks = ref<HTMLElement | null>(null)

function onTaskLoad(tasks: Task[]) {
  tasks.forEach(task => {
    console.log(`Task loaded: ${task.title} (ID: ${task.id})`);
  });
}

function onTaskRender(
  changeCardTitle: (str: string) => void,
  changeDescription: (str: string) => void,
  changeButtonCheckText: (str: string) => void
) {
  console.log('onTaskRender triggered!');
  changeDescription('Subscribe on:');
  changeCardTitle('Subscribe on:');
  changeButtonCheckText(`+${props.rewardAmount}`);
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
  const traffyTasksEl = traffyTasks.value;

  if (traffyTasksEl && window.Traffy && typeof window.Traffy.renderTasks === 'function') {
    traffyTasksEl.innerHTML = '';

    console.log('Rendering tasks...');
    window.Traffy.renderTasks(traffyTasksEl, {
      max_tasks: 3,
      onTaskLoad,
      onTaskRender,
      onTaskReward,
      onTaskReject
    });
  }
}

onMounted(() => {
  nextTick(() => {
    renderTraffyTasks();
  });
});
</script>

<template>
  <div class="traffyTasks" ref="traffyTasks"></div>
</template>

<style scoped>
.traffyTasks {
  width: 100%;
}
</style>