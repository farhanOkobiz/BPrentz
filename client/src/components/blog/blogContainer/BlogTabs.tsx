"use client";

import Tabs from "./Tabs";
import BlogList from "./BlogList";
import { useState, useEffect } from "react";
import { BlogData, Feature } from "@/types/blogTypes/blogTypes";
import { Pagination, Spin } from "antd";
import { getAllBlogs } from "@/services/blog";

interface BlogTabsProps {
  features: Feature[];
}

const pageSize = 8;

const BlogTabs = ({ features }: BlogTabsProps) => {
  const tabs = [{ name: "All", _id: "all" }, ...features.map((f) => ({ name: f.featureName, _id: f._id }))];

  const [activeTab, setActiveTab] = useState<{ name: string; _id: string }>({ name: "All", _id: "all" });
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const featureId = activeTab._id !== "all" ? activeTab._id : undefined;
        const res = await getAllBlogs(currentPage, pageSize, featureId);
        setBlogs(res.data || []);
        setTotal(res.totalContacts || 0);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [activeTab, currentPage]);

  const handleTabChange = (tab: { name: string; _id: string }) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={handleTabChange} />

      {loading ? (
        <div className="flex justify-center py-10">
          <Spin />
        </div>
      ) : (
        <BlogList blogs={blogs} />
      )}

      {total > pageSize && (
        <div className="flex justify-center mt-6">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default BlogTabs;
