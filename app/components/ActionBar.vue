<script setup lang="ts">
import { useChunksStore } from '../../stores/chunks'

const store = useChunksStore()

const emit = defineEmits<{
  (e: 'download'): void
  (e: 'delete'): void
}>()

const selectAllRef = ref<HTMLInputElement | null>(null)

const isIndeterminate = computed(() => {
  return store.selectedCount > 0 && !store.isAllSelected
})

watch(isIndeterminate, (val) => {
  if (selectAllRef.value) {
    selectAllRef.value.indeterminate = val
  }
}, { immediate: true })

onMounted(() => {
  if (selectAllRef.value) {
    selectAllRef.value.indeterminate = isIndeterminate.value
  }
})
</script>

<template>
  <div class="action-bar">
    <div class="action-bar-left">
      <label class="select-all-label">
        <input
          ref="selectAllRef"
          type="checkbox"
          :checked="store.isAllSelected"
          @change="store.toggleAll()"
        />
        <span>Select All</span>
      </label>

      <span v-if="store.selectedCount > 0" class="selection-count">
        {{ store.selectedCount }} selected
      </span>
    </div>

    <div class="action-bar-right">
      <button
        class="btn btn-download"
        :disabled="store.selectedCount === 0 || store.downloadLoading"
        @click="emit('download')"
      >
        ⬇ Download{{ store.selectedCount > 0 ? `(${store.selectedCount})` : '' }}
      </button>

      <button
        class="btn btn-delete"
        :disabled="store.selectedCount === 0 || store.deleteLoading"
        @click="emit('delete')"
      >
        🗑 Delete{{ store.selectedCount > 0 ? `(${store.selectedCount})` : '' }}
      </button>
    </div>
  </div>
</template>
