"use server";
import { apiBaseUrl } from "@/config/config";

export interface GetAllParkingsParams {
  page?: number;
  status?: string;
  sort?: string;
  category?: string;
  location?: string;
  checkinDate?: string;
  checkoutDate?: string;
  bedroomCount?: number;
  bathCount?: number;
  bedCount?: number;
  guestCount?: number;
  limit?: number;
}

export const getAllParkings = async ({
  page = 1,
  limit = 9,
  status,
  sort,
  category,
  location,
  checkinDate,
  checkoutDate,
  bedroomCount,
  bathCount,
  bedCount,
  guestCount,
}: GetAllParkingsParams = {}) => {

  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (status) params.append("status", status);
  if (sort !== undefined) params.append("sort", sort.toString());
  if (category) params.append("category", category);
  if (location) params.append("location", location);
  if (checkinDate) params.append("checkinDate", checkinDate);
  if (checkoutDate) params.append("checkoutDate", checkoutDate);
  if (bedroomCount !== undefined)
    params.append("bedroomCount", bedroomCount.toString());
  if (bathCount !== undefined) params.append("bathCount", bathCount.toString());
  if (bedCount !== undefined) params.append("bedCount", bedCount.toString());
  if (guestCount !== undefined)
    params.append("guestCount", guestCount.toString());

  const url = `${apiBaseUrl}/parking-search?${params.toString()}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch parkings");

  const json = await res.json();
  return {
    data: json.data,
    total: json.total,
    totalPages: json.totalPages,
  };
};

// export const getAllParkings = async ({
//   page = 1,
//   status,
//   sort,
//   category,
//   location,
//   checkinDate,
//   checkoutDate,
//   bedroomCount,
//   bathCount,
//   bedCount,
//   guestCount,
// }: GetAllParkingsParams = {}) => {
//   const params = new URLSearchParams();
//   params.append("page", page.toString());
//   if (status) params.append("status", status);
//   if (sort !== undefined) params.append("sort", sort.toString());
//   if (category) params.append("category", category);
//   if (location) params.append("location", location);
//   if (checkinDate) params.append("checkinDate", checkinDate);
//   if (checkoutDate) params.append("checkoutDate", checkoutDate);
//   if (bedroomCount !== undefined)
//     params.append("bedroomCount", bedroomCount.toString());
//   if (bathCount !== undefined) params.append("bathCount", bathCount.toString());
//   if (bedCount !== undefined) params.append("bedCount", bedCount.toString());
//   if (guestCount !== undefined)
//     params.append("guestCount", guestCount.toString());

//   const url = `${apiBaseUrl}/parking-search?${params.toString()}`;

//   const res = await fetch(url);
//   if (!res.ok) throw new Error("Failed to fetch parkings");

//   const json = await res.json();
//   console.log("data ==== ", json);
//   return {
//     data: json.data,
//     totalParkings: json.totalParkings,
//     totalPages: json.totalPages,
//   };
// };

export const getAllHostParkings = async (
  accessToken?: string,
  page: number = 1,
  limit?: number
) => {
  const url = new URL(`${apiBaseUrl}/host/parking`);
  url.searchParams.append("page", String(page));
  if (limit !== undefined) {
    url.searchParams.append("limit", String(limit));
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch host parkings");
  }

  return res.json();
};

export const getGuestParkings = async (
  accessToken?: string,
  page: number = 1,
  limit: number = 10
) => {
  const res = await fetch(
    `${apiBaseUrl}/guest/parking/bookings?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch guest parkings");
  }

  return res.json();
};

export const getSingleParkingBySlug = async (slug: string) => {
  const res = await fetch(`${apiBaseUrl}/parking/${slug}`);

  if (!res.ok) {
    throw new Error("Failed to fetch parking");
  }

  return res.json();
};
export const getBlockedDates = async (parkingId: string) => {
  const res = await fetch(
    `${apiBaseUrl}/host/parking/date-block-list?parkingId=${parkingId}`
    // {
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //     "Content-Type": "application/json",
    //   },
    // }
  );
  return res.json();
};
export const getParkingBookingsCalenderDateBlocked = async (
  parkingId: string,
  token?: string
) => {
  const res = await fetch(`${apiBaseUrl}/parking/${parkingId}/bookings`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res.json();
};
export const postToggleBlockDate = async ({
  parkingId,
  date,
  accessToken,
}: {
  parkingId: string;
  date: string;
  accessToken: string;
}) => {
  const res = await fetch(`${apiBaseUrl}/host/parking/date-block-list`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ parkingId, date }),
  });

  if (!res.ok) throw new Error("Failed to toggle block date");
  return res.json();
};

export interface GetParkingBookingsParams {
  status?: string;
  accessToken?: string;
  page?: number;
  limit?: number;
}

export const getParkingBookings = async ({
  status,
  accessToken,
  page,
  limit,
}: GetParkingBookingsParams = {}) => {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (page) params.append("page", String(page));
  if (limit) params.append("limit", String(limit));

  const url = `${apiBaseUrl}/booking/parking?${params.toString()}`;

  const res = await fetch(url, {
    headers: {
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch parking bookings");
  return res.json();
};

export const getHostParkingEarnings = async ({
  formMonth,
  toMonth,
  formYear,
  toYear,
  accessToken,
}: {
  formMonth: string;
  toMonth: string;
  formYear: string;
  toYear: string;
  accessToken: string;
}) => {
  const params = new URLSearchParams();
  params.append("formMonth", formMonth);
  params.append("toMonth", toMonth);
  params.append("formYear", formYear);
  params.append("toYear", toYear);

  const url = `${apiBaseUrl}/host/parking/bookings/earnings?${params.toString()}`;
  console.log("url ----------------------------------", url);
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch host parking earnings");
  }
  return res.json();
};

export const createBooking = async ({
  parking,
  checkinDate,
  checkoutDate,
  guestCount,
  accessToken,
}: {
  parking: string;
  checkinDate: string;
  checkoutDate: string;
  guestCount: number | string;
  accessToken: string;
}) => {
  const res = await fetch(`${apiBaseUrl}/booking/parking`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parking,
      checkinDate,
      checkoutDate,
      guestCount,
    }),
  });
  console.log("booking create res === ", res)
  if (!res.ok) throw new Error("Failed to create booking");
  return res.json();
};

export const getParkingBookingsByParkingId = async (parkingId: string) => {
  const res = await fetch(`${apiBaseUrl}/rent/${parkingId}/bookings`);
  console.log("res", res);
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json();
};
