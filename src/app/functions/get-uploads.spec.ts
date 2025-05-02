import { isRight, unwrapEither } from '@/infra/shared/either'
import { makeUploads } from '@/test/factories/make-uploads'
import { randomUUID } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { getUploads } from './get-uploads'

describe('Get uploads', () => {
  it('should be able to get the upalods', async () => {
    const namePattern = randomUUID()

    const uploads = await makeUploads(5, { name: `${namePattern}.webp` })

    const sut = await getUploads({
      searchQuery: namePattern,
    })

    expect(isRight(sut)).toBeTruthy()
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).uploads).toEqual(
      uploads.map(({ id }) => expect.objectContaining({ id }))
    )
  })

  it('should be able to get paginated the upalods', async () => {
    const namePattern = randomUUID()

    const uploads = await makeUploads(5, { name: `${namePattern}.webp` })

    let sut = await getUploads({
      searchQuery: namePattern,
      page: 1,
      pageSize: 3,
    })

    expect(isRight(sut)).toBeTruthy()
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).uploads).toEqual(
      uploads.slice(0, 3).map(({ id }) => expect.objectContaining({ id }))
    )

    sut = await getUploads({
      searchQuery: namePattern,
      page: 2,
      pageSize: 3,
    })

    expect(isRight(sut)).toBeTruthy()
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).uploads).toEqual(
      uploads.slice(3, 5).map(({ id }) => expect.objectContaining({ id }))
    )
  })

  it('should be able to get sorted the upalods', async () => {
    const namePattern = randomUUID()

    const uploads = await makeUploads(5, {
      name: `${namePattern}.webp`,
    })

    let sut = await getUploads({
      searchQuery: namePattern,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    })

    expect(isRight(sut)).toBeTruthy()
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).uploads).toEqual(
      uploads.map(({ id }) => expect.objectContaining({ id }))
    )

    sut = await getUploads({
      searchQuery: namePattern,
      sortBy: 'createdAt',
      sortDirection: 'asc',
    })

    expect(isRight(sut)).toBeTruthy()
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).uploads).toEqual(
      uploads.reverse().map(({ id }) => expect.objectContaining({ id }))
    )
  })
})
