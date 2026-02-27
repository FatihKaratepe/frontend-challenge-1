<script setup lang="ts">
import type { DownloadFile } from '../../types/chunks'

const props = defineProps<{
  files: DownloadFile[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { formatFileSize } = useFormatters()
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>📥 Download Files</h2>
        <button class="modal-close" @click="emit('close')">✕</button>
      </div>

      <div class="modal-body">
        <p style="color: var(--text-secondary); font-size: 0.813rem; margin-bottom: 12px;">
          {{ files.length }} file{{ files.length > 1 ? 's' : '' }} ready for download
        </p>

        <div class="file-list">
          <div
            v-for="file in files"
            :key="file.fileId"
            class="file-item"
          >
            <span class="file-item-name">{{ file.fileName }}</span>
            <span class="file-item-size">{{ formatFileSize(file.fileSize) }}</span>
            <span class="file-item-link">
              <a :href="file.downloadUrl" target="_blank" rel="noopener">Download ↗</a>
            </span>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="emit('close')">Close</button>
      </div>
    </div>
  </div>
</template>
