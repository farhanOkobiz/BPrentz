"use server";

import { apiBaseUrl } from "@/config/config";


export const getAboutTextAndVideo = async () => {
  const res = await fetch(`${apiBaseUrl}/admin/about_us`);

  return res.json();
};
