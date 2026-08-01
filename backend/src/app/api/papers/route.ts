import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { submitPaperPdf, AiServiceError } from "@/lib/ai-service";
import { savePaperFile } from "@/lib/paper-storage";
import { getSystemSettings } from "@/lib/settings";

export const POST = auth(async function POST(req) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ success: false, message: "Not authenticated." }, { status: 401 });
  }
  if (req.auth.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Admin access required." }, { status: 403 });
  }
  const userId = req.auth.user.id;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { success: false, message: "Expected multipart/form-data." },
      { status: 400 }
    );
  }

  const title = form.get("title");
  const authors = form.get("authors");
  const url = form.get("url");
  const pdf = form.get("pdf");

  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ success: false, message: "Title is required." }, { status: 400 });
  }
  if (!(pdf instanceof File) || pdf.size === 0) {
    return NextResponse.json({ success: false, message: "A PDF file is required." }, { status: 400 });
  }
  if (pdf.type && pdf.type !== "application/pdf") {
    return NextResponse.json({ success: false, message: "File must be a PDF." }, { status: 400 });
  }
  const { maxUploadSizeMB } = await getSystemSettings();
  const maxPdfBytes = maxUploadSizeMB * 1024 * 1024;

  if (pdf.size > maxPdfBytes) {
    return NextResponse.json({ success: false, message: `PDF must be under ${maxUploadSizeMB}MB.` }, { status: 400 });
  }
  if (url != null && typeof url !== "string") {
    return NextResponse.json({ success: false, message: "Invalid url." }, { status: 400 });
  }
  if (authors != null && typeof authors !== "string") {
    return NextResponse.json({ success: false, message: "Invalid authors." }, { status: 400 });
  }

  // Store the paper's metadata first — the row's id is what the AI service will key its embedding to.
  const paper = await prisma.paper.create({
    data: {
      title: title.trim(),
      authors: authors?.trim() || null,
      url: url?.trim() || null,
      addedById: userId,
    },
  });

  const filePath = await savePaperFile(paper.id, pdf);
  await prisma.paper.update({ where: { id: paper.id }, data: { filePath } });

  try {
    await submitPaperPdf(paper.id, pdf);
  } catch (err) {
    if (err instanceof AiServiceError) {
      // The paper is safely stored either way; only indexing for recommendations failed.
      return NextResponse.json(
        {
          success: true,
          paper: { ...paper, filePath },
          indexed: false,
          message: "Paper saved, but it could not be indexed for recommendations right now.",
        },
        { status: 201 }
      );
    }
    throw err;
  }

  return NextResponse.json({ success: true, paper: { ...paper, filePath }, indexed: true }, { status: 201 });
});