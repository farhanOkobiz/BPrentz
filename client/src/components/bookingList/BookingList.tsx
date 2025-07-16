"use client";

import React, { useEffect, useState } from "react";
import { IBooking, IRent } from "@/types";
import {
  EditOutlined,
  SaveOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Input,
  InputNumber,
  Button,
  message,
  DatePicker,
  Modal,
  Popconfirm,
  Upload,
  Table,
  Image,
} from "antd";
import dayjs from "dayjs";
import { apiBaseUrl } from "@/config/config";
interface RentListProps {
  rents: IBooking[];
  total: number;
  currentPage: number;
  refetchRents?: (page: number | string) => Promise<void>;
  updateRentImages?: (rentId: string, newImages: string[]) => void;
}
type DateField = "checkinDate" | "checkoutDate";
const BookingList: React.FC<RentListProps> = ({
  rents,
  total,
  currentPage,
  refetchRents = () => Promise.resolve(),
  updateRentImages = () => {},
}) => {
  const [editingField, setEditingField] = useState<{ [key: string]: any }>({});
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [loadingField, setLoadingField] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRent, setSelectedRent] = useState<IRent | null>(null);

  const handleFieldChange = (field: string, value: any) => {
    setEditingField((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditClick = (
    rentId: string,
    field: string,
    currentValue: any
  ) => {
    setCurrentEditId(rentId);
    setEditingField({ [field]: currentValue });
  };
  const showModal = (rent: IRent) => {
    setSelectedRent(null);
    setTimeout(() => {
      setSelectedRent(rent);
    }, 50);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedRent(null);
    setEditingField({});
    setCurrentEditId(null);
  };
  useEffect(() => {
    if (selectedRent) {
      setIsModalOpen(true);
    }
  }, [selectedRent]);
  useEffect(() => {
    if (selectedRent && currentEditId === selectedRent._id) {
      const updated = {
        ...selectedRent,
        ...editingField,
        floorPlan: {
          ...selectedRent.floorPlan,
          ...editingField.floorPlan,
        },
      };
      setSelectedRent(updated);
    }
  }, [editingField]);
  const handleFieldUpdate = async (rentId: string, field: string) => {
    try {
      setLoadingField(field);
      const token = localStorage.getItem("accessToken") || "";
      const body: any = {};

      if (
        ["bedroomCount", "bedCount", "bathCount", "guestCount"].includes(field)
      ) {
        body.floorPlan = { [field]: editingField[field] };
      } else {
        body[field] = editingField[field];
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/host/rent/${rentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();
      if (data.status === "success") {
        message.success("Updated successfully!");
        await refetchRents(currentPage);
      } else {
        message.error("Update failed");
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong");
    } finally {
      setLoadingField(null);
      setCurrentEditId(null);
      setEditingField({});
    }
  };
  const handleImageUpload = async (rentId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    try {
      const token = localStorage.getItem("accessToken") || "";
      const res = await fetch(`${apiBaseUrl}/host/rent/image/${rentId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (data.status === "success") {
        message.success("Images uploaded successfully!");
        await refetchRents(currentPage);
        if (selectedRent?._id === rentId) {
          setSelectedRent((prev) =>
            prev ? { ...prev, images: data.data.images } : prev
          );
        }
      } else {
        message.error("Image upload failed.");
      }
    } catch (err) {
      message.error("Something went wrong.");
      console.error(err);
    }
  };
  const handleImageDelete = async (
    rentId: string,
    imageUrl: string,
    currentImages: string[]
  ) => {
    try {
      const token = localStorage.getItem("accessToken") || "";
      const res = await fetch(`${apiBaseUrl}/host/rent/image/${rentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          images: currentImages,
          imageUrl,
        }),
      });
      const data = await res.json();

      if (data.status === "success") {
        message.success("Image deleted.");
        await refetchRents(currentPage);
        const updatedImages = currentImages.filter((img) => img !== imageUrl);
        updateRentImages(rentId, updatedImages);
        if (selectedRent?._id === rentId) {
          setSelectedRent((prev) =>
            prev ? { ...prev, images: updatedImages } : prev
          );
        }
      } else {
        message.error("Delete failed.");
      }
    } catch (err) {
      console.error(err);
      message.error("Error deleting image.");
    }
  };
  //   const renderEditableDate = (
  //     rent: IRent,
  //     field: "checkinDate" | "checkoutDate"
  //   ) => {
  //     const dateValue = editingField[field]
  //       ? dayjs(editingField[field])
  //       : undefined;

  //     return currentEditId === rent._id && editingField[field] !== undefined ? (
  //       <div className="flex gap-2 items-center">
  //         <DatePicker
  //           className="w-full sm:w-auto"
  //           placement="bottomLeft"
  //           placeholder="Enter Date"
  //           value={dateValue}
  //           onChange={(date) => {
  //             if (date) {
  //               handleFieldChange(field, date.toISOString());
  //             }
  //           }}
  //         />
  //         <Button
  //           icon={<SaveOutlined />}
  //           loading={loadingField === field}
  //           onClick={() => handleFieldUpdate(rent._id, field)}
  //         >
  //           Save
  //         </Button>
  //       </div>
  //     ) : (
  //       <div className="flex items-center gap-2">
  //         {rent[field] ? dayjs(rent[field]).format("YYYY-MM-DD") : "N/A"}
  //         {currentEditId === rent._id && (
  //           <Button
  //             size="small"
  //             icon={<EditOutlined />}
  //             onClick={() =>
  //               handleEditClick(rent._id, field, rent[field] || undefined)
  //             }
  //           />
  //         )}
  //       </div>
  //     );
  //   };

  const columns = [
    {
      title: "Image",
      dataIndex: ["rent", "images"],
      key: "image",
      render: (_: any, record: IBooking) =>
        record.rent.images && record.rent.images.length > 0 ? (
          <Image
            src={apiBaseUrl + record.rent.images[0]}
            alt={record.rent.title}
            width={60}
            height={40}
            style={{ objectFit: "cover", borderRadius: 4 }}
          />
        ) : (
          <div className="w-[60px] h-[40px] bg-gray-200 flex items-center justify-center text-xs text-gray-400 rounded">
            No Image
          </div>
        ),
    },
    {
      title: "Title",
      dataIndex: ["rent", "title"],
      key: "title",
    },
    {
      title: "Host Name",
      dataIndex: ["rentHost", "name"],
      key: "hostName",
      render: (_: any, record: any) => record.rentHost?.name || "N/A",
    },
    {
      title: "Host Email",
      dataIndex: ["rentHost", "email"],
      key: "hostEmail",
      render: (_: any, record: any) => record.rentHost?.email || "N/A",
    },
    {
      title: "Location",
      dataIndex: ["rent", "location"],
      key: "location",
    },
    {
      title: "Price",
      dataIndex: ["rent", "price"],
      key: "price",
      render: (price: number) => price?.toLocaleString() || "N/A",
    },
    {
      title: "Check-in",
      dataIndex: ["rent", "checkinDate"],
      key: "checkinDate",
      render: (date: string) =>
        date ? dayjs(date).format("YYYY-MM-DD") : "N/A",
    },
    {
      title: "Check-out",
      dataIndex: ["rent", "checkoutDate"],
      key: "checkoutDate",
      render: (date: string) =>
        date ? dayjs(date).format("YYYY-MM-DD") : "N/A",
    },
    {
      title: "Bedrooms",
      dataIndex: ["rent", "floorPlan", "bedroomCount"],
      key: "bedroomCount",
      render: (val: number) => val ?? "N/A",
    },
    {
      title: "Beds",
      dataIndex: ["rent", "floorPlan", "bedCount"],
      key: "bedCount",
      render: (val: number) => val ?? "N/A",
    },
    {
      title: "Baths",
      dataIndex: ["rent", "floorPlan", "bathCount"],
      key: "bathCount",
      render: (val: number) => val ?? "N/A",
    },
    {
      title: "Guests",
      dataIndex: ["rent", "floorPlan", "guestCount"],
      key: "guestCount",
      render: (val: number) => val ?? "N/A",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden capitalize">
      <div className="overflow-x-auto">
        <div className="md:hidden">
          <h2 className="text-xl font-semibold text-gray-800 border-b-gray-400 pb-2 mb-4">
            Room Listings
          </h2>
          <div className="p-2 flex flex-col gap-2">
            {rents.map((booking) => (
              <div
                key={booking._id}
                className="flex items-center gap-4 shadow-sm p-4 rounded-lg hover:bg-gray-50 transition"
              >
                {booking.rent.images && booking.rent.images.length > 0 ? (
                  <Image
                    src={apiBaseUrl + booking.rent.images[0]}
                    height={50}
                    width={60}
                    alt={booking.rent.title}
                  />
                ) : (
                  <div className="w-[60px] h-[50px] bg-gray-200 text-xs flex items-center justify-center text-gray-400 rounded">
                    No Image
                  </div>
                )}
                <p
                  className="font-bold text-gray-800 cursor-pointer"
                  onClick={() => showModal(booking.rent)}
                >
                  {booking.rent.title || "No title"}
                </p>
              </div>
            ))}
          </div>
          <Modal
            key={selectedRent?._id || "loading"}
            title="List Details"
            centered
            open={isModalOpen}
            footer={null}
            onCancel={handleCancel}
          >
            {!selectedRent ? (
              <div className="flex justify-center items-center h-[150px]">
                <span className="text-gray-400">Loading details...</span>
                {/* You can also use Antd's <Spin /> here if you prefer */}
              </div>
            ) : (
              <div className="space-y-4">
                <>
                  {selectedRent && (
                    <div className="space-y-4">
                      {/* Title */}
                      <div>
                        <p className="font-medium">Title:</p>
                        {currentEditId === selectedRent._id &&
                        editingField.title !== undefined ? (
                          <div className="flex gap-2">
                            <Input
                              value={editingField.title}
                              onChange={(e) =>
                                handleFieldChange("title", e.target.value)
                              }
                            />
                            <Button
                              icon={<SaveOutlined />}
                              loading={loadingField === "title"}
                              onClick={() =>
                                handleFieldUpdate(selectedRent._id, "title")
                              }
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <div>
                            {selectedRent.title || "N/A"}{" "}
                            <Button
                              size="small"
                              icon={<EditOutlined />}
                              onClick={() =>
                                handleEditClick(
                                  selectedRent._id,
                                  "title",
                                  selectedRent.title
                                )
                              }
                            />
                          </div>
                        )}
                      </div>

                      {/* Location */}
                      <div>
                        <p className="font-medium">Location:</p>
                        {currentEditId === selectedRent._id &&
                        editingField.location !== undefined ? (
                          <div className="flex gap-2">
                            <Input
                              value={editingField.location}
                              onChange={(e) =>
                                handleFieldChange("location", e.target.value)
                              }
                            />
                            <Button
                              icon={<SaveOutlined />}
                              loading={loadingField === "location"}
                              onClick={() =>
                                handleFieldUpdate(selectedRent._id, "location")
                              }
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <div>
                            {selectedRent.location || "N/A"}{" "}
                            <Button
                              size="small"
                              icon={<EditOutlined />}
                              onClick={() =>
                                handleEditClick(
                                  selectedRent._id,
                                  "location",
                                  selectedRent.location
                                )
                              }
                            />
                          </div>
                        )}
                      </div>

                      {/* Price */}
                      <div>
                        <p className="font-medium">Price:</p>
                        {currentEditId === selectedRent._id &&
                        editingField.price !== undefined ? (
                          <div className="flex gap-2">
                            <InputNumber
                              value={editingField.price}
                              onChange={(val) =>
                                handleFieldChange("price", val)
                              }
                            />
                            <Button
                              icon={<SaveOutlined />}
                              loading={loadingField === "price"}
                              onClick={() =>
                                handleFieldUpdate(selectedRent._id, "price")
                              }
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <div>
                            {selectedRent.price || "N/A"}{" "}
                            <Button
                              size="small"
                              icon={<EditOutlined />}
                              onClick={() =>
                                handleEditClick(
                                  selectedRent._id,
                                  "price",
                                  selectedRent.price
                                )
                              }
                            />
                          </div>
                        )}
                      </div>

                      {/* Check-in and Check-out Dates */}
                      {(["checkinDate", "checkoutDate"] as DateField[]).map(
                        (field) => (
                          <div key={field}>
                            <p className="font-medium">
                              {field === "checkinDate"
                                ? "Check-in Date"
                                : "Check-out Date"}
                              :
                            </p>
                            {currentEditId === selectedRent._id &&
                            editingField[field] !== undefined ? (
                              <div className="flex gap-2 items-center">
                                <DatePicker
                                  value={
                                    editingField[field]
                                      ? dayjs(editingField[field])
                                      : undefined
                                  }
                                  onChange={(date) =>
                                    date &&
                                    handleFieldChange(field, date.toISOString())
                                  }
                                />
                                <Button
                                  icon={<SaveOutlined />}
                                  loading={loadingField === field}
                                  onClick={() =>
                                    handleFieldUpdate(selectedRent._id, field)
                                  }
                                >
                                  Save
                                </Button>
                              </div>
                            ) : (
                              <div>
                                {selectedRent[field]
                                  ? dayjs(selectedRent[field]).format(
                                      "YYYY-MM-DD"
                                    )
                                  : "N/A"}{" "}
                                <Button
                                  size="small"
                                  icon={<EditOutlined />}
                                  onClick={() =>
                                    handleEditClick(
                                      selectedRent._id,
                                      field,
                                      selectedRent[field]
                                    )
                                  }
                                />
                              </div>
                            )}
                          </div>
                        )
                      )}

                      {/* Floor Plan */}
                      <div>
                        <p className="font-medium">Floor Plan:</p>
                        {currentEditId === selectedRent._id &&
                        editingField.floorPlan ? (
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              "bedroomCount",
                              "bedCount",
                              "bathCount",
                              "guestCount",
                            ].map((field) => (
                              <InputNumber
                                key={field}
                                min={0}
                                value={editingField.floorPlan[field]}
                                onChange={(value) =>
                                  handleFieldChange("floorPlan", {
                                    ...editingField.floorPlan,
                                    [field]: value,
                                  })
                                }
                              />
                            ))}
                            <Button
                              icon={<SaveOutlined />}
                              className="col-span-2"
                              loading={loadingField === "floorPlan"}
                              onClick={() =>
                                handleFieldUpdate(selectedRent._id, "floorPlan")
                              }
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <div>
                            {Object.entries({
                              Bedroom: selectedRent.floorPlan?.bedroomCount,
                              Bed: selectedRent.floorPlan?.bedCount,
                              Bath: selectedRent.floorPlan?.bathCount,
                              Guest: selectedRent.floorPlan?.guestCount,
                            }).map(([label, value]) => (
                              <p key={label}>
                                {label}: {value ?? "N/A"}
                              </p>
                            ))}
                            <Button
                              size="small"
                              icon={<EditOutlined />}
                              onClick={() =>
                                handleEditClick(
                                  selectedRent._id,
                                  "floorPlan",
                                  selectedRent.floorPlan || {}
                                )
                              }
                            />
                          </div>
                        )}
                      </div>

                      {/* Images */}
                      <div>
                        <p className="font-medium">Images:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedRent.images &&
                          selectedRent.images.length > 0 ? (
                            selectedRent.images.map((imgUrl) => (
                              <div
                                key={imgUrl}
                                className="relative w-[80px] h-[60px]"
                              >
                                <Image
                                  src={apiBaseUrl + imgUrl}
                                  alt="Room Image"
                                  width={80}
                                  height={60}
                                  className="object-cover"
                                />
                                <Popconfirm
                                  title="Delete this image?"
                                  onConfirm={() =>
                                    handleImageDelete(
                                      selectedRent._id,
                                      imgUrl,
                                      selectedRent.images || []
                                    )
                                  }
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  <DeleteOutlined className="absolute top-1 right-1 bg-white p-1 rounded-full text-red-500 cursor-pointer" />
                                </Popconfirm>
                              </div>
                            ))
                          ) : (
                            <div className="text-xs text-gray-400">
                              No images
                            </div>
                          )}
                        </div>
                        <Upload
                          accept="image/*"
                          multiple
                          showUploadList={false}
                          beforeUpload={(file) => {
                            handleImageUpload(selectedRent._id, [file]);
                            return false;
                          }}
                        >
                          <Button
                            icon={<PlusOutlined />}
                            className="mt-2"
                            type="dashed"
                          >
                            Upload Image
                          </Button>
                        </Upload>
                      </div>
                    </div>
                  )}
                </>
              </div>
            )}
          </Modal>
        </div>
        <Table
          dataSource={rents}
          columns={columns}
          rowKey="_id"
          pagination={{
            current: currentPage,
            total: total,
            onChange: (page) => refetchRents(page),
            showSizeChanger: false,
          }}
        />
      </div>
    </div>
  );
};

export default BookingList;
