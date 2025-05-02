import { exportUploads } from '@/app/functions/export-uploads'
import { isRight, unwrapEither } from '@/infra/shared/either'
import * as upload from '@/infra/storage/upload-file-to-storage'
import { makeUploads } from '@/test/factories/make-uploads'
import { randomUUID } from 'node:crypto'
import { describe, expect, it, vi } from 'vitest'

describe('export uploads', () => {
  it('should be able to export uploads', async () => {
    const namePattern = randomUUID()

    const uploadStub = vi
      .spyOn(upload, 'uploadFileToStorage')
      .mockImplementationOnce(async () => {
        return {
          key: `${namePattern}.csv`,
          url: 'http://example.com/file.csv',
        }
      })

    const uploads = await makeUploads(5, { name: `${namePattern}.webp` })

    const sut = await exportUploads({
      searchQuery: namePattern,
    })

    const generatedCSVStream = uploadStub.mock.calls[0][0].contentStream
    const csvAsString = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = []

      generatedCSVStream.on('data', (chunk: Buffer) => {
        chunks.push(chunk)
      })

      generatedCSVStream.on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf-8'))
      })

      generatedCSVStream.on('error', err => {
        reject(err)
      })
    })

    const csvAsArray = csvAsString
      .trim()
      .split('\n')
      .map(row => row.split(','))

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).reportUrl).toBe('http://example.com/file.csv')
    expect(csvAsArray).toEqual([
      ['ID', 'Name', 'URL', 'Uploaded at'],
      ...uploads.map(upload => [
        upload.id,
        upload.name,
        upload.remoteUrl,
        expect.any(String),
      ]),
    ])
  })
})
