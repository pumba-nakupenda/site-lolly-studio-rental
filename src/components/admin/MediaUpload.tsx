"use client";

import { useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface MediaUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  accept?: string;
  label?: string;
  aspectRatio?: string;
}

export default function MediaUpload({
  value,
  onChange,
  folder = "portfolio",
  accept = "image/*,video/*",
  label = "Image",
  aspectRatio = "aspect-video",
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const upload = useCallback(
    async (file: File) => {
      setUploading(true);
      setProgress(0);

      const ext = file.name.split(".").pop();
      const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error } = await supabase.storage.from("media").upload(name, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (error) {
        alert("Erreur upload : " + error.message);
        setUploading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("media").getPublicUrl(name);

      onChange(publicUrl);
      setProgress(100);
      setUploading(false);
    },
    [folder, onChange, supabase]
  );

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    upload(files[0]);
  }

  const isVideo =
    value &&
    (value.includes(".mp4") ||
      value.includes(".webm") ||
      value.includes(".mov"));

  return (
    <div>
      <label className="text-[0.6rem] uppercase tracking-widest text-secondary font-bold block mb-1">
        {label}
      </label>

      {/* Preview */}
      {value ? (
        <div className="relative mb-2 group">
          {isVideo ? (
            <video
              src={value}
              className={`w-full object-cover ${aspectRatio} bg-on-surface`}
              controls
            />
          ) : (
            <img
              src={value}
              alt="Aperçu média"
              className={`w-full object-cover ${aspectRatio}`}
            />
          )}
          <div className="absolute inset-0 bg-on-surface/0 group-hover:bg-on-surface/60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => onChange("")}
              className="bg-error text-white px-4 py-2 text-xs font-bold uppercase"
            >
              Supprimer
            </button>
          </div>
        </div>
      ) : null}

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed cursor-pointer transition-colors p-4 text-center ${
          dragOver
            ? "border-primary-fixed bg-primary-fixed/10"
            : uploading
            ? "border-outline-variant/30 bg-surface-container"
            : "border-outline-variant/30 hover:border-primary-fixed/50"
        }`}
      >
        {uploading ? (
          <div className="space-y-2">
            <span className="material-symbols-outlined text-2xl text-primary-fixed animate-pulse">
              cloud_upload
            </span>
            <p className="text-xs text-secondary">Upload en cours...</p>
            <div className="w-full bg-surface-container h-1">
              <div
                className="bg-primary-fixed h-1 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <span className="material-symbols-outlined text-2xl text-secondary">
              {value ? "swap_horiz" : "cloud_upload"}
            </span>
            <p className="text-xs text-secondary">
              {value
                ? "Glissez pour remplacer"
                : "Glissez un fichier ou cliquez"}
            </p>
          </div>
        )}
      </div>

      {/* URL manuelle */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ou collez une URL directe"
        className="w-full border border-outline-variant/30 py-2 px-3 text-xs bg-transparent mt-2 text-secondary"
      />

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
