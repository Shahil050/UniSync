import { promises as fs } from "fs";
import path from "path";

const STORAGE_DIR = process.env.PAPER_STORAGE_DIR || path.join(process.cwd(), "storage", "papers");

export async function savePaperFile(paperId: string, file: File): Promise<string> {
  await fs.mkdir(STORAGE_DIR, { recursive: true });
  const filePath = path.join(STORAGE_DIR, `${paperId}.pdf`);
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, bytes);
  return filePath;
}

export async function readPaperFile(filePath: string): Promise<Buffer> {
  return fs.readFile(filePath);
}

export async function deletePaperFile(filePath: string | null): Promise<void> {
  if (!filePath) return;
  try {
    await fs.unlink(filePath);
  } catch {
    // File already gone or never existed — nothing further to do.
  }
}