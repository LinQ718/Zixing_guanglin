"use client";

import { ChangeEvent, useState } from "react";
import { GhostButton, Input } from "@/components/admin/AdminUI";
import { uploadImageToR2 } from "@/lib/r2/client-upload";

export function ImageUploadField({
  value,
  onChange,
  onError,
  uploadFolder = "admin",
  label = "圖片",
}: {
  value: string;
  onChange: (next: string) => void;
  onError?: (message: string) => void;
  uploadFolder?: string;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onError?.("請選擇圖片檔案");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onError?.("圖片大小需小於 5MB");
      return;
    }

    try {
      setUploading(true);
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      const uploaded = await uploadImageToR2(file, uploadFolder);
      onChange(uploaded.url);
      setPreviewUrl("");
      URL.revokeObjectURL(localPreview);
    } catch (error) {
      setPreviewUrl("");
      const message = error instanceof Error ? error.message : "上傳失敗，請稍後再試";
      onError?.(message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-2 rounded-xl border border-[rgba(138,109,65,0.18)] bg-[rgba(255,255,255,0.72)] p-3">
      <p className="text-xs tracking-[0.08em] text-[rgba(90,70,35,0.6)]">{label}</p>
      <Input
        placeholder="圖片網址（支援 https:// 或 /path）"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="flex items-center gap-2">
        <label className={`cursor-pointer rounded-lg border border-[rgba(138,109,65,0.35)] bg-[rgba(250,247,242,0.8)] px-3 py-2 text-sm tracking-[0.06em] text-[rgba(60,42,18,0.82)] hover:bg-[rgba(138,109,65,0.08)] ${uploading ? "pointer-events-none opacity-60" : ""}`}>
          {uploading ? "上傳中..." : "上傳圖片"}
          <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
        </label>
        <GhostButton
          type="button"
          onClick={() => onChange("")}
          className="px-3 py-2"
        >
          清除圖片
        </GhostButton>
      </div>
      {previewUrl || value ? (
        <div className="relative h-28 overflow-hidden rounded-lg border border-[rgba(138,109,65,0.2)] bg-[rgba(248,244,236,0.75)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl || value} alt="preview" className="h-full w-full object-cover" />
        </div>
      ) : null}
    </div>
  );
}
