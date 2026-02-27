export function useFormatters() {
    function formatRecordCount(n: number): string {
        if (n >= 1_000_000) {
            return `${(n / 1_000_000).toFixed(1)}M`
        }
        if (n >= 1_000) {
            return `${(n / 1_000).toFixed(1)}K`
        }
        return String(n)
    }

    function formatFileSize(bytes: number): string {
        if (bytes >= 1_073_741_824) {
            return `${(bytes / 1_073_741_824).toFixed(2)} GB`
        }
        if (bytes >= 1_048_576) {
            return `${(bytes / 1_048_576).toFixed(2)} MB`
        }
        if (bytes >= 1_024) {
            return `${(bytes / 1_024).toFixed(2)} KB`
        }
        return `${bytes} B`
    }

    function formatCompressionRatio(ratio: number): string {
        return `${ratio.toFixed(2)}%`
    }

    function formatChunkCount(n: number): string {
        return n.toLocaleString('en-US')
    }

    return {
        formatRecordCount,
        formatFileSize,
        formatCompressionRatio,
        formatChunkCount
    }
}
