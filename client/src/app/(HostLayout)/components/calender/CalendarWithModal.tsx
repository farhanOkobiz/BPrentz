"use client";

import React, { useEffect, useState } from "react";
import { Modal, Form, DatePicker, Select, Button, message } from "antd";
import dayjs from "dayjs";
import { IRent } from "@/types";
import { getAllHostRents } from "@/services/rents";

const { RangePicker } = DatePicker;

interface BlockDateModalProps {
  open: boolean;
  onClose: () => void;
}

const CalendarWithModal: React.FC<BlockDateModalProps> = ({
  open,
  onClose,
}) => {
  const [rents, setRents] = useState<IRent[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken") || "";

      try {
        const res = await getAllHostRents(token);
        setRents(res?.data || []);
      } catch (error) {
        console.error("Error fetching host rents:", error);
        message.error("Could not load your rent listings. Please try again.");
      }
    };

    if (open) fetchData();
  }, [open]);

  const onFinish = async (values: any) => {
    const { rentId, dateRange } = values;

    if (!dateRange || dateRange.length !== 2) {
      return message.warning("Please select a valid date range.");
    }

    const token = localStorage.getItem("accessToken") || "";
    const startDate = dayjs(dateRange[0]).format("YYYY-MM-DD");
    const endDate = dayjs(dateRange[1]).format("YYYY-MM-DD");

    try {
      setLoading(true);
      await fetch("/host/blockedate-create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rent: rentId, startDate, endDate }),
      });

      message.success("Date range successfully blocked.");
      form.resetFields();
      onClose();
    } catch (err) {
      console.error("Failed to block date:", err);
      message.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <div className="text-lg font-semibold tracking-wider ">
          Block Dates For Your Rent Listing
        </div>
      }
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="rentId"
          label="Select Rent Listing"
          rules={[{ required: true, message: "Please choose a rent listing." }]}
        >
          <Select
            placeholder="Choose a rent listing to block dates for"
            disabled={rents.filter((r) => r.title)?.length === 0}
          >
            {rents
              .filter((rent) => rent.title)
              .map((rent) => (
                <Select.Option key={rent._id} value={rent._id}>
                  {rent.title}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="dateRange"
          label="Select Date Range to Block"
          rules={[{ required: true, message: "Please select a date range." }]}
        >
          <RangePicker
            style={{ width: "100%" }}
            disabledDate={(current) =>
              current && current < dayjs().startOf("day")
            }
            placeholder={["Start date", "End date"]}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            className="!bg-primary"
          >
            Confirm & Block Dates
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CalendarWithModal;
