"use client";

import React, { useState } from "react";
import { UploadCloud, Loader2, X, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ImageUploaderProps {
  defaultValue?: string;
}

export default function ImageUploader({ defaultValue = "" }: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState(defaultValue);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError("");

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImageUrl("");
    setError("");
  };

  return (
    <div className="space-y-3">
      {/* Hidden input to pass the URL to the server action */}
      <input type="hidden" name="image" value={imageUrl} required />

      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-lg border border-red-500/20">
          {error}
        </div>
      )}

      {imageUrl ? (
        <div className="relative w-full aspect-video rounded-xl border border-white/10 overflow-hidden bg-[#0F0F12] group">
          <img src={imageUrl} alt="Product preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              type="button" 
              onClick={removeImage}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" /> Remove Image
            </button>
          </div>
          <div className="absolute top-2 right-2 p-1.5 bg-green-500 text-white rounded-full">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      ) : (
        <label className="relative w-full h-40 rounded-xl border-2 border-dashed border-white/20 hover:border-[#D4A373] bg-[#0F0F12] hover:bg-white/5 transition-colors cursor-pointer flex flex-col items-center justify-center overflow-hidden group">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleUpload} 
            disabled={isUploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center text-[#D4A373]">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <span className="text-sm font-medium">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-400 group-hover:text-[#D4A373] transition-colors">
              <UploadCloud className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium mb-1">Click or drag image to upload</span>
              <span className="text-xs opacity-70">PNG, JPG, WEBP up to 5MB</span>
            </div>
          )}
        </label>
      )}
    </div>
  );
}
