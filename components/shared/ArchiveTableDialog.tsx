"use client";
import * as React from "react";
import useSWR from "swr";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import SuratFileSheet from "../surat/SuratFormSheet";

const fetcher = (u: string) => fetch(u).then(r => r.json());

export default function ArchiveTableDialog({
  open, onOpenChange, year, month,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  year: number;
  month: number;
}) {
  const key = open ? `/api/surat/archive?year=${year}&month=${month}` : null;
  const { data, isLoading } = useSWR<{ rows: any[]; count: number }>(key, fetcher);
  const rows = data?.rows ?? [];

  return (
    <Dialog  open={open} onOpenChange={onOpenChange}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Arsip: {String(month).padStart(2,"0")}/{year}</DialogTitle>
          <DialogDescription>Daftar surat yang termasuk dalam arsip bulan ini.</DialogDescription>
        </DialogHeader>

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader className="bg-[#F8F8FF]">
              <TableRow>
                <TableHead className="p-3 w-16">#</TableHead>
                <TableHead className="p-3 w-48">No Surat</TableHead>
                <TableHead className="p-3">Perihal</TableHead>
                <TableHead className="p-3 w-64">Tujuan</TableHead>
                <TableHead className="p-3 w-36">Tanggal</TableHead>
                <TableHead className="p-3 w-24 text-center">File</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="p-6 text-center text-muted-foreground">Memuat…</TableCell></TableRow>
              ) : rows.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="p-6 text-center text-muted-foreground">Tidak ada data.</TableCell></TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="p-3">{r.no_urutan}</TableCell>
                    <TableCell className="p-3">{r.no_surat}</TableCell>
                    <TableCell className="p-3">{r.perihal}</TableCell>
                    <TableCell className="p-3">{r.tujuan}</TableCell>
                    <TableCell className="p-3">{r.tanggal_dibuat}</TableCell>
                    <TableCell className="p-3 text-center">
                      {r.file_url ? (
                        <SuratFileSheet
                          url={r.file_url}
                          trigger={<span className="text-indigo-700 hover:underline cursor-pointer">Lihat</span>}
                        />
                      ) : ("—")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="justify-between">
          <div className="text-sm text-muted-foreground">Total: {data?.count ?? 0} surat</div>
          <DialogClose asChild>
            <Button variant="outline">Tutup</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
