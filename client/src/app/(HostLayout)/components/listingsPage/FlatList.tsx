"use client";

import React, { useState } from "react";
import { IFlatData } from "@/types";
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
  Space,
  Upload,
  Popconfirm,
  Skeleton,
} from "antd";

import Image from "next/image";
import { apiBaseUrl } from "@/config/config";

interface FlatListProps {
  flats: IFlatData[];
  flatPage: number;
  refetchFlats: (page: number) => Promise<void>;
  updateFlatImages: (flatId: string, newImages: string[]) => void;
}
const FlatList: React.FC<FlatListProps> = ({
  flats,
  flatPage,
  refetchFlats,
  updateFlatImages,
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<any>({});
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Add a loading prop or detect loading state as needed
  // For demo, let's assume if flats is undefined/null, it's loading
  const isLoading = !flats || (Array.isArray(flats) && flats.length === 0);

  const handleFieldEditClick = (flat: IFlatData, field: string) => {
    setCurrentEditId(flat._id);
    setEditingField(field);

    setEditingData({
      title: flat.title,
      location: flat.location,
      price: flat.price,
      bedroomCount: flat.floorPlan?.bedroomCount ?? 0,
      balconyCount: flat.floorPlan?.balconyCount ?? 0,
      bathroomCount: flat.floorPlan?.bathroomCount ?? 0,
    });
  };

  const handleChange = (field: string, value: any) => {
    setEditingData((prev: any) => ({ ...prev, [field]: value }));
  };

  const patchFlat = async (flatId: string, field: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken") || "";
      const body: any = {};

      if (field === "floorPlan") {
        body.floorPlan = {
          bedroomCount: editingData.bedroomCount,
          balconyCount: editingData.balconyCount,
          bathroomCount: editingData.bathroomCount,
        };
      } else {
        body[field] = editingData[field];
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/host/flat/${flatId}`,
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
        message.success("Flat updated successfully");
        await refetchFlats(flatPage);
      } else {
        message.error("Failed to update flat");
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong");
    } finally {
      setCurrentEditId(null);
      setEditingField(null);
      setEditingData({});
      setLoading(false);
    }
  };

  const handleImageUpload = async (flatId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    try {
      const token = localStorage.getItem("accessToken") || "";
      const res = await fetch(`${apiBaseUrl}/host/flat/image/${flatId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (data.status === "success") {
        message.success("Images uploaded successfully!");
        await refetchFlats(flatPage);
      } else {
        message.error("Image upload failed.");
      }
    } catch (err) {
      message.error("Something went wrong.");
      console.error(err);
    }
  };

  const handleImageDelete = async (
    flatId: string,
    imageUrl: string,
    currentImages: string[]
  ) => {
    try {
      const token = localStorage.getItem("accessToken") || "";
      const res = await fetch(`${apiBaseUrl}/host/flat/image/${flatId}`, {
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
      console.log("upload image res == ", data);
      if (data.status === "success") {
        message.success("Image deleted successfully!");
        // await refetchFlats(flatPage);
        const updatedImages = currentImages.filter((img) => img !== imageUrl);
        updateFlatImages(flatId, updatedImages);
      } else {
        message.error("Failed to delete image.");
      }
    } catch (err) {
      message.error("Something went wrong.");
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden capitalize">
      <div className="overflow-x-auto">
        {/* ✅ Mobile View */}
        <div className="md:hidden p-4 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 pb-2">
            Flat Listings
          </h2>
          {flats.map((flat) => (
            <div key={flat._id} className="rounded-md p-3 shadow space-y-2">
              <div>
                <strong>Title:</strong>{" "}
                {currentEditId === flat._id && editingField === "title" ? (
                  <Input
                    value={editingData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                  />
                ) : (
                  flat.title || "N/A"
                )}
              </div>

              <div>
                <strong>Location:</strong>{" "}
                {currentEditId === flat._id && editingField === "location" ? (
                  <Input
                    value={editingData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                  />
                ) : (
                  flat.location || "N/A"
                )}
              </div>

              <div>
                <strong>Price:</strong>{" "}
                {currentEditId === flat._id && editingField === "price" ? (
                  <Input
                    value={editingData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                  />
                ) : (
                  flat.price || "N/A"
                )}
              </div>

              <div>
                <strong>Floor Plan:</strong>
                {currentEditId === flat._id && editingField === "floorPlan" ? (
                  <div className="flex gap-2">
                    <InputNumber
                      min={0}
                      value={editingData.bedroomCount}
                      onChange={(val) => handleChange("bedroomCount", val)}
                      placeholder="Bedroom"
                    />
                    <InputNumber
                      min={0}
                      value={editingData.balconyCount}
                      onChange={(val) => handleChange("balconyCount", val)}
                      placeholder="Balcony"
                    />
                    <InputNumber
                      min={0}
                      value={editingData.bathroomCount}
                      onChange={(val) => handleChange("bathroomCount", val)}
                      placeholder="Bathroom"
                    />
                  </div>
                ) : (
                  <div>
                    Bedroom: {flat.floorPlan?.bedroomCount ?? "N/A"} | Balcony:{" "}
                    {flat.floorPlan?.balconyCount ?? "N/A"} | Bathroom:{" "}
                    {flat.floorPlan?.bathroomCount ?? "N/A"}
                  </div>
                )}
              </div>

              <div>
                <strong>Publish Status:</strong>{" "}
                {flat.publishStatus?.replace(/_/g, " ") || "N/A"}
              </div>
              <div>
                <strong>Sold Status:</strong>{" "}
                {flat.isSold ? "Sold" : "Available"}
              </div>

              <div className="space-x-2 mt-1">
                {currentEditId === flat._id ? (
                  <Button
                    icon={<SaveOutlined />}
                    size="small"
                    loading={loading}
                    onClick={() => patchFlat(flat._id, editingField!)}
                  >
                    Save
                  </Button>
                ) : (
                  <>
                    <Button
                      icon={<EditOutlined />}
                      size="small"
                      onClick={() => handleFieldEditClick(flat, "title")}
                    >
                      Title
                    </Button>
                    <Button
                      icon={<EditOutlined />}
                      size="small"
                      onClick={() => handleFieldEditClick(flat, "location")}
                    >
                      Location
                    </Button>
                    <Button
                      icon={<EditOutlined />}
                      size="small"
                      onClick={() => handleFieldEditClick(flat, "floorPlan")}
                    >
                      Floor Plan
                    </Button>
                  </>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {flat.images?.map((imgUrl) => (
                  <div
                    key={imgUrl}
                    className="relative group w-[100px] h-[80px] border rounded"
                  >
                    <Image
                      src={apiBaseUrl + imgUrl}
                      alt="Flat"
                      fill
                      className="object-cover rounded"
                    />
                    <Popconfirm
                      title="Delete this image?"
                      onConfirm={() =>
                        handleImageDelete(flat._id, imgUrl, flat.images || [])
                      }
                      okText="Yes"
                      cancelText="No"
                    >
                      <DeleteOutlined className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md cursor-pointer text-red-500" />
                    </Popconfirm>
                  </div>
                ))}
                <Upload
                  accept="image/*"
                  multiple
                  showUploadList={false}
                  beforeUpload={(file) => {
                    handleImageUpload(flat._id, [file]);
                    return false;
                  }}
                >
                  <Button size="small" icon={<PlusOutlined />}>
                    Upload
                  </Button>
                </Upload>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Desktop View remains same (no change) */}
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
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Sold Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Flat Price
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Bedroom
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Balcony
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Bathroom
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <tr key={idx}>
                  {Array.from({ length: 10 }).map((_, colIdx) => (
                    <td key={colIdx} className="px-6 py-4">
                      <Skeleton active paragraph={false} title={{ width: "80%" }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : flats.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-8 text-gray-400">
                  No flat data found.
                </td>
              </tr>
            ) : (
              flats.map((flat) => (
                <tr key={flat._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 align-top">
                    <Space direction="vertical" className="w-full">
                      {/* Image Preview Grid */}
                      <div className="flex gap-2 flex-wrap">
                        {flat.images && flat.images.length > 0 ? (
                          flat.images.map((imgUrl) => (
                            <div
                              key={imgUrl}
                              className="relative group w-[90px] h-[60px] rounded-md overflow-hidden"
                            >
                              <Image
                                src={apiBaseUrl + imgUrl}
                                alt="Flat Image"
                                fill
                                className="object-cover"
                              />
                              <Popconfirm
                                title="Delete this image?"
                                onConfirm={() =>
                                  handleImageDelete(
                                    flat._id,
                                    imgUrl,
                                    flat.images || []
                                  )
                                }
                                okText="Yes"
                                cancelText="No"
                              >
                                <DeleteOutlined className="absolute top-0 right-0 p-1 bg-white rounded-full shadow cursor-pointer opacity-90 text-red-500 text-xs hover:opacity-100 group-hover:visible" />
                              </Popconfirm>
                            </div>
                          ))
                        ) : (
                          <div className="w-[90px] h-[60px] flex items-center justify-center border rounded bg-gray-100 text-gray-400 text-xs">
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
                          handleImageUpload(flat._id, [file]);
                          return false;
                        }}
                      >
                        <Button size="small" icon={<PlusOutlined />}>
                          Upload
                        </Button>
                      </Upload>
                    </Space>
                  </td>

                  {/* <td className="px-6 py-4 ">
                  <div className="flex flex-col items-start gap-2">
                    {flat?.images && flat.images.length > 0 ? (
                      <div className="relative w-[90px] h-[60px]">
                        <Image
                          src={apiBaseUrl + flat.images[0]}
                          alt={flat.title || "Flat Image"}
                          fill
                          className="rounded-md object-cover"
                        />
                        <Popconfirm
                          title="Delete this image?"
                          onConfirm={() =>
                            handleImageDelete(
                              flat._id,
                              flat.images[0],
                              flat.images || []
                            )
                          }
                          okText="Yes"
                          cancelText="No"
                        >
                          <DeleteOutlined className="absolute top-1 right-1 bg-white p-1 rounded-full text-red-500 text-xs cursor-pointer shadow" />
                        </Popconfirm>
                      </div>
                    ) : (
                      <div className="w-[90px] h-[60px] flex items-center justify-center border rounded bg-gray-100 text-gray-400 text-xs">
                        No Image
                      </div>
                    )}

                    <Upload
                      accept="image/*"
                      multiple
                      showUploadList={false}
                      beforeUpload={(file) => {
                        handleImageUpload(flat._id, [file]);
                        return false;
                      }}
                    >
                      <Button size="small" icon={<PlusOutlined />}>
                        Upload
                      </Button>
                    </Upload>
                  </div>
                </td> */}

                  <td className="px-6 py-4">
                    {currentEditId === flat._id && editingField === "title" ? (
                      <Input
                        value={editingData.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                      />
                    ) : (
                      flat.title || "N/A"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {flat.publishStatus?.replace(/_/g, " ") || "No Status"}
                  </td>

                  {/* Sold Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {flat.isSold ? "Sold" : "Available"}
                  </td>

                  {/* Location */}
                  <td className="px-6 py-4">
                    {currentEditId === flat._id && editingField === "location" ? (
                      <Input
                        value={editingData.location}
                        onChange={(e) => handleChange("location", e.target.value)}
                      />
                    ) : (
                      flat.location || "N/A"
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {currentEditId === flat._id && editingField === "price" ? (
                      <Input
                        value={editingData.location}
                        onChange={(e) => handleChange("price", e.target.value)}
                      />
                    ) : (
                      flat.price || "N/A"
                    )}
                  </td>

                  {/* Bedroom */}
                  <td className="px-6 py-4">
                    {currentEditId === flat._id &&
                      editingField === "floorPlan" ? (
                      <InputNumber
                        min={0}
                        value={editingData.bedroomCount}
                        onChange={(val) => handleChange("bedroomCount", val)}
                      />
                    ) : (
                      flat.floorPlan?.bedroomCount ?? "N/A"
                    )}
                  </td>

                  {/* Balcony */}
                  <td className="px-6 py-4">
                    {currentEditId === flat._id &&
                      editingField === "floorPlan" ? (
                      <InputNumber
                        min={0}
                        value={editingData.balconyCount}
                        onChange={(val) => handleChange("balconyCount", val)}
                      />
                    ) : (
                      flat.floorPlan?.balconyCount ?? "N/A"
                    )}
                  </td>

                  {/* Bathroom */}
                  <td className="px-6 py-4">
                    {currentEditId === flat._id &&
                      editingField === "floorPlan" ? (
                      <InputNumber
                        min={0}
                        value={editingData.bathroomCount}
                        onChange={(val) => handleChange("bathroomCount", val)}
                      />
                    ) : (
                      flat.floorPlan?.bathroomCount ?? "N/A"
                    )}
                  </td>

                  <td className="px-6 py-4 space-x-1">
                    {currentEditId === flat._id ? (
                      <Button
                        icon={<SaveOutlined />}
                        loading={loading}
                        onClick={() => patchFlat(flat._id, editingField!)}
                      >
                        Save
                      </Button>
                    ) : (
                      <>
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => handleFieldEditClick(flat, "title")}
                        >
                          Title
                        </Button>
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => handleFieldEditClick(flat, "location")}
                        >
                          Location
                        </Button>
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => handleFieldEditClick(flat, "floorPlan")}
                        >
                          Bedroom, Balcony, Bathroom
                        </Button>
                      </>
                    )}
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

export default FlatList;

// "use client";

// import React, { useState } from "react";
// import { IFlatData } from "@/types";
// import {
//   EditOutlined,
//   SaveOutlined,
//   DeleteOutlined,
//   PlusOutlined,
// } from "@ant-design/icons";
// import {
//   Input,
//   InputNumber,
//   Button,
//   message,
//   Modal,
//   Upload,
//   Popconfirm,
// } from "antd";
// import Image from "next/image";
// import { apiBaseUrl } from "@/config/config";

// interface FlatListProps {
//   flats: IFlatData[];
//   refetchFlats: () => Promise<void>;
// }

// const FlatList: React.FC<FlatListProps> = ({ flats, refetchFlats }) => {
//   const [editingField, setEditingField] = useState<string | null>(null);
//   const [editingData, setEditingData] = useState<any>({});
//   const [currentEditId, setCurrentEditId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleFieldEditClick = (flat: IFlatData, field: string) => {
//     setCurrentEditId(flat._id);
//     setEditingField(field);

//     setEditingData({
//       title: flat.title,
//       location: flat.location,
//       bedroomCount: flat.floorPlan?.bedroomCount ?? 0,
//       balconyCount: flat.floorPlan?.balconyCount ?? 0,
//       bathroomCount: flat.floorPlan?.bathroomCount ?? 0,
//     });
//   };

//   const handleChange = (field: string, value: any) => {
//     setEditingData((prev: any) => ({ ...prev, [field]: value }));
//   };

//   const patchFlat = async (flatId: string, field: string) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("accessToken") || "";
//       const body: any = {};

//       if (field === "floorPlan") {
//         body.floorPlan = {
//           bedroomCount: editingData.bedroomCount,
//           balconyCount: editingData.balconyCount,
//           bathroomCount: editingData.bathroomCount,
//         };
//       } else {
//         body[field] = editingData[field];
//       }

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/host/flat/${flatId}`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(body),
//         }
//       );

//       const data = await res.json();

//       if (data.status === "success") {
//         message.success("Flat updated successfully");
//         await refetchFlats();
//       } else {
//         message.error("Failed to update flat");
//       }
//     } catch (error) {
//       console.error(error);
//       message.error("Something went wrong");
//     } finally {
//       setCurrentEditId(null);
//       setEditingField(null);
//       setEditingData({});
//       setLoading(false);
//     }
//   };

//   const handleImageUpload = async (flatId: string, files: File[]) => {
//     const formData = new FormData();
//     files.forEach((file) => formData.append("images", file));
//     try {
//       const token = localStorage.getItem("accessToken") || "";
//       const res = await fetch(`${apiBaseUrl}/host/flat/image/${flatId}`, {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });
//       const data = await res.json();
//       if (data.status === "success") {
//         message.success("Images uploaded successfully!");
//         await refetchFlats();
//       } else {
//         message.error("Image upload failed.");
//       }
//     } catch (err) {
//       message.error("Something went wrong.");
//       console.error(err);
//     }
//   };

//   const handleImageDelete = async (
//     flatId: string,
//     imageUrl: string,
//     currentImages: string[]
//   ) => {
//     try {
//       const token = localStorage.getItem("accessToken") || "";
//       const res = await fetch(`${apiBaseUrl}/host/flat/image/${flatId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           images: currentImages,
//           imageUrl,
//         }),
//       });
//       const data = await res.json();
//       if (data.status === "success") {
//         message.success("Image deleted successfully!");
//         await refetchFlats();
//       } else {
//         message.error("Failed to delete image.");
//       }
//     } catch (err) {
//       message.error("Something went wrong.");
//       console.error(err);
//     }
//   };

//   const showModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleOk = () => {
//     setIsModalOpen(false);
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow overflow-hidden capitalize">
//       <div className="overflow-x-auto">
//         {/* Mobile View */}
//         <div className="md:hidden">
//           <h2 className="text-xl font-semibold text-gray-800 border-b-gray-400 pb-2 mb-4">
//             Flat Listings
//           </h2>
//           <div className="p-2 flex flex-col gap-2">
//             {flats.map((flat) => {
//               const { images } = flat;
//               return (
//                 <>
//                   <div className="flex items-center gap-10 shadow-lg p-4 rounded-lg hover:bg-gray-50 transition ">
//                     {/* image */}
//                     {images && images?.length > 0 ? (
//                       <Image
//                         src={apiBaseUrl + images[0]}
//                         height={50}
//                         width={60}
//                         alt={flat?.title || "Land Image"}
//                       />
//                     ) : (
//                       <div
//                         style={{
//                           width: 100,
//                           height: 100,
//                           background: "#f0f0f0",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           color: "#999",
//                           fontSize: 12,
//                         }}
//                       >
//                         No Image
//                       </div>
//                     )}

//                     <p
//                       key={flat._id}
//                       className="font-bold text-gray-800"
//                       onClick={showModal}
//                     >
//                       {flat.title || "No title"}
//                     </p>
//                   </div>
//                   <Modal
//                     title="Room Details"
//                     centered
//                     closable={{ "aria-label": "Custom Close Button" }}
//                     open={isModalOpen}
//                     footer={null}
//                     onOk={handleOk}
//                     onCancel={handleCancel}
//                   >
//                     <p className="border-b-1 border-gray-300 p-2">
//                       Land Title: {flat.title || "No title"}
//                     </p>
//                     <p className="border-b-1 border-gray-300 p-2">
//                       Status:{" "}
//                       {flat.publishStatus?.replace(/_/g, " ") || "No Status"}
//                     </p>
//                     <p className="border-b-1 border-gray-300 p-2">
//                       Sold Status: {flat.isSold ? "Sold" : "Available"}{" "}
//                       <Button size="small" icon={<EditOutlined />} />
//                     </p>

//                     <p className="border-b-1 border-gray-300 p-2">
//                       Land Prize: {flat.price}{" "}
//                       <Button size="small" icon={<EditOutlined />} />
//                     </p>
//                     <p className=" p-2">
//                       Location: {flat.location}{" "}
//                       <Button size="small" icon={<EditOutlined />} />
//                     </p>
//                   </Modal>
//                 </>
//               );
//             })}
//           </div>
//         </div>
//         <table className="hidden md:block min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
//                 Image
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
//                 Title
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
//                 Sold Status
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
//                 Location
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
//                 Flat Price
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
//                 Bedroom
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
//                 Balcony
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
//                 Bathroom
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {flats.map((flat) => (
//               <tr key={flat._id}>
//                 <td className="px-6 py-4">
//                   {flat?.images && flat.images?.length > 0 ? (
//                     <Image
//                       src={apiBaseUrl + flat.images[0]}
//                       height={60}
//                       width={90}
//                       alt={flat.title || "Flat Image"}
//                       className="rounded-md"
//                     />
//                   ) : (
//                     <div
//                       style={{
//                         width: 90,
//                         height: 60,
//                         background: "#f0f0f0",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         color: "#999",
//                         fontSize: 12,
//                       }}
//                     >
//                       No Image
//                     </div>
//                   )}
//                 </td>
//                 <td className="px-6 py-4">
//                   {currentEditId === flat._id && editingField === "title" ? (
//                     <Input
//                       value={editingData.title}
//                       onChange={(e) => handleChange("title", e.target.value)}
//                     />
//                   ) : (
//                     flat.title || "N/A"
//                   )}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {flat.publishStatus?.replace(/_/g, " ") || "No Status"}
//                 </td>

//                 {/* Sold Status */}
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {flat.isSold ? "Sold" : "Available"}
//                 </td>

//                 {/* Location */}
//                 <td className="px-6 py-4">
//                   {currentEditId === flat._id && editingField === "location" ? (
//                     <Input
//                       value={editingData.location}
//                       onChange={(e) => handleChange("location", e.target.value)}
//                     />
//                   ) : (
//                     flat.location || "N/A"
//                   )}
//                 </td>
//                 <td className="px-6 py-4">
//                   {currentEditId === flat._id && editingField === "price" ? (
//                     <Input
//                       value={editingData.location}
//                       onChange={(e) => handleChange("price", e.target.value)}
//                     />
//                   ) : (
//                     flat.price || "N/A"
//                   )}
//                 </td>

//                 {/* Bedroom */}
//                 <td className="px-6 py-4">
//                   {currentEditId === flat._id &&
//                   editingField === "floorPlan" ? (
//                     <InputNumber
//                       min={0}
//                       value={editingData.bedroomCount}
//                       onChange={(val) => handleChange("bedroomCount", val)}
//                     />
//                   ) : (
//                     flat.floorPlan?.bedroomCount ?? "N/A"
//                   )}
//                 </td>

//                 {/* Balcony */}
//                 <td className="px-6 py-4">
//                   {currentEditId === flat._id &&
//                   editingField === "floorPlan" ? (
//                     <InputNumber
//                       min={0}
//                       value={editingData.balconyCount}
//                       onChange={(val) => handleChange("balconyCount", val)}
//                     />
//                   ) : (
//                     flat.floorPlan?.balconyCount ?? "N/A"
//                   )}
//                 </td>

//                 {/* Bathroom */}
//                 <td className="px-6 py-4">
//                   {currentEditId === flat._id &&
//                   editingField === "floorPlan" ? (
//                     <InputNumber
//                       min={0}
//                       value={editingData.bathroomCount}
//                       onChange={(val) => handleChange("bathroomCount", val)}
//                     />
//                   ) : (
//                     flat.floorPlan?.bathroomCount ?? "N/A"
//                   )}
//                 </td>

//                 <td className="px-6 py-4 space-x-1">
//                   {currentEditId === flat._id ? (
//                     <Button
//                       icon={<SaveOutlined />}
//                       loading={loading}
//                       onClick={() => patchFlat(flat._id, editingField!)}
//                     >
//                       Save
//                     </Button>
//                   ) : (
//                     <>
//                       <Button
//                         icon={<EditOutlined />}
//                         onClick={() => handleFieldEditClick(flat, "title")}
//                       >
//                         Title
//                       </Button>
//                       <Button
//                         icon={<EditOutlined />}
//                         onClick={() => handleFieldEditClick(flat, "location")}
//                       >
//                         Location
//                       </Button>
//                       <Button
//                         icon={<EditOutlined />}
//                         onClick={() => handleFieldEditClick(flat, "floorPlan")}
//                       >
//                         Bedroom, Balcony, Bathroom
//                       </Button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default FlatList;

// "use client";

// import React, { useState } from "react";
// import { IFlatData } from "@/types";
// import { EditOutlined, SaveOutlined } from "@ant-design/icons";
// import { Input, InputNumber, Button, message, Modal } from "antd";
// import Image from "next/image";
// import { apiBaseUrl } from "@/config/config";

// interface FlatListProps {
//   flats: IFlatData[];
//   refetchFlats: () => Promise<void>;
// }

// const FlatList: React.FC<FlatListProps> = ({ flats, refetchFlats }) => {
//   const [editingField, setEditingField] = useState<string | null>(null);
//   const [editingData, setEditingData] = useState<any>({});
//   const [currentEditId, setCurrentEditId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleFieldEditClick = (flat: IFlatData, field: string) => {
//     setCurrentEditId(flat._id);
//     setEditingField(field);

//     setEditingData({
//       title: flat.title,
//       location: flat.location,
//       bedroomCount: flat.floorPlan?.bedroomCount ?? 0,
//       balconyCount: flat.floorPlan?.balconyCount ?? 0,
//       bathroomCount: flat.floorPlan?.bathroomCount ?? 0,
//     });
//   };

//   const handleChange = (field: string, value: any) => {
//     setEditingData((prev: any) => ({ ...prev, [field]: value }));
//   };

//   const patchFlat = async (flatId: string, field: string) => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("accessToken") || "";
//       const body: any = {};

//       if (field === "floorPlan") {
//         body.floorPlan = {
//           bedroomCount: editingData.bedroomCount,
//           balconyCount: editingData.balconyCount,
//           bathroomCount: editingData.bathroomCount,
//         };
//       } else {
//         body[field] = editingData[field];
//       }

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/host/flat/${flatId}`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(body),
//         }
//       );

//       const data = await res.json();

//       if (data.status === "success") {
//         message.success("Flat updated successfully");
//         await refetchFlats();
//       } else {
//         message.error("Failed to update flat");
//       }
//     } catch (error) {
//       console.error(error);
//       message.error("Something went wrong");
//     } finally {
//       setCurrentEditId(null);
//       setEditingField(null);
//       setEditingData({});
//       setLoading(false);
//     }
//   };
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const showModal = () => {
//     setIsModalOpen(true);
//   };
//   const handleOk = () => {
//     setIsModalOpen(false);
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow overflow-hidden capitalize">
//       <div className="overflow-x-auto">
//         <div className="md:hidden">
//           <h2 className="text-xl font-semibold text-gray-800 border-b-gray-400 pb-2 mb-4">
//             Flat Listings
//           </h2>
//           <div className="p-2 flex flex-col gap-2">
//             {flats.map((flat) => {
//               const { images } = flat;
//               return (
//                 <>
//                   <div className="flex items-center gap-10 shadow-lg p-4 rounded-lg hover:bg-gray-50 transition ">
//                     {/* image */}
//                     {images && images?.length > 0 ? (
//                       <Image
//                         src={apiBaseUrl + images[0]}
//                         height={50}
//                         width={60}
//                         alt={flat?.title || "Land Image"}
//                       />
//                     ) : (
//                       <div
//                         style={{
//                           width: 100,
//                           height: 100,
//                           background: "#f0f0f0",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           color: "#999",
//                           fontSize: 12,
//                         }}
//                       >
//                         No Image
//                       </div>
//                     )}

//                     <p
//                       key={flat._id}
//                       className="font-bold text-gray-800"
//                       onClick={showModal}
//                     >
//                       {flat.title || "No title"}
//                     </p>
//                   </div>
//                   <Modal
//                     title="Room Details"
//                     centered
//                     closable={{ "aria-label": "Custom Close Button" }}
//                     open={isModalOpen}
//                     footer={null}
//                     onOk={handleOk}
//                     onCancel={handleCancel}
//                   >
//                     <p className="border-b-1 border-gray-300 p-2">
//                       Land Title: {flat.title || "No title"}
//                     </p>
//                     <p className="border-b-1 border-gray-300 p-2">
//                       Status:{" "}
//                       {flat.publishStatus?.replace(/_/g, " ") || "No Status"}
//                     </p>
//                     <p className="border-b-1 border-gray-300 p-2">
//                       Sold Status: {flat.isSold ? "Sold" : "Available"}{" "}
//                       <Button size="small" icon={<EditOutlined />} />
//                     </p>

//                     <p className="border-b-1 border-gray-300 p-2">
//                       Land Prize: {flat.price}{" "}
//                       <Button size="small" icon={<EditOutlined />} />
//                     </p>
//                     <p className=" p-2">
//                       Location: {flat.location}{" "}
//                       <Button size="small" icon={<EditOutlined />} />
//                     </p>
//                   </Modal>
//                 </>
//               );
//             })}
//           </div>
//         </div>
//         <table className="hidden md:block min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
//                 Image
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
//                 Title
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
//                 Sold Status
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
//                 Location
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
//                 Flat Price
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
//                 Bedroom
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
//                 Balcony
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
//                 Bathroom
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {flats.map((flat) => (
//               <tr key={flat._id}>
//                 <td className="px-6 py-4">
//                   {flat?.images && flat.images?.length > 0 ? (
//                     <Image
//                       src={apiBaseUrl + flat.images[0]}
//                       height={60}
//                       width={90}
//                       alt={flat.title || "Flat Image"}
//                       className="rounded-md"
//                     />
//                   ) : (
//                     <div
//                       style={{
//                         width: 90,
//                         height: 60,
//                         background: "#f0f0f0",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         color: "#999",
//                         fontSize: 12,
//                       }}
//                     >
//                       No Image
//                     </div>
//                   )}
//                 </td>
//                 <td className="px-6 py-4">
//                   {currentEditId === flat._id && editingField === "title" ? (
//                     <Input
//                       value={editingData.title}
//                       onChange={(e) => handleChange("title", e.target.value)}
//                     />
//                   ) : (
//                     flat.title || "N/A"
//                   )}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {flat.publishStatus?.replace(/_/g, " ") || "No Status"}
//                 </td>

//                 {/* Sold Status */}
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   {flat.isSold ? "Sold" : "Available"}
//                 </td>

//                 {/* Location */}
//                 <td className="px-6 py-4">
//                   {currentEditId === flat._id && editingField === "location" ? (
//                     <Input
//                       value={editingData.location}
//                       onChange={(e) => handleChange("location", e.target.value)}
//                     />
//                   ) : (
//                     flat.location || "N/A"
//                   )}
//                 </td>
//                 <td className="px-6 py-4">
//                   {currentEditId === flat._id && editingField === "price" ? (
//                     <Input
//                       value={editingData.location}
//                       onChange={(e) => handleChange("price", e.target.value)}
//                     />
//                   ) : (
//                     flat.price || "N/A"
//                   )}
//                 </td>

//                 {/* Bedroom */}
//                 <td className="px-6 py-4">
//                   {currentEditId === flat._id &&
//                   editingField === "floorPlan" ? (
//                     <InputNumber
//                       min={0}
//                       value={editingData.bedroomCount}
//                       onChange={(val) => handleChange("bedroomCount", val)}
//                     />
//                   ) : (
//                     flat.floorPlan?.bedroomCount ?? "N/A"
//                   )}
//                 </td>

//                 {/* Balcony */}
//                 <td className="px-6 py-4">
//                   {currentEditId === flat._id &&
//                   editingField === "floorPlan" ? (
//                     <InputNumber
//                       min={0}
//                       value={editingData.balconyCount}
//                       onChange={(val) => handleChange("balconyCount", val)}
//                     />
//                   ) : (
//                     flat.floorPlan?.balconyCount ?? "N/A"
//                   )}
//                 </td>

//                 {/* Bathroom */}
//                 <td className="px-6 py-4">
//                   {currentEditId === flat._id &&
//                   editingField === "floorPlan" ? (
//                     <InputNumber
//                       min={0}
//                       value={editingData.bathroomCount}
//                       onChange={(val) => handleChange("bathroomCount", val)}
//                     />
//                   ) : (
//                     flat.floorPlan?.bathroomCount ?? "N/A"
//                   )}
//                 </td>

//                 <td className="px-6 py-4 space-x-1">
//                   {currentEditId === flat._id ? (
//                     <Button
//                       icon={<SaveOutlined />}
//                       loading={loading}
//                       onClick={() => patchFlat(flat._id, editingField!)}
//                     >
//                       Save
//                     </Button>
//                   ) : (
//                     <>
//                       <Button
//                         icon={<EditOutlined />}
//                         onClick={() => handleFieldEditClick(flat, "title")}
//                       >
//                         Title
//                       </Button>
//                       <Button
//                         icon={<EditOutlined />}
//                         onClick={() => handleFieldEditClick(flat, "location")}
//                       >
//                         Location
//                       </Button>
//                       <Button
//                         icon={<EditOutlined />}
//                         onClick={() => handleFieldEditClick(flat, "floorPlan")}
//                       >
//                         Bedroom, Balcony, Bathroom
//                       </Button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default FlatList;
