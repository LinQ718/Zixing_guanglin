type UploadResponse = {
  ok: boolean;
  mode?: "r2" | "local";
  message?: string;
  objectKey?: string;
  publicUrl?: string;
};

export async function uploadImageToR2(file: File, folder: string) {
  const formData = new FormData();
  formData.set("file", file);
  formData.set("folder", folder);

  const uploadRes = await fetch("/api/admin/upload/file", {
    method: "POST",
    body: formData,
  });

  const uploadData = (await uploadRes.json()) as UploadResponse;
  if (!uploadRes.ok || !uploadData.ok || !uploadData.publicUrl) {
    throw new Error(uploadData.message || "圖片上傳失敗");
  }

  return {
    url: uploadData.publicUrl,
    objectKey: uploadData.objectKey || "",
  };
}
