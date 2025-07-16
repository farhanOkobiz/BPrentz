"use client";

import { useListingContext } from "@/contexts/ListingContext";
import { useListingStepContext } from "@/contexts/ListingStepContext";
import { useEffect, useState } from "react";
import CategoryServices from "@/services/category/category.services";
import { Home, Building2, Landmark, Warehouse } from "lucide-react";
import { Skeleton, message } from "antd";
import { Category } from "@/app/(HostLayout)/components/types/category";

export default function CategoryPage() {
  const { featureId, listingId, featureType } = useListingContext();
  const { setOnNextSubmit } = useListingStepContext();
  const [messageApi, contextHolder] = message.useMessage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!featureId) return;

      setLoading(true);
      try {
        const res = await CategoryServices.fetchCategories(featureId);
        setCategories(res?.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [featureId]);

  const handleSubmit = async () => {
    if (!selected) {
      setError("Please select a category before continuing.");
      return;
    }

    setError("");

    if (!listingId || !featureType) return;

    try {
      const categoryPatchRes = await CategoryServices.setListingCategory({
        featureType,
        listingId,
        categoryId: selected,
      });
      messageApi.success(`${featureType} category Selected  Successfully`);
      console.log("categoryPatchRes ==", categoryPatchRes);
    } catch (err) {
      console.error("Error setting listing category:", err);
      messageApi.error("Failed to Select Category");
      throw err;
    }
  };

  useEffect(() => {
    setOnNextSubmit(handleSubmit);
  }, [selected, listingId, featureType]);

  const getCategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "apartment":
      case "flat":
        return <Building2 className="w-8 h-8 text-primary" />;
      case "house":
        return <Home className="w-8 h-8 text-primary" />;
      case "land":
        return <Landmark className="w-8 h-8 text-primary" />;
      case "warehouse":
        return <Warehouse className="w-8 h-8 text-primary" />;
      default:
        return <Home className="w-8 h-8 text-primary" />;
    }
  };

  return (
    <div className="min-h-[calc(80vh-100px)] flex items-center justify-center">
      {contextHolder}
      <div className="w-full max-w-6xl space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-center text-primary">
          Choose the Best Category
        </h2>
        <p className="text-base md:text-lg text-gray-600 font-normal tracking-wide mb-6 text-center">
          Select the category that most accurately describes your property. <br className="hidden md:block" />
          <span className="text-gray-500 font-medium">
            You can always update this later if needed.
          </span>
        </p>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton.Button
                key={idx}
                active
                block
                style={{ height: 150, borderRadius: 16 }}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category._id}
                onClick={() => setSelected(category._id)}
                className={`relative cursor-pointer border rounded-2xl p-4 flex flex-col items-center gap-3 transition-all duration-200 ${selected === category._id
                  ? "border-primary ring-0 ring-primary"
                  : "border-gray-200"
                  }`}
              >
                <div className="absolute top-2 right-2 w-5 h-5 border rounded border-gray-300 flex items-center justify-center bg-white">
                  {selected === category._id && (
                    <span className="text-primary text-xs font-bold leading-none">
                      ✔
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-center space-y-2">
                  {getCategoryIcon(category.categoryName)}
                  <span className="font-medium">{category.categoryName}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
