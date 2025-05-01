<template>
  <div class="kit-icon" ref="container" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  icon: string
  width?: string
  height?: string
  pathColor?: string
}>()

const container = ref<HTMLElement | null>(null)

const renderSvg = () => {
  if (container.value && props.icon) {
    container.value.innerHTML = ''
    const parser = new DOMParser()
    const doc = parser.parseFromString(props.icon, 'image/svg+xml')
    const svg = doc.documentElement

    if (props.width) svg.setAttribute('width', props.width)
    if (props.height) svg.setAttribute('height', props.height)
    if (props.width) svg.style.width = props.width
    if (props.height) svg.style.height = props.height

    if (props.pathColor) {
      const paths = svg.querySelectorAll('path')
      paths.forEach(path => path.setAttribute('fill', props.pathColor || '#fff'))
    }

    container.value.appendChild(svg)
  }
}

onMounted(renderSvg)
watch(() => props.icon, renderSvg)
</script>