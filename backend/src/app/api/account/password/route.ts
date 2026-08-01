import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/parse-json";

export const PATCH = auth(async function PATCH(req) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: body, error } = await parseJson(req);
  if (error) return error;

  const { currentPassword, newPassword } = body;

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { success: false, message: "currentPassword and newPassword are required." },
      { status: 400 }
    );
  }
  if (typeof newPassword !== "string" || newPassword.length < 8) {
    return NextResponse.json(
      { success: false, message: "New password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const userId = req.auth.user.id;

  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: { passwordHash: true },
  });
  if (!user || !user.passwordHash) {
    return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
  }

  const validCurrent = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!validCurrent) {
    return NextResponse.json({ success: false, message: "Current password is incorrect." }, { status: 401 });
  }

  const newHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash: newHash } });

  return NextResponse.json({ success: true, message: "Password updated." });
});