"use client";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

type Props = {
  url: string;
  trigger?: React.ReactNode;
};

export default function SuratFileSheet({ url, trigger }: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger ?? <Button variant="link" className="underline p-0">Lihat</Button>}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Preview File</SheetTitle>
        </SheetHeader>

        <div className="mt-4 h-[80vh] overflow-hidden rounded-md border">
          {/* Preview PDF / Image via iframe */}
          <iframe
            src={url}
            className="w-full h-full"
            style={{ border: "none" }}
          />
        </div>

        <div className="mt-2 flex justify-end">
          <SheetClose asChild>
            <Button variant="outline">Tutup</Button>
          </SheetClose>
          <Button asChild className="ml-2">
            <a href={url} target="_blank" rel="noopener noreferrer">Buka di Tab Baru</a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
