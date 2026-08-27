export const getCloudinaryUrl = (publicId: string, options?: string) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return publicId;
  
  if (publicId.startsWith("http")) return publicId;
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${options ? options + "/" : ""}${publicId}`;
};

export async function uploadToCloudinary(file: File): Promise<string> {
  const sigRes = await fetch("/api/cloudinary/signature");
  if (!sigRes.ok) throw new Error("Failed to get upload signature");
  const { signature, timestamp, cloudName, apiKey } = await sigRes.json();

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  // Only send upload_preset if one is actually configured — an empty string
  // sent here would be excluded from Cloudinary's own signature check,
  // producing a mismatch against a signature that included it.
  if (uploadPreset) formData.append("upload_preset", uploadPreset);

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.json().catch(() => ({}));
    throw new Error(err?.error?.message || "Cloudinary upload failed");
  }

  const data = await uploadRes.json();
  return data.secure_url as string;
}

export const openCloudinaryWidget = (
  callback: (url: string) => void,
  options: any = {}
) => {
  if (typeof window === "undefined" || !(window as any).cloudinary) {
    console.error("Cloudinary widget not loaded");
    return;
  }

  const widget = (window as any).cloudinary.createUploadWidget(
    {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      ...options,
    },
    (error: any, result: any) => {
      if (!error && result && result.event === "success") {
        callback(result.info.secure_url);
      }
    }
  );

  widget.open();
};
