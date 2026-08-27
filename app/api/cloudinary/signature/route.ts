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
  // Cloudinary verifies signatures with SHA-1 by default (not SHA-256) unless
  // the account explicitly configures a different signature_algorithm.
  // It also only includes params with a real value in the string it signs —
  // an empty upload_preset must be OMITTED here to match, not sent as "".
  const crypto = require("crypto");
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const params = uploadPreset
    ? `timestamp=${timestamp}&upload_preset=${uploadPreset}`
    : `timestamp=${timestamp}`;
  const toSign = `${params}${process.env.CLOUDINARY_API_SECRET}`;
  return crypto.createHash("sha1").update(toSign).digest("hex");
}
