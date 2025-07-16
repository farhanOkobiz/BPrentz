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
import rentServices from "../services/rentBook.service";

const { processChangeStatus, processDeleteOne, processGetAll } = rentServices;
const { Option } = Select;

const RentBook = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9); // Default page size
  // const [expandedMessages, setExpandedMessages] = useState({});
  const [statusFilter, setStatusFilter] = useState();

  const queryClient = useQueryClient();

  const queryKey = ["flatBookings", { page, limit, status: statusFilter }];

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () =>
      processGetAll({
        page,
        limit,
        status: statusFilter || "",
      }),
    keepPreviousData: true,
  });

  useEffect(() => {
    if (isError) antdMessage.error("Failed to load flat bookings");
  }, [isError]);

  const changeStatusMutation = useMutation({
    mutationFn: ({ id, payload }) => processChangeStatus({ id, payload }),
    onSuccess: () => {
      antdMessage.success("Update successful");
      queryClient.invalidateQueries(["flatBookings"]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }) => processDeleteOne({ id }),
    onSuccess: () => {
      antdMessage.success("Item deleted successfully");
      queryClient.invalidateQueries(["flatBookings"]);
    },
  });

  const columns = [
    {
      title: "SL",
      render: (_, __, index) => (page - 1) * 9 + index + 1,
      width: 50,
    },
    {
      title: "Rent Title",
      render: (_, record) => record.rent?.title || "N/A",
      key: "title",
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
      render: (text) => text || "N/A",
    },
    {
      title: "Payment Gateway",
      dataIndex: "paymentGateway",
      key: "paymentGateway",
      render: (text) => text || "N/A",
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => {
        const statusColorMap = {
          PENDING: "bg-yellow-100 text-yellow-700",
          SUCCESS: "bg-green-100 text-green-700",
          FAILED: "bg-red-100 text-red-700",
          CANCELLED: "bg-gray-200 text-gray-600",
        };
        return (
          <span
            className={`px-2 py-1 text-xs font-semibold rounded ${statusColorMap[status] || "bg-gray-100 text-gray-700"}`}
          >
            {status}
          </span>
        );
      },
    },

    {
      title: "Single Night Price",
      render: (_, record) => `BDT ${record.rent?.price || "N/A"}`,
      key: "singleprice",
    },
    {
      title: "Rent Total Price",
      render: (_, record) => `BDT ${record?.price || "N/A"}`,
      key: "totalprice",
    },
    // booking information
    {
      title: "Check-in Date",
      render: (_, record) => {
        const bookingDate = new Date(record.checkinDate);
        return bookingDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      },
      key: "checkinDate",
    },
    {
      title: "Check-out Date",
      render: (_, record) => {
        const bookingDate = new Date(record.checkoutDate);
        return bookingDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      },
      key: "checkoutDate",
    },
    {
      title: "Guest Count",
      render: (_, record) => `Guest ${record.guestCount || "N/A"}`,
      key: "guestCount",
    },
    {
      title: "Host",
      render: (_, record) => (
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Name:</span>
            <span>{record.rentHost?.name || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Email:</span>
            <span>{record.rentHost?.email || "N/A"}</span>
          </div>
        </div>
      ),
      key: "host",
    },
    {
      title: "Booking User",
      render: (_, record) => (
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Name:</span>
            <span>{record.user?.name || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Email:</span>
            <span>{record.user?.email || "N/A"}</span>
          </div>
        </div>
      ),
      key: "bookingUser",
    },
    {
      title: "Status updated by admin",
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
          { }
          <Select.Option value="checked_in">Checked In</Select.Option>
          <Select.Option value="checked_out">Checked Out</Select.Option>
          <Select.Option value="rejected">Rejected</Select.Option>
          <Select.Option value="pending">Pending</Select.Option>
        </Select>
      ),
    },
    {
      title: "Cover Image",
      render: (_, record) =>
        record.rent?.images.length > 0 ? (
          <Image width={80} src={`${baseUrl}${record.rent?.images[0]}`} />
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
      <h1 className="text-2xl font-bold mb-4">Rent Booking Management</h1>

      <div className="flex gap-4 mb-4">
        <Select
          placeholder="Filter by Status"
          value={statusFilter}
          onChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
          allowClear
          style={{ width: 180 }}
        >
          <Select.Option value="checked_in">Checked In</Select.Option>
          <Select.Option value="checked_out">Checked Out</Select.Option>
          <Select.Option value="rejected">Rejected</Select.Option>
          <Select.Option value="pending">Pending</Select.Option>
        </Select>
      </div>

      <Table
        dataSource={data?.data || []}
        loading={isLoading}
        columns={columns}
        rowKey="_id"
        pagination={{
          current: page,
          pageSize: limit,
          total: data?.totalContacts || 0,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          onChange: (p, l) => {
            setPage(p);
            setLimit(l);
          },
        }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default RentBook;
