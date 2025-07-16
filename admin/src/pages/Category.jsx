import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CategoryServices from "../services/category.services";
import FeatureServices from "../services/feature.services";
const {
  processDeleteCategory,
  processEditCategory,
  processGetCategory,
  processAddCategory,
} = CategoryServices;

const { processGetFeature } = FeatureServices;

import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Table,
  Tabs,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";

const Category = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();
  const [activeFeatureId, setActiveFeatureId] = useState(null);
  const queryClient = useQueryClient();

  // Fetch all features
  const { data: featuresData, isLoading: featuresLoading } = useQuery({
    queryKey: ["features"],
    queryFn: processGetFeature,
  });

  // Fetch categories for the selected feature
  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ["categories", activeFeatureId],
    queryFn: () => processGetCategory(activeFeatureId),
    enabled: !!activeFeatureId,
  });

  const categories = categoryData?.data || [];

  // --- Mutations ---
  const addCategoryMutation = useMutation({
    mutationFn: processAddCategory,
    onSuccess: () => {
      message.success("Category added successfully");
      queryClient.invalidateQueries({
        queryKey: ["categories", activeFeatureId],
      });
    },
    onError: () => message.error("Failed to add category"),
  });

  const editCategoryMutation = useMutation({
    mutationFn: ({ id, payload }) => processEditCategory(id, payload),
    onSuccess: () => {
      message.success("Category updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["categories", activeFeatureId],
      });
    },
    onError: () => message.error("Failed to update category"),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: processDeleteCategory,
    onSuccess: () => {
      message.success("Category deleted");
      queryClient.invalidateQueries({
        queryKey: ["categories", activeFeatureId],
      });
    },
    onError: () => message.error("Failed to delete category"),
  });

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingCategory(null);
  };

  const handleFormFinish = (values) => {
    const payload = {
      categoryName: values.categoryName,
      feature: [values.feature], // backend expects array
    };

    if (editingCategory) {
      editCategoryMutation.mutate({ id: editingCategory._id, payload });
    } else {
      addCategoryMutation.mutate(payload);
    }

    handleModalCancel();
  };

  const handleEdit = (record) => {
    setEditingCategory(record);
    setIsModalVisible(true);
    form.setFieldsValue({
      categoryName: record.categoryName,
      feature: record.feature[0], // assuming one feature
    });
  };

  const handleDelete = (id) => {
    deleteCategoryMutation.mutate(id);
  };

  const columns = [
    {
      title: "Category Name",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Service",
      dataIndex: "feature",
      key: "feature",
      render: (featureIds) => {
        const names = featureIds
          .map(
            (id) => featuresData?.data?.find((f) => f._id === id)?.featureName
          )
          .filter(Boolean);
        return names.join(", ") || "Unknown";
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginBottom: 4 }}
          />
          <Popconfirm
            title="Are you sure to delete this category?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];
  useEffect(() => {
    if (!activeFeatureId && featuresData?.data?.length > 0) {
      setActiveFeatureId(featuresData.data[0]._id);
    }
  }, [featuresData, activeFeatureId]);
  return (
    <div className="w-full bg-white my-6 p-8 rounded-md">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button
          className="custom-button"
          onClick={() => {
            form.resetFields();
            setEditingCategory(null);
            setIsModalVisible(true);
          }}
          // disabled={!activeFeatureId}
        >
          <PlusSquareOutlined /> Add New
        </Button>
      </div>

      <Tabs
        activeKey={activeFeatureId || ""}
        onChange={(key) => setActiveFeatureId(key)}
        items={
          featuresData?.data?.map((feature) => ({
            label: feature.featureName,
            key: feature._id,
          })) || []
        }
      />

      <div className="categoryTable">
        <Table
          dataSource={categories}
          columns={columns}
          loading={categoryLoading}
          rowKey="_id"
          scroll={{ x: "max-content" }}
          className="mt-4 categoryTable"
          pagination={false}
        />
      </div>

      <Modal
        title={editingCategory ? "Edit Category" : "Create Category"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleFormFinish} layout="vertical">
          <Form.Item
            name="categoryName"
            label="Category Name"
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="feature"
            label="Feature"
            rules={[{ required: true, message: "Please select a feature" }]}
          >
            <Select placeholder="Select a feature" loading={featuresLoading}>
              {featuresData?.data?.map((feature) => (
                <Select.Option key={feature._id} value={feature._id}>
                  {feature.featureName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Button
            className="custom-button"
            htmlType="submit"
            loading={
              addCategoryMutation.isPending || editCategoryMutation.isPending
            }
          >
            {editingCategory ? "Update" : "Create"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Category;
