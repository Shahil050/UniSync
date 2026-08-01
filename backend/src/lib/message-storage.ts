import { promises as fs } from "fs";
import path from "path";

const STORAGE_DIR = process.env.MESSAGE_STORAGE_DIR || path.join(process.cwd(), "storage", "messages");

export async function saveMessageFile(messageId: string, file: File): Promise<string> {
  await fs.mkdir(STORAGE_DIR, { recursive: true });
  const ext = path.extname(file.name) || "";
  const filePath = path.join(STORAGE_DIR, `${messageId}${ext}`);
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, bytes);
  return filePath;
}

export async function readMessageFile(filePath: string): Promise<Buffer> {
  return fs.readFile(filePath);
}

export async function deleteMessageFile(filePath: string | null): Promise<void> {
  if (!filePath) return;
  try {
    await fs.unlink(filePath);
  } catch {
    // File already gone or never existed — nothing further to do.
  }
}