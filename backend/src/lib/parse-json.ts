import { NextResponse } from "next/server";

export async function parseJson<T = any>(
  req: Request
): Promise<{ data: T; error: null } | { data: null; error: NextResponse }> {
  try {
    const data = await req.json();
    return { data, error: null };
  } catch {
    return {
      data: null,
      error: NextResponse.json(
        { success: false, message: "Invalid or missing JSON body." },
        { status: 400 }
      ),
    };
  }
}