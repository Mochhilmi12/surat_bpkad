import { z } from 'zod';

export const suratSchema = z.object({
  no_urutan: z.coerce.number().int().positive(),
  no_surat: z.string().min(1),
  perihal: z.string().min(1),
  tujuan: z.string().min(1),
  tanggal_dibuat: z.string().date().or(z.string().min(10)), // ISO (YYYY-MM-DD)
  file_url: z.string().url().optional().nullable(),
});
export type SuratInput = z.infer<typeof suratSchema>;
