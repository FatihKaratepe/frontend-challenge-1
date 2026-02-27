<script setup lang="ts">
import type { ChunkGroup, ChunkDate, Bucket } from '../../types/chunks'
import { useChunksStore } from '../../stores/chunks'

const props = defineProps<{
  group: ChunkGroup
}>()

const emit = defineEmits<{
  (e: 'cellHover', bucket: Bucket, event: MouseEvent): void
  (e: 'cellLeave'): void
}>()

const store = useChunksStore()
const { formatRecordCount, formatFileSize, formatCompressionRatio } = useFormatters()

const isGroupChecked = computed(() => store.isGroupSelected(props.group.date))
const isGroupIndeterminate = computed(() => store.isGroupPartiallySelected(props.group.date))

function toggleGroup() {
  store.toggleGroup(props.group.date)
}

function toggleChunk(date: ChunkDate) {
  store.toggleChunk(date)
}

function onCellHover(bucket: Bucket, e: MouseEvent) {
  emit('cellHover', bucket, e)
}

function onCellLeave() {
  emit('cellLeave')
}

const hourLabel = computed(() => {
  const h = props.group.date.hour
  return `${String(h).padStart(2, '0')}:00`
})

const checkboxRef = ref<HTMLInputElement | null>(null)

watch(isGroupIndeterminate, (val) => {
  if (checkboxRef.value) {
    checkboxRef.value.indeterminate = val
  }
}, { immediate: true })

onMounted(() => {
  if (checkboxRef.value) {
    checkboxRef.value.indeterminate = isGroupIndeterminate.value
  }
})
</script>

<template>
  <div class="hour-row">
    <div class="hour-row-checkbox">
      <input
        ref="checkboxRef"
        type="checkbox"
        :checked="isGroupChecked"
        @change="toggleGroup"
      />
    </div>

    <div class="hour-label">{{ hourLabel }}</div>

    <div class="hour-cells">
      <ChunkCell
        v-for="bucket in group.buckets"
        :key="`${bucket.date.hour}-${bucket.date.minute}`"
        :bucket="bucket"
        :level="store.getColorLevel(bucket.dataCount)"
        :selected="store.isSelected(bucket.date)"
        @toggle="toggleChunk"
        @hover="onCellHover"
        @leave="onCellLeave"
      />
    </div>

    <div class="hour-stats">
      <div class="stat-item">
        <span class="stat-label">Records</span>
        <span class="stat-value">{{ formatRecordCount(group.dataCount) }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Size</span>
        <span class="stat-value">{{ formatFileSize(group.sizeOnDisk) }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Ratio</span>
        <span class="stat-value">{{ formatCompressionRatio(group.compressionRatio) }}</span>
      </div>
    </div>
  </div>
</template>
