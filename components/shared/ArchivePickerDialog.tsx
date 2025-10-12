"use client";
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function ArchivePickerDialog({
  open, onOpenChange, onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: (year: number, month: number) => void;
}) {
  const now = new Date();
  const [year, setYear] = React.useState(now.getFullYear());
  const [month, setMonth] = React.useState(now.getMonth() + 1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pilih Arsip Bulanan</DialogTitle>
          <DialogDescription>Pilih bulan & tahun arsip yang ingin dilihat.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-3">
          <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
            <SelectTrigger className="w-28"><SelectValue placeholder="Bulan" /></SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }).map((_, i) => (
                <SelectItem key={i+1} value={String(i+1)}>{i+1}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Tahun" /></SelectTrigger>
            <SelectContent>
              {Array.from({ length: 7 }).map((_, i) => {
                const y = now.getFullYear() - i;
                return <SelectItem key={y} value={String(y)}>{y}</SelectItem>;
              })}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button className="bg-slate-600 text-white hover:bg-slate-700" onClick={() => onConfirm(year, month)}>Lihat Arsip</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
