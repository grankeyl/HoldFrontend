import { ref, onMounted, watch } from 'vue'

interface ShowPromiseResult {
  error?: boolean
  done?: boolean
  state?: string
  description?: string
  [key: string]: any
}

interface UseAdsgramOptions {
  blockId: string
  onReward: (result: ShowPromiseResult) => void
  onError?: (result: ShowPromiseResult) => void
}

export function useAdsgram({ blockId, onReward, onError }: UseAdsgramOptions) {
  const AdController = ref<any>(null)

  onMounted(() => {
    AdController.value = (window as any).Adsgram?.init({ blockId })
  })

  watch(() => blockId, () => {
    AdController.value = (window as any).Adsgram?.init({ blockId })
  })

  const showAd = async () => {
    if (AdController.value) {
      try {
        const showPromise: Promise<ShowPromiseResult> = AdController.value.show();
        
        showPromise
          .then((result) => {
            if (result.error) {
              onError?.(result)
              return false
            }

            if (result.done) {
              onReward(result)
              return true
            }

            return false
          })
          .catch((result) => {
            onError?.(result)
            return false
          })

      } catch (result) {
        onError
        return false;
      }
    } else {
      onError?.({
        error: true,
        done: false,
        state: 'load',
        description: 'Adsgram script not loaded',
      })
    }
  }

  return showAd
}