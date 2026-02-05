import { NextResponse } from "next/server";
import { getIO } from "@/lib/socket";

export async function GET() {
  getIO();
  return NextResponse.json({ ok: true });
}
