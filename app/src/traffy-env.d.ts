declare global {
  interface Window {
    Traffy?: {
      renderTasks: (
        el: HTMLElement,
        options: {
          max_tasks?: number
          onTaskLoad?: (tasks: Task[]) => void
          onTaskRender?: (
            changeCardTitle: (str: string) => void,
            changeDescription: (str: string) => void,
            changeButtonCheckText: (str: string) => void
          ) => void
          onTaskReward?: (task: Task, signedToken: string) => Promise<void>
          onTaskReject?: (task: Task) => void
        }
      ) => void
    }
  }

  interface Task {
    id: string
    title: string
    image_url: string | null
    link: string
    [key: string]: any
  }
}

export {}