<script setup lang="ts">
import { useChunksStore } from '../../stores/chunks'

const store = useChunksStore()
const { formatRecordCount, formatFileSize, formatChunkCount } = useFormatters()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirmed'): void
}>()

const confirmed = ref(false)
const showResult = ref(false)

async function handleDelete() {
  await store.deleteChunks()
  showResult.value = true
}

function handleClose() {
  confirmed.value = false
  showResult.value = false
  emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click.self="handleClose">
    <div class="modal-content">
      <!-- Result view -->
      <template v-if="showResult && store.deleteResult">
        <div class="modal-header">
          <h2>Delete Result</h2>
          <button class="modal-close" @click="handleClose">✕</button>
        </div>
        <div class="delete-result">
          <div class="result-icon">
            {{ store.deleteResult.status === 'completed' ? '✅' : '⚠️' }}
          </div>
          <div class="result-message">
            {{ store.deleteResult.status === 'completed' ? 'Deletion Successful' : 'Deletion Partially Failed' }}
          </div>
          <div class="result-detail">
            {{ store.deleteResult.additionalInfo }}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="handleClose">Close</button>
        </div>
      </template>

      <!-- Confirmation view -->
      <template v-else>
        <div class="modal-header">
          <h2>🗑 Delete Chunks</h2>
          <button class="modal-close" @click="handleClose">✕</button>
        </div>

        <div class="modal-body">
          <div class="warning-banner">
            <span class="warning-icon">⚠️</span>
            <span>This action is irreversible. The selected data chunks will be permanently deleted.</span>
          </div>

          <div class="delete-summary">
            <div class="summary-item">
              <div class="summary-label">Chunks</div>
              <div class="summary-value">{{ formatChunkCount(store.selectedCount) }}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Total Size</div>
              <div class="summary-value">{{ formatFileSize(store.selectedTotalSize) }}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Records</div>
              <div class="summary-value">{{ formatRecordCount(store.selectedTotalRecords) }}</div>
            </div>
          </div>

          <p style="color: var(--text-muted); font-size: 0.75rem; margin-bottom: 8px;">
            Files to be deleted:
          </p>

          <div class="file-list">
            <div
              v-for="bucket in store.selectedBuckets.slice(0, 20)"
              :key="`${bucket.date.hour}-${bucket.date.minute}`"
              class="file-item"
            >
              <span class="file-item-name">
                chunk_{{ bucket.date.year }}_{{ String(bucket.date.month).padStart(2, '0') }}_{{ String(bucket.date.day).padStart(2, '0') }}_{{ String(bucket.date.hour).padStart(2, '0') }}_{{ String(bucket.date.minute ?? 0).padStart(2, '0') }}.dat
              </span>
              <span class="file-item-size">{{ formatFileSize(bucket.sizeOnDisk) }}</span>
            </div>
            <div v-if="store.selectedBuckets.length > 20" class="file-item" style="justify-content: center; color: var(--text-muted);">
              ... and {{ store.selectedBuckets.length - 20 }} more files
            </div>
          </div>

          <label class="confirm-check">
            <input
              v-model="confirmed"
              type="checkbox"
            />
            <span>I understand this action cannot be undone</span>
          </label>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="handleClose">Cancel</button>
          <button
            class="btn btn-delete"
            :disabled="!confirmed || store.deleteLoading"
            @click="handleDelete"
          >
            {{ store.deleteLoading ? 'Deleting...' : `Delete ${formatChunkCount(store.selectedCount)} Chunks` }}
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
