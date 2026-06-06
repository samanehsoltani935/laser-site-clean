import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "public/uploads";

export async function saveUploadedFile(
  file: File,
  subfolder = "general"
): Promise<{ fileName: string; fileUrl: string; fileType: string }> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = path.extname(file.name) || "";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const dir = path.join(process.cwd(), UPLOAD_DIR, subfolder);

  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, safeName), buffer);

  return {
    fileName: file.name,
    fileUrl: `/uploads/${subfolder}/${safeName}`,
    fileType: file.type || "application/octet-stream",
  };
}
