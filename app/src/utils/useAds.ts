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

export async function useAdsgram({ blockId, onReward, onError }: UseAdsgramOptions) {
  const AdController = ref<any>(null)

  while (!(window as any).Adsgram) {
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  AdController.value = (window as any).Adsgram.init({ blockId })

  const showAd = async () => {
    if (AdController.value) {
      try {
        const showPromise: Promise<ShowPromiseResult> = AdController.value.show();

        showPromise
          .then((result) => {
            if (result.error) {
              console.log(result);
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
            console.log(result);
            onError?.(result)
            return false
          })

      } catch (result) {
        console.log(result);
        onError
        return false;
      }
    } else {
      onError
    }
  }

  return showAd
}