import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  Popconfirm,
  Table,
  Upload,
  message,
} from "antd";
import {
  PlusSquareOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AmenitiesServices from "../services/amenities.services";
import { baseUrl } from "../constants/env";

const {
  processAddAmenities,
  processDeleteAmenities,
  processEditAmenities,
  processGetAmenities,
  processEditAmenitiesField,
} = AmenitiesServices;

const Amenities = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ["amenities"],
    queryFn: processGetAmenities,
  });

  const amenities = data || [];

  const { mutate: addAmenity, isPending: isAdding } = useMutation({
    mutationFn: (formData) => processAddAmenities(formData),
    onSuccess: () => {
      message.success("Amenity added successfully");
      queryClient.invalidateQueries({ queryKey: ["amenities"] });
      handleModalCancel();
    },
    onError: () => {
      message.error("Failed to add amenity");
    },
  });

  const { mutate: editAmenity, isPending: isEditing } = useMutation({
    mutationFn: ({ id, formData }) => processEditAmenities(id, formData),
    onSuccess: () => {
      message.success("Amenity updated successfully");
      queryClient.invalidateQueries({ queryKey: ["amenities"] });
      handleModalCancel();
    },
    onError: () => {
      message.error("Failed to update amenity");
    },
  });
  const { mutate: editAmenityField } = useMutation({
    mutationFn: ({ id, data }) => processEditAmenitiesField(id, data),
    onSuccess: () => {
      message.success("Amenity field updated successfully");
      queryClient.invalidateQueries({ queryKey: ["amenities"] });
      handleModalCancel();
    },
    onError: () => {
      message.error("Failed to update amenity field");
    },
  });

  const { mutate: deleteAmenity, isPending: isDeleting } = useMutation({
    mutationFn: (id) => processDeleteAmenities(id),
    onSuccess: () => {
      message.success("Amenity deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["amenities"] });
    },
    onError: () => {
      message.error("Failed to delete amenity");
    },
  });

  const handleModalCancel = () => {
    form.resetFields();
    setEditingAmenity(null);
    setFileList([]);
    setIsModalVisible(false);
  };

  const handleFormFinish = async () => {
    try {
      const values = await form.validateFields();
      const isImageUpdated = fileList.length > 0 && fileList[0].originFileObj;

      if (editingAmenity) {
        if (isImageUpdated) {
          const formData = new FormData();
          formData.append("amenitiesLabel", values.amenitiesLabel);
          formData.append("amenitiesImage", fileList[0].originFileObj);

          editAmenity({ id: editingAmenity._id, formData });
        } else {
          const payload = { amenitiesLabel: values.amenitiesLabel };
          editAmenityField({ id: editingAmenity._id, data: payload });
        }
      } else {
        const formData = new FormData();
        formData.append("amenitiesLabel", values.amenitiesLabel);
        if (isImageUpdated) {
          formData.append("amenitiesImage", fileList[0].originFileObj);
        }

        addAmenity(formData);
      }
    } catch (err) {
      console.error("Validation failed:", err);
      message.error("Failed to submit amenity");
    }
  };

  const handleEdit = (record) => {
    setEditingAmenity(record);
    form.setFieldsValue({ amenitiesLabel: record.amenitiesLabel });
    if (record.amenitiesImage) {
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: `${baseUrl}${record.amenitiesImage}`,
        },
      ]);
    }
    setIsModalVisible(true);
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleRemoveImage = () => {
    setFileList([]);
  };

  const columns = [
    {
      title: "Label",
      dataIndex: "amenitiesLabel",
      key: "amenitiesLabel",
    },
    {
      title: "Image",
      dataIndex: "amenitiesImage",
      key: "amenitiesImage",
      render: (url) => (
        <Image
          src={`${baseUrl}${url}`}
          alt="Amenity"
          style={{ width: 50, height: 50 }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure to delete this amenity?"
            onConfirm={() => deleteAmenity(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full bg-white my-6 p-8 rounded-md">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Amenities Management</h1>
        <Button
          className="custom-button"
          onClick={() => {
            setEditingAmenity(null);
            form.resetFields();
            setFileList([]);
            setIsModalVisible(true);
          }}
        >
          <PlusSquareOutlined /> Add New
        </Button>
      </div>

      <Table
        dataSource={amenities}
        columns={columns}
        rowKey="_id"
        loading={isPending || isDeleting}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingAmenity ? "Edit Amenity" : "Create Amenity"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFormFinish}>
          <Form.Item
            name="amenitiesLabel"
            label="Amenity Label"
            rules={[{ required: true, message: "Please enter a label" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Amenity Image">
            <Upload
              listType="picture-card"
              beforeUpload={() => false}
              fileList={fileList}
              onChange={handleFileChange}
              onRemove={handleRemoveImage}
              multiple={false}
            >
              {fileList.length >= 1 ? null : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Button
            className="custom-button"
            htmlType="submit"
            loading={isAdding || isEditing}
          >
            {editingAmenity ? "Update" : "Create"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Amenities;
