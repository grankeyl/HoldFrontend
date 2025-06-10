<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { toast } from 'vue3-toastify';
import { getCurrentInstance } from 'vue';
import { collectConfetti } from '@/utils/useConfetti';
import { AppCache } from '@/stores/pinia';
import * as adsApi from '@/api/services/ads.service';
import TelegramModule from '@/hooks/useTelegram';

const { proxy } = getCurrentInstance()! as any;

type Task = {
  id: string
  title: string
  image_url: string | null
  link: string
}

const props = defineProps<{
  rewardAmount: number
}>()

const isLoading = ref(true);
const hasVisibleTasks = ref(false);
const tasksNotFound = ref(false);

function onTaskRender(
  changeReward: (str: string) => void,
  changeCardTitle: (str: string) => void,
  changeDescription: (str: string) => void,
  changeButtonCheckText: (str: string) => void
) {
  changeReward(`+${props.rewardAmount}`);
  changeCardTitle('');
  changeDescription(`+${props.rewardAmount}`);
  changeButtonCheckText('Claim');
}

async function onTaskReward(task: Task, signedToken: string) {
  console.log('✅ onReward', task, signedToken);

  const appCache = AppCache() as any;
  const adUse = await adsApi.request({ task_type: 'task' });
  if (!adUse) return;

  const adToken = adUse.reward_token;
  localStorage.setItem('ads_task', adToken);

  const result = await adsApi.complete({ reward_token: adToken });
  if (!result) return;

  if (result.type && result.type === 'no_cost') {
    toast.error(proxy.$t('Toasts.ErrorTask'));
    return;
  }

  if (!result.type && result.balance) {
    collectConfetti();
    TelegramModule.useMediumHaptic();
    toast.success(`${proxy.$t('Toasts.SuccessEarnTokens', { tokens: props.rewardAmount })}`);
    appCache.UserData.balance = result.balance;
  }
}

function onTaskReject(task: Task) {
  console.log('❌ onReject', task);
  toast.error(proxy.$t('Toasts.ErrorTask'));
}

function onTaskLoad(tasks: Task[]) {
  if (tasks && tasks.length > 0) {
    hasVisibleTasks.value = true;
    isLoading.value = false;
    console.log('✅ Задания найдены');
  } else {
    hasVisibleTasks.value = false;
    isLoading.value = false;
    console.warn('❌ Задания не найдены');
  }
}

function initTraffyTasks() {
  const container = document.getElementById('traffyTasks');
  if (!container) {
    console.warn('❌ Не найден контейнер traffyTasks');
    return;
  }

  if (typeof window.Traffy !== 'undefined' && window.Traffy.renderTasks) {
    container.innerHTML = '';
    window.Traffy.renderTasks(container, {
      max_tasks: 3,
      onTaskLoad,
      onTaskRender,
      onTaskReward,
      onTaskReject
    });
  } else {
    console.warn('❌ window.Traffy не определен');
    tasksNotFound.value = true;
  }
}

nextTick(() => initTraffyTasks());

setInterval(() => {
  const container = document.getElementById('traffyTasks') as HTMLElement;
  if (container.children.length === 0) {
    tasksNotFound.value = true;
  }
}, 1000);
</script>

<template>
  <div v-if="!tasksNotFound" class="contextTasks">
    <div>
      <div class="contextTasksItems">
        <div id="traffyTasks" class="traffyTasks" />
      </div>
    </div>

    <div v-if="isLoading && !hasVisibleTasks" class="loader-button" />
  </div>
</template>

<style scoped>
@import url('./Task.module.scss');

.traffyTasks {
  width: 100%;
}
</style>