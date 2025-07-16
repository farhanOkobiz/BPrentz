"use server";
import { apiBaseUrl } from "@/config/config";

type GetAllFlatsParams = {
  page?: number;
  status?: string;
  sort?: number;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
};

export const getAllFlats = async ({
  page = 1,
  status,
  sort,
  category,
  location,
  minPrice,
  maxPrice,
}: GetAllFlatsParams = {}) => {

  const params = new URLSearchParams();

  params.append("page", page.toString());
  if (status) params.append("publishStatus", status);
  if (sort !== undefined) params.append("sort", sort.toString());
  if (category) params.append("category", category);
  if (location) params.append("location", location);
  if (minPrice !== undefined) params.append("minPrice", minPrice.toString());
  if (maxPrice !== undefined) params.append("maxPrice", maxPrice.toString());

  const url = `${apiBaseUrl}/flat?${params.toString()}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch flat");
  return res.json();
};

export const getAllHostFlats = async (
  accessToken?: string,
  page: number = 1
) => {
  const res = await fetch(`${apiBaseUrl}/host/flat?page=${page}`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch host flats");
  }
  return res.json();
};

export const getSingleFlatBySlug = async (slug: string) => {
  const res = await fetch(`${apiBaseUrl}/flat/${slug}`);

  if (!res.ok) {
    throw new Error("Failed to fetch flat");
  }

  return res.json();
};

interface Flat {
  flat: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const createFlat = async (flatData: Flat, accessToken: string) => {
  console.log(flatData);

  const res = await fetch(`${apiBaseUrl}/flat/booking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(flatData),
  });

  console.log("--------res----------", res);

  // Optionally handle error
  if (!res.ok) {
    throw new Error("Failed to create flat");
  }

  return res.json();
};
