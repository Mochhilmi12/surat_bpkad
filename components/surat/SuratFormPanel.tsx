"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UploadButton } from "@/lib/uploadthing"; 
import type { SuratListItem } from "@/types";

type Props = {
  /** Jika ada, form akan menjadi mode edit */
  selected?: SuratListItem | null;
  onSaved: () => void;
  onClear: () => void;
};

export default function SuratFormPanel({ selected, onSaved, onClear }: Props) {
  const isEdit = Boolean(selected);
  const [noSurat, setNoSurat] = React.useState(selected?.no_surat ?? "");
  const [perihal, setPerihal] = React.useState(selected?.perihal ?? "");
  const [tujuan, setTujuan] = React.useState(selected?.tujuan ?? "");
  const [tanggal, setTanggal] = React.useState(selected?.tanggal_dibuat ?? "");
  const [fileUrl, setFileUrl] = React.useState<string | null>(selected?.file_url ?? null);
  const [loading, setLoading] = React.useState(false);

  // sync ketika selected berubah
  React.useEffect(() => {
    setNoSurat(selected?.no_surat ?? "");
    setPerihal(selected?.perihal ?? "");
    setTujuan(selected?.tujuan ?? "");
    setTanggal(selected?.tanggal_dibuat ?? "");
    setFileUrl(selected?.file_url ?? null);
  }, [selected]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      no_surat: noSurat.trim(),
      perihal: perihal.trim(),
      tujuan: tujuan.trim(),
      tanggal_dibuat: tanggal,
      file_url: fileUrl ?? null,
    };

    const res = await fetch(isEdit ? `/api/surat/${selected!.id}` : "/api/surat", {
      method: isEdit ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      const msg =
        j?.error?.fieldErrors
          ? Object.entries(j.error.fieldErrors)
              .map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`)
              .join("\n")
          : j?.error || "Gagal menyimpan";
      alert(msg);
      return;
    }

    onSaved();
    if (!isEdit) {
      // reset saat create sukses
      setNoSurat("");
      setPerihal("");
      setTujuan("");
      setTanggal("");
      setFileUrl(null);
    } else {
      onClear();
    }
  }

  function handleNew() {
    onClear();
    setNoSurat("");
    setPerihal("");
    setTujuan("");
    setTanggal("");
    setFileUrl(null);
  }

  return (
    <Card className="bg-white shadow-sm border-slate-200/70 rounded-2xl h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">
          {isEdit ? "Edit surat" : "Buat surat baru"}
        </CardTitle>
        <Button variant="outline" size="sm" onClick={handleNew}>
          Buat baru
        </Button>
      </CardHeader>

      <CardContent>
        <form id="surat-form" onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="no_surat">No Surat</Label>
              <Input
                id="no_surat"
                value={noSurat}
                onChange={(e) => setNoSurat(e.target.value)}
                minLength={3}
                required
                placeholder="001/SM/2025"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="perihal">Perihal</Label>
              <Textarea
                id="perihal"
                value={perihal}
                onChange={(e) => setPerihal(e.target.value)}
                rows={3}
                placeholder="Perihal surat…"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="tujuan">Tujuan</Label>
              <Input
                id="tujuan"
                value={tujuan}
                onChange={(e) => setTujuan(e.target.value)}
                placeholder="Penerima / tujuan surat"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="tanggal">Tanggal</Label>
              <Input
                id="tanggal"
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label>File (opsional)</Label>
              <div className="flex items-center gap-2">
                <UploadButton
                  endpoint="suratFile"
                  onClientUploadComplete={(res) => {
                    const url = res?.[0]?.url;
                    if (url) setFileUrl(url);
                  }}
                  onUploadError={(e) => alert(e.message)}
                />
                {fileUrl ? (
                  <a
                    className="text-sm underline text-sky-600"
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Lihat file
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">Belum ada file</span>
                )}
              </div>
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex items-center gap-2">
        <Button type="submit" form="surat-form" disabled={loading}>
          {loading ? "Menyimpan…" : isEdit ? "Simpan perubahan" : "Simpan"}
        </Button>
        {isEdit && (
          <Button type="button" variant="outline" onClick={handleNew}>
            Batal edit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
