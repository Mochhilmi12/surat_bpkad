"use client";

import * as React from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";

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
      <DialogContent className="w-full flex flex-col">
        <DialogHeader>
          <DialogTitle>Pilih Arsip Bulanan</DialogTitle>
          <DialogDescription>Pilih bulan & tahun arsip yang ingin dilihat.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-3">
          <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Bulan" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }).map((_, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>
                  {new Date(2000, i, 1).toLocaleString("id-ID", { month: "long" })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 7 }).map((_, i) => {
                const y = now.getFullYear() - i;
                return (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button onClick={() => onConfirm(year, month)}>Lihat Arsip</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
