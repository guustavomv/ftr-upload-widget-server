import type { FastifyInstance } from 'fastify'
import { exportUploadsRoute } from './export-uploads'
import { getUploadsRoute } from './get-uploads'
import { uploadImageRoute } from './upload-image'

export function routes(app: FastifyInstance) {
  app.register(uploadImageRoute)
  app.register(getUploadsRoute)
  app.register(exportUploadsRoute)
}
