<script setup lang="ts">
import type { Bucket } from '../../types/chunks'
import { useChunksStore } from '../../stores/chunks'

const store = useChunksStore()
const { formatRecordCount, formatFileSize, formatCompressionRatio } = useFormatters()

const tooltipBucket = ref<Bucket | null>(null)
const tooltipStyle = ref<Record<string, string>>({})

function onCellHover(bucket: Bucket, e: MouseEvent) {
  tooltipBucket.value = bucket
  tooltipStyle.value = {
    left: `${e.clientX + 12}px`,
    top: `${e.clientY - 10}px`
  }
}

function onCellLeave() {
  tooltipBucket.value = null
}

const tooltipTimeLabel = computed(() => {
  if (!tooltipBucket.value) return ''
  const h = String(tooltipBucket.value.date.hour).padStart(2, '0')
  const m = String(tooltipBucket.value.date.minute ?? 0).padStart(2, '0')
  return `${h}:${m}`
})
</script>

<template>
  <div class="heatmap-container">
    <HourRow
      v-for="group in store.groups"
      :key="`${group.date.day}-${group.date.hour}`"
      :group="group"
      @cell-hover="onCellHover"
      @cell-leave="onCellLeave"
    />

    <Teleport to="body">
      <div
        v-if="tooltipBucket"
        class="cell-tooltip"
        :style="tooltipStyle"
      >
        <div class="tooltip-time">{{ tooltipTimeLabel }}</div>
        <div class="tooltip-row">
          <span class="tooltip-label">Records</span>
          <span>{{ formatRecordCount(tooltipBucket.dataCount) }}</span>
        </div>
        <div class="tooltip-row">
          <span class="tooltip-label">Size</span>
          <span>{{ formatFileSize(tooltipBucket.sizeOnDisk) }}</span>
        </div>
        <div class="tooltip-row">
          <span class="tooltip-label">Compression</span>
          <span>{{ formatCompressionRatio(tooltipBucket.compressionRatio) }}</span>
        </div>
      </div>
    </Teleport>
  </div>
</template>
