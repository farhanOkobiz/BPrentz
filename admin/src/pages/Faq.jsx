import { Button, Form, Input, Modal, Popconfirm, Table, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import FaqServices from "../services/faq.services";
import { truncateText } from "../utils/truncateText";

const { processAddFaq, processDeleteFaq, processEditFaq, processGetFaq } =
  FaqServices;

const Faq = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingFaq, setEditingFaq] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});

  const queryClient = useQueryClient();

  const {
    data: faqRes,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["faqs"],
    queryFn: processGetFaq,
  });

  const faqs = faqRes?.data || [];

  const { mutate: addFaq, isPending: isAdding } = useMutation({
    mutationFn: processAddFaq,
    onSuccess: () => {
      message.success("FAQ added successfully");
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      handleModalCancel();
    },
    onError: () => {
      message.error("Failed to add FAQ");
    },
  });

  const { mutate: editFaq, isPending: isEditing } = useMutation({
    mutationFn: ({ id, data }) => processEditFaq(data, id),
    onSuccess: () => {
      message.success("FAQ updated successfully");
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      handleModalCancel();
    },
    onError: () => {
      message.error("Failed to update FAQ");
    },
  });

  const { mutate: deleteFaq, isPending: isDeleting } = useMutation({
    mutationFn: (id) => processDeleteFaq(id),
    onSuccess: () => {
      message.success("FAQ deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
    onError: () => {
      message.error("Failed to delete FAQ");
    },
  });

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingFaq(null);
  };

  const handleFormFinish = async () => {
    try {
      const values = await form.validateFields();
      if (editingFaq) {
        editFaq({ id: editingFaq._id, data: values });
      } else {
        addFaq(values);
      }
    } catch (err) {
      console.error("Validation failed:", err);
    }
  };

  const handleEdit = (record) => {
    setEditingFaq(record);
    setIsModalVisible(true);
    form.setFieldsValue({
      faqQuestion: record.faqQuestion,
      faqAnswer: record.faqAnswer,
    });
  };

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const columns = [
    {
      title: "FAQ Question",
      dataIndex: "faqQuestion",
      key: "faqQuestion",
      ellipsis: true,
      render: (text) => (
        <div style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
          {text}
        </div>
      ),
    },
    {
      title: "FAQ Answer",
      dataIndex: "faqAnswer",
      key: "faqAnswer",
      ellipsis: true,
      render: (text, record) => {
        const isExpanded = expandedRows[record._id];
        const displayedText = isExpanded ? text : truncateText(text, 100);
        return (
          <div style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
            {displayedText}
            {text.length > 100 && (
              <Button
                type="link"
                onClick={() => toggleExpand(record._id)}
                style={{ padding: 0 }}
              >
                {isExpanded ? "See less" : "See more"}
              </Button>
            )}
          </div>
        );
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
            title="Are you sure to delete this FAQ?"
            onConfirm={() => deleteFaq(record._id)}
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
        <h1 className="text-2xl font-bold">FAQ Management</h1>
        <Button
          className="custom-button"
          onClick={() => {
            form.resetFields();
            setEditingFaq(null);
            setIsModalVisible(true);
          }}
        >
          <PlusSquareOutlined /> Add New
        </Button>
      </div>

      <Table
        dataSource={faqs}
        columns={columns}
        rowKey="_id"
        loading={isPending || isDeleting}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingFaq ? "Edit FAQ" : "Create FAQ"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFormFinish}>
          <Form.Item
            name="faqQuestion"
            label="FAQ Question"
            rules={[{ required: true, message: "Please enter a question" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="faqAnswer"
            label="FAQ Answer"
            rules={[{ required: true, message: "Please enter an answer" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Button
            className="custom-button"
            htmlType="submit"
            loading={isAdding || isEditing}
          >
            {editingFaq ? "Update" : "Create"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Faq;
