import { Button, Form, Input, Modal, Popconfirm, Table, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import FeatureServices from "../services/feature.services";

const {
  processGetFeature,
  processAddFeature,
  // processDeleteFeature,
  processEditFeature,
} = FeatureServices;

const Feature = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingFeature, setEditingFeature] = useState(null);

  const queryClient = useQueryClient();

  // Fetch features
  const { data: responseData, isPending } = useQuery({
    queryKey: ["features"],
    queryFn: processGetFeature,
  });

  const features = responseData?.data || [];

  // Add feature
  const { mutate: addFeature, isPending: isAdding } = useMutation({
    mutationFn: processAddFeature,
    onSuccess: () => {
      message.success("Feature added successfully");
      queryClient.invalidateQueries({ queryKey: ["features"] });
      handleModalCancel();
    },
    onError: () => {
      message.error("Failed to add feature");
    },
  });

  // Edit feature
  const { mutate: editFeature, isPending: isEditing } = useMutation({
    mutationFn: ({ id, data }) => processEditFeature(data, id),
    onSuccess: () => {
      message.success("Feature updated successfully");
      queryClient.invalidateQueries({ queryKey: ["features"] });
      handleModalCancel();
    },
    onError: () => {
      message.error("Failed to update feature");
    },
  });

  // Delete feature
  // const { mutate: deleteFeature, isPending: isDeleting } = useMutation({
  //   mutationFn: (id) => processDeleteFeature(id),
  //   onSuccess: () => {
  //     message.success("Feature deleted successfully");
  //     queryClient.invalidateQueries({ queryKey: ["features"] });
  //   },
  //   onError: () => {
  //     message.error("Failed to delete feature");
  //   },
  // });

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingFeature(null);
  };

  const handleFormFinish = (values) => {
    if (editingFeature) {
      editFeature({ id: editingFeature._id, data: values });
    } else {
      addFeature(values);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "featureName",
      key: "featureName",
    },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   render: (_, record) => (
    //     <div className="flex flex-col gap-1">
    //       {/* <Button
    //         icon={<EditOutlined />}
    //         onClick={() => {
    //           setEditingFeature(record);
    //           setIsModalVisible(true);
    //           form.setFieldsValue({ featureName: record.featureName });
    //         }}
    //         style={{ marginBottom: 4 }}
    //       /> */}
    //       {/* <Popconfirm
    //         title="Are you sure to delete this feature?"
    //         onConfirm={() => deleteFeature(record._id)}
    //         okText="Yes"
    //         cancelText="No"
    //       >
    //         <Button icon={<DeleteOutlined />} danger />
    //       </Popconfirm> */}
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="w-full bg-white my-6 p-8 rounded-md">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Services</h1>
        {/* <Button
          className="custom-button"
          onClick={() => {
            setEditingFeature(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          <PlusSquareOutlined /> Add New
        </Button> */}
      </div>

      <Table
        dataSource={features}
        columns={columns}
        rowKey="_id"
        // loading={isPending || isDeleting}
        loading={isPending}
        scroll={{ x: "max-content" }}
        pagination={false}
      />

      <Modal
        title={editingFeature ? "Edit Feature" : "Create Feature"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleFormFinish} layout="vertical">
          <Form.Item
            name="featureName"
            label="Feature Name"
            rules={[{ required: true, message: "Please enter a feature name" }]}
          >
            <Input />
          </Form.Item>

          <Button
            className="custom-button"
            htmlType="submit"
            loading={isAdding || isEditing}
          >
            {editingFeature ? "Update" : "Create"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Feature;
