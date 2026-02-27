<script setup lang="ts">
import { useChunksStore } from '../../stores/chunks'

const store = useChunksStore()
const { formatRecordCount, formatFileSize, formatChunkCount } = useFormatters()

const colorLevels = [0, 1, 2, 3, 4, 5, 6, 7]
const colorVars = [
  'var(--heat-0)', 'var(--heat-1)', 'var(--heat-2)', 'var(--heat-3)',
  'var(--heat-4)', 'var(--heat-5)', 'var(--heat-6)', 'var(--heat-7)'
]
</script>

<template>
  <div class="footer-stats">
    <div class="stats-group">
      <div class="stat-card">
        <div class="stat-label">Total Records</div>
        <div class="stat-value">{{ formatRecordCount(store.totalDataCount) }}</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Total Chunks</div>
        <div class="stat-value">{{ formatChunkCount(store.totalChunks) }}</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">Size On Disk</div>
        <div class="stat-value">{{ formatFileSize(store.totalSizeOnDisk) }}</div>
      </div>
    </div>

    <div class="color-scale">
      <span class="color-scale-label">Less</span>
      <div class="color-scale-boxes">
        <div
          v-for="(level, i) in colorLevels"
          :key="i"
          class="color-scale-box"
          :style="{ background: colorVars[i] }"
        />
      </div>
      <span class="color-scale-label">More</span>
    </div>
  </div>
</template>
