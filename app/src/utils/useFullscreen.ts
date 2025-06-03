import { onMounted, onBeforeUnmount } from 'vue'
import WebApp from '@twa-dev/sdk'

function isDesktop(): boolean {
  const userAgent = navigator.userAgent
  return (
    /Windows|Macintosh|Linux/i.test(userAgent) &&
    !/Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(userAgent)
  )
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default function useFullscreen() {
  onMounted(() => {
    if (!WebApp || isDesktop()) return

    const expand = () => {
      WebApp?.requestFullscreen?.()
    }

    expand()

    const checkAndRetry = async () => {
      let delayMs = 0

      while (delayMs <= 500) {
        if (WebApp.isExpanded) break

        expand()
        await delay(delayMs)
        delayMs += 10
      }
    }

    const timeoutId = setTimeout(checkAndRetry, 10)

    onBeforeUnmount(() => {
      clearTimeout(timeoutId)
    })
  })
}