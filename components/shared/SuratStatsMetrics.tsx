"use client";
import * as React from "react";
import useSWR from "swr";
import { FileText, CalendarDays, Calendar, Clock } from "lucide-react";
import { MetricsGrid } from "@/components/shared/MetricsGrid";
import ArchivePickerDialog from "@/components/shared/ArchivePickerDialog";
import ArchiveTableDialog from "@/components/shared/ArchiveTableDialog";

type Stats = {
  total: number;
  today: number;
  thisMonth: number;
  last: { no_surat: string; perihal: string; tanggal_dibuat: string } | null;
};

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function SuratStatsMetrics() {
  const { data, isLoading } = useSWR<Stats>("/api/surat/stats", fetcher);

  // state untuk flow pilih bulan -> tampil tabel
  const [openPick, setOpenPick] = React.useState(false);
  const [openTable, setOpenTable] = React.useState(false);
  const now = new Date();
  const [year, setYear] = React.useState(now.getFullYear());
  const [month, setMonth] = React.useState(now.getMonth() + 1);

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
      filterValue: "thisMonth", // akan memicu picker
    },
    {
      title: "SURAT TERAKHIR",
      value: data?.last?.no_surat ?? "-",
      icon: Clock,
      color: "text-rose-600",
      trend: "flat" as const,
      deltaLabel: "-",
      highlight: data?.last?.perihal ?? "-",
      caption: "Perihal & tanggal surat terakhir",
      filterValue: "last",
    },
  ];

  function handleCardClick(key: string) {
    if (key === "thisMonth") {
      setOpenPick(true); // buka pilih bulan dulu
    }
  }

  return (
    <section className="w-full ">
      <MetricsGrid
        cards={cards}
        statusFilter=""
        onClickCard={handleCardClick}
        isLoading={isLoading}
        skeletonCount={4}
      />

      {/* Modal 1: pilih bulan/tahun */}
      <ArchivePickerDialog
        open={openPick}
        onOpenChange={setOpenPick}
        onConfirm={(y, m) => {
          setYear(y);
          setMonth(m);
          setOpenPick(false);
          setOpenTable(true);
        }}
      />

      {/* Modal 2: tabel arsip untuk bulan & tahun terpilih */}
      <ArchiveTableDialog
        open={openTable}
        onOpenChange={setOpenTable}
        year={year}
        month={month}
      />
    </section>
  );
}

