"use client";

import { useEffect, useState } from "react";
import { useListingContext } from "@/contexts/ListingContext";
import { useListingStepContext } from "@/contexts/ListingStepContext";

import { message, Input } from "antd";
import CategoryServices from "@/services/category/category.services";

export default function VideoUploadPage() {
    const { listingId, featureType } = useListingContext();
    const { setOnNextSubmit } = useListingStepContext();
    const [videoUrl, setVideoUrl] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmit = async () => {
        if (!listingId || !featureType || !videoUrl) {
            messageApi.error("Please enter a video URL.");
            throw new Error("Missing data");
        }
        setLoading(true);
        try {
            const res = await CategoryServices.ProcessUpdateListingVideo(
                featureType,
                listingId,
                videoUrl
            );
            console.log("Video updated:", res);
            messageApi.success("Video link updated successfully!");
        } catch (err) {
            messageApi.error("Failed to update video link.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setOnNextSubmit(handleSubmit);
    }, [videoUrl, listingId, featureType]);

    return (
        <div className="min-h-[calc(80vh-100px)] flex items-center justify-center">
            {contextHolder}
            <div className="w-full max-w-2xl space-y-6 px-4 mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-center text-primary">
                    Add a Video Tour (Optional)
                </h2>
                <p className="text-base md:text-lg text-gray-600 font-normal tracking-wide mb-6 text-center">
                    Share a YouTube video link to give guests a better feel for your place.
                </p>
                <Input
                    value={videoUrl}
                    onChange={e => setVideoUrl(e.target.value)}
                    placeholder="Paste your YouTube video URL here"
                    size="large"
                    disabled={loading}
                />
            </div>
        </div>
    );
}