"use client";

import { useEffect } from "react";
import { Pagination } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

interface FlatPaginationProps {
  current: number;
  total: number;
  pageSize?: number;
  hasData: boolean;
}

const FlatPagination: React.FC<FlatPaginationProps> = ({
  current,
  total,
  pageSize = 6,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const maxPage = Math.ceil(total / pageSize);

  useEffect(() => {
    if (current > maxPage && maxPage >= 1) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", maxPage.toString());
      router.replace(`/flat?${params.toString()}`);
    }
  }, [current, maxPage, router, searchParams]);

  const onChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push(`/flat?${params.toString()}`);
  };

  return (
    <Pagination
      current={current}
      pageSize={pageSize}
      total={total}
      onChange={onChange}
      showSizeChanger={false}
    />
  );
};

export default FlatPagination;
