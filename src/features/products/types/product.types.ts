export type ProductCategory = 'Thực phẩm bổ sung' | 'Nước uống' | 'Phụ kiện' | 'Trang phục';
export type ProductFilterType = 'ALL' | 'Thực phẩm bổ sung' | 'Nước uống' | 'Phụ kiện' | 'Trang phục' | 'TRASH';

export interface Product {
  id: string;
  productCode: string;
  name: string;
  category: ProductCategory;
  price: number;      // Giá bán / Giá mua
  costPrice: number;  // Giá vốn
  stock: number;      // Số lượng tồn
  unit: string;       // Đơn vị tính: Hũ, Đôi, Cái, Chai...
  image?: string;
  isDeleted?: boolean;
}

export interface ProductMetrics {
  totalProducts: number;
  totalStock: number;
  lowStockCount: number;
  categoriesCount: number;
}