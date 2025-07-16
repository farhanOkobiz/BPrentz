"use client";

import React, { useState, useRef } from "react";
import { useListingContext } from "@/contexts/ListingContext";
import ListingImageApis from "@/services/imageListing/imageListing.service";
import { message, Typography } from "antd";
import { apiBaseUrl } from "@/config/config";
import Image from "next/image";

const { Title, Text } = Typography;

const ImageUploader: React.FC = () => {
  const { listingId, featureType } = useListingContext();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null); // single image preview
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({}); // track uploading state per file
  const [deletingMap, setDeletingMap] = useState<{ [key: string]: boolean }>({}); // track deleting state per image
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !listingId || !featureType) return;
    const file = files[0];
    if (!file) return;
    // Show instant preview
    const tempUrl = URL.createObjectURL(file);
    setUploading((prev) => ({ ...prev, [tempUrl]: true }));
    setPreview(tempUrl);
    const formData = new FormData();
    formData.append("images", file);
    try {
      setLoading(true);
      const res: any = await ListingImageApis.uploadImage(
        featureType,
        listingId,
        formData
      );
      messageApi.success("Image Upload Successfully");
      const uploadedImageUrl = res?.data?.data?.images?.slice(-1)[0];
      setPreview(uploadedImageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      messageApi.error("Image Upload Failed");
      setPreview(null);
    } finally {
      setUploading({});
      setLoading(false);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = async (imgUrl: string) => {
    if (!listingId || !featureType || !imgUrl) return;
    setDeletingMap((prev) => ({ ...prev, [imgUrl]: true }));
    try {
      setLoading(true);
      await ListingImageApis.deleteImage(featureType, listingId, {
        imageUrl: imgUrl,
        images: [],
      });
      messageApi.success("Image Deleted Successfully");
      setPreview(null);
    } catch (error) {
      console.error("Error deleting image:", error);
      messageApi.error("Image Deleted Failed");
    } finally {
      setDeletingMap({});
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {contextHolder}
      <div>
        <Title level={3}>Share some photos of your place</Title>
        <Text type="secondary">You can add more later.</Text>
      </div>

      {/* Uploaded Image Preview */}
      {preview && (
        <div className="mb-4 flex justify-center">
          <div className="relative group border rounded-xl overflow-hidden">
            <Image
              src={preview.startsWith("/public") ? apiBaseUrl + preview : preview}
              alt="Preview"
              width={240}
              height={160}
              className="object-cover w-full h-[160px]"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(preview);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-sm hover:bg-red-600 opacity-80 group-hover:opacity-100 transition"
              disabled={!!deletingMap[preview]}
              aria-label="Delete image"
            >
              ✕
            </button>
            {uploading[preview] && (
              <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-20 rounded-xl">
                <span className="loader border-4 border-primary border-t-transparent rounded-full w-8 h-8 animate-spin"></span>
                <span className="ml-3 text-primary font-medium">Uploading...</span>
              </div>
            )}
            {deletingMap[preview] && (
              <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-20 rounded-xl">
                <span className="loader border-4 border-primary border-t-transparent rounded-full w-8 h-8 animate-spin"></span>
                <span className="ml-3 text-primary font-medium">Deleting...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload area or Add button */}
      {!preview && (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition cursor-pointer relative flex flex-col items-center justify-center gap-2 ${loading
            ? "opacity-50 pointer-events-none"
            : "hover:bg-gray-50 border-gray-300"
            }`}
          onClick={() => !loading && fileInputRef.current?.click()}
        >
          {Object.values(uploading).some(Boolean) && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-xl">
              <span className="loader border-4 border-primary border-t-transparent rounded-full w-10 h-10 animate-spin"></span>
              <span className="ml-3 text-primary font-medium">Uploading...</span>
            </div>
          )}
          <svg className="w-10 h-10 mx-auto text-primary mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          <p className="text-gray-600 mb-1 font-medium text-lg">
            Click to upload or drag & drop image
          </p>
          <div className="text-sm text-gray-400 mb-1">(Supported: .jpg, .png)</div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
        </div>
      )}
      <style>{`
        .loader {
          border-width: 4px;
          border-style: solid;
          border-color: #3b82f6 #f3f4f6 #f3f4f6 #f3f4f6;
        }
      `}</style>
    </div>
  );
};

export default ImageUploader;
