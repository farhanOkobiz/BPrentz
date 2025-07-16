"use client";

import React, { useEffect, useState } from "react";
import { IRent } from "@/types";
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
  Space,
  Skeleton,
} from "antd";
import dayjs from "dayjs";
import Image from "next/image";
import { apiBaseUrl } from "@/config/config";
interface RentListProps {
  rents: IRent[];
  rentPage: number;
  refetchRents: (page: number | string) => Promise<void>;
  updateRentImages: (rentId: string, newImages: string[]) => void;
}
type DateField = "checkinDate" | "checkoutDate";
const RentList: React.FC<RentListProps> = ({
  rents,
  rentPage,
  refetchRents,
  updateRentImages,
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
  console.log("selectedRent ", selectedRent);
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
        await refetchRents(rentPage);
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
        await refetchRents(rentPage);
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
        await refetchRents(rentPage);
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
  const renderEditableDate = (
    rent: IRent,
    field: "checkinDate" | "checkoutDate"
  ) => {
    const dateValue = editingField[field]
      ? dayjs(editingField[field])
      : undefined;

    return currentEditId === rent._id && editingField[field] !== undefined ? (
      <div className="flex gap-2 items-center">
        <DatePicker
          className="w-full sm:w-auto"
          placement="bottomLeft"
          placeholder="Enter Date"
          value={dateValue}
          onChange={(date) => {
            if (date) {
              handleFieldChange(field, date.toISOString());
            }
          }}
        />
        <Button
          icon={<SaveOutlined />}
          loading={loadingField === field}
          onClick={() => handleFieldUpdate(rent._id, field)}
        >
          Save
        </Button>
      </div>
    ) : (
      <div className="flex items-center gap-2">
        {rent[field] ? dayjs(rent[field]).format("YYYY-MM-DD") : "N/A"}
        {currentEditId === rent._id && (
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() =>
              handleEditClick(rent._id, field, rent[field] || undefined)
            }
          />
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden capitalize">
      <div className="overflow-x-auto">
        <div className="md:hidden">
          <h2 className="text-xl font-semibold text-gray-800 border-b-gray-400 pb-2 mb-4">
            Room Listings
          </h2>
          <div className="p-2 flex flex-col gap-2">
            {rents.map((rent) => (
              <div
                key={rent._id}
                className="flex items-center gap-4 shadow-sm p-4 rounded-lg hover:bg-gray-50 transition"
              >
                {rent.images && rent.images.length > 0 ? (
                  <Image
                    src={apiBaseUrl + rent.images[0]}
                    height={50}
                    width={60}
                    alt={rent.title}
                  />
                ) : (
                  <div className="w-[60px] h-[50px] bg-gray-200 text-xs flex items-center justify-center text-gray-400 rounded">
                    No Image
                  </div>
                )}
                <p
                  className="font-bold text-gray-800 cursor-pointer"
                  onClick={() => showModal(rent)}
                >
                  {rent.title || "No title"}
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
                                  fill
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
        <table className="hidden md:block min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Available From
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Available Till
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Bedrooms
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Beds
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Baths
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Guests
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {(!rents || rents.length === 0) ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx}>
                  {Array.from({ length: 12 }).map((_, colIdx) => (
                    <td key={colIdx} className="px-6 py-4">
                      <Skeleton.Button active size="small" style={{ width: '100%', height: 24, borderRadius: 8 }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              rents.map((rent) => (
                <tr key={rent._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 align-top">
                    <Space direction="vertical">
                      <div className="flex flex-col gap-2 w-[100px]">
                        {/* Image Grid */}
                        <div className="flex flex-wrap gap-2">
                          {rent?.images && rent?.images?.length > 0 ? (
                            rent?.images?.map((imgUrl) => (
                              <div
                                key={imgUrl}
                                className="relative w-[60px] h-[50px] rounded-md overflow-hidden group"
                              >
                                <Image
                                  src={apiBaseUrl + imgUrl}
                                  alt={rent.title || "Rent Image"}
                                  fill
                                  className="object-cover"
                                />
                                <Popconfirm
                                  title="Delete this image?"
                                  onConfirm={() =>
                                    handleImageDelete(
                                      rent._id,
                                      imgUrl,
                                      rent.images || []
                                    )
                                  }
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  <DeleteOutlined className="absolute top-0 right-0 p-1 bg-white text-red-500 text-xs rounded-full shadow-md cursor-pointer opacity-90 hover:opacity-100 group-hover:visible" />
                                </Popconfirm>
                              </div>
                            ))
                          ) : (
                            <div className="w-[60px] h-[50px] flex items-center justify-center border rounded bg-gray-100 text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </div>

                        {/* Upload Button */}
                        <Upload
                          accept="image/*"
                          multiple
                          showUploadList={false}
                          beforeUpload={(file) => {
                            handleImageUpload(rent._id, [file]);
                            return false;
                          }}
                        >
                          <Button
                            size="small"
                            icon={<PlusOutlined />}
                            className="w-full"
                            type="dashed"
                          >
                            Upload
                          </Button>
                        </Upload>
                      </div>
                    </Space>
                  </td>

                  {/* Title */}
                  <td className="px-6 py-4">
                    {currentEditId === rent._id &&
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
                          onClick={() => handleFieldUpdate(rent._id, "title")}
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {rent.title}
                        {currentEditId === rent._id && (
                          <Button
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() =>
                              handleEditClick(rent._id, "title", rent.title)
                            }
                          />
                        )}
                      </div>
                    )}
                  </td>

                  {/* Location */}
                  <td className="px-6 py-4">
                    {currentEditId === rent._id &&
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
                          onClick={() => handleFieldUpdate(rent._id, "location")}
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {rent.location}
                        {currentEditId === rent._id && (
                          <Button
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() =>
                              handleEditClick(rent._id, "location", rent.location)
                            }
                          />
                        )}
                      </div>
                    )}
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4">
                    {currentEditId === rent._id &&
                      editingField.price !== undefined ? (
                      <div className="flex gap-2">
                        <InputNumber
                          value={editingField.price}
                          onChange={(val) => handleFieldChange("price", val)}
                        />
                        <Button
                          icon={<SaveOutlined />}
                          loading={loadingField === "price"}
                          onClick={() => handleFieldUpdate(rent._id, "price")}
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {rent.price}
                        {currentEditId === rent._id && (
                          <Button
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() =>
                              handleEditClick(rent._id, "price", rent.price)
                            }
                          />
                        )}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {renderEditableDate(rent, "checkinDate")}
                  </td>
                  <td className="px-6 py-4">
                    {renderEditableDate(rent, "checkoutDate")}
                  </td>

                  {currentEditId === rent._id && editingField.floorPlan ? (
                    <>
                      {[
                        "bedroomCount",
                        "bedCount",
                        "bathCount",
                        "guestCount",
                      ].map((field) => (
                        <td key={field} className="px-6 py-4">
                          <InputNumber
                            min={0}
                            value={editingField.floorPlan[field]}
                            onChange={(value) =>
                              setEditingField((prev) => ({
                                ...prev,
                                floorPlan: {
                                  ...prev.floorPlan,
                                  [field]: value,
                                },
                              }))
                            }
                          />
                        </td>
                      ))}
                      <td className="px-6 py-4">
                        <Button
                          icon={<SaveOutlined />}
                          loading={loadingField === "floorPlan"}
                          onClick={() => handleFieldUpdate(rent._id, "floorPlan")}
                        >
                          Save
                        </Button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4">
                        {rent.floorPlan?.bedroomCount ?? "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        {rent.floorPlan?.bedCount ?? "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        {rent.floorPlan?.bathCount ?? "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        {rent.floorPlan?.guestCount ?? "N/A"}
                        {currentEditId === rent._id && (
                          <Button
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => {
                              setCurrentEditId(rent._id);
                              setEditingField({
                                floorPlan: {
                                  bedroomCount: rent.floorPlan?.bedroomCount ?? 0,
                                  bedCount: rent.floorPlan?.bedCount ?? 0,
                                  bathCount: rent.floorPlan?.bathCount ?? 0,
                                  guestCount: rent.floorPlan?.guestCount ?? 0,
                                },
                              });
                            }}
                          />
                        )}
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4">
                    <Button
                      className="!bg-primary text-white"
                      type={currentEditId === rent._id ? "default" : "primary"}
                      onClick={() => {
                        if (currentEditId === rent._id) {
                          setCurrentEditId(null);
                          setEditingField({});
                        } else {
                          setCurrentEditId(rent._id);
                          // setEditingField({
                          //   title: rent.title,
                          //   location: rent.location,
                          //   price: rent.price,
                          //   checkinDate: rent.checkinDate,
                          //   checkoutDate: rent.checkoutDate,
                          //   floorPlan: { ...rent.floorPlan },
                          // });
                        }
                      }}
                    >
                      {currentEditId === rent._id ? "Cancel" : "Edit"}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RentList;
