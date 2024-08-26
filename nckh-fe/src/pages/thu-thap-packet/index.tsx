import React, { useState, useEffect, useRef } from "react";
import { Button, Table, Modal } from "antd";

interface Packet {
  key: number;
  src_ip: string;
  dst_ip: string;
  protocol: string;
  details: string;
}

const ThuThapPacket: React.FC = () => {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPacket, setSelectedPacket] = useState<string | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (isGenerating) {
      if (websocketRef.current) {
        console.warn("WebSocket connection already established");
        return; // Tránh tạo nhiều kết nối
      }

      const websocket = new WebSocket("ws://localhost:8000/ws");
      websocketRef.current = websocket;

      websocket.onmessage = (event: MessageEvent) => {
        try {
          const packetData = JSON.parse(event.data);
          const newPacket: Packet = {
            key: packetData.packet_counter,
            src_ip: packetData.src_ip,
            dst_ip: packetData.dst_ip,
            protocol: packetData.protocol,
            details: packetData.details,
          };
          setPackets((prevPackets) => [...prevPackets, newPacket]);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      websocket.onclose = () => {
        console.log("WebSocket closed");
        websocketRef.current = null;
      };

      websocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } else {
      if (websocketRef.current) {
        websocketRef.current.close();
        websocketRef.current = null;
      }
    }

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
        websocketRef.current = null;
      }
    };
  }, [isGenerating]);

  const handleStartGenerating = async () => {
    try {
      const response = await fetch("http://localhost:8000/start");
      if (response.ok) {
        setIsGenerating(true);
      } else {
        console.error("Failed to start data generation");
      }
    } catch (error) {
      console.error("Error starting data generation:", error);
    }
  };

  const handleStopGenerating = async () => {
    try {
      const response = await fetch("http://localhost:8000/stop");
      if (response.ok) {
        setIsGenerating(false);
      } else {
        console.error("Failed to stop data generation");
      }
    } catch (error) {
      console.error("Error stopping data generation:", error);
    }
  };

  const handleRowClick = (record: Packet) => {
    setSelectedPacket(record.details);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedPacket(null);
  };

  const columns = [
    {
      title: "No.",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Source IP",
      dataIndex: "src_ip",
      key: "src_ip",
    },
    {
      title: "Destination IP",
      dataIndex: "dst_ip",
      key: "dst_ip",
    },
    {
      title: "Protocol",
      dataIndex: "protocol",
      key: "protocol",
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>Real-Time Data</h1>
      <Button
        type="primary"
        onClick={handleStartGenerating}
        style={{ marginBottom: 20, marginRight: 10 }}
      >
        Start Generating Data
      </Button>
      <Button
        type="default"
        onClick={handleStopGenerating}
        style={{ marginBottom: 20 }}
      >
        Stop Generating Data
      </Button>
      <Table
        dataSource={packets}
        columns={columns}
        pagination={false}
        bordered
        size="small"
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />
      <Modal
        title="Packet Details"
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <pre>{selectedPacket}</pre>
      </Modal>
    </div>
  );
};

export default ThuThapPacket;
