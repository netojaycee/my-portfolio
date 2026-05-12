"use client";

import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CloudinaryUploadProps {
  onSuccess: (url: string) => void;
  value?: string;
  className?: string;
}

export function CloudinaryUpload({ onSuccess, value, className }: CloudinaryUploadProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUpload = async () => {
    try {
      // 1. Get signature from our API
      const res = await fetch("/api/cloudinary/signature");
      const { signature, timestamp, cloudName, apiKey } = await res.json();

      // 2. Open widget
      const widget = (window as any).cloudinary.createUploadWidget(
        {
          cloudName,
          apiKey,
          uploadSignature: signature,
          timestamp,
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
          cropping: true,
          multiple: false,
          clientAllowedFormats: ["webp", "png", "jpg", "jpeg"],
        },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            onSuccess(result.info.secure_url);
          }
        }
      );

      widget.open();
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  if (!mounted) return null;

  return (
    <div className={cn("space-y-4", className)}>
      {value ? (
        <div className="relative aspect-video w-full max-w-sm rounded-xl overflow-hidden border border-border group">
          <Image src={value} alt="Upload" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={handleUpload}
              className="px-4 py-2 bg-white text-black text-sm font-bold rounded-lg"
            >
              Change Image
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleUpload}
          className="w-full max-w-sm aspect-video rounded-xl border-2 border-dashed border-border hover:border-accent hover:bg-surface transition-all flex flex-col items-center justify-center gap-2 text-muted"
        >
          <Upload className="w-8 h-8" />
          <span className="text-sm font-medium">Click to upload image</span>
        </button>
      )}
    </div>
  );
}
