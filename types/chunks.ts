/** Flexible timestamp — fields present depend on granularity */
export interface ChunkDate {
    year: number
    month: number   // 1-12
    day: number     // 1-31
    hour: number    // 0-23
    minute?: number // 0-59 (present in bucket-level data)
}

/** A single data chunk (one minute of backup data) */
export interface Bucket {
    date: ChunkDate
    dataChunkCount: number
    sizeOnDisk: number
    compressedBytes: number
    uncompressedBytes: number
    compressionRatio: number
    dataCount: number
}

/** An hourly group containing 60 minute-buckets */
export interface ChunkGroup {
    date: ChunkDate
    buckets: Bucket[]
    dataChunkCount: number
    sizeOnDisk: number
    compressedBytes: number
    uncompressedBytes: number
    compressionRatio: number
    dataCount: number
}

/** Full API response for chunk data */
export interface SignedFilesResponse {
    groups: ChunkGroup[]
    dataChunkCount: number
    sizeOnDisk: number
    compressedBytes: number
    uncompressedBytes: number
    compressionRatio: number
    dataCount: number
    minDataCount: number
    maxDataCount: number
    minByte: number
    maxByte: number
}

/** Download URL for a single chunk file */
export interface DownloadFile {
    fileId: string
    fileName: string
    downloadUrl: string
    expirationDate: string
    fileSize: number
}

/** Result of a delete operation */
export interface DeleteResult {
    processedFileIds: string[]
    failedFileIds: string[]
    status: string
    additionalInfo: string
}

/** Request body for download-urls and delete endpoints */
export interface ChunkRequest {
    dates: ChunkDate[]
}
