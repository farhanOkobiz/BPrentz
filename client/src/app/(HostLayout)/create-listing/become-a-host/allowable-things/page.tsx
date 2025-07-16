"use client";
import { useEffect, useState } from "react";
import { Button, Input, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useListingContext } from "@/contexts/ListingContext";
import { useListingStepContext } from "@/contexts/ListingStepContext";
import CategoryServices from "@/services/category/category.services";

export default function AllowableThingsPage() {
  const [input, setInput] = useState("");
  const [allowableThings, setAllowableThings] = useState<string[]>([]);
  const { listingId, featureType } = useListingContext();
  const { setOnNextSubmit } = useListingStepContext();
  const [messageApi, contextHolder] = message.useMessage();

  const handleAdd = () => {
    if (input.trim() && !allowableThings.includes(input.trim())) {
      setAllowableThings([...allowableThings, input.trim()]);
      setInput("");
    }
  };

  const handleDelete = (idx: number) => {
    setAllowableThings(allowableThings.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!listingId || !featureType) return;
    try {
      const res = await CategoryServices.processAllowableThings(
        featureType,
        listingId,
        allowableThings
      );
      messageApi.success(`AllowableThings Updated Successfully`);
      console.log("AllowableThings ", res);
    } catch (error) {
      console.log("Allowable Things updated failed", error);
      messageApi.error("Allowable Things Updated Failed ");
      throw error;
    }
  };

  useEffect(() => {
    setOnNextSubmit(handleSubmit);
  }, [allowableThings, listingId, featureType]);

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      {contextHolder}
      <h1 className="text-2xl font-bold mb-6 text-primary">
        Documents requirements while check-in
      </h1>
      <div className="flex gap-2 mb-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a rule (e.g. No pets allowed)"
          onPressEnter={handleAdd}
          className="flex-1"
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          disabled={!input.trim()}
        >
          Add
        </Button>
      </div>
      <ul className="mb-6">
        {allowableThings.map((thing, idx) => (
          <li
            key={idx}
            className="flex items-center justify-between bg-gray-50 rounded px-3 py-2 mb-2"
          >
            <span>{thing}</span>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDelete(idx)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
