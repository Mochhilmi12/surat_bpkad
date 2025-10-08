import { z } from "zod";

export const suratCreateSchema = z.object({
  no_surat: z.string().min(3),   // ⬅️ ini yang bikin 400
  perihal: z.string().min(3),
  tujuan: z.string().min(2),
  tanggal_dibuat: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  file_url: z.string().url().nullable().optional(),
});

export const suratUpdateSchema = suratCreateSchema.partial();
export type SuratCreateInput = z.infer<typeof suratCreateSchema>;
export type SuratUpdateInput = z.infer<typeof suratUpdateSchema>;
