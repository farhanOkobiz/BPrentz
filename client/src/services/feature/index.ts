"use server";
import { apiBaseUrl } from "@/config/config";

export const getAllFeature = async () => {
  const res = await fetch(`${apiBaseUrl}/admin/feature`);
  console.log(res);
  return res.json();
};
