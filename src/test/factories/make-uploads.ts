import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { fakerPT_BR as faker } from '@faker-js/faker'
import dayjs from 'dayjs'

import type { InferInsertModel } from 'drizzle-orm'

export async function makeUploads(
  quantity = 1,
  overrides?: Partial<InferInsertModel<typeof schema.uploads>>
) {
  const results = await db
    .insert(schema.uploads)
    .values(
      Array.from({ length: quantity }).map((_, i) => {
        const fileName = `${i + 1}-${overrides?.name || faker.system.fileName()}`

        return {
          name: fileName,
          remoteKey: `images/${fileName}`,
          remoteUrl: `http://example.com/images/${fileName}`,
          createdAt: dayjs().subtract(i, 'days').toDate(),
          ...overrides,
        }
      })
    )
    .returning()

  return results
}
