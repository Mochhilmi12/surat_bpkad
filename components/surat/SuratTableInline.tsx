"use client";

import * as React from "react";
import useSWR from "swr";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArchiveIcon, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SuratFormPanel from "./SuratFormPanel";
import SuratFileSheet from "./SuratFormSheet"; 
import type { SuratListItem } from "@/types";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function TableSkeletonRow() {
  return (
    <TableRow>
      <TableCell className="py-4"><Skeleton className="h-6 w-10 rounded" /></TableCell>
      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
      <TableCell><Skeleton className="h-4 w-64" /></TableCell>
      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
      <TableCell><Skeleton className="h-4 w-36" /></TableCell>
      <TableCell className="text-center"><Skeleton className="h-6 w-14 mx-auto rounded" /></TableCell>
      <TableCell className="text-right"><Skeleton className="ml-auto h-8 w-8 rounded-md" /></TableCell>
    </TableRow>
  );
}

function TableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, i) => <TableSkeletonRow key={i} />)}
    </TableBody>
  );
}

export default function SuratTableInline() {
  const [q, setQ] = React.useState("");
  const { data, isLoading, mutate } = useSWR<{ rows: SuratListItem[] }>(
    `/api/surat?q=${encodeURIComponent(q)}`,
    fetcher
  );

  const rows = data?.rows ?? [];

  // --- Pagination state
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(1);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [openArchive, setOpenArchive] = React.useState(false);
  const [archivingId, setArchivingId] = React.useState<string | null>(null);
  const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage));
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex   = Math.min(startIndex + rowsPerPage, rows.length);
  const pageData   = React.useMemo(
    () => rows.slice(startIndex, endIndex),
    [rows, startIndex, endIndex]
  );

  // reset page kalau cari/ubah page size
  React.useEffect(() => { setPage(1); }, [q, rowsPerPage]);

  const [selected, setSelected] = React.useState<SuratListItem | null>(null);
  

   async function confirmDelete() {
    if (!deletingId) return;
    const res = await fetch(`/api/surat/${deletingId}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Gagal menghapus");
    } else {
      if (selected?.id === deletingId) setSelected(null);
      mutate();
    }
    setOpenDelete(false);
    setDeletingId(null);
  }

  async function confirmArchive() {
  if (!archivingId) return;
  await fetch(`/api/surat/${archivingId}/archive`, { method: "PATCH" });
  mutate();
  setOpenArchive(false);
}


  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
      {/* KIRI: panel form */}
      <div className="lg:col-span-1">
        <SuratFormPanel
          selected={selected}
          onSaved={() => {
            mutate();
          }}
          onClear={() => setSelected(null)}
        />
      </div>

      {/* KANAN: tabel */}
      <div className="lg:col-span-2 flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
        {/* toolbar pencarian */}
        <div className="flex flex-rpw md:flex-row lg:items-center justify-between gap-3 px-4 py-3 ">
          <h3 className="text-base font-semibold text-slate-800">Daftar Surat</h3>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
            <Input
            placeholder="Cari no surat/perihal/tujuan..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full sm:w-72"
          />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="min-w-[720px]">
            <TableHeader className="bg-[#F8F8FF]">
              <TableRow className="border-slate-200">
                <TableHead className="text-slate-700 font-semibold p-4 w-16">#</TableHead>
                <TableHead className="text-slate-700 font-semibold p-4 w-40">No Surat</TableHead>
                <TableHead className="text-slate-700 font-semibold p-4">Perihal</TableHead>
                <TableHead className="text-slate-700 font-semibold p-4 w-64">Tujuan</TableHead>
                <TableHead className="text-slate-700 font-semibold p-4 w-36">Tanggal</TableHead>
                <TableHead className="text-slate-700 font-semibold p-4 w-28 text-center">File</TableHead>
                <TableHead className="text-slate-700 font-semibold p-4 w-24 text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            {isLoading ? (
  <TableSkeleton rows={10} />
) : rows.length === 0 ? (
  <TableBody>
    <TableRow>
      <TableCell colSpan={7} className="py-14 text-center text-slate-500">
        Belum ada data.
      </TableCell>
    </TableRow>
  </TableBody>
) : (
  <TableBody>
    {pageData.map((r, i) => (
      <TableRow key={r.id} className="hover:bg-slate-50 transition-colors">
        <TableCell className="p-4">
          <span className="text-slate-700">{startIndex + i + 1}</span>
        </TableCell>
        <TableCell className="p-4">
          <div className="font-medium text-slate-900">{r.no_surat}</div>
        </TableCell>
        <TableCell className="p-4">
          <div className="text-slate-900">{r.perihal}</div>
        </TableCell>
        <TableCell className="p-4">
          <div className="text-slate-900">{r.tujuan}</div>
        </TableCell>
        <TableCell className="p-4">
          <Badge className="bg-slate-100 text-slate-700 border border-slate-200">
            {r.tanggal_dibuat}
          </Badge>
        </TableCell>
        <TableCell className="p-4 text-center">
          {r.file_url ? (
            <SuratFileSheet
              url={r.file_url}
              trigger={<Button variant="link" className="p-0 h-auto text-[#27aae1]">Lihat</Button>}
            />
          ) : (
            <span className="text-slate-400">-</span>
          )}
        </TableCell>
        <TableCell className="p-4 text-right">
          {/* ...DropdownMenu tetap... */}
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
)}
          </Table>
          {/* Footer pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200">
        <div className="text-xs sm:text-sm text-slate-600">
          {isLoading
            ? `Memuat ${rowsPerPage} baris…`
            : rows.length > 0
              ? `${startIndex + 1}–${endIndex} dari ${rows.length} baris`
              : "0 dari 0 baris"}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Baris per halaman</span>
            <select
              value={rowsPerPage}
              disabled={isLoading}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="h-8 rounded-md border border-slate-300 bg-white px-2 text-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#27aae1]/40"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => setPage(1)} disabled={isLoading || page === 1}>«</Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={isLoading || page === 1}>‹</Button>
            <span className="text-xs sm:text-sm text-slate-600 px-2">
              Halaman <b>{page}</b> / {totalPages}
            </span>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={isLoading || page === totalPages}>›</Button>
            <Button variant="outline" size="sm" onClick={() => setPage(totalPages)} disabled={isLoading || page === totalPages}>»</Button>
          </div>
        </div>
      </div>
        </div>
      </div>
      <div className="w-full">
        {/* Modal konfirmasi delete */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Hapus surat?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            Apakah Anda yakin ingin menghapus surat ini? Tindakan ini tidak dapat dibatalkan.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpenDelete(false)}>Batal</Button>
            <Button variant="destructive" onClick={confirmDelete}>Ya, hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openArchive} onOpenChange={setOpenArchive}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Arsipkan surat?</DialogTitle>
    </DialogHeader>
    <p className="text-sm text-slate-600">
      Surat ini akan dipindahkan ke arsip bulanan. Anda tetap bisa melihatnya nanti.
    </p>
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpenArchive(false)}>Batal</Button>
      <Button variant="secondary" onClick={confirmArchive}>Ya, arsipkan</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
      </div>
    </div>
  );
}



