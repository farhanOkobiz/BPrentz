"use client";
import { useEffect, useState } from "react";
import { Button, Input, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useListingContext } from "@/contexts/ListingContext";
import { useListingStepContext } from "@/contexts/ListingStepContext";
import CategoryServices from "@/services/category/category.services";

export default function HouseRulesPage() {
  const [input, setInput] = useState("");
  const [houseRules, setHouseRules] = useState<string[]>([]);
  const { listingId, featureType } = useListingContext();
  const { setOnNextSubmit } = useListingStepContext();
  const [messageApi, contextHolder] = message.useMessage();

  const handleAdd = () => {
    if (input.trim() && !houseRules.includes(input.trim())) {
      setHouseRules([...houseRules, input.trim()]);
      setInput("");
    }
  };

  const handleDelete = (idx: number) => {
    setHouseRules(houseRules.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!listingId || !featureType) return;
    try {
      const res = await CategoryServices.processHouseRuleSetApi(
        featureType,
        listingId,
        houseRules
      );
      messageApi.success(`House Rules Updated Successfully`);
      setHouseRules([]);
      setInput("");
      console.log("HouseRules ", res);
    } catch (error) {
      console.log("House Rules updated failed", error);
      messageApi.error("House Rules Updated Failed ");
    }
  };

  useEffect(() => {
    setOnNextSubmit(handleSubmit);
  }, [houseRules, listingId, featureType]);

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      {contextHolder}
      <h1 className="text-2xl font-bold mb-6 text-primary">Set House Rules</h1>
      <div className="flex gap-2 mb-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a rule (e.g. No smoking allowed)"
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
        {houseRules.map((rule, idx) => (
          <li
            key={idx}
            className="flex items-center justify-between bg-gray-50 rounded px-3 py-2 mb-2"
          >
            <span>{rule}</span>
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
