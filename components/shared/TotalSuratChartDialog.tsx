"use client";

import * as React from "react";
import useSWR from "swr";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

const fetcher = (u: string) => fetch(u).then(r => r.json());

export default function TotalSuratChartDialog({
  open,
  onOpenChange,
  year,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  year: number;
}) {
  const { data, isLoading } = useSWR(open ? `/api/surat/stats-monthly?year=${year}` : null, fetcher);
  const rows = data?.rows ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Total Surat per Bulan — {year}</DialogTitle>
        </DialogHeader>

        <div className="h-72 w-full">
          {isLoading ? (
            <div className="grid place-items-center h-full text-sm text-muted-foreground">Memuat…</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                {/* warna biru pemerintahan */}
                <Bar dataKey="count" fill="#1d4ed8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Tutup</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
