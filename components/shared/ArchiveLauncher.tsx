"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import ArchivePickerDialog from "./ArchivePickerDialog";
import ArchiveTableDialog from "./ArchiveTableDialog";

export default function ArchiveLauncher() {
  const [openPick, setOpenPick] = React.useState(false);
  const [openTable, setOpenTable] = React.useState(false);
  const [year, setYear] = React.useState<number>(new Date().getFullYear());
  const [month, setMonth] = React.useState<number>(new Date().getMonth() + 1);

  return (
    <>
      <Button variant="outline" className="bg-slate-600 text-white hover:bg-slate-700" onClick={() => setOpenPick(true)}>Arsip</Button>

      <ArchivePickerDialog
        open={openPick}
        onOpenChange={setOpenPick}
        onConfirm={(y, m) => {
          setYear(y); setMonth(m);
          setOpenPick(false);
          setOpenTable(true);
        }}
      />

      <ArchiveTableDialog
        open={openTable}
        onOpenChange={setOpenTable}
        year={year}
        month={month}
      />

    </>
  );
}
