import { Button, Form, Input, Modal, Popconfirm, Table, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusSquareOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import AboutUsServices from "../services/aboutUs.services";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const {
  processAddAboutUs,
  processEditAboutUs,
  processGetAboutUs,
  processDeleteAboutUs,
} = AboutUsServices;

// YouTube URL parser to get video ID
const getYouTubeVideoId = (url) => {
  if (!url) return null;

  // Handle different YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
};

// YouTube Video Embed Component
const YouTubeEmbed = ({ url }) => {
  const videoId = getYouTubeVideoId(url);

  if (!videoId) {
    return <div>Invalid YouTube URL</div>;
  }

  return (
    <div className="video-responsive">
      <iframe
        width="400"
        height="200"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

// Integrated Description Component
const Description = ({ content }) => {
  if (!content) return <span>No description available</span>;
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
};

const AboutUs = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // Fetch AboutUs data
  const { data: aboutUsData = [], isLoading } = useQuery({
    queryKey: ["aboutUs"],
    queryFn: processGetAboutUs,
  });

  // Add AboutUs mutation
  const addMutation = useMutation({
    mutationFn: processAddAboutUs,
    onSuccess: () => {
      message.success("About Us section added successfully");
      queryClient.invalidateQueries({ queryKey: ["aboutUs"] });
      setIsModalVisible(false);
      form.resetFields();
    },
    onError: (error) => {
      message.error(`Failed to add: ${error.message}`);
    },
  });

  // Edit AboutUs mutation
  const editMutation = useMutation({
    mutationFn: ({ id, payload }) => processEditAboutUs(id, payload),
    onSuccess: () => {
      message.success("About Us section updated successfully");
      queryClient.invalidateQueries({ queryKey: ["aboutUs"] });
      setIsModalVisible(false);
      setEditingItem(null);
      form.resetFields();
    },
    onError: (error) => {
      message.error(`Failed to update: ${error.message}`);
    },
  });

  // Delete AboutUs mutation
  const deleteMutation = useMutation({
    mutationFn: processDeleteAboutUs,
    onSuccess: () => {
      message.success("About Us section deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["aboutUs"] });
    },
    onError: (error) => {
      message.error(`Failed to delete: ${error.message}`);
    },
  });

  // Handle form submission
  const handleFormSubmit = (values) => {
    if (editingItem) {
      editMutation.mutate({ id: editingItem._id, payload: values });
    } else {
      addMutation.mutate(values);
    }
  };

  // Handle edit button click
  const handleEdit = (record) => {
    setEditingItem(record);
    setIsModalVisible(true);
    form.setFieldsValue({
      videoUrl: record.videoUrl,
      description: record.description,
    });
  };

  // Handle modal cancel
  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingItem(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Video",
      dataIndex: "videoUrl",
      key: "videoUrl",
      render: (videoUrl) => <YouTubeEmbed url={videoUrl} />,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description) => <Description content={description} />,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure to delete this item?"
            onConfirm={() => deleteMutation.mutate(record._id)}
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
        <h1 className="text-2xl font-bold">About Us</h1>
        <Button
          className="custom-button"
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: 16 }}
        >
          <PlusSquareOutlined /> Add New
        </Button>
      </div>

      <Table
        dataSource={aboutUsData}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={
          editingItem ? "Edit About Us Section" : "Create About Us Section"
        }
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleFormSubmit} layout="vertical">
          <Form.Item
            name="videoUrl"
            label="Video URL"
            rules={[{ required: true, message: "Please enter the video URL" }]}
          >
            <Input placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=Ha4fSclVanI)" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <ReactQuill theme="snow" />
          </Form.Item>

          <Button
            className="custom-button"
            htmlType="submit"
            loading={addMutation.isPending || editMutation.isPending}
          >
            {editingItem ? "Update" : "Save"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default AboutUs;
