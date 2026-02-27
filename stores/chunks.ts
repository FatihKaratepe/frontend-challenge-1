import { defineStore } from 'pinia'
import type { SignedFilesResponse, ChunkDate, Bucket, DownloadFile, DeleteResult } from '../types/chunks'

function bucketKey(date: ChunkDate): string {
    return `${date.year}-${date.month}-${date.day}-${date.hour}-${date.minute}`
}
function groupKey(date: ChunkDate): string {
    return `${date.year}-${date.month}-${date.day}-${date.hour}`
}

export const useChunksStore = defineStore('chunks', {
    state: () => ({
        data: null as SignedFilesResponse | null,
        selectedKeys: new Set<string>(),
        loading: false,
        error: null as string | null,
        downloadResults: null as DownloadFile[] | null,
        deleteResult: null as DeleteResult | null,
        downloadLoading: false,
        deleteLoading: false
    }),

    getters: {
        groups: (state) => state.data?.groups ?? [],
        totalDataCount: (state) => state.data?.dataCount ?? 0,
        totalChunks: (state) => state.data?.dataChunkCount ?? 0,
        totalSizeOnDisk: (state) => state.data?.sizeOnDisk ?? 0,
        minDataCount: (state) => state.data?.minDataCount ?? 0,
        maxDataCount: (state) => state.data?.maxDataCount ?? 0,
        selectedCount: (state) => state.selectedKeys.size,

        allBuckets(): Bucket[] {
            return this.groups.flatMap(g => g.buckets)
        },

        totalBucketCount(): number {
            return this.allBuckets.length
        },

        isAllSelected(): boolean {
            return this.totalBucketCount > 0 && this.selectedCount === this.totalBucketCount
        },

        selectedDates(): ChunkDate[] {
            const dates: ChunkDate[] = []
            for (const group of this.groups) {
                for (const bucket of group.buckets) {
                    const key = bucketKey(bucket.date)
                    if (this.selectedKeys.has(key)) {
                        dates.push(bucket.date)
                    }
                }
            }
            return dates
        },

        selectedBuckets(): Bucket[] {
            const buckets: Bucket[] = []
            for (const group of this.groups) {
                for (const bucket of group.buckets) {
                    const key = bucketKey(bucket.date)
                    if (this.selectedKeys.has(key)) {
                        buckets.push(bucket)
                    }
                }
            }
            return buckets
        },

        selectedTotalSize(): number {
            return this.selectedBuckets.reduce((sum, b) => sum + b.sizeOnDisk, 0)
        },

        selectedTotalRecords(): number {
            return this.selectedBuckets.reduce((sum, b) => sum + b.dataCount, 0)
        }
    },

    actions: {
        async fetchChunks() {
            this.loading = true
            this.error = null
            try {
                const data = await $fetch<SignedFilesResponse>('/api/chunks')
                this.data = data
            } catch (e: any) {
                this.error = e.message || 'Failed to load chunk data'
            } finally {
                this.loading = false
            }
        },

        isSelected(date: ChunkDate): boolean {
            return this.selectedKeys.has(bucketKey(date))
        },

        toggleChunk(date: ChunkDate) {
            const key = bucketKey(date)
            const newSet = new Set(this.selectedKeys)
            if (newSet.has(key)) {
                newSet.delete(key)
            } else {
                newSet.add(key)
            }
            this.selectedKeys = newSet
        },

        isGroupSelected(groupDate: ChunkDate): boolean {
            const group = this.groups.find(g => groupKey(g.date) === groupKey(groupDate))
            if (!group || group.buckets.length === 0) return false
            return group.buckets.every(b => this.selectedKeys.has(bucketKey(b.date)))
        },

        isGroupPartiallySelected(groupDate: ChunkDate): boolean {
            const group = this.groups.find(g => groupKey(g.date) === groupKey(groupDate))
            if (!group || group.buckets.length === 0) return false
            const selectedInGroup = group.buckets.filter(b => this.selectedKeys.has(bucketKey(b.date))).length
            return selectedInGroup > 0 && selectedInGroup < group.buckets.length
        },

        toggleGroup(groupDate: ChunkDate) {
            const group = this.groups.find(g => groupKey(g.date) === groupKey(groupDate))
            if (!group) return
            const newSet = new Set(this.selectedKeys)
            const allSelected = this.isGroupSelected(groupDate)
            for (const bucket of group.buckets) {
                const key = bucketKey(bucket.date)
                if (allSelected) {
                    newSet.delete(key)
                } else {
                    newSet.add(key)
                }
            }
            this.selectedKeys = newSet
        },

        toggleAll() {
            if (this.isAllSelected) {
                this.selectedKeys = new Set()
            } else {
                const newSet = new Set<string>()
                for (const group of this.groups) {
                    for (const bucket of group.buckets) {
                        newSet.add(bucketKey(bucket.date))
                    }
                }
                this.selectedKeys = newSet
            }
        },

        clearSelection() {
            this.selectedKeys = new Set()
        },

        getColorLevel(dataCount: number): number {
            const min = this.minDataCount
            const max = this.maxDataCount
            if (max === min) return 4
            const ratio = (dataCount - min) / (max - min)
            return Math.min(7, Math.floor(ratio * 8))
        },

        async downloadChunks() {
            if (this.selectedCount === 0) return
            this.downloadLoading = true
            try {
                const result = await $fetch<DownloadFile[]>('/api/chunks/download-urls', {
                    method: 'POST',
                    body: { dates: this.selectedDates }
                })
                this.downloadResults = result
            } catch (e: any) {
                this.error = e.message || 'Failed to get download URLs'
            } finally {
                this.downloadLoading = false
            }
        },

        async deleteChunks() {
            if (this.selectedCount === 0) return
            this.deleteLoading = true
            try {
                const result = await $fetch<DeleteResult>('/api/chunks', {
                    method: 'DELETE',
                    body: { dates: this.selectedDates }
                })
                this.deleteResult = result
                this.clearSelection()
            } catch (e: any) {
                this.error = e.message || 'Failed to delete chunks'
            } finally {
                this.deleteLoading = false
            }
        }
    }
})
