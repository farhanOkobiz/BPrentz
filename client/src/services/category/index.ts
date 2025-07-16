"use server";
import { apiBaseUrl } from "@/config/config";

export const getAllCategory = async (featureId: string) => {
  const res = await fetch(
    `${apiBaseUrl}/admin/category?feature_id=${featureId}`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.statusText}`);
  }

  return res.json();
};
