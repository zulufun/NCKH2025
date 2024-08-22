import React, { useState, useEffect, useRef } from "react";
import { Button, Table } from "antd";

interface Packet {
  key: number;
  text: string;
}

const ThongKeCount: React.FC = () => {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const websocketRef = useRef<WebSocket | null>(null); // Sử dụng useRef để lưu trữ WebSocket

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
          const newPacket: Packet = {
            key: packets.length + 1,
            text: event.data,
          };
          setPackets((prevPackets) => [...prevPackets, newPacket]);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      websocket.onclose = () => {
        console.log("WebSocket closed");
        websocketRef.current = null; // Đặt lại ref khi kết nối đóng
      };

      websocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } else {
      // Ngừng kết nối khi không còn cần thiết
      if (websocketRef.current) {
        websocketRef.current.close();
        websocketRef.current = null;
      }
    }

    // Cleanup function
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
        websocketRef.current = null;
      }
    };
  }, [isGenerating, packets]);

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

  const columns = [
    {
      title: "No.",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Packet Information",
      dataIndex: "text",
      key: "text",
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
      />
    </div>
  );
};

export default ThongKeCount;
