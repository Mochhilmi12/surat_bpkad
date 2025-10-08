"use client";

import useSWR from "swr";
import StatCard from "@/components/shared/StatCard"; 
import { FileText, Calendar, CalendarDays, Clock } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Stats = {
  total: number;
  today: number;
  thisMonth: number;
  last: { no_surat: string; perihal: string; tanggal_dibuat: string } | null;
};

export default function SuratStats() {
  const { data, isLoading, error } = useSWR<Stats>("/api/surat/stats", fetcher);

  if (isLoading) {
    return <p className="text-muted-foreground">Memuat statistik…</p>;
  }

  if (error) {
    return (
      <p className="text-sm text-red-600">
        Gagal memuat statistik. Coba refresh. {error instanceof Error ? error.message : ""}
      </p>
    );
  }

  const total = data?.total ?? 0;
  const today = data?.today ?? 0;
  const thisMonth = data?.thisMonth ?? 0;
  const lastNo = data?.last?.no_surat ?? "-";
  const lastSubtitle = data?.last
    ? `${data.last.perihal} · ${data.last.tanggal_dibuat}`
    : "Belum ada data";

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Surat"
        value={total}
        icon={<FileText className="size-5" />}
        tint="blue"
        subtitle="Keseluruhan data surat"
      />
      <StatCard
        title="Surat Hari Ini"
        value={today}
        icon={<CalendarDays className="size-5" />}
        tint="green"
        subtitle="Dibuat pada hari ini"
      />
      <StatCard
        title="Surat Bulan Ini"
        value={thisMonth}
        icon={<Calendar className="size-5" />}
        tint="amber"
        subtitle="Dibuat bulan berjalan"
      />
      <StatCard
        title="Surat Terakhir"
        value={lastNo}
        icon={<Clock className="size-5" />}
        tint="rose"
        subtitle={lastSubtitle}
      />
    </div>
  );
}
