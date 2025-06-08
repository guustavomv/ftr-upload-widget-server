import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(3333),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('production'),
    DATABASE_URL: z.string().url().startsWith('postgresql://'),
    CLOUDFLARE_ACCOUNT_ID: z.string(),
    CLOUDFLARE_ACCESS_KEY_ID: z.string(),
    CLOUDFLARE_SECRET_ACCESS_KEY: z.string(),
    CLOUDFLARE_BUCKET: z.string(),
    CLOUDFLARE_PUBLIC_URL: z.string().url(),
  },
  runtimeEnv: process.env,
})
