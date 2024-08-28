import { Col, Modal, Row } from "antd";
import { Form, Input, Select } from "antd";
import { X } from "react-feather";
import { PromotionFormProps } from "../../thong-ke-ct/types";

const PromotionForm: React.FC<PromotionFormProps> = ({
  isAdd,
  action,
  form,
  onFinish,
  onReset,
  product,
}) => {
  return (
    <Modal
      title={`${action === "Add" ? "Thêm mới" : "Chỉnh sửa"} khuyến mãi`}
      open={isAdd}
      closeIcon={<X onClick={onReset} />}
      width={400}
      footer={false}
      centered
    >
      <Form form={form} onFinish={onFinish}>
        <Row gutter={10}>
          <Col span={24}>
            <Form.Item
              label="Tên Logs nguy hiểm"
              name="name"
              rules={[
                { required: true, message: "Tên Logs không được để trống" },
              ]}
            >
              <Input placeholder="Nhập tên" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Chọn Collection"
              name="collection"
              rules={[
                { required: true, message: "Tên ngân hàng không được để trống" },
              ]}
            >
              <Select options={product} placeholder="Chọn ngân hàng" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item style={{ display: "flex", justifyContent: "flex-end", marginBottom: 0 }}>
          <button className="btn btn-success" type="submit" style={{ marginRight: 10 }}>
            {action === "Add" ? "Thêm mới" : "Lưu"}
          </button>
          <button className="btn btn-secondary" type="button" onClick={onReset}>
            Hủy
          </button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PromotionForm;
