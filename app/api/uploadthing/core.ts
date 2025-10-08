import { createUploadthing, type FileRouter } from "uploadthing/next";
const f = createUploadthing();
export const ourFileRouter = {
  suratFile: f({ blob: { maxFileSize: "16MB" } })
    .onUploadComplete(async ({ file }) => ({ url: file.url })),
} satisfies FileRouter;
export type OurFileRouter = typeof ourFileRouter;