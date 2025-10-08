"use client";
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { SuratListItem } from "@/types";
import { UploadButton } from "@/lib/uploadthing";

type Props = {
  mode: "create" | "edit";
  initial?: Partial<SuratListItem & { tanggal_dibuat: string; }>;
  onSaved: () => void;
  trigger?: React.ReactNode;
};

export default function SuratFormDialog({ mode, initial, onSaved, trigger }: Props) {
  const [open, setOpen] = React.useState(false);
  const [fileUrl, setFileUrl] = React.useState<string | null>(initial?.file_url ?? null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      no_surat: String(fd.get("no_surat") ?? ""),
      perihal: String(fd.get("perihal") ?? ""),
      tujuan: String(fd.get("tujuan") ?? ""),
      tanggal_dibuat: String(fd.get("tanggal_dibuat") ?? ""),
      file_url: fileUrl,
    };

    const url = mode === "create"
      ? "/api/surat"
      : `/api/surat/${initial?.id}`;

    const res = await fetch(url, {
      method: mode === "create" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(()=> ({}));
      alert(err?.error ? JSON.stringify(err.error) : "Gagal menyimpan");
      return;
    }
    setOpen(false);
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>{mode === "create" ? "Tambah Surat" : "Edit Surat"}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input name="no_surat" defaultValue={initial?.no_surat ?? ""} placeholder="No Surat" required />
          <Textarea name="perihal" defaultValue={initial?.perihal ?? ""} placeholder="Perihal" required />
          <Input name="tujuan" defaultValue={initial?.tujuan ?? ""} placeholder="Tujuan" required />
          <Input name="tanggal_dibuat" type="date" defaultValue={initial?.tanggal_dibuat ?? ""} required />

          <div className="space-y-2">
            <div className="text-sm">File (opsional): {fileUrl ? <a className="underline" href={fileUrl} target="_blank">Lihat</a> : "-"}</div>
            <UploadButton
              endpoint="suratFile"
              onClientUploadComplete={(res: any) => { setFileUrl(res?.[0]?.url ?? null); }}
              onUploadError={(e: any) => alert(e.message)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={()=>setOpen(false)}>Batal</Button>
            <Button type="submit">{mode === "create" ? "Simpan" : "Update"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
