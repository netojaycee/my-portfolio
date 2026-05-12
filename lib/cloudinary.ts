export const getCloudinaryUrl = (publicId: string, options?: string) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return publicId;
  
  if (publicId.startsWith("http")) return publicId;
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${options ? options + "/" : ""}${publicId}`;
};

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
