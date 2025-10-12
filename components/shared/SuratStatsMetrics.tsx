"use client";
import * as React from "react";
import useSWR from "swr";
import { FileText, CalendarDays, Calendar, Clock } from "lucide-react";
import { MetricsGrid } from "@/components/shared/MetricsGrid";
import ArchiveTableDialog from "@/components/shared/ArchiveTableDialog";

type Stats = {
  total: number;
  today: number;
  thisMonth: number;
  last: { no_surat: string; perihal: string; tanggal_dibuat: string } | null;
};

const fetcher = (u: string) => fetch(u).then(r => r.json());

export default function SuratStatsMetrics() {
  const { data, isLoading } = useSWR<Stats>("/api/surat/stats", fetcher);

  // === state modal arsip bulan ini
  const now = new Date();
  const [openArchive, setOpenArchive] = React.useState(false);
  const archiveYear = now.getFullYear();
  const archiveMonth = now.getMonth() + 1;

  const cards = [
    {
      title: "TOTAL SURAT",
      value: data?.total ?? 0,
      icon: FileText,
      color: "text-sky-600",
      trend: "up" as const,
      deltaLabel: "+1 hari ini",
      highlight: "Keseluruhan arsip",
      caption: "Jumlah seluruh surat yang tersimpan",
      filterValue: "total",
    },
    {
      title: "SURAT HARI INI",
      value: data?.today ?? 0,
      icon: CalendarDays,
      color: "text-emerald-600",
      trend: "up" as const,
      deltaLabel: "+1",
      highlight: "Aktivitas harian",
      caption: "Surat yang dibuat pada tanggal hari ini",
      filterValue: "today",
    },
    {
      title: "SURAT BULAN INI",
      value: data?.thisMonth ?? 0,
      icon: Calendar,
      color: "text-amber-600",
      trend: "up" as const,
      deltaLabel: "+1",
      highlight: "Periode berjalan",
      caption: "Total surat pada bulan berjalan",
      filterValue: "thisMonth", // <- penting: penanda kartu bulan ini
    },
    {
      title: "SURAT TERAKHIR",
      value: data?.last?.no_surat ?? "-",
      icon: Clock,
      color: "text-rose-600",
      trend: "flat" as const,
      deltaLabel: "—",
      highlight: data?.last?.perihal ?? "—",
      caption: "Perihal & tanggal surat terakhir",
      filterValue: "last",
    },
  ];

  // klik kartu
  function handleCardClick(key: string) {
    if (key === "thisMonth") {
      // buka modal arsip bulan berjalan
      setOpenArchive(true);
      return;
    }
    // kartu lain bisa dipakai buat filter/aksi lain kalau perlu
  }

  return (
    <>
      <MetricsGrid
        cards={cards}
        statusFilter=""           // tidak dipakai? boleh kosong
        onClickCard={handleCardClick}
        isLoading={isLoading}
        skeletonCount={4}
      />

      {/* Modal tabel arsip bulan berjalan */}
      <ArchiveTableDialog
        open={openArchive}
        onOpenChange={setOpenArchive}
        year={archiveYear}
        month={archiveMonth}
      />
    </>
  );
}
