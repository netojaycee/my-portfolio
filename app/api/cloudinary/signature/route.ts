import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = generateSignature(timestamp);

  return NextResponse.json({
    signature,
    timestamp,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
}

function generateSignature(timestamp: number): string {
  // Use Cloudinary's v2 signature approach
  const crypto = require("crypto");
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";
  const toSign = `timestamp=${timestamp}&upload_preset=${uploadPreset}${process.env.CLOUDINARY_API_SECRET}`;
  return crypto.createHash("sha256").update(toSign).digest("hex");
}
