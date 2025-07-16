"use client";
import { useEffect, useState } from "react";
import { getAllFeature } from "@/services/feature";
import { getAllCategory } from "@/services/category";
import { ICategory, IListingFor } from "@/types";

export const useRentCategories = () => {
  const [rentCategories, setRentCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRentCategories = async () => {
      try {
        const { data: features } = await getAllFeature();
        const rentFeature = features.find(
          (feature: IListingFor) => feature.featureName === "Rent"
        );

        if (rentFeature?._id) {
          const { data: categories } = await getAllCategory(rentFeature._id);
          setRentCategories(categories || []);
        }
      } catch (error) {
        console.error("Failed to fetch rent categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentCategories();
  }, []);

  return { rentCategories, loading };
};
