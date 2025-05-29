import { z } from 'zod';

const envSchema = z.object({
  VITE_APP_BASE_PATH: z?.string().default('/').optional(),
  MOCK_API: z.string().optional()
});

export const env = envSchema.parse(process.env);
