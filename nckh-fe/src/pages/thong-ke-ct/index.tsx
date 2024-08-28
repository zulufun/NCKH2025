import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Form, Modal,Row,Breadcrumb, Divider } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { PromotionType, ProductType } from './types';
import PromotionForm from './components/Form';
import { getPromotion, createPromotion, deletePromotion, updatePromotion } from '../../utils/services/thongkect';

const ThongKeCT: React.FC = () => {
  const [data, setData] = useState<PromotionType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [editPromotion, setEditPromotion] = useState<PromotionType | null>(null);
  const [action, setAction] = useState<'Add' | 'Edit'>('Add');

  const fetchPromotions = useCallback(async () => {
    try {
      const result = await getPromotion();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch promotions:', error);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch('/api/products');
      const result = await response.json();
      setProducts(result);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  }, []);

  useEffect(() => {
    fetchPromotions();
    fetchProducts();
  }, [fetchPromotions, fetchProducts]);

  const handleAdd = () => {
    setAction('Add');
    form.resetFields();
    setVisible(true);
  };

  const handleEdit = (record: PromotionType) => {
    setAction('Edit');
    setEditPromotion(record);
    form.setFieldsValue(record);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleFinish = async (values: { name: string; id_product: string }) => {
    try {
      if (action === 'Add') {
        await createPromotion(values);
      } else if (action === 'Edit' && editPromotion) {
        await updatePromotion(editPromotion.id, values);
      }
      setVisible(false);
      fetchPromotions();
    } catch (error) {
      console.error(`Failed to ${action === 'Add' ? 'add' : 'update'} promotion:`, error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePromotion(id);
      fetchPromotions();
    } catch (error) {
      console.error('Failed to delete promotion:', error);
    }
  };

  const columns: ColumnsType<PromotionType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      align: 'center',
    },
    {
      title: 'Name',
      dataIndex: 'username',
      key: 'username',
      width: 200,
      align: 'left',
    },
    {
      title: 'Ngày Phát hiện',
      dataIndex: 'date',
      key: 'date',
      width: 200,
      align: 'left',
      render: (productId: string) => {
        const product = products.find(p => p.value === productId);
        return product ? product.label : 'Unknown';
      },
    },
    {
      title: 'Nội dung log',
      dataIndex: 'date',
      key: 'date',
      width: 200,
      align: 'left',
      render: (productId: string) => {
        const product = products.find(p => p.value === productId);
        return product ? product.label : 'Unknown';
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.id)} style={{ marginLeft: 8 }}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="thong-ke-ct">
      <Row>
        <Breadcrumb
          style={{ margin: "auto", marginLeft: 0 }}
          items={[
            {
              title: "Thống kê",
            },
            {
              title: <span style={{ fontWeight: "bold" }}>Thống kê chi tiết</span>,
            },
          ]}
        />
        <Divider style={{ margin: "10px" }}></Divider>
      </Row>
      
      <Button type="primary" onClick={handleAdd}>Thêm mới dữ liệu</Button>
      <Table dataSource={data} columns={columns} rowKey="id" />

      <PromotionForm
        isAdd={visible}
        action={action}
        form={form}
        onFinish={handleFinish}
        onReset={() => setVisible(false)}
        product={products}
      />
      
    </div>
  );
};

export default ThongKeCT;
