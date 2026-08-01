import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidUuid } from "@/lib/validate-uuid";
import { readPaperFile } from "@/lib/paper-storage";

export const GET = auth(async function GET(req, { params }) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ success: false, message: "Not authenticated." }, { status: 401 });
  }

  const { id } = await params;
  if (!isValidUuid(id)) {
    return NextResponse.json({ success: false, message: "Invalid paper ID." }, { status: 400 });
  }

  const paper = await prisma.paper.findUnique({ where: { id } });
  if (!paper || !paper.filePath) {
    return NextResponse.json({ success: false, message: "Paper file not found." }, { status: 404 });
  }

  let bytes: Buffer;
  try {
    bytes = await readPaperFile(paper.filePath);
  } catch {
    return NextResponse.json({ success: false, message: "Stored file is missing." }, { status: 404 });
  }

  return new NextResponse(Uint8Array.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${paper.title.replace(/[^\w.-]/g, "_")}.pdf"`,
    },
  });
});