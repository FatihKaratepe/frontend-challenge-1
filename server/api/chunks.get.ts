import { readFileSync } from 'fs'
import { resolve } from 'path'
import type { SignedFilesResponse } from '../../types/chunks'

let cachedData: SignedFilesResponse | null = null

export default defineEventHandler((): SignedFilesResponse => {
    if (!cachedData) {
        const filePath = resolve(process.cwd(), 'mock-data/signedfiles.json')
        const raw = readFileSync(filePath, 'utf-8')
        cachedData = JSON.parse(raw) as SignedFilesResponse
    }
    return cachedData
})
