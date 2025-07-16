"use client";

import React, { useState } from "react";
import { ILandData } from "@/types";
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
  // Modal,
  Upload,
  Space,
  Popconfirm,
} from "antd";
import { apiBaseUrl } from "@/config/config";
import Image from "next/image";

interface LandListProps {
  lands: ILandData[];
  landPage?: number;
  refetchLands: () => void;
  updateLandImages: (landId: string, newImages: string[]) => void;
}

const LandList: React.FC<LandListProps> = ({
  lands,
  // landPage,
  refetchLands,
  updateLandImages,
}) => {
  const [editingField, setEditingField] = useState<{ [key: string]: any }>({});
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [loadingField, setLoadingField] = useState<string | null>(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [modalLand, setModalLand] = useState<ILandData | null>(null);

  const handleFieldChange = (field: string, value: any) => {
    setEditingField((prev) => ({ ...prev, [field]: value }));
  };

  // const handleEditClick = (
  //   landId: string,
  //   field: string,
  //   currentValue: any
  // ) => {
  //   setCurrentEditId(landId);
  //   setEditingField({ [field]: currentValue });
  // };

  const handleFieldUpdate = async (landId: string, field: string) => {
    try {
      setLoadingField(field);
      const token = localStorage.getItem("accessToken") || "";
      const body: any = {};
      body[field] = editingField[field];

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/host/land/${landId}`,
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
        await refetchLands();
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

  const handleImageUpload = async (landId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    try {
      const token = localStorage.getItem("accessToken") || "";
      const res = await fetch(`${apiBaseUrl}/host/land/image/${landId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      console.log("upload image res == ", data);
      if (data.status === "success") {
        message.success("Images uploaded successfully!");
        await refetchLands();
      } else {
        message.error("Image upload failed.");
      }
    } catch (err) {
      message.error("Something went wrong.");
      console.error(err);
    }
  };

  const handleImageDelete = async (
    landId: string,
    imageUrl: string,
    currentImages: string[]
  ) => {
    try {
      const token = localStorage.getItem("accessToken") || "";
      const res = await fetch(`${apiBaseUrl}/host/land/image/${landId}`, {
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
      console.log("image delete res ==", data);
      if (data.status === "success") {
        const updatedImages = currentImages.filter((img) => img !== imageUrl);
        updateLandImages(landId, updatedImages);
        // await refetchLands();
      } else {
        message.error("Delete failed.");
      }
    } catch (err) {
      console.error(err);
      message.error("Error deleting image.");
    }
  };

  // const showModal = (land: ILandData) => {
  //   setModalLand(land);
  //   setIsModalOpen(true);
  // };

  // const handleCancel = () => {
  //   setIsModalOpen(false);
  //   setModalLand(null);
  //   setCurrentEditId(null);
  //   setEditingField({});
  // };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden capitalize w-full">
      {/* Mobile View */}
      <div className="md:hidden py-4 px-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b-gray-400 pb-2 mb-4">
          Land Listings
        </h2>
        <div className="flex flex-col gap-6">
          {lands.map((land: any) => {
            const isEditing = currentEditId === land._id;
            return (
              <div key={land._id} className="shadow rounded p-4 bg-white">
                <div className="flex gap-3 flex-wrap">
                  {/* Images with delete */}
                  {land.images?.map((imgUrl: any, index: any) => (
                    <div key={index} className="relative group">
                      <Image
                        src={apiBaseUrl + imgUrl}
                        alt={land.title || "Land Image"}
                        width={80}
                        height={60}
                        className="rounded-md"
                      />
                      <Popconfirm
                        title="Delete this image?"
                        onConfirm={() =>
                          handleImageDelete(land._id, imgUrl, land.images || [])
                        }
                        okText="Yes"
                        cancelText="No"
                      >
                        <DeleteOutlined className="absolute top-0 right-0 p-1 bg-white rounded-full shadow-md cursor-pointer opacity-80 hover:text-red-500 group-hover:visible" />
                      </Popconfirm>
                    </div>
                  ))}
                  {/* Upload button */}
                  <Upload
                    accept="image/*"
                    multiple
                    showUploadList={false}
                    beforeUpload={(file) => {
                      handleImageUpload(land._id, [file]);
                      return false;
                    }}
                  >
                    <Button icon={<PlusOutlined />}>Upload</Button>
                  </Upload>
                </div>

                {/* Editable fields */}
                <div className="mt-4 space-y-3">
                  {/* Title */}
                  <div className="flex items-center justify-between">
                    <strong>Title:</strong>
                    {isEditing ? (
                      <Input
                        value={editingField.title}
                        onChange={(e) =>
                          handleFieldChange("title", e.target.value)
                        }
                        className="flex-1 ml-2"
                      />
                    ) : (
                      <span className="ml-2">{land.title}</span>
                    )}
                  </div>

                  {/* Land Size */}
                  <div className="flex items-center justify-between">
                    <strong>Land Size:</strong>
                    {isEditing ? (
                      <InputNumber
                        min={0}
                        value={editingField.landSize}
                        onChange={(val) => handleFieldChange("landSize", val)}
                        className="ml-2 w-full"
                      />
                    ) : (
                      <span className="ml-2">{land.landSize}</span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <strong>Price:</strong>
                    {isEditing ? (
                      <InputNumber
                        min={0}
                        value={editingField.price}
                        onChange={(val) => handleFieldChange("price", val)}
                        className="ml-2 w-full"
                      />
                    ) : (
                      <span className="ml-2">{land.price}</span>
                    )}
                  </div>

                  {/* Location */}
                  <div className="flex items-center justify-between">
                    <strong>Location:</strong>
                    {isEditing ? (
                      <Input
                        value={editingField.location}
                        onChange={(e) =>
                          handleFieldChange("location", e.target.value)
                        }
                        className="flex-1 ml-2"
                      />
                    ) : (
                      <span className="ml-2">{land.location}</span>
                    )}
                  </div>
                </div>

                {/* Edit/Save/Cancel Buttons */}
                <div className="mt-4 flex gap-2 justify-end">
                  {isEditing ? (
                    <>
                      <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        loading={loadingField !== null}
                        onClick={async () => {
                          const fields = [
                            "title",
                            "landSize",
                            "price",
                            "location",
                          ];
                          for (const field of fields) {
                            if (
                              editingField[field] !== undefined &&
                              editingField[field] !==
                              land[field as keyof ILandData]
                            ) {
                              await handleFieldUpdate(land._id, field);
                            }
                          }
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => {
                          setCurrentEditId(null);
                          setEditingField({});
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => {
                        setCurrentEditId(land._id);
                        setEditingField({
                          title: land.title,
                          landSize: land.landSize,
                          price: land.price,
                          location: land.location,
                        });
                      }}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop View */}
      <table className="min-w-full hidden md:table divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {["Image", "Title", "Status", "Sold Status", "Land Size", "Land Price", "Location", "Actions"].map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {lands.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-8 text-gray-400">
                No land data found.
              </td>
            </tr>
          ) : (
            lands.map((land) => {
              const isEditing = currentEditId === land._id;
              return (
                <tr key={land._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Space direction="vertical" size="middle">
                      <div className="flex gap-2 flex-wrap">
                        {land.images?.map((imgUrl, index) => (
                          <div
                            key={index}
                            className="relative group w-[80px] h-[60px]"
                          >
                            <Image
                              src={apiBaseUrl + imgUrl}
                              width={80}
                              height={60}
                              alt="Land"
                              className="rounded-md object-cover"
                            />
                            <Popconfirm
                              title="Delete this image?"
                              onConfirm={() =>
                                handleImageDelete(
                                  land._id,
                                  imgUrl,
                                  land.images || []
                                )
                              }
                              okText="Yes"
                              cancelText="No"
                            >
                              <DeleteOutlined className="absolute top-0 right-0 p-1 bg-white rounded-full shadow-md cursor-pointer opacity-80 hover:text-red-500 group-hover:visible" />
                            </Popconfirm>
                          </div>
                        ))}
                      </div>

                      <Upload
                        accept="image/*"
                        multiple
                        showUploadList={false}
                        beforeUpload={(file) => {
                          handleImageUpload(land._id, [file]);
                          return false;
                        }}
                      >
                        <Button icon={<PlusOutlined />}>Upload</Button>
                      </Upload>
                    </Space>
                  </td>

                  <td className="px-6 py-4">
                    {isEditing ? (
                      <Input
                        value={editingField.title}
                        onChange={(e) =>
                          handleFieldChange("title", e.target.value)
                        }
                      />
                    ) : (
                      land.title
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {land.publishStatus?.replace(/_/g, " ") || "No Status"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {land.isSold ? "Sold" : "Available"}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <InputNumber
                        value={editingField.landSize}
                        onChange={(val) => handleFieldChange("landSize", val)}
                      />
                    ) : (
                      land.landSize
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <InputNumber
                        value={editingField.price}
                        onChange={(val) => handleFieldChange("price", val)}
                      />
                    ) : (
                      land.price
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <Input
                        value={editingField.location}
                        onChange={(e) =>
                          handleFieldChange("location", e.target.value)
                        }
                      />
                    ) : (
                      land.location
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Button
                          type="primary"
                          icon={<SaveOutlined />}
                          loading={loadingField !== null}
                          onClick={async () => {
                            const fields = [
                              "title",
                              "landSize",
                              "price",
                              "location",
                            ];
                            for (const field of fields) {
                              if (
                                editingField[field] !== undefined &&
                                editingField[field] !==
                                land[field as keyof ILandData]
                              ) {
                                await handleFieldUpdate(land._id, field);
                              }
                            }
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => {
                            setCurrentEditId(null);
                            setEditingField({});
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                          setCurrentEditId(land._id);
                          setEditingField({
                            title: land.title,
                            landSize: land.landSize,
                            price: land.price,
                            location: land.location,
                          });
                        }}
                      >
                        Edit
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LandList;
