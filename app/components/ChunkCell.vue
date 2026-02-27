<script setup lang="ts">
import type { Bucket, ChunkDate } from '../../types/chunks'

const props = defineProps<{
  bucket: Bucket
  level: number
  selected: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle', date: ChunkDate): void
  (e: 'hover', bucket: Bucket, event: MouseEvent): void
  (e: 'leave'): void
}>()

function handleClick() {
  emit('toggle', props.bucket.date)
}

function handleMouseEnter(e: MouseEvent) {
  emit('hover', props.bucket, e)
}

function handleMouseMove(e: MouseEvent) {
  emit('hover', props.bucket, e)
}

function handleMouseLeave() {
  emit('leave')
}
</script>

<template>
  <div
    class="chunk-cell"
    :class="{ selected }"
    :data-level="level"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <span v-if="selected" class="cell-check">✓</span>
  </div>
</template>
