import type { ChunkDate, ChunkRequest, DownloadFile } from '../../../types/chunks'

function pad(n: number): string {
    return String(n).padStart(2, '0')
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export default defineEventHandler(async (event): Promise<DownloadFile[]> => {
    const body = await readBody<ChunkRequest>(event)
    const dates = body.dates || []

    return dates.map((d: ChunkDate, i: number) => {
        const fileName = `chunk_${d.year}_${pad(d.month)}_${pad(d.day)}_${pad(d.hour)}_${pad(d.minute ?? 0)}.dat`
        const fileSize = randomInt(89808, 209888)
        return {
            fileId: `f${i + 1}`,
            fileName,
            downloadUrl: `https://storage.example.com/signed/${fileName}?token=mock-token-${i + 1}&expires=1740400000`,
            expirationDate: '2026-02-22T00:00:00Z',
            fileSize
        }
    })
})
