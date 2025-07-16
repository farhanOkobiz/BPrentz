import {
  Table,
  Button,
  Select,
  Input,
  Image,
  Popconfirm,
  Modal,
  Tag,
  message,
  Checkbox,
} from "antd";
import { SearchOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import FlatServices from "../services/flat.services";
import { baseUrl } from "../constants/env";

const { processChangeStatus, processDeleteOne, processGetAll, processSelectFlat } = FlatServices;
const { Option } = Select;

const Flat = () => {
  const [searchText, setSearchText] = useState();
  const [statusFilter, setStatusFilter] = useState();
  // const [sortOrder, setSortOrder] = useState();
  const [page, setPage] = useState();
  const [isModalOpen, setIsModalOpen] = useState();
  const [selectedFlat, setSelectedFlat] = useState(null);
  const [isSold, setIsSold] = useState();

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["flats", page, statusFilter, searchText, isSold],
    queryFn: () =>
      processGetAll({
        page,
        status: statusFilter || "",
        // sort: sortOrder || "",
        search: searchText || "",
        isSold: isSold || "",
      }),
    keepPreviousData: true,
  });

  const changeStatusMutation = useMutation({
    mutationFn: ({ id, payload }) => processChangeStatus({ id, payload }),
    onSuccess: () => {
      message.success("Update successful");
      queryClient.invalidateQueries(["flats"]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }) => processDeleteOne({ id }),
    onSuccess: () => {
      message.success("Item deleted successfully");
      queryClient.invalidateQueries(["flats"]);
    },
  });
  const selectMutation = useMutation({
    mutationFn: ({ id, payload }) => processSelectFlat({ id, payload }),
    onSuccess: () => {
      message.success("Priority updated");
      queryClient.invalidateQueries(["flats"]);
    },
    onError: () => {
      message.error("Failed to update priority");
    },
  })

  const columns = [
    {
      title: "SL",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Priority",
      dataIndex: "selected",
      render: (selected, record) => (
        <Checkbox
          checked={!!selected}
          onChange={(e) => {
            selectMutation.mutate({ id: record._id, payload: { selected: e.target.checked } });
          }}
        />
      ),
    },
    {
      title: "Category",
      render: (_, record) => record.category?.categoryName || "N/A",
    },
    {
      title: "Host",
      render: (_, record) => (
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Name:</span>
            <span>{record?.host?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Email:</span>
            <span>{record?.host?.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      render: (_, record) => (
        <Select
          value={record.publishStatus}
          onChange={(value) =>
            changeStatusMutation.mutate({
              id: record._id,
              payload: { status: value },
            })
          }
          style={{ width: 120 }}
        >
          <Option value="in_progress">In Progress</Option>
          <Option value="pending">Pending</Option>
          <Option value="published">Published</Option>
          <Option value="unpublished">Unpublished</Option>
        </Select>
      ),
    },
    {
      title: "Is Sold",
      render: (_, record) => (
        <Select
          value={record.isSold}
          onChange={(value) =>
            changeStatusMutation.mutate({
              id: record._id,
              payload: { isSold: value },
            })
          }
          style={{ width: 120 }}
        >
          <Option value={false}>Not Sold</Option>
          <Option value={true}>Sold</Option>
        </Select>
      ),
    },
    {
      title: "Cover Image",
      render: (record) =>
        record.coverImage ? (
          <div className="w-12 h-12 overflow-hidden rounded-md">
            <Image
              width={80}
              src={`${baseUrl}${record.coverImage}`}
              alt="Cover" className="w-full h-full object-cover" />
          </div>

        ) : (
          <div className="w-20 h-20 bg-gray-200 flex items-center justify-center">
            N/A
          </div>
        ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          {/* <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedFlat(record);
              setIsModalOpen(true);
            }}
          /> */}
          <Popconfirm
            title="Are you sure to delete this listing?"
            onConfirm={() => deleteMutation.mutate({ id: record._id })}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedFlat(null);
  };

  useEffect(() => {
    if (isError) message.error("Failed to load flats");
  }, [isError]);

  return (
    <div
      className="w-full bg-white my-6 p-8 rounded-md overflow-y-auto"
      style={{ maxHeight: "80vh" }}
    >
      <h1 className="text-2xl font-bold mb-4">Flat Management</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search by host email"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(1);
          }}
          onPressEnter={(e) => {
            setSearchText(e.target.value);
            setPage(1);
          }}
          allowClear
          style={{ width: 250 }}
        />
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
          <Option value="in_progress">In Progress</Option>
          <Option value="pending">Pending</Option>
          <Option value="published">Published</Option>
          <Option value="unpublished">Unpublished</Option>
        </Select>
        {/* <Select
          placeholder="Sort By"
          value={sortOrder}
          onChange={(value) => {
            setSortOrder(value);
            setPage(1);
          }}
          allowClear
          style={{ width: 150 }}
        >
          <Option value={-1}>Newest</Option>
          <Option value={1}>Oldest</Option>
        </Select> */}
        <Select
          placeholder="Filter by Sold Status"
          value={isSold}
          onChange={(value) => {
            setIsSold(value);
            setPage(1);
          }}
          allowClear
          style={{ width: 150 }}
        >
          <Option value={true}>Sold</Option>
          <Option value={false}>Not Sold</Option>
        </Select>
      </div>

      <Table
        dataSource={data?.data || []}
        loading={isLoading}
        columns={columns}
        rowKey="_id"
        pagination={{
          current: page,
          pageSize: 9,
          total: data?.totalContacts || 0,
          onChange: (p) => setPage(p),
        }}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={<span className="text-xl font-semibold">Flat Details</span>}
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={900}
      >
        {selectedFlat && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Basic Info</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-gray-500">Title</div>
                <div className="text-right">{selectedFlat.title}</div>
                <div className="text-gray-500">Description</div>
                <div className="text-right">{selectedFlat.description}</div>
                <div className="text-gray-500">Category</div>
                <div className="text-right">
                  {selectedFlat.category?.categoryName}
                </div>
                <div className="text-gray-500">Location</div>
                <div className="text-right">{selectedFlat.location}</div>
                <div className="text-gray-500">Price</div>
                <div className="text-right">BDT {selectedFlat.price}</div>
                <div className="text-gray-500">Building Year</div>
                <div className="text-right">{selectedFlat.buildingYear}</div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Images</h3>
              <Image.PreviewGroup>
                <div className="flex gap-3 flex-wrap">
                  {selectedFlat.images?.map((img, idx) => (
                    <Image
                      key={idx}
                      width={100}
                      src={`${baseUrl}${img}`}
                      alt={`Image ${idx}`}
                    />
                  ))}
                </div>
              </Image.PreviewGroup>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Video</h3>
              <div className="text-sm text-gray-500 mb-2">
                Watch the video of the flat
              </div>
              <div className="flex justify-start">
                {/* Embedding YouTube or other platform video */}
                <iframe
                  width="40%"
                  height="200"
                  src={selectedFlat.video.replace("watch?v=", "embed/")}
                  title="Flat Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {selectedFlat.listingFor?.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Listing For</h3>
                <div className="flex gap-2 flex-wrap">
                  {selectedFlat.listingFor.map((item) => (
                    <Tag key={item._id}>{item.featureName}</Tag>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h3 className="text-lg font-medium mb-2">Floor Plan</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {Object.entries(selectedFlat.floorPlan || {}).map(
                  ([key, val]) => {
                    const isBooleanField =
                      key === "dinning" || key === "drawing";
                    const displayValue = isBooleanField
                      ? val
                        ? "Yes"
                        : "No"
                      : val?.toString();

                    return (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-500 capitalize">{key}</span>
                        <span>{displayValue}</span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {selectedFlat.amenities?.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Amenities</h3>
                <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                  {selectedFlat.amenities.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Flat;
