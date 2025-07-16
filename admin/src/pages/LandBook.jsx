import {
  Table,
  Button,
  Select,
  Input,
  Image,
  Popconfirm,
  Modal,
  Tag,
  message as antdMessage,
} from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { baseUrl } from "../constants/env";
import landServices from "../services/landBook.service";

const { processChangeStatus, processDeleteOne, processGetAll } = landServices;
const { Option } = Select;

const LandBook = () => {
  const [page, setPage] = useState(1);
  const [expandedMessages, setExpandedMessages] = useState({});

  const queryClient = useQueryClient();

  const queryKey = ["landBookings", { page }];

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () =>
      processGetAll({
        page,
      }),
    keepPreviousData: true,
  });

  useEffect(() => {
    if (isError) antdMessage.error("Failed to load land bookings");
  }, [isError]);

  const changeStatusMutation = useMutation({
    mutationFn: ({ id, payload }) => processChangeStatus({ id, payload }),
    onSuccess: () => {
      antdMessage.success("Update successful");
      queryClient.invalidateQueries(["landBookings"]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }) => processDeleteOne({ id }),
    onSuccess: () => {
      antdMessage.success("Item deleted successfully");
      queryClient.invalidateQueries(["landBookings"]);
    },
  });

  const columns = [
    {
      title: "SL",
      render: (_, __, index) => (page - 1) * 9 + index + 1,
      width: 50,
    },
    {
      title: "Lend Title",
      render: (_, record) => record.land?.title || "N/A",
      key: "title",
    },
    {
      title: "Lend Price",
      render: (_, record) => `BDT ${record.land?.price || "N/A"}`,
      key: "price",
    },
    {
      title: "Category",
      render: (_, record) => record.land?.category?.categoryName || "N/A",
      key: "category",
    },
    {
      title: "Host",
      render: (_, record) => (
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Name:</span>
            <span>{record.land?.host?.name || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Email:</span>
            <span>{record.land?.host?.email || "N/A"}</span>
          </div>
        </div>
      ),
      key: "host",
    },
    {
      title: "Booking Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Booking Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Booking Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Message",
      key: "message",
      render: (_, record) => {
        const msg = record.message || "";
        const isLong = msg.length > 10;
        const expanded = expandedMessages[record._id] || false;

        const toggleExpand = () =>
          setExpandedMessages((prev) => ({
            ...prev,
            [record._id]: !expanded,
          }));

        return (
          <div className="w-[80%]">
            {isLong && !expanded ? `${msg.slice(0, 10)}...` : msg}
            {isLong && (
              <Button type="link" size="small" onClick={toggleExpand}>
                {expanded ? "Less" : "More"}
              </Button>
            )}
          </div>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Select
          value={record.status}
          onChange={(value) =>
            changeStatusMutation.mutate({
              id: record._id,
              payload: { status: value },
            })
          }
          style={{ width: 120 }}
        >
          <Select.Option value="available">Available</Select.Option>
          <Select.Option value="sold_out">Sold Out</Select.Option>
        </Select>
      ),
    },
    {
      title: "Cover Image",
      render: (_, record) =>
        record.land?.coverImage ? (
          <Image width={80} src={`${baseUrl}${record.land.coverImage}`} />
        ) : (
          <div className="w-20 h-20 bg-gray-200 flex items-center justify-center">
            N/A
          </div>
        ),
      key: "coverImage",
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this booking?"
          onConfirm={() => deleteMutation.mutate({ id: record._id })}
          okText="Yes"
          cancelText="No"
        >
          <Button icon={<DeleteOutlined />} danger />
        </Popconfirm>
      ),
      key: "actions",
    },
  ];

  return (
    <div
      className="w-full bg-white my-6 p-8 rounded-md overflow-y-auto"
      style={{ maxHeight: "80vh" }}
    >
      <h1 className="text-2xl font-bold mb-4">Land Booking Management</h1>

      <Table
        dataSource={data?.data || []}
        loading={isLoading}
        columns={columns}
        rowKey="_id"
        pagination={{
          current: page,
          pageSize: 9,
          total: data?.totalLand || 0,
          onChange: (p) => setPage(p),
        }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default LandBook;
