"use server";
import { apiBaseUrl } from "@/config/config";

type GetAllLandsParams = {
  page?: number;
  status?: string;
  sort?: number;
  category?: string;

  location?: string;
  minPrice?: number;
  maxPrice?: number;
};

export const getAllLands = async ({
  page = 1,
  status,
  sort,
  category,
  location,
  minPrice,
  maxPrice,
}: GetAllLandsParams = {}) => {
  const params = new URLSearchParams();

  params.append("page", page.toString());
  if (status) params.append("status", status);
  if (sort !== undefined) params.append("sort", sort.toString());
  if (category) params.append("category", category);
  if (location) params.append("location", location);
  if (minPrice !== undefined) params.append("minPrice", minPrice.toString());
  if (maxPrice !== undefined) params.append("maxPrice", maxPrice.toString());

  const url = `${apiBaseUrl}/land?${params.toString()}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch land");
  return res.json();
};

export const getAllHostLands = async (
  accessToken?: string,
  page: number = 1
) => {
  const res = await fetch(`${apiBaseUrl}/host/land?page=${page}`, {
      cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch host lands");
  }
  return res.json();
};

export const getSingleLandBySlug = async (slug: string) => {
  const res = await fetch(`${apiBaseUrl}/land/${slug}`);

  if (!res.ok) {
    throw new Error("Failed to fetch land");
  }

  return res.json();
};

interface land {
  land: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const createLand = async (landData: land, accessToken: string) => {
  console.log(landData);

  const res = await fetch(`${apiBaseUrl}/land/booking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(landData),
  });

  console.log("--------land----------", res);

  // Optionally handle error
  if (!res.ok) {
    throw new Error("Failed to create land");
  }

  return res.json();
};
