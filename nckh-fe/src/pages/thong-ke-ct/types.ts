export interface PromotionType {
    id: number;
    name: string;
    id_product: string;
  }
  
  export interface ProductType {
    value: string;
    label: string;
  }
  
  export interface PromotionFormProps {
    isAdd: boolean;
    action: 'Add' | 'Edit';
    form: any;
    onFinish: (values: any) => void;
    onReset: () => void;
    product: ProductType[];
  }
  