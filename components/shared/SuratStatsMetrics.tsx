// src/components/surat/SuratStatsMetrics.tsx
"use client";

import useSWR from "swr";
import { useMemo, useState } from "react";
import { MetricsGrid } from "@/components/shared/MetricsGrid"; // path = file MetricsGrid kamu
import type { MetricCard } from "@/types";
import { FileText, CalendarDays, Calendar, Clock } from "lucide-react";

type Stats = {
  total: number;
  today: number;
  thisMonth: number;
  last: { no_surat: string; perihal: string; tanggal_dibuat: string } | null;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function SuratStatsMetrics() {
  const { data, isLoading } = useSWR<Stats>("/api/surat/stats", fetcher);
  const [active, setActive] = useState<string>("");

  const cards: MetricCard[] = useMemo(() => {
    const total = data?.total ?? 0;
    const today = data?.today ?? 0;
    const thisMonth = data?.thisMonth ?? 0;
    const last = data?.last;

    return [
      {
        title: "Total Surat",
        value: total,
        icon: FileText,
        color: "text-sky-600",
        trend: today > 0 ? "up" : "flat",
        deltaLabel: today > 0 ? `+${today} hari ini` : "stabil",
        highlight: "Keseluruhan arsip",
        caption: "Jumlah seluruh surat yang tersimpan",
        filterValue: "ALL",
      },
      {
        title: "Surat Hari Ini",
        value: today,
        icon: CalendarDays,
        color: "text-emerald-600",
        trend: today > 0 ? "up" : "flat",
        deltaLabel: today > 0 ? `+${today}` : "0",
        highlight: "Aktivitas harian",
        caption: "Surat yang dibuat pada tanggal hari ini",
        filterValue: "TODAY",
      },
      {
        title: "Surat Bulan Ini",
        value: thisMonth,
        icon: Calendar,
        color: "text-amber-600",
        trend: thisMonth > 0 ? "up" : "flat",
        deltaLabel: thisMonth > 0 ? `+${thisMonth}` : "0",
        highlight: "Periode berjalan",
        caption: "Total surat pada bulan berjalan",
        filterValue: "THIS_MONTH",
      },
      {
        title: "Surat Terakhir",
        value: last?.no_surat ?? "-",
        icon: Clock,
        color: "text-rose-600",
        trend: "flat",
        deltaLabel: last?.tanggal_dibuat ?? "-",
        highlight: last?.perihal ?? "Belum ada data",
        caption: last ? "Perihal & tanggal surat terakhir" : "Menunggu entri pertama",
        filterValue: "LAST",
      },
    ];
  }, [data]);

  return (
    <MetricsGrid
      cards={cards}
      statusFilter={active}
      onClickCard={(val) => setActive(val)} // sementara hanya highlight aktif
      isLoading={isLoading}
      skeletonCount={4}
    />
  );
}
