// "use client";

// import { Pagination, Skeleton } from "antd";
// import { useEffect, useState } from "react";

// import TabContent from "./TabContent";
// import TabMenu from "./TabMenu";
// import { getRentBookings } from "@/services/rents";
// import type { TabKey } from "./types";

// const statusMap: Record<TabKey, string | undefined> = {
//   all: "",
//   pending: "pending",
//   checking: "checked_in",
//   checkout: "checked_out",
//   cancancelled: "cancelled",
//   rejected: "rejected",
// };

// const TabContainer = () => {
//   const [activeTab, setActiveTab] = useState<TabKey>("all");
//   const [data, setData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [total, setTotal] = useState(0);

//   const accessToken =
//     typeof window !== "undefined"
//       ? localStorage.getItem("accessToken") || undefined
//       : undefined;


//   useEffect(() => {
//      if (!accessToken) return;
//     const controller = new AbortController();
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const status = statusMap[activeTab];
//         const result = await getRentBookings({
//           status,
//           accessToken,
//           page,
//           limit,
//         });
//         setData(result.data || []);
//         setTotal(result.totalRents || 0);
//       } catch (err: any) {
//         setError(err.message || "Unknown error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();

//     return () => {
//       controller.abort();
//     };
//   }, [activeTab, accessToken, page, limit]);

//   useEffect(() => {
//      if (!accessToken) return;
//     setPage(1);
//   }, [activeTab, accessToken]);

//   return (
//     <div className="bg-white rounded-lg shadow-md p-4">
//       <h2 className="text-lg sm:text-xl font-medium md:mb-4">
//         Guest reservations for your properties
//       </h2>

//       <TabMenu activeTab={activeTab} setActiveTab={setActiveTab} />

//       {loading && (
//         <div className="space-y-4">
//           <Skeleton active paragraph={{ rows: 2 }} />
//           <Skeleton active paragraph={{ rows: 4 }} />
//         </div>
//       )}
//       {error && <p className="text-red-500">{error}</p>}

//       {!loading && !error && (
//         <>
//           <TabContent activeTab={activeTab} data={data} />
//           <div className="flex justify-end mt-4">
//             <Pagination
//               current={page}
//               pageSize={limit}
//               total={total}
//               onChange={(p, l) => {
//                 setPage(p);
//                 setLimit(l);
//               }}
//               showSizeChanger
//               pageSizeOptions={["5", "10", "20", "50"]}
//             />
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default TabContainer;
"use client";

import { Pagination, Skeleton } from "antd";
import { useEffect, useState } from "react";

import TabContent from "./TabContent";
import TabMenu from "./TabMenu";
import { getRentBookings } from "@/services/rents";
import type { TabKey } from "./types";

const statusMap: Record<TabKey, string | undefined> = {
  all: "",
  pending: "pending",
  checking: "checked_in",
  checkout: "checked_out",
  cancancelled: "cancelled",
  rejected: "rejected",
};

const TabContainer = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  // এখানে পরিবর্তন
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    // শুধু client-side-এ accessToken সেট হবে
    if (typeof window !== "undefined") {
      setAccessToken(localStorage.getItem("accessToken") || undefined);
    }
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const status = statusMap[activeTab];
        const result = await getRentBookings({
          status,
          accessToken,
          page,
          limit,
        });
        setData(result.data || []);
        setTotal(result.totalRents || 0);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [activeTab, accessToken, page, limit]);

  useEffect(() => {
    if (!accessToken) return;
    setPage(1);
  }, [activeTab, accessToken]);

  // accessToken না পাওয়া পর্যন্ত skeleton দেখান
  if (accessToken === undefined) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg sm:text-xl font-medium md:mb-4">
        Guest reservations for your properties
      </h2>

      <TabMenu activeTab={activeTab} setActiveTab={setActiveTab} />

      {loading && (
        <div className="space-y-4">
          <Skeleton active paragraph={{ rows: 2 }} />
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <TabContent activeTab={activeTab} data={data} />
          <div className="flex justify-end mt-4">
            <Pagination
              current={page}
              pageSize={limit}
              total={total}
              onChange={(p, l) => {
                setPage(p);
                setLimit(l);
              }}
              showSizeChanger
              pageSizeOptions={["5", "10", "20", "50"]}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TabContainer;