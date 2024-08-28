import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import { get } from '../../utils/services/thongkect'; // Hàm gọi API

// Định nghĩa kiểu dữ liệu cho các đối tượng trong bảng
interface Type {
  key: number; // Key duy nhất cho mỗi hàng trong bảng
  name: string;
  date: string;
}

const ThongKeCT: React.FC = () => {
  const [data, setData] = useState<Type[]>([]); // State để lưu trữ dữ liệu

  // Hàm gọi API và xử lý dữ liệu
  const fetchPromotions = async () => {
    try {
      const response = await get(); // Gọi API
      // Kiểm tra nếu response có định dạng đúng, xử lý dữ liệu
      const formattedData = response.data.map((item: any, index: number) => ({
        key: index, // Sử dụng index làm key cho mỗi hàng
        name: item.name || 'N/A', // Nếu không có name, hiển thị 'N/A'
        date: item.date || 'N/A', // Nếu không có date, hiển thị 'N/A'
      }));
      setData(formattedData); // Cập nhật state với dữ liệu đã xử lý
    } catch (error) {
      console.error('Failed to fetch promotions:', error);
      setData([]); // Đảm bảo bảng trống nếu có lỗi
    }
  };

  // Gọi hàm fetch dữ liệu khi component được mount
  useEffect(() => {
    fetchPromotions();
  }, []);

  // Định nghĩa các cột hiển thị trong bảng
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={fetchPromotions}>
        Refresh Data
      </Button>
      <Table dataSource={data} columns={columns} pagination={{ pageSize: 5 }} />
    </div>
  );
};

export default ThongKeCT;
