import type { ChunkRequest, DeleteResult } from '../../types/chunks'

export default defineEventHandler(async (event): Promise<DeleteResult> => {
    const body = await readBody<ChunkRequest>(event)
    const dates = body.dates || []
    const count = dates.length

    const processedFileIds = Array.from({ length: count }, (_, i) => `f${i + 1}`)

    return {
        processedFileIds,
        failedFileIds: [],
        status: 'completed',
        additionalInfo: `${count} files deleted successfully`
    }
})
