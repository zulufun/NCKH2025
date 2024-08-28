export interface Type {
  id: number;
  name: string;
  id_product: string;
  date: string; // Thêm thuộc tính date, kiểu có thể là string hoặc Date tùy vào dữ liệu bạn nhận được từ API
}

export interface LinkedType {
  value: string;
  label: string;
}

export interface FormProps {
  isAdd: boolean;
  action: 'Add' | 'Edit';
  form: any;
  onFinish: (values: any) => void;
  onReset: () => void;
  linked: LinkedType[];
}
