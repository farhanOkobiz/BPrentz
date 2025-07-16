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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SearchOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import RentServices from "../services/rent.services";
import { baseUrl } from "../constants/env";

const { processChangeStatus, processDeleteOne, processGetAll, processSelectRent } = RentServices;


const { Option } = Select;

const Rent = () => {
  const [searchText, setSearchText] = useState();
  const [statusFilter, setStatusFilter] = useState();
  const [sortOrder, setSortOrder] = useState();
  const [page, setPage] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRent, setSelectedRent] = useState(null);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "rents",
      page,
      statusFilter || "",
      sortOrder || "",
      searchText || "",
    ],
    queryFn: () =>
      processGetAll({
        page,
        status: statusFilter || "",
        sort: sortOrder || "",
        search: searchText || "",
      }),
    keepPreviousData: true,
  });
  console.log(data);
  const changeStatusMutation = useMutation({
    mutationFn: ({ id, payload }) => processChangeStatus({ id, payload }),
    onSuccess: () => {
      message.success("Status Change Successful");
      queryClient.invalidateQueries(["rents"]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }) => processDeleteOne({ id }),
    onSuccess: () => {
      message.success("Item Deleted Successful");
      queryClient.invalidateQueries(["rents"]);
    },
  });

  const selectMutation = useMutation({
    mutationFn: ({ id, payload }) => processSelectRent({ id, payload }),
    onSuccess: () => {
      message.success("Priority updated");
      queryClient.invalidateQueries(["rents"]);
    },
    onError: () => {
      message.error("Failed to update priority");
    },
  });

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
      dataIndex: "status",
      render: (status, record) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Select
            value={status}
            onChange={(value) =>
              changeStatusMutation.mutate({
                id: record._id,
                payload: { status: value },
              })
            }
            style={{ width: 120 }}
          >
            <Option value="in_progress">in_progress</Option>
            <Option value="pending">pending</Option>
            <Option value="published">Published</Option>
            <Option value="unpublished">Unpublished</Option>
          </Select>
        </div>
      ),
    },
    {
      title: "Cover Image",
      dataIndex: "coverImage",
      render: (img) =>
        img ? (
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-12 h-12 overflow-hidden"
          >
            <Image
              src={`${baseUrl}${img}`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-20 h-20 bg-gray-200 flex items-center justify-center">
            N/A
          </div>
        ),
    }
    ,

    {
      title: "Actions",
      render: (_, record) => (
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedRent(record);
              setIsModalOpen(true);
            }}
          />
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
    setSelectedRent(null);
  };

  useEffect(() => {
    if (isError) {
      message.error("Error loading rent listings.");
    }
  }, [isError]);

  return (
    <div
      className="w-full bg-white my-6 p-8 rounded-md overflow-y-auto"
      style={{ maxHeight: "80vh" }}
    >
      <h1 className="text-2xl font-bold mb-4">Rent Management</h1>

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
          <Option value="in_progress">in_progress</Option>
          <Option value="pending">pending</Option>
          <Option value="published">Published</Option>
          <Option value="unpublished">Unpublished</Option>
        </Select>
        <Select
          placeholder="Sort By"
          value={sortOrder}
          onChange={(value) => {
            setSortOrder(value);
            setPage(1);
          }}
          allowClear
          style={{ width: 150 }}
        >
          <Option value={-1}>New</Option>
          <Option value={1}>Old</Option>
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
          total: data?.totalRents || 0,
          onChange: (p) => setPage(p),
        }}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={
          <span className="text-xl font-semibold">Rent Listing Details</span>
        }
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={900}
      >
        {selectedRent && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Basic Info</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-gray-500">Title</div>
                <div className="text-right">{selectedRent.title}</div>
                <div className="text-gray-500">Description</div>
                <div className="text-right">{selectedRent.description}</div>
                <div className="text-gray-500">Category</div>
                <div className="text-right">
                  {selectedRent.category?.categoryName}
                </div>
                <div className="text-gray-500">Location</div>
                <div className="text-right">{selectedRent.location}</div>
                <div className="text-gray-500">Price</div>
                <div className="text-right">${selectedRent.price}</div>
                <div className="text-gray-500">Status</div>
                <div className="text-right capitalize">
                  {selectedRent.status}
                </div>
              </div>
            </div>

            <hr />

            <div>
              <h3 className="text-lg font-medium mb-2">Images</h3>
              <Image.PreviewGroup>
                <div className="flex gap-3 flex-wrap">
                  {selectedRent.images?.map((img, idx) => (
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

            {selectedRent.amenities?.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Amenities</h3>
                <div className="flex gap-3 flex-wrap">
                  {selectedRent.amenities.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Image
                        width={30}
                        src={`${baseUrl}${item.amenitiesImage}`}
                      />
                      <span>{item.amenitiesLabel}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {[
              { label: "Allowable Things", data: selectedRent.allowableThings },
              { label: "House Rules", data: selectedRent.houseRules },
              {
                label: "Cancellation Policy",
                data: selectedRent.cancellationPolicy,
              },
            ].map(
              (section) =>
                section.data?.length > 0 && (
                  <div key={section.label}>
                    <h3 className="text-lg font-medium mb-2">
                      {section.label}
                    </h3>
                    <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                      {section.data.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )
            )}

            <div>
              <h3 className="text-lg font-medium mb-2">Floor Plan</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {Object.entries(selectedRent.floorPlan || {}).map(
                  ([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-500">{key}</span>
                      <span>{val}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {selectedRent.listingFor?.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Listing For</h3>
                <div className="flex gap-2 flex-wrap">
                  {selectedRent.listingFor.map((item) => (
                    <Tag key={item._id}>{item.featureName}</Tag>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Rent;
