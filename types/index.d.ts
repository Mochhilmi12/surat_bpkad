export type Surat = {
  id: string;
  no_urutan: number;
  no_surat: string;
  perihal: string;
  tujuan: string;
  tanggal_dibuat: string; // ISO date
  file_url?: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type SuratListItem = Pick<
  Surat,
  "id" | "no_urutan" | "no_surat" | "perihal" | "tujuan" | "tanggal_dibuat" | "file_url"
>;

// src/types/index.ts
import type { ElementType } from "react";

export type MetricCard = {
  title: string;
  value: string | number;
  icon: ElementType<{ className?: string }>;
  color: string; // tailwind text color utk ikon
  trend: "up" | "down" | "flat";
  deltaLabel: string; // label kecil di badge
  highlight: string; // judul kecil di bawah garis
  caption: string;   // keterangan kecil di bawah highlight
  filterValue: string; // nilai untuk onClickCard
};
