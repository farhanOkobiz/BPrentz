import { Table, Button, Modal } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { RowData } from "./types";

interface TabTableProps {
  data: RowData[];
}

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useState(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 968);
    };
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  return isMobile;
};

const TabTable: React.FC<TabTableProps> = ({ data }) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<RowData | null>(null);
  const isMobile = useIsMobile();

  const showModal = (record: RowData) => {
    setSelected(record);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setSelected(null);
  };

  const columns: ColumnsType<RowData> = [
    {
      title: "Title",
      dataIndex: ["rent", "title"],
      key: "title",
    },
    {
      title: "Location",
      dataIndex: ["rent", "location"],
      key: "location",
    },
    {
      title: "Check-in",
      dataIndex: "checkinDate",
      key: "checkinDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Check-out",
      dataIndex: "checkoutDate",
      key: "checkoutDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Guests",
      dataIndex: "guestCount",
      key: "guestCount",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `${price} ৳`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => status.replace(/_/g, " ").toUpperCase(),
    },
    {
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => showModal(record)}
        />
      ),
    },
  ];

  return (
    <>
      {isMobile ? (
        <div className="space-y-2">
          {data.map((item) => (
            <div
              key={item._id}
              className="p-3 shadow-sm rounded hover:bg-gray-50 cursor-pointer"
              onClick={() => showModal(item)}
            >
              <p className="text-base font-medium text-black">
                {item.rent.title}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <Table<RowData>
          columns={columns}
          dataSource={data}
          rowKey={(record) => record._id}
          pagination={false}
        />
      )}

      <Modal
        title="Booking Details"
        open={visible}
        onCancel={handleCancel}
        footer={null}
      >
        {selected && (
          <div className="space-y-2">
            <p>
              <strong>Title:</strong> {selected.rent.title}
            </p>
            <p>
              <strong>Location:</strong> {selected.rent.location}
            </p>
            <p>
              <strong>Check-in:</strong>{" "}
              {new Date(selected.checkinDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Check-out:</strong>{" "}
              {new Date(selected.checkoutDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Guests:</strong> {selected.guestCount}
            </p>
            <p>
              <strong>Price:</strong> {selected.price} ৳
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {selected.status.replace(/_/g, " ").toUpperCase()}
            </p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default TabTable;
