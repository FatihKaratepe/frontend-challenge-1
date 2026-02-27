<script setup lang="ts">
import { useChunksStore } from '../../stores/chunks'

const store = useChunksStore()

const showDownloadModal = ref(false)
const showDeleteModal = ref(false)

onMounted(() => {
  store.fetchChunks()
})

async function handleDownload() {
  await store.downloadChunks()
  if (store.downloadResults) {
    showDownloadModal.value = true
  }
}

function handleDeleteRequest() {
  showDeleteModal.value = true
}

function closeDownloadModal() {
  showDownloadModal.value = false
  store.downloadResults = null
}

function closeDeleteModal() {
  showDeleteModal.value = false
  store.deleteResult = null
}

useHead({
  title: 'Backup Data Integrity Dashboard',
  meta: [
    { name: 'description', content: 'Monitor and manage backup data chunks with an interactive heatmap visualization' }
  ]
})
</script>

<template>
  <div class="dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="dashboard-header-info">
        <h1>🛡 Backup Data Integrity</h1>
        <p>Monitor and manage backup data chunks — 24-hour heatmap visualization</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="store.loading" class="loading-container">
      <div class="spinner" />
      <p>Loading chunk data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="store.error" class="loading-container">
      <p style="color: var(--accent-red);">{{ store.error }}</p>
      <button class="btn btn-secondary" @click="store.fetchChunks()">
        Retry
      </button>
    </div>

    <!-- Dashboard Content -->
    <template v-else-if="store.data">
      <!-- Action Bar -->
      <ActionBar
        @download="handleDownload"
        @delete="handleDeleteRequest"
      />

      <!-- Heatmap Grid -->
      <HeatmapGrid />

      <!-- Footer Stats -->
      <FooterStats />
    </template>

    <!-- Download Modal -->
    <DownloadModal
      v-if="showDownloadModal && store.downloadResults"
      :files="store.downloadResults"
      @close="closeDownloadModal"
    />

    <!-- Delete Modal -->
    <DeleteModal
      v-if="showDeleteModal"
      @close="closeDeleteModal"
    />
  </div>
</template>
